-- Create the developer_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS developer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  vibe_coding_tools TEXT[],
  github_url TEXT,
  availability TEXT NOT NULL CHECK (availability IN ('full-time', 'part-time', 'occasional', 'weekends')),
  additional_info TEXT,
  terms_accepted BOOLEAN NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE developer_applications ENABLE ROW LEVEL SECURITY;

-- Create policy for public inserts
CREATE POLICY IF NOT EXISTS "Anyone can insert applications"
ON developer_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for public viewing
CREATE POLICY IF NOT EXISTS "Public can view applications"
ON developer_applications
FOR SELECT
TO public
USING (true);
