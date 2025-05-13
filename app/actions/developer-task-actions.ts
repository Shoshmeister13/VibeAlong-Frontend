"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function getOpenTasks() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, message: "You must be logged in to view tasks" }
    }

    // Get the user's profile to ensure they are a developer
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", session.user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, message: "Error fetching user profile" }
    }

    if (profile.role !== "developer") {
      return { success: false, message: "Only developers can view the task board" }
    }

    // Fetch all open tasks
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        description,
        priority,
        category,
        stack,
        key_points,
        suggested_steps,
        estimated_time_hours,
        estimated_cost_usd,
        status,
        vibe_coder_id,
        created_at,
        profiles!tasks_vibe_coder_id_fkey (
          full_name
        )
      `)
      .eq("status", "Open")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching open tasks:", error)
      return { success: false, message: `Error fetching open tasks: ${error.message}` }
    }

    return { success: true, data: tasks }
  } catch (error) {
    console.error("Unexpected error in getOpenTasks:", error)
    return {
      success: false,
      message: "An unexpected error occurred while fetching tasks",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function claimTask(taskId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, message: "You must be logged in to claim a task" }
    }

    // Get the user's profile to ensure they are a developer
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", session.user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, message: "Error fetching user profile" }
    }

    if (profile.role !== "developer") {
      return { success: false, message: "Only developers can claim tasks" }
    }

    // Check if the task is still open
    const { data: task, error: taskError } = await supabase.from("tasks").select("status").eq("id", taskId).single()

    if (taskError || !task) {
      return { success: false, message: "Error fetching task" }
    }

    if (task.status !== "Open") {
      return { success: false, message: "This task is no longer available" }
    }

    // Update the task
    const { error } = await supabase
      .from("tasks")
      .update({
        status: "In Progress",
        developer_id: profile.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("status", "Open") // Extra check to prevent race conditions

    if (error) {
      console.error("Error claiming task:", error)
      return { success: false, message: `Error claiming task: ${error.message}` }
    }

    // Revalidate the paths to update the UI
    revalidatePath("/dashboard/developer/tasks")
    revalidatePath("/dashboard/tasks")

    return { success: true, message: "Task claimed successfully" }
  } catch (error) {
    console.error("Unexpected error in claimTask:", error)
    return {
      success: false,
      message: "An unexpected error occurred while claiming the task",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
