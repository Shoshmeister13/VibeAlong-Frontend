"use server"

export async function getTasks(projectId: string) {
  try {
    // Mock task data
    return {
      success: true,
      data: [
        {
          id: "task-1",
          title: "Implement user authentication",
          description: "Add login, signup, and password reset functionality",
          status: "open",
          priority: "high",
          project_id: projectId,
          estimated_hours: 4,
          created_at: new Date().toISOString(),
        },
        {
          id: "task-2",
          title: "Create product listing page",
          description: "Design and implement the product grid with filtering options",
          status: "in_progress",
          priority: "medium",
          project_id: projectId,
          estimated_hours: 6,
          created_at: new Date().toISOString(),
        },
        {
          id: "task-3",
          title: "Set up payment processing",
          description: "Integrate Stripe for secure payment processing",
          status: "completed",
          priority: "high",
          project_id: projectId,
          estimated_hours: 8,
          created_at: new Date().toISOString(),
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return { success: false, error: "Failed to fetch tasks" }
  }
}

export async function submitTask(values: any) {
  try {
    // Mock AI analysis
    const aiAnalysis = {
      key_points: ["Implement login", "Implement signup", "Implement password reset"],
      suggested_steps: [
        { step: "Create login form", description: "Create a form for users to log in" },
        { step: "Create signup form", description: "Create a form for users to sign up" },
        { step: "Implement password reset", description: "Implement password reset functionality" },
      ],
      estimated_time_hours: 10,
      estimated_cost_usd: 500,
    }

    return {
      success: true,
      message: "Task submitted successfully",
      analysis: aiAnalysis,
    }
  } catch (error) {
    console.error("Error submitting task:", error)
    return { success: false, message: "Failed to submit task" }
  }
}
