"use client"

import { useState, useEffect } from "react"
import { TaskCard } from "./task-card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname } from "next/navigation"

interface TaskListProps {
  projectId?: string
  limit?: number
  showApplyButton?: boolean
  showCollaborateButton?: boolean
}

export function TaskList({ projectId, limit, showApplyButton = false, showCollaborateButton = true }: TaskListProps) {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  // Determine if this is being viewed in the vibe-coder dashboard
  const isVibeCoderView =
    pathname.includes("/dashboard/vibe-coder") ||
    pathname.includes("/vibe-coder-dashboard") ||
    pathname.includes("/dashboard/tasks")

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        // In a real app, this would call an API to get tasks
        // For now, we'll use mock data
        const mockTasks = [
          {
            id: "task1",
            title: "Implement User Authentication",
            description: "Create a secure authentication system with email verification and social login options.",
            status: "Open",
            priority: "High",
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            estimated_time_hours: 8,
            estimated_cost_usd: 400,
            stack: ["React", "NextAuth", "Supabase"],
            applicants: [
              {
                id: "dev1",
                name: "Alex Johnson",
                avatar: "/abstract-aj.png",
                rating: 4.8,
                skills: ["React", "TypeScript", "Node.js"],
                hourlyRate: 45,
              },
            ],
          },
          {
            id: "task2",
            title: "Design Dashboard UI",
            description: "Create a modern, responsive dashboard interface with data visualization components.",
            status: "Open",
            priority: "Medium",
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            estimated_time_hours: 12,
            estimated_cost_usd: 600,
            stack: ["Figma", "Tailwind CSS", "React"],
            applicants: [
              {
                id: "dev1",
                name: "Alex Johnson",
                avatar: "/abstract-aj.png",
                rating: 4.8,
                skills: ["React", "TypeScript", "Node.js"],
                hourlyRate: 45,
              },
              {
                id: "dev2",
                name: "Sarah Rodriguez",
                avatar: "/abstract-geometric-sr.png",
                rating: 4.9,
                skills: ["React", "Next.js", "UI/UX"],
                hourlyRate: 50,
              },
            ],
          },
          {
            id: "task3",
            title: "API Integration",
            description: "Integrate third-party payment processing API with error handling and webhooks.",
            status: "In Progress",
            priority: "Urgent",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            estimated_time_hours: 6,
            estimated_cost_usd: 300,
            stack: ["Node.js", "Express", "Stripe API"],
            developer_id: "dev123",
          },
        ]

        // If we have a real API call, we would use it here
        // const result = await getTasks(projectId)
        // if (result.success) {
        //   setTasks(limit ? result.data.slice(0, limit) : result.data)
        // }

        // For now, use mock data
        setTasks(limit ? mockTasks.slice(0, limit) : mockTasks)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [projectId, limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(limit || 3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No tasks found.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          showApplyButton={showApplyButton}
          showCollaborateButton={showCollaborateButton}
          isVibeCoderView={isVibeCoderView}
        />
      ))}
    </div>
  )
}
