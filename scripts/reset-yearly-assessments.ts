import { createClient } from '@supabase/supabase-js';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function resetYearlyAssessments() {
  try {
    console.log('🔄 Starting yearly assessment count reset...');
    console.log('📅 Current date:', new Date().toISOString());

    // Call the database function to reset yearly assessment counts
    const { error } = await supabase.rpc('reset_yearly_assessment_counts');

    if (error) {
      console.error('❌ Error resetting yearly assessment counts:', error);
      process.exit(1);
    }

    console.log('✅ Yearly assessment counts reset successfully!');
    console.log('📊 All users with expired assessment periods have been reset to 0');

  } catch (error) {
    console.error('❌ Error in yearly assessment reset:', error);
    process.exit(1);
  }
}

// Run the reset function
resetYearlyAssessments();
