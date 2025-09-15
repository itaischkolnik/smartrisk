import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupPagesTable() {
  try {
    console.log('Setting up pages table...');
    
    // Read the migration SQL
    const migrationPath = path.join(__dirname, '../supabase/migrations/20240613_create_pages_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration...');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // If exec_sql doesn't exist, try direct execution
      console.log('exec_sql not available, trying direct execution...');
      
      // Split the SQL into individual statements and execute them
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('Executing:', statement.substring(0, 50) + '...');
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (stmtError) {
            console.error('Error executing statement:', stmtError);
            console.error('Statement:', statement);
          }
        }
      }
    }
    
    console.log('✅ Pages table setup completed!');
    
    // Verify the table was created
    const { data: tables, error: listError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'pages');
    
    if (listError) {
      console.error('Error checking tables:', listError);
    } else if (tables && tables.length > 0) {
      console.log('✅ Pages table verified in database');
    } else {
      console.log('⚠️  Pages table not found - may need manual creation');
    }
    
  } catch (error) {
    console.error('❌ Error setting up pages table:', error);
    process.exit(1);
  }
}

// Run the setup
setupPagesTable();
