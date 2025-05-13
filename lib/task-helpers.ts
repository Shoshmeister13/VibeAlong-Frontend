/**
 * Helper functions for task management
 */

/**
 * Assigns a developer to a task and updates the task status
 * @param taskId - The ID of the task to update
 * @param developerId - The ID of the developer to assign
 * @param developerData - Additional developer data
 * @returns Promise with the result of the operation
 */
export async function assignDeveloperToTask(taskId: string, developerId: string, developerData: any) {
  try {
    // In a real app, this would update the database
    // For now, we'll update the mock data in localStorage
    const storedTasks = localStorage.getItem("mockTasks")
    if (storedTasks) {
      try {
        const tasks = JSON.parse(storedTasks)
        const updatedTasks = tasks.map((task: any) => {
          if (task.id === taskId) {
            return {
              ...task,
              status: "In Progress",
              assigned_developer: developerData,
              developer_id: developerId,
              progress: 0,
              last_updated: new Date().toISOString(),
            }
          }
          return task
        })

        localStorage.setItem("mockTasks", JSON.stringify(updatedTasks))
        return { success: true }
      } catch (e) {
        console.error("Error updating task:", e)
        return { success: false, error: "Failed to update task data" }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error assigning developer:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * For frontend development, always allow access to task spaces
 */
export function checkTaskAccess(task: any, userId: string, userRole: string) {
  // Always return true for frontend development
  return true
}
