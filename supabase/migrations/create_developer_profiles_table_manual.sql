-- This file can be run manually in the Supabase SQL Editor
-- to create the developer_profiles table

-- Create the developer_profiles table
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

-- Enable Row Level Security
ALTER TABLE public.developer_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile" 
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

-- Allow service role to access all profiles
CREATE POLICY "Service role can do anything" 
  ON public.developer_profiles
  USING (auth.role() = 'service_role');
