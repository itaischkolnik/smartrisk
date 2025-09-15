-- Fix RLS policies for admin_roles table
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow authenticated users to read admin_roles" ON admin_roles;

-- Create a simple policy that allows any authenticated user to read admin_roles
-- This is needed for the admin login check
CREATE POLICY "Allow authenticated users to read admin_roles" ON admin_roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Also create a policy that allows service role to read all admin_roles (for admin operations)
CREATE POLICY "Allow service role full access" ON admin_roles
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT SELECT ON admin_roles TO authenticated;
GRANT ALL ON admin_roles TO service_role;

-- Ensure the table is accessible
ALTER TABLE admin_roles FORCE ROW LEVEL SECURITY;
