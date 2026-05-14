import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { findings, dentistName, clinicName, patientName } = await req.json();

  const date = new Date().toLocaleDateString();
  
  // Enterprise-grade narrative construction
  const narrative = `
CLINICAL JUSTIFICATION REPORT
Date: ${date}
Patient: ${patientName || 'Anonymous'}
Provider: ${dentistName || 'TBD'}
Facility: ${clinicName || 'DentoGraph Network'}
--------------------------------------------------

EXECUTIVE SUMMARY:
Comprehensive radiographic analysis indicates an overall clinical health score of ${findings.overall_score}. 
Total estimated treatment complexity is rated at ${findings.overall_severity_score}/10 based on detected pathologies.

CLINICAL FINDINGS & JUSTIFICATION:
${findings.findings.map((f: any) => `
TOOTH #${f.tooth_number || 'GEN'}: ${f.condition} (${f.severity} SEVERITY)
CDT CODES: ${f.cdt_codes?.map((c: any) => c.code).join(', ') || 'N/A'}
JUSTIFICATION: ${f.explanation}
CLINICAL IMPACT: ${f.why_it_matters || 'Failure to treat may lead to systemic complications.'}
`).join('\n')}

RECOMMENDED TREATMENT TIMELINE:
Priority: ${findings.overall_urgency}
Action Plan: ${findings.recommended_followup}

--------------------------------------------------
DISCLAIMER: This report is generated via DentoGraph Analytical AI and should be verified by a licensed dental professional before submission to secondary payers.
--------------------------------------------------
DOCUMENT ID: DG-${Math.random().toString(36).substr(2, 9).toUpperCase()}
  `.trim();

  return NextResponse.json({ narrative });
}
