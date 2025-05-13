-- First, let's inspect the current constraint
SELECT con.conname AS constraint_name,
       pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'developer_applications'
  AND con.contype = 'c'
  AND con.conname LIKE '%availability%';

-- Drop the existing constraint
ALTER TABLE developer_applications DROP CONSTRAINT IF EXISTS developer_applications_availability_check;

-- Add a more flexible constraint that accepts various formats
ALTER TABLE developer_applications ADD CONSTRAINT developer_applications_availability_check 
CHECK (availability IN ('full-time', 'part-time', 'occasional', 'weekends', 
                        'Full-time', 'Part-time', 'Occasional', 'Weekends',
                        'FULL-TIME', 'PART-TIME', 'OCCASIONAL', 'WEEKENDS'));

-- Alternatively, if case sensitivity is an issue, we could use a case-insensitive check:
-- ALTER TABLE developer_applications ADD CONSTRAINT developer_applications_availability_check 
-- CHECK (LOWER(availability) IN ('full-time', 'part-time', 'occasional', 'weekends'));
