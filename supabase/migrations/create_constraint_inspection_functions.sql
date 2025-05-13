-- Function to get all constraints for a table
CREATE OR REPLACE FUNCTION get_table_constraints(table_name text)
RETURNS TABLE (
  constraint_name text,
  constraint_type text,
  table_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.constraint_name::text,
    tc.constraint_type::text,
    tc.table_name::text
  FROM 
    information_schema.table_constraints tc
  WHERE 
    tc.table_name = $1
    AND tc.table_schema = 'public';
END;
$$ LANGUAGE plpgsql;

-- Function to get check constraint definitions
CREATE OR REPLACE FUNCTION get_check_constraints(table_name text)
RETURNS TABLE (
  constraint_name text,
  constraint_definition text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    con.conname::text AS constraint_name,
    pg_get_constraintdef(con.oid)::text AS constraint_definition
  FROM 
    pg_constraint con
  JOIN 
    pg_class rel ON rel.oid = con.conrelid
  JOIN 
    pg_namespace nsp ON nsp.oid = rel.relnamespace
  WHERE 
    rel.relname = $1
    AND nsp.nspname = 'public'
    AND con.contype = 'c';
END;
$$ LANGUAGE plpgsql;
