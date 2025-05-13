-- Normalize role names in the profiles table
UPDATE profiles
SET role = 'vibe-coder'
WHERE role = 'vibe_coder';

-- Add a check constraint to ensure role names are consistent
ALTER TABLE profiles
ADD CONSTRAINT check_role_names
CHECK (role IN ('developer', 'vibe-coder', 'agency'));
