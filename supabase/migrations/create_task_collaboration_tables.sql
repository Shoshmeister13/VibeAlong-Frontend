-- Create task_messages table
CREATE TABLE IF NOT EXISTS task_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_platform_instructions table
CREATE TABLE IF NOT EXISTS task_platform_instructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  instructions TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for task_messages
ALTER TABLE task_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for tasks they are involved in" ON task_messages
  FOR SELECT
  USING (
    auth.uid() = (SELECT vibe_coder_id FROM tasks WHERE id = task_id) OR
    auth.uid() = (SELECT developer_id FROM tasks WHERE id = task_id)
  );

CREATE POLICY "Users can insert messages for tasks they are involved in" ON task_messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT vibe_coder_id FROM tasks WHERE id = task_id) OR
    auth.uid() = (SELECT developer_id FROM tasks WHERE id = task_id)
  );

-- Add RLS policies for task_platform_instructions
ALTER TABLE task_platform_instructions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view platform instructions for tasks they are involved in" ON task_platform_instructions
  FOR SELECT
  USING (
    auth.uid() = (SELECT vibe_coder_id FROM tasks WHERE id = task_id) OR
    auth.uid() = (SELECT developer_id FROM tasks WHERE id = task_id)
  );

CREATE POLICY "Vibe-Coders can insert platform instructions for their tasks" ON task_platform_instructions
  FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT vibe_coder_id FROM tasks WHERE id = task_id)
  );

CREATE POLICY "Vibe-Coders can update platform instructions for their tasks" ON task_platform_instructions
  FOR UPDATE
  USING (
    auth.uid() = (SELECT vibe_coder_id FROM tasks WHERE id = task_id)
  );
