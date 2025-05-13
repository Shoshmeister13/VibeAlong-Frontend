-- Check if developer_profiles table exists, if not create it
CREATE TABLE IF NOT EXISTS public.developer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  bio TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  vibe_coding_tools JSONB DEFAULT '[]'::jsonb,
  experience_level TEXT NOT NULL,
  github_username TEXT,
  portfolio_url TEXT,
  availability TEXT NOT NULL,
  task_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  hourly_rate NUMERIC NOT NULL DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS developer_profiles_user_id_idx ON public.developer_profiles(user_id);
CREATE INDEX IF NOT EXISTS developer_profiles_experience_level_idx ON public.developer_profiles(experience_level);
