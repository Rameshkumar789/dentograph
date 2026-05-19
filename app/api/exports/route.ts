import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { recordId, exportType } = await req.json();
    if (!recordId || !exportType) {
      return NextResponse.json({ error: 'Missing export details' }, { status: 400 });
    }

    await supabase.from('export_logs').insert({
      user_id: user.id,
      record_id: recordId,
      export_type: exportType,
      metadata: { format: 'printable_pdf' },
    });

    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'export_record',
      entity_type: 'record',
      entity_id: recordId,
      metadata: { export_type: exportType },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Export log error:', error);
    return NextResponse.json({ error: 'Unable to log export' }, { status: 500 });
  }
}
