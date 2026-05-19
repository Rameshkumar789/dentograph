import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { DentalAnalysisSchema } from '@/lib/schemas';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const fileCountStr = formData.get('fileCount') as string;
    const fileCount = fileCountStr ? parseInt(fileCountStr, 10) : 1;
    const recordType = formData.get('record_type') as string;
    const dentistName = formData.get('dentist_name') as string;
    const clinicName = formData.get('clinic_name') as string;
    const visitDate = formData.get('visit_date') as string;
    let patientId = formData.get('patient_id') as string;
    const providerId = formData.get('provider_id') as string;
    const clinicId = formData.get('clinic_id') as string;
    const source = (formData.get('source') as string) || 'patient';
    const consentId = formData.get('consent_id') as string;

    // For dentist-initiated scans, we use the provider's ID (the doctor) as the 
    // secure 'patient_id' to satisfy RLS policies (auth.uid() = patient_id).
    // The UI will override this with the actual patient_name from the AI manifest.
    if (!patientId && providerId) {
      patientId = providerId;
    }

    const patientName = formData.get('patient_name') as string || 'New Patient';

    if (!patientId || fileCount === 0) {
      return Response.json({ error: 'Missing files or patient identifier' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const uploadedPaths: string[] = [];
    const contentParts: Array<{ type: 'text'; text: string } | { type: 'image'; image: Buffer }> = [];

    const baseInstructions = `
CRITICAL INSTRUCTIONS — You MUST follow ALL of these:

1. DUAL EXPLANATIONS: For EVERY finding, provide TWO explanations:
   - "explanation": Written in plain English for a patient with ZERO medical knowledge. Friendly, empathetic, no jargon.
   - "clinical_explanation": Written using proper dental terminology for a dentist or specialist.

2. CDT CODES: For every finding that involves a procedure or treatment, identify the correct CDT procedure codes.
   - Include the code (e.g. "D2391"), the official ADA name, a plain English translation, and an estimated cost range in USD.
   - If a finding has no associated procedure, use an empty array.
   - Also provide a deduplicated list of ALL detected CDT codes in "detected_cdt_codes".

3. SEVERITY SCORING: For every finding, provide a "severity_score" from 1 to 10:
   - 1-2 = Minor/cosmetic issue
   - 3-4 = Mild concern, monitor
   - 5-6 = Moderate, needs attention soon
   - 7-8 = Serious, needs treatment
   - 9-10 = Critical/emergency
   Also provide "overall_severity_score" (1-10) for the entire record.

4. SUMMARIES: Provide BOTH a "patient_summary" (plain English) AND a "clinical_summary" (dental terminology).
   Also provide BOTH "recommended_followup" (for patient) AND "clinical_followup" (for specialist).

5. COST ESTIMATE: Provide "estimated_total_cost" as a USD range for all recommended treatments combined.

6. EXPLAINABLE AI: For EVERY finding, you MUST provide:
   - "why_it_matters": 1-2 sentences explaining WHY this matters. Focus on consequences of inaction and cost implications.
     Example: "If left untreated, this cavity will reach the nerve within 6-12 months, turning a $200 filling into a $1,500 root canal."
   - "confidence": Your confidence in this finding — "High" (clearly visible), "Medium" (likely but needs clinical confirmation), or "Low" (possible but uncertain).

7. Use FDI tooth numbering system (11-48). Be friendly, reassuring, and honest.`;

    const prompt = recordType === 'comprehensive'
      ? `You are an expert dental assistant analyzing a comprehensive dental record.
         Analyze all provided images/documents carefully (X-rays, 3D scans, and prescriptions).
         Cross-reference findings across all documents.
         ${baseInstructions}`
      : recordType === 'prescription'
      ? `You are an expert dental assistant analyzing a dental prescription.
         Extract all dental findings, recommended treatments, and conditions mentioned.
         ${baseInstructions}`
      : `You are an expert dental radiologist analyzing dental X-rays.
         Identify all visible teeth conditions including cavities, bone loss, existing restorations, and missing teeth.
         ${baseInstructions}`;

    contentParts.push({ type: 'text', text: prompt });

    for (let i = 0; i < fileCount; i++) {
      const file = formData.get(`file${i}`) as File || formData.get('file'); // Fallback for old single-file format
      if (!file) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || 'image/jpeg';

      // Pass image to Gemini
      contentParts.push({ type: 'image', image: buffer });

      // Upload file to storage
      const filePath = `${patientId}/${Date.now()}-${i}-${file.name}`;
      await supabase.storage.from('dental-records').upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });
      uploadedPaths.push(filePath);
    }

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: DentalAnalysisSchema,
      messages: [{
        role: 'user',
        content: contentParts,
      }],
    });

    // Save record to DB with identity bundled in findings
    const combinedPaths = uploadedPaths.join(',');
    const { data: record, error: dbError } = await supabase
      .from('records')
      .insert({
        patient_id: patientId,
        record_type: recordType,
        file_path: combinedPaths,
        dentist_name: dentistName || null,
        clinic_name: clinicName || null,
        visit_date: visitDate || new Date().toISOString().slice(0, 10),
        ai_findings: { ...object, patient_name: patientName },
        provider_id: providerId || null,
        clinic_id: clinicId || null,
        source: source
      })
      .select()
      .single();

    if (dbError) throw dbError;

    if (uploadedPaths.length > 0) {
      await supabase.from('record_files').insert(uploadedPaths.map((path, index) => ({
        record_id: record.id,
        patient_id: patientId,
        storage_path: path,
        file_name: path.split('/').pop(),
        mime_type: (formData.get(`file${index}`) as File | null)?.type || null,
        file_size: (formData.get(`file${index}`) as File | null)?.size || null,
      })));
    }

    await supabase.from('ai_processing_logs').insert({
      user_id: patientId,
      record_id: record.id,
      consent_id: consentId || null,
      purpose: 'record_analysis',
      model: 'gemini-2.5-flash',
      metadata: { record_type: recordType, file_count: uploadedPaths.length, source },
    });

    await supabase.from('audit_logs').insert({
      actor_id: patientId,
      action: 'create_record',
      entity_type: 'record',
      entity_id: record.id,
      metadata: { record_type: recordType, file_count: uploadedPaths.length, source },
    });

    return Response.json({ record, findings: object });
  } catch (err) {
    console.error('Analyze error:', err);
    return Response.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
