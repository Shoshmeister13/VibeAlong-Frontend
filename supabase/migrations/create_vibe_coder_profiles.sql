CREATE TABLE IF NOT EXISTS vibe_coder_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  vibe_coding_tools TEXT[] DEFAULT '{}',
  monthly_budget DECIMAL(10, 2),
  avatar_url TEXT,
  total_tasks_posted INTEGER DEFAULT 0,
  avg_completion_time INTERVAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE vibe_coder_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
CREATE POLICY "Users can view their own vibe coder profile"
  ON vibe_coder_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own vibe coder profile"
  ON vibe_coder_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own vibe coder profile"
  ON vibe_coder_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);
