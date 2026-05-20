import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { recordId, enabled, recipientLabel, recipientEmail } = await req.json();
    if (!recordId) return NextResponse.json({ error: 'Missing recordId' }, { status: 400 });

    const { data: record, error: recordError } = await supabase
      .from('records')
      .select('id, patient_id, share_token')
      .eq('id', recordId)
      .single();

    if (recordError || !record || record.patient_id !== user.id) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    if (!enabled) {
      const { error: revokeError } = await supabase
        .from('record_shares')
        .update({ revoked_at: new Date().toISOString(), revoked_by: user.id })
        .eq('record_id', recordId)
        .eq('patient_id', user.id)
        .is('revoked_at', null);

      await supabase.from('records').update({ share_enabled: false }).eq('id', recordId);
      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'revoke_share',
        entity_type: 'record',
        entity_id: recordId,
        metadata: { reason: 'patient_disabled_share' },
      });

      return NextResponse.json({ enabled: false, fallback: isMissingTable(revokeError) });
    }

    const { data: existing, error: existingError } = await supabase
      .from('record_shares')
      .select('*')
      .eq('record_id', recordId)
      .eq('patient_id', user.id)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (isMissingTable(existingError)) {
      const token = record.share_token || randomUUID();
      await supabase
        .from('records')
        .update({ share_enabled: true, share_token: token })
        .eq('id', recordId);

      await supabase.from('audit_logs').insert({
        actor_id: user.id,
        action: 'create_share',
        entity_type: 'record',
        entity_id: recordId,
        metadata: { fallback: 'records_share_token' },
      });

      return NextResponse.json({
        enabled: true,
        token,
        fallback: true,
      });
    }

    let share = existing;
    if (!share) {
      const { data: created, error: createError } = await supabase
        .from('record_shares')
        .insert({
          record_id: recordId,
          patient_id: user.id,
          created_by: user.id,
          recipient_label: recipientLabel || null,
          recipient_email: recipientEmail || null,
        })
        .select('*')
        .single();

      if (createError) throw createError;
      share = created;
    }

    await supabase
      .from('records')
      .update({ share_enabled: true, share_token: share.token })
      .eq('id', recordId);

    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'create_share',
      entity_type: 'record',
      entity_id: recordId,
      metadata: { share_id: share.id, expires_at: share.expires_at },
    });

    return NextResponse.json({
      enabled: true,
      shareId: share.id,
      token: share.token,
      expiresAt: share.expires_at,
    });
  } catch (error) {
    console.error('Share API error:', error);
    return NextResponse.json({ error: 'Unable to update share link' }, { status: 500 });
  }
}

function isMissingTable(error: unknown) {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: string }).code === 'PGRST205'
  );
}
