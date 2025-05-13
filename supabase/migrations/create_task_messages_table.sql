-- Create task_messages table
CREATE TABLE IF NOT EXISTS public.task_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.task_messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view messages for tasks they are involved in
CREATE POLICY "Users can view messages for their tasks" ON public.task_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT vibe_coder_id FROM public.tasks WHERE id = task_id
      UNION
      SELECT developer_id FROM public.tasks WHERE id = task_id
    )
  );

-- Policy to allow users to insert messages for tasks they are involved in
CREATE POLICY "Users can insert messages for their tasks" ON public.task_messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT vibe_coder_id FROM public.tasks WHERE id = task_id
      UNION
      SELECT developer_id FROM public.tasks WHERE id = task_id
    )
  );

-- Policy to allow users to update their own messages
CREATE POLICY "Users can update their own messages" ON public.task_messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- Policy to allow users to delete their own messages
CREATE POLICY "Users can delete their own messages" ON public.task_messages
  FOR DELETE USING (auth.uid() = sender_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS task_messages_task_id_idx ON public.task_messages(task_id);
CREATE INDEX IF NOT EXISTS task_messages_sender_id_idx ON public.task_messages(sender_id);
