CREATE OR REPLACE FUNCTION create_projects_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Check if the projects table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'projects'
  ) THEN
    -- Create the projects table
    CREATE TABLE public.projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      platform TEXT,
      stage TEXT,
      status TEXT DEFAULT 'active',
      owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Add RLS policies
    ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

    -- Policy to allow users to view their own projects
    CREATE POLICY "Users can view their own projects"
      ON public.projects
      FOR SELECT
      USING (auth.uid() = owner_id);

    -- Policy to allow users to insert their own projects
    CREATE POLICY "Users can insert their own projects"
      ON public.projects
      FOR INSERT
      WITH CHECK (auth.uid() = owner_id);

    -- Policy to allow users to update their own projects
    CREATE POLICY "Users can update their own projects"
      ON public.projects
      FOR UPDATE
      USING (auth.uid() = owner_id);

    -- Policy to allow users to delete their own projects
    CREATE POLICY "Users can delete their own projects"
      ON public.projects
      FOR DELETE
      USING (auth.uid() = owner_id);
  END IF;
END;
$$ LANGUAGE plpgsql;
