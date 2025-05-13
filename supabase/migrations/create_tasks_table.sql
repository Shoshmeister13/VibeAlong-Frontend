-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
  category TEXT NOT NULL,
  stack TEXT[] NOT NULL,
  key_points TEXT[],
  suggested_steps JSONB,
  estimated_time_hours NUMERIC,
  estimated_cost_usd NUMERIC,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Assigned', 'In Progress', 'Review', 'Completed', 'Cancelled')),
  vibe_coder_id UUID NOT NULL REFERENCES profiles(id),
  developer_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS tasks_vibe_coder_id_idx ON tasks(vibe_coder_id);
CREATE INDEX IF NOT EXISTS tasks_developer_id_idx ON tasks(developer_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
