"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function approveApplication(applicationId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, message: "You must be logged in to approve applications" }
  }

  // Check if the user is an admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (!profile || profile.role !== "admin") {
    return { success: false, message: "You do not have permission to approve applications" }
  }

  // Update the application status
  const { error } = await supabase.from("developer_applications").update({ status: "approved" }).eq("id", applicationId)

  if (error) {
    console.error("Error approving application:", error)
    return { success: false, message: "Error approving application" }
  }

  // Revalidate the paths to update the UI
  revalidatePath("/admin/developer-applications")
  revalidatePath(`/admin/developer-applications/${applicationId}`)

  redirect("/admin/developer-applications")
}

export async function rejectApplication(applicationId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { success: false, message: "You must be logged in to reject applications" }
  }

  // Check if the user is an admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (!profile || profile.role !== "admin") {
    return { success: false, message: "You do not have permission to reject applications" }
  }

  // Update the application status
  const { error } = await supabase.from("developer_applications").update({ status: "rejected" }).eq("id", applicationId)

  if (error) {
    console.error("Error rejecting application:", error)
    return { success: false, message: "Error rejecting application" }
  }

  // Revalidate the paths to update the UI
  revalidatePath("/admin/developer-applications")
  revalidatePath(`/admin/developer-applications/${applicationId}`)

  redirect("/admin/developer-applications")
}
