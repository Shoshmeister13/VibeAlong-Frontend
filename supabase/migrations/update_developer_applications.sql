-- Make user_id optional in the developer_applications table
ALTER TABLE developer_applications 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow anonymous inserts
DROP POLICY IF EXISTS "Users can insert their own applications" ON developer_applications;

-- Create a policy that allows anyone to insert applications
CREATE POLICY "Anyone can insert applications"
ON developer_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Create a policy that allows public to view applications
CREATE POLICY "Public can view applications"
ON developer_applications
FOR SELECT
TO public
USING (true);
