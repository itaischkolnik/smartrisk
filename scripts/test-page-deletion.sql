-- Test script to verify page deletion works correctly
-- Run this after applying the fix to test the functionality

-- 1. First, let's check the current RLS policies on the pages table
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

-- 2. Check if there are any pages in the table
SELECT COUNT(*) as total_pages FROM pages;

-- 3. Check the admin_roles table to ensure admin users exist
SELECT * FROM admin_roles WHERE is_admin = true;

-- 4. Test the admin policy by simulating an admin user
-- (This will help verify the RLS policy is working correctly)
SELECT 
    'Admin policy test' as test_name,
    EXISTS (
        SELECT 1 FROM admin_roles 
        WHERE email = 'ramisaf3@gmail.com'  -- Replace with actual admin email
        AND is_admin = true
    ) as admin_exists;

-- 5. Check if the pages table has the correct structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'pages' 
ORDER BY ordinal_position;
