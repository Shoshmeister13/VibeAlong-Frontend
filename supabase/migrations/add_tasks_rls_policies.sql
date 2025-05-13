-- Enable Row Level Security on tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for vibe coders to view their own tasks
CREATE POLICY "Vibe coders can view their own tasks"
ON tasks
FOR SELECT
USING (vibe_coder_id = auth.uid());

-- Create policy for vibe coders to insert their own tasks
CREATE POLICY "Vibe coders can insert their own tasks"
ON tasks
FOR INSERT
WITH CHECK (vibe_coder_id = auth.uid());

-- Create policy for vibe coders to update their own tasks
CREATE POLICY "Vibe coders can update their own tasks"
ON tasks
FOR UPDATE
USING (vibe_coder_id = auth.uid());

-- Create policy for developers to view open tasks
CREATE POLICY "Developers can view open tasks"
ON tasks
FOR SELECT
USING (
  status = 'Open' OR 
  developer_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'developer'
  )
);

-- Create policy for developers to update tasks assigned to them
CREATE POLICY "Developers can update tasks assigned to them"
ON tasks
FOR UPDATE
USING (
  developer_id = auth.uid()
);

-- Create policy for admins to view all tasks
CREATE POLICY "Admins can view all tasks"
ON tasks
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
