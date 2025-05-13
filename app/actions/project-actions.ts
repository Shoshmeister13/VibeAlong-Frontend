"use server"

export async function getProjects() {
  try {
    // Return mock data
    return {
      success: true,
      data: [
        {
          id: "proj-1",
          name: "E-commerce Platform",
          description: "A modern e-commerce platform with React and Node.js",
          platform: "Next.js",
          stage: "Development",
        },
        {
          id: "proj-2",
          name: "Portfolio Website",
          description: "Personal portfolio website with blog functionality",
          platform: "Vercel",
          stage: "Planning",
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return { success: false, error: "Failed to fetch projects" }
  }
}

export async function createProject(data: any) {
  try {
    // Mock project creation
    return {
      success: true,
      message: "Project created successfully",
      projectId: "new-project-id",
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function createTask(data: any) {
  try {
    // Mock task creation
    return {
      success: true,
      message: "Task created successfully",
      taskId: "new-task-id",
    }
  } catch (error) {
    console.error("Error creating task:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  try {
    // Mock project update
    return {
      success: true,
      data: {
        id: projectId,
        name: formData.get("name") || "Updated Project",
        description: formData.get("description") || "Updated description",
        platform: formData.get("platform") || "Next.js",
        stage: formData.get("stage") || "Development",
      },
    }
  } catch (error) {
    console.error("Error updating project:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(projectId: string) {
  try {
    // Mock project deletion
    return { success: true }
  } catch (error) {
    console.error("Error deleting project:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

export async function getProjectTasks(projectId: string) {
  try {
    // Return mock task data
    return {
      success: true,
      data: [
        {
          id: "task-1",
          title: "Design User Interface",
          description: "Create wireframes and mockups for the main dashboard",
          priority: "high",
          status: "In Progress",
          estimated_time_hours: 8,
          estimated_cost_usd: 400,
          vibe_coder_id: "vc-123",
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "task-2",
          title: "Implement Authentication",
          description: "Set up user authentication with OAuth providers",
          priority: "medium",
          status: "Open",
          estimated_time_hours: 6,
          estimated_cost_usd: 300,
          vibe_coder_id: "vc-123",
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "task-3",
          title: "Database Schema Design",
          description: "Design and implement the database schema for the application",
          priority: "high",
          status: "Completed",
          estimated_time_hours: 4,
          estimated_cost_usd: 200,
          vibe_coder_id: "vc-123",
          project_id: projectId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return { success: false, error: "Failed to fetch tasks", data: [] }
  }
}
