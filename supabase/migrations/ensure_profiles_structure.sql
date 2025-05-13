-- First, check if the profiles table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        -- Create the profiles table if it doesn't exist
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL,
            full_name TEXT,
            role TEXT,
            avatar_url TEXT,
            profile_completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Add RLS policies
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Allow users to read their own profile
        CREATE POLICY "Users can read their own profile"
            ON public.profiles
            FOR SELECT
            USING (auth.uid() = id);
            
        -- Allow users to update their own profile
        CREATE POLICY "Users can update their own profile"
            ON public.profiles
            FOR UPDATE
            USING (auth.uid() = id);
            
        -- Allow service role to manage all profiles
        CREATE POLICY "Service role can manage all profiles"
            ON public.profiles
            USING (auth.role() = 'service_role');
    ELSE
        -- Ensure the profile_completed column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'profile_completed'
        ) THEN
            ALTER TABLE public.profiles ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
        END IF;
        
        -- Ensure the role column exists
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'role'
        ) THEN
            ALTER TABLE public.profiles ADD COLUMN role TEXT;
        END IF;
    END IF;
END
$$;
