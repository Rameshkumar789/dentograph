import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const { messages, findings, patientSummary } = await req.json();
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase.from('ai_processing_logs').insert({
      user_id: user.id,
      purpose: 'dentobot_chat',
      model: 'gemini-2.5-flash',
      metadata: { message_count: messages?.length || 0 },
    });
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'use_dentobot',
      entity_type: 'patient_profile',
      entity_id: user.id,
      metadata: { message_count: messages?.length || 0 },
    });
  }

  const systemPrompt = `You are DentoBot — a friendly, knowledgeable dental health assistant.
You are helping a patient understand their specific dental record.

Here is the patient's dental health data:
Summary: ${patientSummary}
Findings: ${JSON.stringify(findings, null, 2)}

Your role:
- Explain dental conditions in plain English (no jargon)
- Be honest but reassuring and empathetic
- Give practical advice and context
- Mention typical costs when asked (give ranges, not guarantees)
- Always remind them their dentist has the final say on treatment
- Keep responses concise (2-4 sentences max per response)
- Never diagnose or prescribe — you're an educator, not a clinician`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
