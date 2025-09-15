import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateAssessments() {
  console.log('🚀 Starting assessment migration...');
  
  try {
    // Step 1: Get the user IDs
    console.log('📋 Getting user IDs...');
    
    const { data: sourceUser, error: sourceError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', 'ramisaf3@gmail.com')
      .single();
    
    if (sourceError || !sourceUser) {
      console.error('❌ Source user not found:', sourceError);
      return;
    }
    
    const { data: targetUser, error: targetError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', '884line@gmail.com')
      .single();
    
    if (targetError || !targetUser) {
      console.error('❌ Target user not found:', targetError);
      return;
    }
    
    console.log(`📤 Source user: ${sourceUser.email} (${sourceUser.id})`);
    console.log(`📥 Target user: ${targetUser.email} (${targetUser.id})`);
    
    // Step 2: Get all assessments for the source user
    console.log('🔍 Fetching assessments...');
    
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', sourceUser.id);
    
    if (assessmentsError) {
      console.error('❌ Error fetching assessments:', assessmentsError);
      return;
    }
    
    console.log(`📊 Found ${assessments?.length || 0} assessments to migrate`);
    
    if (!assessments || assessments.length === 0) {
      console.log('✅ No assessments to migrate');
      return;
    }
    
    // Step 3: Update each assessment to the new user
    console.log('🔄 Updating assessments...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const assessment of assessments) {
      try {
        const { error: updateError } = await supabase
          .from('assessments')
          .update({ user_id: targetUser.id })
          .eq('id', assessment.id);
        
        if (updateError) {
          console.error(`❌ Failed to update assessment ${assessment.id}:`, updateError);
          errorCount++;
        } else {
          console.log(`✅ Updated assessment ${assessment.id}`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating assessment ${assessment.id}:`, error);
        errorCount++;
      }
    }
    
    // Step 4: Update any related files
    console.log('📁 Updating related files...');
    
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', sourceUser.id);
    
    if (filesError) {
      console.error('❌ Error fetching files:', filesError);
    } else if (files && files.length > 0) {
      console.log(`📁 Found ${files.length} files to migrate`);
      
      let fileSuccessCount = 0;
      let fileErrorCount = 0;
      
      for (const file of files) {
        try {
          const { error: updateError } = await supabase
            .from('files')
            .update({ user_id: targetUser.id })
            .eq('id', file.id);
          
          if (updateError) {
            console.error(`❌ Failed to update file ${file.id}:`, updateError);
            fileErrorCount++;
          } else {
            console.log(`✅ Updated file ${file.id}`);
            fileSuccessCount++;
          }
        } catch (error) {
          console.error(`❌ Error updating file ${file.id}:`, error);
          fileErrorCount++;
        }
      }
      
      console.log(`📁 Files migrated: ${fileSuccessCount} success, ${fileErrorCount} errors`);
    }
    
    // Step 5: Summary
    console.log('\n🎉 Migration Summary:');
    console.log(`📊 Assessments: ${successCount} migrated, ${errorCount} failed`);
    console.log(`👤 Source user: ${sourceUser.email} (${sourceUser.id})`);
    console.log(`👤 Target user: ${targetUser.email} (${targetUser.id})`);
    
    if (successCount > 0) {
      console.log('\n✅ Migration completed successfully!');
      console.log(`💡 You can now use ${targetUser.email} for regular user testing`);
      console.log(`💡 Keep ${sourceUser.email} for admin access only`);
    } else {
      console.log('\n❌ Migration failed - no assessments were migrated');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error during migration:', error);
  }
}

// Run the migration
migrateAssessments()
  .then(() => {
    console.log('🏁 Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });
