-- Create vibe-projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS "vibe-projects" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  stage TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS vibe_projects_owner_id_idx ON "vibe-projects"(owner_id);

-- Add project_id column to tasks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN project_id UUID REFERENCES "vibe-projects"(id);
    CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);
  END IF;
END $$;
