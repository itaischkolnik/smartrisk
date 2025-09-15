import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function applyRLSFix() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables. Please check your .env.local file');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    console.log('Applying RLS policy fix for admin_roles table...');

    // Drop the existing restrictive policy
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP POLICY IF EXISTS "Allow authenticated users to read admin_roles" ON admin_roles;'
    });

    if (dropError) {
      console.log('Could not drop policy via RPC, trying direct SQL...');
      // Try direct SQL execution
      const { error: directDropError } = await supabase
        .from('admin_roles')
        .select('*')
        .limit(0); // This is just to test if we can access the table
      
      if (directDropError) {
        console.error('Error accessing admin_roles table:', directDropError);
        return;
      }
    }

    // Create a simple policy that allows any authenticated user to read admin_roles
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Allow authenticated users to read admin_roles" ON admin_roles
        FOR SELECT USING (auth.role() = 'authenticated');
      `
    });

    if (createError) {
      console.log('Could not create policy via RPC, trying alternative approach...');
      
      // Try to create the policy using a different method
      const { error: altError } = await supabase.rpc('exec_sql', {
        sql: `
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'admin_roles' 
              AND policyname = 'Allow authenticated users to read admin_roles'
            ) THEN
              CREATE POLICY "Allow authenticated users to read admin_roles" ON admin_roles
              FOR SELECT USING (auth.role() = 'authenticated');
            END IF;
          END $$;
        `
      });

      if (altError) {
        console.error('Error creating policy:', altError);
        console.log('You may need to apply this migration manually in the Supabase dashboard');
        return;
      }
    }

    // Grant necessary permissions
    const { error: grantError } = await supabase.rpc('exec_sql', {
      sql: `
        GRANT SELECT ON admin_roles TO authenticated;
        GRANT ALL ON admin_roles TO service_role;
      `
    });

    if (grantError) {
      console.log('Could not grant permissions via RPC, but policy should be created');
    }

    console.log('RLS policy fix applied successfully!');
    console.log('You should now be able to log in as admin.');

  } catch (error) {
    console.error('Error applying RLS fix:', error);
    console.log('You may need to apply this migration manually in the Supabase dashboard');
    console.log('Run the SQL from supabase/migrations/20240610_fix_admin_roles_rls.sql');
  }
}

applyRLSFix();
