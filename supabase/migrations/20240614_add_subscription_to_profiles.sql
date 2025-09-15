-- Add subscription field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription TEXT DEFAULT 'חינם' CHECK (subscription IN ('חינם', 'יזם', 'איש עסקים', 'מקצועי'));

-- Update existing profiles to have 'חינם' as default if they don't have a subscription
UPDATE profiles SET subscription = 'חינם' WHERE subscription IS NULL;

-- Create index for better performance on subscription queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON profiles(subscription);

-- Add comment to document the field
COMMENT ON COLUMN profiles.subscription IS 'User subscription level: חינם (Free), יזם (Entrepreneur), איש עסקים (Business Person), מקצועי (Professional)';
