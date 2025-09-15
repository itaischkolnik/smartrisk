-- Final fix for admin login RLS policy
-- Run this in your Supabase dashboard SQL editor

-- Step 1: Drop all existing conflicting policies
DROP POLICY IF EXISTS "Allow authenticated users to read admin_roles" ON admin_roles;
DROP POLICY IF EXISTS "Allow users to check own admin status" ON admin_roles;
DROP POLICY IF EXISTS "Allow service role full access" ON admin_roles;

-- Step 2: Create the correct simple policy
CREATE POLICY "Allow authenticated users to read admin_roles" ON admin_roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Step 3: Grant necessary permissions
GRANT SELECT ON admin_roles TO authenticated;
GRANT ALL ON admin_roles TO service_role;

-- Step 4: Verify the policy was created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'admin_roles'
ORDER BY policyname;
