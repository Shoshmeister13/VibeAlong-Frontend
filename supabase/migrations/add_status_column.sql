-- Check if the status column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'developer_applications'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE developer_applications ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;
