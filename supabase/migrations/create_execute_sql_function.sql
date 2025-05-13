-- Create a function to execute SQL directly
-- This is useful for creating tables and other schema changes
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'SQL execution error: %', SQLERRM;
  RETURN FALSE;
END;
$$;

-- Create a function specifically for creating the developer profiles table
CREATE OR REPLACE FUNCTION create_developer_profiles_table()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'developer_profiles'
  ) THEN
    -- Create the table if it doesn't exist
    EXECUTE '
      CREATE TABLE public.developer_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name TEXT NOT NULL,
        tagline TEXT NOT NULL,
        bio TEXT NOT NULL,
        skills JSONB NOT NULL DEFAULT ''[]''::jsonb,
        vibe_coding_tools JSONB DEFAULT ''[]''::jsonb,
        experience_level TEXT NOT NULL,
        github_username TEXT,
        portfolio_url TEXT,
        availability TEXT NOT NULL,
        task_categories JSONB NOT NULL DEFAULT ''[]''::jsonb,
        hourly_rate NUMERIC NOT NULL DEFAULT 0,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(user_id)
      );
      
      CREATE INDEX IF NOT EXISTS developer_profiles_user_id_idx ON public.developer_profiles(user_id);
    ';
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error creating developer_profiles table: %', SQLERRM;
  RETURN FALSE;
END;
$$;
