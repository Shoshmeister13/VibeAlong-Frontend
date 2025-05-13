-- Create task ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.task_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  developer_id UUID NOT NULL,
  quality_rating INTEGER NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
  time_rating INTEGER NOT NULL CHECK (time_rating BETWEEN 1 AND 5),
  availability_rating INTEGER NOT NULL CHECK (availability_rating BETWEEN 1 AND 5),
  review TEXT,
  submitted_by UUID NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Prevent multiple ratings for the same task
  CONSTRAINT unique_task_rating UNIQUE (task_id)
);

-- Add RLS policies
ALTER TABLE public.task_ratings ENABLE ROW LEVEL SECURITY;

-- Allow vibe coders to insert ratings for their own tasks
CREATE POLICY task_ratings_insert_policy ON public.task_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    submitted_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = task_id AND (vibe_coder_id = auth.uid() OR created_by_id = auth.uid())
    )
  );

-- Allow users to view ratings
CREATE POLICY task_ratings_select_policy ON public.task_ratings
  FOR SELECT
  TO authenticated
  USING (true);

-- Add a column to tasks table to track if a rating has been submitted
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS rating_submitted BOOLEAN DEFAULT false;

-- Create a trigger to update the task when a rating is submitted
CREATE OR REPLACE FUNCTION update_task_rating_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tasks
  SET rating_submitted = true
  WHERE id = NEW.task_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_task_rating_insert
AFTER INSERT ON public.task_ratings
FOR EACH ROW
EXECUTE FUNCTION update_task_rating_status();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_ratings_task_id ON public.task_ratings(task_id);
CREATE INDEX IF NOT EXISTS idx_task_ratings_developer_id ON public.task_ratings(developer_id);
