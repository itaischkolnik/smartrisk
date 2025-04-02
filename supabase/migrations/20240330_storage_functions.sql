-- Function to set CORS rules for a bucket
CREATE OR REPLACE FUNCTION set_cors_rules(bucket_id text, cors_rules jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the cors_rules in storage.buckets
  UPDATE storage.buckets
  SET cors_rules = cors_rules
  WHERE id = bucket_id;
END;
$$;

-- Function to create storage policies
CREATE OR REPLACE FUNCTION create_storage_policy(bucket_name text, policy_name text, definition text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create policy for SELECT
  EXECUTE format(
    'CREATE POLICY IF NOT EXISTS %I ON storage.objects FOR SELECT TO authenticated USING %s',
    policy_name || '_select',
    definition
  );
  
  -- Create policy for INSERT
  EXECUTE format(
    'CREATE POLICY IF NOT EXISTS %I ON storage.objects FOR INSERT TO authenticated WITH CHECK %s',
    policy_name || '_insert',
    definition
  );
END;
$$; 