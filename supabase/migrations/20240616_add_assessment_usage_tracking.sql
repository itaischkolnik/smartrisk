-- Add assessment usage tracking fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS assessments_used_this_year INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_assessment_reset_date DATE DEFAULT CURRENT_DATE;

-- Create index for better performance on usage queries
CREATE INDEX IF NOT EXISTS idx_profiles_assessments_used ON profiles(assessments_used_this_year);
CREATE INDEX IF NOT EXISTS idx_profiles_last_reset ON profiles(last_assessment_reset_date);

-- Add comment to document the new fields
COMMENT ON COLUMN profiles.assessments_used_this_year IS 'Number of assessments used in the current year';
COMMENT ON COLUMN profiles.last_assessment_reset_date IS 'Date when assessment count was last reset (for yearly renewal)';

-- Create a function to reset assessment counts yearly
CREATE OR REPLACE FUNCTION reset_yearly_assessment_counts()
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET assessments_used_this_year = 0,
      last_assessment_reset_date = CURRENT_DATE
  WHERE last_assessment_reset_date < CURRENT_DATE - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if user can create assessment
CREATE OR REPLACE FUNCTION can_create_assessment(user_subscription TEXT, assessments_used INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  CASE user_subscription
    WHEN 'חינם' THEN
      RETURN FALSE; -- Free users cannot create assessments
    WHEN 'יזם' THEN
      RETURN assessments_used = 0; -- Entrepreneur can only do one assessment
    WHEN 'איש עסקים' THEN
      RETURN assessments_used < 18; -- Business Person: 18 per year
    WHEN 'מקצועי' THEN
      RETURN assessments_used < 36; -- Professional: 36 per year
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create a function to increment assessment count
CREATE OR REPLACE FUNCTION increment_assessment_count(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_subscription TEXT;
  current_count INTEGER;
  can_create BOOLEAN;
BEGIN
  -- Get user's subscription and current count
  SELECT subscription, assessments_used_this_year 
  INTO user_subscription, current_count
  FROM profiles 
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user can create assessment
  can_create := can_create_assessment(user_subscription, current_count);
  
  IF can_create THEN
    -- Increment the count
    UPDATE profiles 
    SET assessments_used_this_year = assessments_used_this_year + 1
    WHERE id = user_id;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
