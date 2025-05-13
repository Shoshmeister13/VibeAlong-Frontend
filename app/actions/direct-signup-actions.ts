"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// This server action creates a user and immediately signs them in
// without requiring email confirmation
export async function directSignUp(email: string, password: string, fullName: string) {
  // Create an admin client with service role key for admin operations
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

  // Create a regular client for setting cookies
  const supabase = createServerActionClient<Database>({ cookies })

  try {
    console.log("Starting direct signup process for:", email)

    // Create a new user with the admin client
    console.log("Creating new user with admin client")
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
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
      throw createError
    }

    if (!newUser || !newUser.user) {
      throw new Error("Failed to create user with admin client")
    }

    const userId = newUser.user.id
    console.log("Created new user with ID:", userId)

    // Generate a session for the user
    console.log("Generating session for user:", userId)
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    })

    if (sessionError) {
      console.error("Error generating session:", sessionError)
      throw sessionError
    }

    if (!sessionData || !sessionData.properties) {
      throw new Error("Failed to generate session")
    }

    // Extract the hashed token from the magic link
    const hashedToken = new URL(sessionData.properties.action_link).searchParams.get("token")

    if (!hashedToken) {
      throw new Error("Failed to extract token from magic link")
    }

    // Exchange the token for a session
    console.log("Exchanging token for session")
    const { data: exchangeData, error: exchangeError } = await supabase.auth.verifyOtp({
      token_hash: hashedToken,
      type: "magiclink",
    })

    if (exchangeError) {
      console.error("Error exchanging token for session:", exchangeError)
      throw exchangeError
    }

    console.log("Session created successfully")

    // Try to store user details in the profiles table, but don't fail if the table doesn't exist
    try {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName,
        email,
        role: "vibe_coder",
        profile_completed: false,
      })

      if (profileError) {
        // If the table doesn't exist, log the error but continue
        if (profileError.message.includes("does not exist") || profileError.code === "PGRST114") {
          console.warn("Profiles table does not exist, skipping profile creation")
        } else {
          console.error("Profile creation error:", profileError)
        }
      }
    } catch (profileError: any) {
      console.warn("Error creating profile (continuing anyway):", profileError.message)
    }

    // Try to insert into vibe_coders table if it exists
    try {
      const { error: vibeCoderError } = await supabase.from("vibe_coders").insert({
        user_id: userId,
        email,
        created_at: new Date().toISOString(),
      })

      if (vibeCoderError && !vibeCoderError.message.includes("does not exist")) {
        console.error("Error inserting into vibe_coders:", vibeCoderError)
      }
    } catch (error) {
      console.warn("Error inserting into vibe_coders (continuing anyway):", error)
    }

    return { success: true, user: exchangeData.user }
  } catch (error: any) {
    console.error("Direct signup error:", error)
    throw new Error(error.message || "Failed to sign up")
  }
}
