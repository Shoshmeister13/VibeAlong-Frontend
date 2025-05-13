-- Run this SQL in the Supabase SQL Editor to create the developer_profiles table

-- Create the developer_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.developer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS developer_profiles_user_id_idx ON public.developer_profiles(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.developer_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for different operations
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.developer_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.developer_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.developer_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow authenticated users to view all profiles (for search functionality)
CREATE POLICY "Authenticated users can view all profiles"
  ON public.developer_profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Grant service role access to the table
GRANT ALL ON public.developer_profiles TO service_role;

-- Grant authenticated users access to the table
GRANT SELECT, INSERT, UPDATE ON public.developer_profiles TO authenticated;

-- Add a comment to the table
COMMENT ON TABLE public.developer_profiles IS 'Stores developer profile information for the VibeAlong platform';
