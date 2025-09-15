-- Create admin_roles table to allow same email to have both user and admin roles
CREATE TABLE IF NOT EXISTS admin_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the two admin emails
INSERT INTO admin_roles (email, is_admin) VALUES 
    ('ramisaf3@gmail.com', true),
    ('itaisd@gmail.com', true)
ON CONFLICT (email) DO UPDATE SET 
    is_admin = EXCLUDED.is_admin,
    updated_at = NOW();

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin_roles
CREATE POLICY "Allow authenticated users to read admin_roles" ON admin_roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_roles 
        WHERE email = user_email AND is_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
