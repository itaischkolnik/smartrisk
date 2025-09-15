-- Cleanup script to completely remove pages table and start fresh
-- Use this if you encounter conflicts or want to reset everything

-- Drop all policies
DROP POLICY IF EXISTS "Allow admins full access to pages" ON pages;
DROP POLICY IF EXISTS "Allow public read access to published pages" ON pages;

-- Drop trigger
DROP TRIGGER IF EXISTS update_pages_modtime ON pages;

-- Drop function
DROP FUNCTION IF EXISTS update_pages_modified_column();

-- Drop table completely
DROP TABLE IF EXISTS pages CASCADE;

-- Verify table is gone
SELECT 'Pages table cleanup completed' as status;
