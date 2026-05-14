import { z } from 'zod';

const CDTCodeSchema = z.object({
  code: z.string().describe('CDT procedure code, e.g. D2391, D2740, D0220'),
  name: z.string().describe('Official ADA procedure name, e.g. "Resin-based composite - one surface, posterior"'),
  plain_english: z.string().describe('Plain English translation, e.g. "A tooth-colored filling on a back tooth (1 surface)"'),
  estimated_cost_range: z.string().nullable().describe('Estimated cost range in USD, e.g. "$150 - $300"'),
});

const FindingSchema = z.object({
  tooth_number: z.number().nullable().describe('FDI tooth number 11-48, or null if general finding'),
  condition: z.enum(['Healthy', 'Cavity', 'Bone Loss', 'Crown', 'Implant', 'Missing', 'Fracture', 'Recommended Treatment']),
  severity: z.enum(['Low', 'Medium', 'High']).nullable(),
  severity_score: z.number().min(1).max(10).nullable().describe('Numerical severity score 1 (minor) to 10 (critical)'),
  explanation: z.string().describe('Plain English, one sentence, no jargon — written for a patient with zero medical knowledge'),
  clinical_explanation: z.string().describe('Clinical/technical explanation using proper dental terminology — written for a dentist or specialist'),
  action_required: z.boolean(),
  why_it_matters: z.string().describe('1-2 sentences explaining WHY this finding matters to the patient\'s health. E.g. "If left untreated, this cavity could reach the nerve, causing severe pain and requiring a root canal that costs 5x more."'),
  confidence: z.enum(['High', 'Medium', 'Low']).describe('AI confidence level in this finding. High = clearly visible, Medium = likely but needs confirmation, Low = possible but uncertain'),
  timeframe: z.string().nullable().describe('e.g. "within 3 months" or "urgent"'),
  cdt_codes: z.array(CDTCodeSchema).describe('Any CDT procedure codes associated with this finding. Empty array if none.'),
});

export const DentalAnalysisSchema = z.object({
  patient_summary: z.string().describe('Friendly 2-3 sentence overview, no jargon — for the patient'),
  clinical_summary: z.string().describe('Clinical summary using proper dental terminology — for a dentist or specialist reviewing this record'),
  overall_score: z.enum(['A', 'B+', 'B', 'C+', 'C', 'D']).describe('Dental health grade'),
  overall_severity_score: z.number().min(1).max(10).describe('Overall oral health severity score: 1 = excellent, 10 = critical'),
  overall_urgency: z.enum(['Routine', 'Soon', 'Urgent']),
  findings: z.array(FindingSchema),
  recommended_followup: z.string().describe('Plain English next step for the patient'),
  clinical_followup: z.string().describe('Clinical follow-up recommendation using dental terminology — for a specialist'),
  source_type: z.enum(['xray', 'prescription', 'comprehensive']),
  detected_cdt_codes: z.array(CDTCodeSchema).describe('All CDT codes detected across the entire record, deduplicated'),
  estimated_total_cost: z.string().nullable().describe('Estimated total treatment cost range in USD, e.g. "$500 - $1,200"'),
});

export type DentalAnalysis = z.infer<typeof DentalAnalysisSchema>;
export type Finding = z.infer<typeof FindingSchema>;
export type CDTCode = z.infer<typeof CDTCodeSchema>;
