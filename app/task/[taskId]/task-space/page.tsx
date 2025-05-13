import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { EnhancedTaskSpace } from "@/components/task-space/enhanced-task-space"
import { TaskSpaceAccessDenied } from "@/components/task-space/task-space-access-denied"

export default async function TaskSpacePage({ params }: { params: { taskId: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get the user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", session.user.id)
    .single()

  if (profileError || !profile) {
    redirect("/dashboard")
  }

  // Fetch the task
  const { data: task, error } = await supabase
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
      developer_id,
      project_id,
      created_at,
      updated_at,
      progress,
      last_updated,
      budget,
      estimated_hours,
      projects(
        id,
        name,
        description,
        platform
      ),
      profiles!tasks_vibe_coder_id_fkey (
        id,
        full_name,
        email,
        avatar_url
      ),
      profiles!tasks_developer_id_fkey (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .eq("id", params.taskId)
    .single()

  if (error || !task) {
    notFound()
  }

  // Check if the user has access to this task
  const isVibeCoder = profile.role === "vibe_coder" && task.vibe_coder_id === profile.id
  const isDeveloper = profile.role === "developer" && task.developer_id === profile.id

  // Check if the task is in a valid state for the task space
  const isValidTaskState = task.status === "In Progress" || task.status === "Completed" || task.status === "Review"

  if (!isVibeCoder && !isDeveloper) {
    redirect("/dashboard")
  }

  if (!isValidTaskState) {
    return <TaskSpaceAccessDenied task={task} />
  }

  // Render the enhanced task space
  return <EnhancedTaskSpace task={task} userId={profile.id} userRole={profile.role} />
}
