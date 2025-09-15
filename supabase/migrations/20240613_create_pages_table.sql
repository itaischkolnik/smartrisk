-- Create pages table for content management system
CREATE TABLE IF NOT EXISTS pages (
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

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at DESC);

-- Create index on is_published for filtering
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to manage all pages
CREATE POLICY "Allow admins full access to pages" ON pages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_roles 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
            AND is_admin = true
        )
    );

-- Create policy to allow public read access to published pages
CREATE POLICY "Allow public read access to published pages" ON pages
    FOR SELECT USING (is_published = true);

-- Grant necessary permissions
GRANT ALL ON pages TO authenticated;
GRANT SELECT ON pages TO anon;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pages_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pages_modtime 
    BEFORE UPDATE ON pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_pages_modified_column();
