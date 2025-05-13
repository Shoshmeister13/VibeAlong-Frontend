-- Add new columns to developer_profiles table
ALTER TABLE developer_profiles
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS task_categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS vibe_coding_tools TEXT[] DEFAULT '{}';
