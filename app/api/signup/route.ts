import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 })
    }

    // Create an admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // Create a new user with the admin client
    console.log("Creating new user with admin client")
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "vibe_coder",
      },
    })

    if (createError) {
      console.error("Error creating user with admin client:", createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    if (!userData || !userData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    const userId = userData.user.id
    console.log("Created new user with ID:", userId)

    // Create a client for the newly created user
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_ANON_KEY || "", {
      auth: {
        persistSession: false,
      },
    })

    // Sign in with the created credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error("Error signing in:", signInError)
      return NextResponse.json({ error: signInError.message }, { status: 500 })
    }

    if (!signInData || !signInData.session) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Set the session cookie
    const cookieStore = cookies()

    // Set the access token cookie
    cookieStore.set("sb-access-token", signInData.session.access_token, {
      path: "/",
      maxAge: 60 * 60, // 1 hour
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    // Set the refresh token cookie
    cookieStore.set("sb-refresh-token", signInData.session.refresh_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    // Try to store user details in the profiles table
    try {
      await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName,
        email,
        role: "vibe_coder",
        profile_completed: false,
      })
    } catch (error) {
      console.warn("Error creating profile (continuing anyway):", error)
    }

    // Try to insert into vibe_coders table if it exists
    try {
      await supabase.from("vibe_coders").insert({
        user_id: userId,
        email,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.warn("Error inserting into vibe_coders (continuing anyway):", error)
    }

    return NextResponse.json({
      success: true,
      user: userData.user,
    })
  } catch (error: any) {
    console.error("Error in signup route:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}
