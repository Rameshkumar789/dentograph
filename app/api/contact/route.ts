import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { name, clinicName, email } = await req.json();

    if (!name || !email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Store the contact submission in Supabase
    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        clinic_name: clinicName || null,
        email,
        created_at: new Date().toISOString(),
      });

    if (error) {
      return Response.json({ error: 'Submission could not be stored' }, { status: 500 });
    }

    return Response.json({ success: true, message: 'Thank you! We will be in touch shortly.' });
  } catch (err) {
    console.error('Contact form error:', err);
    return Response.json({ error: 'Submission failed' }, { status: 500 });
  }
}
