const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ommsicdffhveivfpgcpe.supabase.co';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!key) {
  console.error('No Supabase Key found');
  process.exit(1);
}

const supabase = createClient(url, key);

async function audit() {
  console.log('--- RAW DATABASE AUDIT ---');
  const { data, error } = await supabase
    .from('records')
    .select('id, record_type, source, clinic_id, dentist_name, clinic_name, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.table(data);
  console.log('Total records in scan:', data.length);
}

audit();
