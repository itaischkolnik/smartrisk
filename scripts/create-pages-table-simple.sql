-- Simple script to create the pages table
-- Run this in your Supabase SQL Editor

-- Drop existing table if it exists (for clean start)
DROP TABLE IF EXISTS pages CASCADE;

-- Create pages table
CREATE TABLE pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    meta_description TEXT,
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_created_at ON pages(created_at DESC);
CREATE INDEX idx_pages_published ON pages(is_published);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create admin policy
CREATE POLICY "Allow admins full access to pages" ON pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
            AND is_admin = true
        )
    );

-- Create public read policy
CREATE POLICY "Allow public read access to published pages" ON pages
    FOR SELECT USING (is_published = true);

-- Grant permissions
GRANT ALL ON pages TO authenticated;
GRANT SELECT ON pages TO anon;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_pages_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pages_modtime 
    BEFORE UPDATE ON pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_pages_modified_column();

-- Verify table was created
SELECT 'Pages table created successfully!' as status;
