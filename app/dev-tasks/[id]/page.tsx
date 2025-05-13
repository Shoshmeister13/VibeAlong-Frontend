export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { TaskDetailView } from "@/components/tasks/task-detail-view"

export default async function DevTaskDetailPage({ params }: { params: { id: string } }) {
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

  // Check if user is a developer
  if (profile.role !== "developer" && profile.role !== "admin") {
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
      profiles!tasks_vibe_coder_id_fkey (
        id,
        full_name,
        email
      ),
      profiles!tasks_developer_id_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !task) {
    notFound()
  }

  // Check if the user has access to this task
  const isDeveloper = task.developer_id === profile.id || task.status === "Open"

  if (!isDeveloper && profile.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <TaskDetailView task={task} backHref="/dashboard/developer/tasks" userRole={profile.role} userId={profile.id} />
  )
}
