import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function setupStorage() {
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
    // Create the bucket if it doesn't exist
    const { data: bucket, error: bucketError } = await supabase
      .storage
      .createBucket('assessment-files', {
        public: true,
        allowedMimeTypes: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 52428800, // 50MB in bytes
      });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('Bucket already exists, continuing with CORS setup...');
      } else {
        throw bucketError;
      }
    } else {
      console.log('Bucket created successfully');
    }

    // Set CORS configuration using raw SQL since the API doesn't support it directly
    const { data: corsData, error: corsError } = await supabase
      .rpc('set_cors_rules', {
        bucket_id: 'assessment-files',
        cors_rules: JSON.stringify([{
          allowed_origins: ['*'],
          allowed_methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
          allowed_headers: ['*'],
          expose_headers: ['Content-Range', 'Range'],
          max_age_seconds: 3600
        }])
      });

    if (corsError) {
      throw corsError;
    }

    console.log('CORS configuration updated successfully');

    // Create storage policies
    const { data: policyData, error: policyError } = await supabase
      .rpc('create_storage_policy', {
        bucket_name: 'assessment-files',
        policy_name: 'Allow public read',
        definition: "(bucket_id = 'assessment-files'::text)"
      });

    if (policyError) {
      throw policyError;
    }

    console.log('Storage policies created successfully');

  } catch (error) {
    console.error('Error setting up storage:', error);
    process.exit(1);
  }
}

setupStorage(); 