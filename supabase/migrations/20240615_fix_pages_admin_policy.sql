-- Fix pages table admin RLS policy to use JWT email instead of auth.uid()
-- This ensures admin operations work correctly in API routes

-- Drop the existing admin policy
DROP POLICY IF EXISTS "Allow admins full access to pages" ON pages;

-- Create a new admin policy that uses JWT email (more reliable in API routes)
CREATE POLICY "Allow admins full access to pages" ON pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE email = auth.jwt() ->> 'email'
            AND is_admin = true
        )
    );

-- Verify the policy was created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'pages'
ORDER BY policyname;
