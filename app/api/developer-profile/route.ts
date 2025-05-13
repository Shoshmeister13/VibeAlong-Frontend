import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Parse the request body
    let profileData
    try {
      profileData = await request.json()
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 },
      )
    }

    // Validate required fields
    if (!profileData.user_id) {
      console.error("Missing user_id in request")
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: user_id",
        },
        { status: 400 },
      )
    }

    console.log("Received profile data:", JSON.stringify(profileData))

    // First check if the table exists
    try {
      const { error: checkError } = await supabase.from("developer_profiles").select("count").limit(1)

      if (checkError) {
        console.log("Table check error, attempting to create table:", checkError.message)

        // Try to create the table
        const createTableSql = `
          CREATE TABLE IF NOT EXISTS public.developer_profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            full_name TEXT,
            tagline TEXT,
            bio TEXT,
            skills JSONB DEFAULT '[]'::jsonb,
            vibe_coding_tools JSONB DEFAULT '[]'::jsonb,
            experience_level TEXT,
            github_username TEXT,
            portfolio_url TEXT,
            availability TEXT,
            task_categories JSONB DEFAULT '[]'::jsonb,
            hourly_rate NUMERIC DEFAULT 0,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            UNIQUE(user_id)
          );
          
          -- Add RLS policies
          ALTER TABLE public.developer_profiles ENABLE ROW LEVEL SECURITY;
          
          -- Allow users to read all profiles
          CREATE POLICY "Allow users to read all profiles"
            ON public.developer_profiles
            FOR SELECT
            TO authenticated
            USING (true);
            
          -- Allow users to update their own profile
          CREATE POLICY "Allow users to update their own profile"
            ON public.developer_profiles
            FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id);
            
          -- Allow users to insert their own profile
          CREATE POLICY "Allow users to insert their own profile"
            ON public.developer_profiles
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
        `

        // Use service role to create table if available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseServiceKey && supabaseUrl) {
          console.log("Using service role to create table")
          const { createClient: createAdminClient } = await import("@supabase/supabase-js")

          const adminClient = createAdminClient(supabaseUrl, supabaseServiceKey)

          try {
            await adminClient.rpc("exec_sql", { sql: createTableSql })
            console.log("Table created successfully")
          } catch (createError) {
            console.error("Error creating table with service role:", createError)
          }
        }
      }
    } catch (tableError) {
      console.error("Error checking/creating table:", tableError)
    }

    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("developer_profiles")
      .select("user_id")
      .eq("user_id", profileData.user_id)
      .maybeSingle()

    let result

    if (existingProfile) {
      console.log("Updating existing profile")
      result = await supabase.from("developer_profiles").update(profileData).eq("user_id", profileData.user_id).select()
    } else {
      console.log("Inserting new profile")
      result = await supabase.from("developer_profiles").insert(profileData).select()
    }

    const { data, error } = result

    if (error) {
      console.error("Error inserting/updating profile:", error)
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Unexpected error in developer profile API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
