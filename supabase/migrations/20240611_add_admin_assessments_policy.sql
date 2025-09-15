-- Add admin policies for assessments table to bypass user-specific RLS
-- This allows admin users to view all assessments in the system

-- Create admin policy for viewing all assessments
CREATE POLICY "Admins can view all assessments" ON assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_admin = true
    )
  );

-- Create admin policy for updating all assessments
CREATE POLICY "Admins can update all assessments" ON assessments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_admin = true
    )
  );

-- Create admin policy for deleting all assessments
CREATE POLICY "Admins can delete all assessments" ON assessments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_admin = true
    )
  );

-- Also add admin policies for assessment_data table
CREATE POLICY "Admins can view all assessment data" ON assessment_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_admin = true
    )
  );

-- Add admin policies for files table
CREATE POLICY "Admins can view all files" ON files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_admin = true
    )
  );

-- Add admin policies for analyses table
CREATE POLICY "Admins can view all analyses" ON analyses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE email = auth.jwt() ->> 'email' 
      AND is_admin = true
    )
  );
