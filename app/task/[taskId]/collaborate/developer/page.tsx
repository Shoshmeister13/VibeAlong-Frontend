"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { DeveloperTaskSpace } from "@/components/collaboration/developer-task-space"
import { RoleSelector } from "@/components/task-space/role-selector"

// Now, let's update the MOCK_TASK to include GitHub repository information
const MOCK_TASK = {
  id: "task-1",
  title: "Implement User Dashboard",
  description: "Create a responsive dashboard with user statistics, recent activity, and task progress indicators.",
  status: "In Progress",
  priority: "High",
  project: {
    id: "proj-1",
    name: "Developer Collaboration Platform",
    description: "A platform for connecting developers with projects",
    platform: "V0",
  },
  vibe_coder_id: "vibe-coder-1",
  developer_id: "developer-1",
  vibe_coder: {
    id: "vibe-coder-1",
    full_name: "Alex Johnson",
    email: "alex@example.com",
    avatar_url: "/abstract-aj.png",
  },
  developer: {
    id: "developer-1",
    full_name: "Sam Rivera",
    email: "sam@example.com",
    avatar_url: "/abstract-geometric-sr.png",
  },
  suggested_steps: [
    {
      step: "Analyze requirements",
      description: "Review the dashboard requirements and create a component plan",
      completed: true,
    },
    {
      step: "Create UI components",
      description: "Develop the UI components following the design system",
      completed: false,
    },
    { step: "Implement data fetching", description: "Connect the dashboard to the API endpoints", completed: false },
    {
      step: "Add responsive design",
      description: "Ensure the dashboard works well on all device sizes",
      completed: false,
    },
    { step: "Write tests", description: "Create unit and integration tests for the dashboard", completed: false },
  ],
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  estimated_hours: 16,
  progress: 20,
  last_updated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  platform: "V0",
  created_by: "user-1",
  attachments: [
    { name: "dashboard-wireframe.png", url: "#", type: "image/png", size: "1.2 MB" },
    { name: "requirements.pdf", url: "#", type: "application/pdf", size: "450 KB" },
  ],
  comments: [
    {
      id: "comment-1",
      user: { id: "vibe-coder-1", name: "Alex Johnson", avatar: "/abstract-aj.png" },
      content: "I've added some additional wireframes to the attachments. Let me know what you think!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "comment-2",
      user: { id: "developer-1", name: "Sam Rivera", avatar: "/abstract-geometric-sr.png" },
      content: "Thanks for the wireframes. I'll start implementing the basic structure today.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

export default function DeveloperTaskCollaborationPage() {
  const params = useParams()
  const taskId = params.taskId as string
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<any>(null)

  useEffect(() => {
    // Simulate loading for a more realistic experience
    const timer = setTimeout(() => {
      // Use the specific mock task for task-1, or generate a mock for other IDs
      if (taskId === "task-1") {
        setTask(MOCK_TASK)
      } else {
        // Create a generic mock task for any other task ID
        setTask({
          ...MOCK_TASK,
          id: taskId,
          title: `Task ${taskId}`,
          description: `This is a mock task for ${taskId} created for UI/UX development.`,
        })
      }
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [taskId])

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <RoleSelector />
      <DeveloperTaskSpace task={task} userId="developer-1" />
    </div>
  )
}
