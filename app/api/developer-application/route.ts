import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "You must be logged in to submit an application" }, { status: 401 })
  }

  // Get the application data from the request
  const applicationData = await request.json()

  // Check if the email already exists in the applications
  const { data: existingApplication, error: checkError } = await supabase
    .from("developer_applications")
    .select("id, status")
    .eq("email", applicationData.email)
    .maybeSingle()

  if (checkError) {
    console.error("Error checking existing application:", checkError)
    return NextResponse.json({ error: "Error checking existing application" }, { status: 500 })
  }

  // If application exists and is not rejected, return error
  if (existingApplication && existingApplication.status !== "rejected") {
    return NextResponse.json(
      {
        error: "An application with this email already exists",
        id: existingApplication.id,
      },
      { status: 400 },
    )
  }

  // Insert the application
  const { data, error } = await supabase
    .from("developer_applications")
    .insert({
      user_id: session.user.id,
      full_name: applicationData.full_name,
      email: applicationData.email,
      experience_level: applicationData.experience_level,
      skills: applicationData.skills,
      vibe_coding_tools: applicationData.vibe_coding_tools,
      github_url: applicationData.github_url,
      availability: applicationData.availability,
      additional_info: applicationData.additional_info,
      terms_accepted: applicationData.terms_accepted,
      status: "pending",
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ error: "Error submitting application" }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
