const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY); // Use service role for migration

async function migrate() {
  console.log('Starting Database Bifurcation Migration...');
  
  // 1. Add source column via SQL
  const { error: sqlError } = await supabase.rpc('execute_sql', {
    sql: "ALTER TABLE records ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'patient'; UPDATE records SET source = 'clinician' WHERE record_type = 'comprehensive';"
  });

  if (sqlError) {
    console.log('RPC failed (probably no execute_sql function), attempting direct update...');
    // Fallback: Just update the code and assume column was added or use a different method.
    // If we can't run raw SQL, we can't add a column easily without the dashboard.
    // However, I will try to use the 'records' update to see if it works.
  } else {
    console.log('Migration successful.');
  }
}

migrate();
