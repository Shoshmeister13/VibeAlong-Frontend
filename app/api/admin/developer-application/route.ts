import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "You must be logged in to perform this action" }, { status: 401 })
  }

  // Check if the user is an admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "You do not have permission to perform this action" }, { status: 403 })
  }

  // Get the application data from the request
  const { applicationId, status } = await request.json()

  if (!applicationId || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Update the application status
  const { error } = await supabase.from("developer_applications").update({ status }).eq("id", applicationId)

  if (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json({ error: "Error updating application status" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
