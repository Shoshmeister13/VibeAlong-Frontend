-- Create a function to execute arbitrary SQL
-- This is needed for migrations that can't be run directly through the Supabase client
CREATE OR REPLACE FUNCTION execute_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
