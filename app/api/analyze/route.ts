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
    const patientId = formData.get('patient_id') as string;

    if (!patientId || fileCount === 0) {
      return Response.json({ error: 'Missing files or patient ID' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const uploadedPaths: string[] = [];
    const contentParts: any[] = [];

    const prompt = recordType === 'comprehensive'
      ? `You are an expert dental assistant helping patients understand their comprehensive dental record.
         Analyze all provided images/documents carefully (these may include X-rays, 3D scans, and text prescriptions).
         Cross-reference the findings across all documents. Extract all dental findings, recommended treatments,
         and conditions mentioned. Map each finding to a specific tooth number where possible using FDI numbering.
         Explain everything in plain English that a patient with no medical background can understand.
         Be friendly, reassuring, and honest.`
      : recordType === 'prescription'
      ? `You are an expert dental assistant helping patients understand their dental prescriptions.
         Analyze this prescription document carefully. Extract all dental findings, recommended treatments,
         and conditions mentioned. Map each finding to a specific tooth number where possible using FDI numbering.
         Explain everything in plain English that a patient with no medical background can understand.
         Be friendly, reassuring, and honest. For any tooth number you cannot determine, use null.`
      : `You are an expert dental radiologist helping patients understand their X-rays.
         Analyze this dental X-ray carefully. Identify all visible teeth conditions including cavities,
         bone loss, existing restorations (crowns, fillings, implants), and missing teeth.
         Use FDI tooth numbering system (11-48). Explain everything in plain English suitable
         for a patient with zero medical knowledge. Be friendly, reassuring, and honest.`;

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

    // Save record to DB with comma-separated paths
    const combinedPaths = uploadedPaths.join(',');
    const { data: record, error: dbError } = await supabase
      .from('records')
      .insert({
        patient_id: patientId,
        record_type: recordType,
        file_path: combinedPaths,
        dentist_name: dentistName || null,
        clinic_name: clinicName || null,
        visit_date: visitDate || null,
        ai_findings: object,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return Response.json({ record, findings: object });
  } catch (err) {
    console.error('Analyze error:', err);
    return Response.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
