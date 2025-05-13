-- Drop the existing constraint
ALTER TABLE developer_applications DROP CONSTRAINT IF EXISTS developer_applications_availability_check;

-- Add a new constraint with the exact values
ALTER TABLE developer_applications ADD CONSTRAINT developer_applications_availability_check 
CHECK (availability IN ('Full-Time', 'Part-Time', 'Occasional'));

-- Update any existing records to match the new format
UPDATE developer_applications SET availability = 'Full-Time' WHERE LOWER(availability) LIKE 'full%time%';
UPDATE developer_applications SET availability = 'Part-Time' WHERE LOWER(availability) LIKE 'part%time%';
UPDATE developer_applications SET availability = 'Occasional' WHERE LOWER(availability) LIKE 'occasional%';
