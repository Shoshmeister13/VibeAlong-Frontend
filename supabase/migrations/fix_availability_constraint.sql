-- Drop the existing check constraint if it exists
ALTER TABLE developer_applications DROP CONSTRAINT IF EXISTS developer_applications_availability_check;

-- Add the correct check constraint
ALTER TABLE developer_applications ADD CONSTRAINT developer_applications_availability_check 
CHECK (availability IN ('full-time', 'part-time', 'occasional', 'weekends'));
