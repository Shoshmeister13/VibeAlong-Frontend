-- Create the devs table for Developer Experts
CREATE TABLE IF NOT EXISTS public.devs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  bio TEXT,
  years_of_experience INTEGER NOT NULL,
  ai_platforms TEXT[] NOT NULL,
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.devs ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own data
CREATE POLICY "Users can view their own dev profile"
  ON public.devs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to update their own data
CREATE POLICY "Users can update their own dev profile"
  ON public.devs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for users to insert their own data
CREATE POLICY "Users can insert their own dev profile"
  ON public.devs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for admins to view all dev profiles
CREATE POLICY "Admins can view all dev profiles"
  ON public.devs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at timestamp
CREATE TRIGGER update_devs_updated_at
BEFORE UPDATE ON public.devs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
