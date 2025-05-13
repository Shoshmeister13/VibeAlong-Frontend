-- Function to create a dev profile bypassing RLS
CREATE OR REPLACE FUNCTION create_dev_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_bio TEXT,
  p_github_url TEXT,
  p_years_of_experience INTEGER,
  p_ai_platforms TEXT[],
  p_frameworks TEXT[],
  p_profile_picture TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO devs (
    user_id,
    full_name,
    email,
    bio,
    github_url,
    years_of_experience,
    ai_platforms,
    frameworks,
    profile_picture,
    created_at
  ) VALUES (
    p_user_id,
    p_full_name,
    p_email,
    p_bio,
    p_github_url,
    p_years_of_experience,
    p_ai_platforms,
    p_frameworks,
    p_profile_picture,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a user profile bypassing RLS
CREATE OR REPLACE FUNCTION create_user_profile(
  p_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_role TEXT,
  p_profile_completed BOOLEAN
) RETURNS VOID AS $$
BEGIN
  INSERT INTO profiles (
    id,
    full_name,
    email,
    role,
    profile_completed,
    created_at
  ) VALUES (
    p_id,
    p_full_name,
    p_email,
    p_role,
    p_profile_completed,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
