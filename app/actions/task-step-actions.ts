"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function saveTaskSteps(
  taskId: string,
  steps: { step: string; description?: string; completed?: boolean }[],
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id

    // Check if user has access to this task
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("vibe_coder_id, developer_id")
      .eq("id", taskId)
      .single()

    if (taskError || !task) {
      return { success: false, error: "Task not found" }
    }

    if (task.vibe_coder_id !== userId && task.developer_id !== userId) {
      return { success: false, error: "Not authorized to update this task" }
    }

    // Update the task with the new steps
    const { error: updateError } = await supabase.from("tasks").update({ suggested_steps: steps }).eq("id", taskId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error saving task steps:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateTaskStepStatus({
  taskId,
  stepId,
  completed,
}: {
  taskId: string
  stepId: string
  completed: boolean
}) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id

    // Check if user has access to this task
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("vibe_coder_id, developer_id, suggested_steps")
      .eq("id", taskId)
      .single()

    if (taskError || !task) {
      return { success: false, error: "Task not found" }
    }

    if (task.vibe_coder_id !== userId && task.developer_id !== userId) {
      return { success: false, error: "Not authorized to update this task" }
    }

    // Update the specific step in the suggested_steps array
    const updatedSteps = Array.isArray(task.suggested_steps)
      ? task.suggested_steps.map((step: any) => {
          if (step.id === stepId || step.step === stepId) {
            return { ...step, completed }
          }
          return step
        })
      : []

    // Update the task with the modified steps
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ suggested_steps: updatedSteps })
      .eq("id", taskId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating task step:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
