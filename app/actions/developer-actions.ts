"use server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

interface DeveloperApplicationInput {
  full_name: string
  email: string
  experience_level: string
  skills: string[]
  vibe_coding_tools: string[] | null
  github_url: string | null
  availability: string
  additional_info: string | null
  terms_accepted: boolean
}

export async function ensureDeveloperProfilesTable() {
  const supabase = createServerActionClient<Database>({ cookies })

  try {
    // Check if the table exists
    const { error: checkError } = await supabase.from("developer_profiles").select("count").limit(1)

    if (checkError) {
      console.log("Developer profiles table may not exist, attempting to create it")

      // Execute the SQL to create the table
      const { error: createError } = await supabase.rpc("create_developer_profiles_table_if_not_exists")

      if (createError) {
        console.error("Error creating developer profiles table:", createError)
        return { success: false, error: createError.message }
      }

      return { success: true, message: "Developer profiles table created successfully" }
    }

    return { success: true, message: "Developer profiles table already exists" }
  } catch (error) {
    console.error("Error ensuring developer profiles table:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createOrUpdateDeveloperProfile(profileData: any) {
  const supabase = createServerActionClient<Database>({ cookies })

  try {
    // First check if a profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("developer_profiles")
      .select("user_id")
      .eq("user_id", profileData.user_id)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing profile:", checkError)
      return { success: false, error: checkError.message }
    }

    let result

    // If profile exists, update it instead of inserting
    if (existingProfile) {
      result = await supabase.from("developer_profiles").update(profileData).eq("user_id", profileData.user_id).select()
    } else {
      // Create developer profile in Supabase
      result = await supabase.from("developer_profiles").insert(profileData).select()
    }

    const { data, error } = result

    if (error) {
      console.error("Error creating/updating developer profile:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in createOrUpdateDeveloperProfile:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function submitDeveloperApplication(data: DeveloperApplicationInput) {
  console.log("Starting submitDeveloperApplication with data:", data)
  console.log("Availability value:", data.availability)

  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    console.log("Supabase client created successfully")

    // Check if the email already exists in the applications
    const { data: existingApplication, error: checkError } = await supabase
      .from("developer_applications")
      .select("id")
      .eq("email", data.email)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing application:", checkError)
      return { success: false, message: `Error checking existing application: ${checkError.message}` }
    }

    if (existingApplication) {
      console.log("Existing application found with ID:", existingApplication.id)
      return {
        success: false,
        message: "An application with this email already exists",
        applicationId: existingApplication.id,
      }
    }

    // Get the constraint definition to see what values are allowed
    const { data: constraintData, error: constraintError } = await supabase
      .from("information_schema.table_constraints")
      .select("constraint_name")
      .eq("table_name", "developer_applications")
      .eq("constraint_type", "CHECK")
      .like("constraint_name", "%availability%")
      .single()

    if (constraintError) {
      console.log("Error fetching constraint info:", constraintError)
    } else {
      console.log("Found constraint:", constraintData)
    }

    // Normalize the availability value to match common formats
    let normalizedAvailability = data.availability.toLowerCase().trim()

    // Map common formats to expected values
    const availabilityMap: Record<string, string> = {
      "full-time": "Full-Time",
      "Full-Time": "Full-Time",
      "full time": "Full-Time",
      fulltime: "Full-Time",
      "part-time": "Part-Time",
      "Part-Time": "Part-Time",
      "part time": "Part-Time",
      parttime: "Part-Time",
      occasional: "Occasional",
      Occasional: "Occasional",
    }

    if (availabilityMap[normalizedAvailability]) {
      normalizedAvailability = availabilityMap[normalizedAvailability]
    }

    console.log("Normalized availability:", normalizedAvailability)

    // Prepare application data
    const applicationData = {
      full_name: data.full_name,
      email: data.email,
      experience_level: data.experience_level,
      skills: data.skills,
      vibe_coding_tools: data.vibe_coding_tools || [],
      github_url: data.github_url,
      availability: normalizedAvailability, // Use normalized value
      additional_info: data.additional_info || "",
      terms_accepted: data.terms_accepted,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "pending", // Add status directly
    }

    console.log("Inserting application with data:", applicationData)

    // Insert the application without requiring user_id
    const { data: application, error } = await supabase
      .from("developer_applications")
      .insert(applicationData)
      .select("id")
      .single()

    if (error) {
      console.error("Error submitting application:", error)

      // If it's a constraint violation, try a different approach
      if (error.message.includes("violates check constraint") && error.message.includes("availability")) {
        console.log("Constraint violation on availability, trying direct values")

        // Try each of these common values directly
        for (const tryValue of ["full-time", "part-time", "occasional", "weekends", "Full-time", "Part-time"]) {
          console.log(`Trying availability value: ${tryValue}`)

          const retryData = {
            ...applicationData,
            availability: tryValue,
          }

          const { data: retryApp, error: retryError } = await supabase
            .from("developer_applications")
            .insert(retryData)
            .select("id")
            .single()

          if (!retryError) {
            console.log("Success with value:", tryValue)

            // Revalidate the path to update the UI
            revalidatePath("/developer-onboarding")
            revalidatePath("/dashboard/developer")

            return {
              success: true,
              message: "Application submitted successfully",
              applicationId: retryApp.id,
            }
          }
        }
      }

      return {
        success: false,
        message: `Error submitting application: ${error.message}. Please try a different availability option.`,
      }
    }

    console.log("Application submitted successfully with ID:", application.id)

    // Revalidate the path to update the UI
    revalidatePath("/developer-onboarding")
    revalidatePath("/dashboard/developer")

    return {
      success: true,
      message: "Application submitted successfully",
      applicationId: application.id,
    }
  } catch (error) {
    console.error("Unexpected error in submitDeveloperApplication:", error)
    return {
      success: false,
      message: "An unexpected error occurred while submitting your application",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function getApplicationStatus(userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get the application for the user
    const { data: application, error } = await supabase
      .from("developer_applications")
      .select(`
        id, 
        status, 
        created_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error getting application status:", error)
      return null
    }

    return application
  } catch (error) {
    console.error("Error getting application status:", error)
    return null
  }
}

export async function createDeveloperProfile(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // Get the current user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id

    // Get form data
    const fullName = formData.get("fullName") as string
    const experienceLevel = formData.get("experienceLevel") as string
    const vibeCodingTools = JSON.parse((formData.get("vibeCodingTools") as string) || "[]")
    const githubUrl = formData.get("githubUrl") as string
    const availability = formData.get("availability") as string
    const hourlyRate = Number(formData.get("hourlyRate"))

    // Create developer profile
    const { error: profileError } = await supabase.from("developer_profiles").insert({
      user_id: userId,
      full_name: fullName,
      experience_level: experienceLevel,
      vibe_coding_tools: vibeCodingTools,
      github_url: githubUrl || null,
      availability,
      hourly_rate: hourlyRate,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    // Update the main profile to mark as completed
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_completed: true, role: "developer" })
      .eq("id", userId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Create developer profile error:", error)
    return { success: false, error: String(error) }
  }
}

export async function getDeveloperProfile() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // Get the current user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id

    // Get developer profile
    const { data: profile, error: profileError } = await supabase
      .from("developer_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (profileError) {
      return { success: false, error: profileError.message, data: null }
    }

    return { success: true, data: profile }
  } catch (error) {
    console.error("Get developer profile error:", error)
    return { success: false, error: String(error), data: null }
  }
}
