"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Helper function to get the correct profile table based on role
const getProfileTable = (role: string) => {
  switch (role) {
    case "developer":
    case "developer_expert":
      return "devs"
    case "vibe-coder":
      return "vibe_coders"
    case "agency":
      return "agency_profiles"
    default:
      return "vibe_coders" // Default to vibe_coders
  }
}

// Server actions for authentication that can safely use the anon key
export async function signInWithEmail(email: string, password: string) {
  // For server actions, we need to create a client with cookies
  const supabaseWithCookies = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabaseWithCookies.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Update the signUpWithEmail function to use the correct profile table
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  role: "vibe-coder" | "developer" | "agency",
  additionalInfo?: any,
) {
  // For server actions, we need to create a client with cookies
  const supabaseWithCookies = createServerActionClient<Database>({ cookies })

  try {
    // Step 1: Create auth user
    const { data, error } = await supabaseWithCookies.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
          ...additionalInfo,
        },
      },
    })

    if (error) {
      console.error("Auth signup error:", error)
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error("User creation failed")
    }

    // Step 2: Create profile in the correct table based on role
    const profileTable = getProfileTable(role)

    try {
      const profileData = {
        user_id: data.user.id,
        email: email,
        full_name: name,
        profile_completed: false,
        ...additionalInfo,
      }

      console.log(`Creating profile in ${profileTable} with data:`, profileData)

      const { error: profileError } = await supabaseWithCookies.from(profileTable).insert(profileData)

      if (profileError) {
        console.error(`${profileTable} creation error:`, profileError)

        // Try to update if insert failed (might be a duplicate key error)
        const { error: updateError } = await supabaseWithCookies
          .from(profileTable)
          .update({
            full_name: name,
            profile_completed: false,
            ...additionalInfo,
          })
          .eq("user_id", data.user.id)

        if (updateError) {
          console.error(`${profileTable} update error:`, updateError)
        }
      }
    } catch (profileError) {
      console.error(`Error creating ${profileTable}:`, profileError)
    }

    // Now sign in the user immediately after signup
    const { error: signInError } = await supabaseWithCookies.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      console.error("Auto sign-in error:", signInError)
    }

    return data
  } catch (error: any) {
    console.error("Server action signup error:", error)
    throw new Error(error.message || "Failed to sign up")
  }
}

export async function signOut() {
  const supabaseWithCookies = createServerActionClient<Database>({ cookies })
  await supabaseWithCookies.auth.signOut()
}

// Update profile completion in the correct table
export async function updateProfileCompletion(userId: string, role: string, completed: boolean) {
  const supabaseWithCookies = createServerActionClient<Database>({ cookies })
  const profileTable = getProfileTable(role)

  try {
    const { error } = await supabaseWithCookies
      .from(profileTable)
      .update({ profile_completed: completed })
      .eq("user_id", userId)

    if (error) {
      console.error(`Error updating ${profileTable} completion:`, error)
      throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error(`Failed to update ${profileTable} completion:`, error)
    throw new Error(error.message || "Failed to update profile completion")
  }
}
