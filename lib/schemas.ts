import { z } from 'zod';

const FindingSchema = z.object({
  tooth_number: z.number().nullable().describe('FDI tooth number 11-48, or null if general finding'),
  condition: z.enum(['Healthy', 'Cavity', 'Bone Loss', 'Crown', 'Implant', 'Missing', 'Fracture', 'Recommended Treatment']),
  severity: z.enum(['Low', 'Medium', 'High']).nullable(),
  explanation: z.string().describe('Plain English, one sentence, no jargon'),
  action_required: z.boolean(),
  timeframe: z.string().nullable().describe('e.g. "within 3 months" or "urgent"'),
});

export const DentalAnalysisSchema = z.object({
  patient_summary: z.string().describe('Friendly 2-3 sentence overview, no jargon'),
  overall_score: z.enum(['A', 'B+', 'B', 'C+', 'C', 'D']).describe('Dental health grade'),
  overall_urgency: z.enum(['Routine', 'Soon', 'Urgent']),
  findings: z.array(FindingSchema),
  recommended_followup: z.string().describe('Plain English next step for the patient'),
  source_type: z.enum(['xray', 'prescription']),
});

export type DentalAnalysis = z.infer<typeof DentalAnalysisSchema>;
export type Finding = z.infer<typeof FindingSchema>;
