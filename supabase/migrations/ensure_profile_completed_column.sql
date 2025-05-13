-- Check if profile_completed column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'profile_completed'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add index on profile_completed for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_profile_completed ON public.profiles(profile_completed);

-- Update any NULL values to FALSE
UPDATE public.profiles SET profile_completed = FALSE WHERE profile_completed IS NULL;
