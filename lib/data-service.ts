"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getProjects(userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching projects:", error)
      return []
    }

    // Ensure we always return an array, even if data is null or undefined
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("Error in getProjects:", error)
    return []
  }
}

export async function getProject(id: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching project:", error)
      return null
    }

    return {
      ...data,
      techStack: data.stack || [], // Ensure techStack is always an array
      collaborators: [
        {
          id: "1",
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "developer",
          status: "active",
        },
        {
          id: "2",
          name: "Jane Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "developer",
          status: "pending",
        },
      ],
    }
  } catch (error) {
    console.error("Error in getProject:", error)
    return null
  }
}

export async function getCollaborations(userId: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from("collaborations")
      .select(`
        *,
        project:project_id(*),
        owner:owner_id(*)
      `)
      .or(`owner_id.eq.${userId},collaborators.cs.{${userId}}`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching collaborations:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getCollaborations:", error)
    return []
  }
}

export async function getCollaboration(id: string) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from("collaborations")
      .select(`
        *,
        project:project_id(*),
        owner:owner_id(*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching collaboration:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getCollaboration:", error)
    return null
  }
}
