-- Clean up duplicate profiles policies and fix role assignments

-- Drop all existing duplicate policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Create clean, single policies with proper roles
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- Create admin policies with proper roles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
            AND is_admin = true
        )
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
            AND is_admin = true
        )
    );

-- Ensure proper permissions
GRANT SELECT, UPDATE, INSERT ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;
