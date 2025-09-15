-- Temporarily disable RLS on profiles table for testing
-- This will allow the admin API to work while we debug the RLS policies

-- Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Note: This is for testing only. Re-enable RLS after fixing the policies with:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
