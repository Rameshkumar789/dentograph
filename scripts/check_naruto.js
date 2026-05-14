const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase
    .from('records')
    .select('id, record_type, ai_findings')
    .ilike('ai_findings->>patient_name', '%narutobeast%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Found records:', data.map(r => ({
    id: r.id,
    type: r.record_type,
    patient: r.ai_findings?.patient_name
  })));
}

check();
