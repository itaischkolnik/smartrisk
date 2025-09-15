-- Enable RLS on all tables
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policies for assessments table
CREATE POLICY "Users can view their own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" ON assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for assessment_data table
CREATE POLICY "Users can view their assessment data" ON assessment_data
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM assessments WHERE id = assessment_data.assessment_id
  ));

CREATE POLICY "Users can create assessment data" ON assessment_data
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM assessments WHERE id = assessment_data.assessment_id
  ));

CREATE POLICY "Users can update their assessment data" ON assessment_data
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM assessments WHERE id = assessment_data.assessment_id
  ));

CREATE POLICY "Users can delete their assessment data" ON assessment_data
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM assessments WHERE id = assessment_data.assessment_id
  ));

-- Policies for files table
CREATE POLICY "Users can view their assessment files" ON files
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM assessments WHERE id = files.assessment_id
  ));

CREATE POLICY "Users can create assessment files" ON files
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM assessments WHERE id = files.assessment_id
  ));

CREATE POLICY "Users can update their assessment files" ON files
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM assessments WHERE id = files.assessment_id
  ));

CREATE POLICY "Users can delete their assessment files" ON files
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM assessments WHERE id = files.assessment_id
  ));

-- Policies for analyses table
CREATE POLICY "Users can view their analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their analyses" ON analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their analyses" ON analyses
  FOR DELETE USING (auth.uid() = user_id); 