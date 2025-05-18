"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  Clock4,
  AlertCircle,
  Code,
  Tag,
  ArrowRight,
  Users2,
} from "lucide-react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

type TaskStatus = "pending" | "in_progress" | "completed" | "all"

export default function TasksPage() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const { user } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TaskStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // First, get the selected project
  useEffect(() => {
    if (!user) return

    async function getSelectedProject() {
      try {
        // Get the vibe_coder ID
        const { data: vibeCoder, error: vibeCoderError } = await supabase
          .from("vibe_coders")
          .select("id")
          .eq("user_id", user.id)
          .single()

        if (vibeCoderError || !vibeCoder) {
          console.error("Error fetching vibe_coder:", vibeCoderError)
          return null
        }

        // Get the most recent project
        const { data: projects, error: projectsError } = await supabase
          .from("vibe_projects")
          .select("*")
          .eq("vibe_coder_id", vibeCoder.id)
          .order("created_at", { ascending: false })
          .limit(1)

        if (projectsError) {
          console.error("Error fetching projects:", projectsError)
          return null
        }

        if (projects && projects.length > 0) {
          setSelectedProject(projects[0])
          return projects[0]
        }

        return null
      } catch (err) {
        console.error("Error getting selected project:", err)
        return null
      }
    }

    getSelectedProject()
  }, [user, supabase])

  // Then, fetch tasks for the selected project
  useEffect(() => {
    if (!user || !selectedProject) return

    async function fetchTasks() {
      setLoading(true)
      setError(null)

      try {
        // Fetch tasks from Supabase for the selected project
        const { data, error } = await supabase
          .from("tasks")
          .select("*, assigned_developer:vibe_coders(name, avatar_url)")
          .eq("project_id", selectedProject.id)
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }

        if (data && data.length > 0) {
          setTasks(data)
        } else {
          // If no tasks found, create mock tasks for demonstration
          const mockTasks = generateMockTasks(selectedProject.id)
          setTasks(mockTasks)
          // Save to localStorage for persistence
          localStorage.setItem("mockTasks", JSON.stringify(mockTasks))
        }
      } catch (err: any) {
        console.error("Error fetching tasks:", err)
        setError(err.message)

        // If the error is about missing tables, try to set up the database
        if (err.message.includes("does not exist")) {
          try {
            await setupDatabase()
            // Try fetching again after setup
            const { data } = await supabase
              .from("tasks")
              .select("*, assigned_developer:vibe_coders(name, avatar_url)")
              .eq("project_id", selectedProject.id)
              .order("created_at", { ascending: false })

            if (data && data.length > 0) {
              setTasks(data)
            } else {
              const mockTasks = generateMockTasks(selectedProject.id)
              setTasks(mockTasks)
              localStorage.setItem("mockTasks", JSON.stringify(mockTasks))
            }
            setError(null)
          } catch (setupErr: any) {
            console.error("Error setting up database:", setupErr)
            setError(`Failed to set up database: ${setupErr.message}`)

            // Fall back to mock tasks
            const mockTasks = generateMockTasks(selectedProject.id)
            setTasks(mockTasks)
            localStorage.setItem("mockTasks", JSON.stringify(mockTasks))
          }
        } else {
          // For any other error, use mock tasks
          const mockTasks = generateMockTasks(selectedProject.id)
          setTasks(mockTasks)
          localStorage.setItem("mockTasks", JSON.stringify(mockTasks))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user, supabase, selectedProject])

  // Check for mock tasks in localStorage
  useEffect(() => {
    const mockTasksJson = localStorage.getItem("mockTasks")
    if (mockTasksJson && (!tasks || tasks.length === 0) && !loading) {
      try {
        const mockTasks = JSON.parse(mockTasksJson)
        setTasks(mockTasks)
        setLoading(false)
        setError(null)
      } catch (err) {
        console.error("Error parsing mock tasks:", err)
      }
    }
  }, [tasks, loading])

  async function setupDatabase() {
    // Call the API route to set up the database tables
    const response = await fetch("/api/setup-database", {
      method: "POST",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to set up database")
    }

    return await response.json()
  }

  function generateMockTasks(projectId: string) {
    const statuses = ["Open", "In Progress", "Completed"]
    const priorities = ["High", "Medium", "Low"]
    const developers = [
      { id: "dev1", name: "Alex Johnson", avatar_url: "/placeholder.svg?height=40&width=40" },
      { id: "dev2", name: "Sam Chen", avatar_url: "/placeholder.svg?height=40&width=40" },
      { id: "dev3", name: "Taylor Kim", avatar_url: "/placeholder.svg?height=40&width=40" },
    ]

    const mockTasks = [
      {
        id: "task1",
        title: "Implement User Authentication",
        description: "Create a secure authentication system with email verification and password reset functionality.",
        status: "Open",
        priority: "High",
        project_id: projectId,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_time_hours: 12,
        estimated_cost_usd: 600,
        assigned_developer: null,
        requirements: "- OAuth integration\n- Email verification\n- Password reset flow\n- Rate limiting",
        ai_summary:
          "This task involves creating a secure authentication system with multiple verification methods and security features to protect user accounts.",
        stack: ["React", "NextAuth", "Supabase"],
      },
      {
        id: "task2",
        title: "Build Dashboard UI Components",
        description: "Create reusable dashboard components including charts, data tables, and filter controls.",
        status: "In Progress",
        priority: "Medium",
        project_id: projectId,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_time_hours: 8,
        estimated_cost_usd: 400,
        assigned_developer: developers[0],
        progress: 45,
        last_update: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        messages: 3,
        requirements:
          "- Responsive design\n- Dark/light mode support\n- Accessibility compliance\n- Performance optimization",
        ai_summary:
          "This task focuses on building a comprehensive set of UI components for the dashboard with emphasis on responsiveness, accessibility and theme support.",
        stack: ["React", "Tailwind CSS", "shadcn/ui"],
      },
      {
        id: "task3",
        title: "Implement Payment Processing",
        description:
          "Integrate Stripe payment gateway for subscription and one-time payments with proper error handling.",
        status: "Completed",
        priority: "High",
        project_id: projectId,
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_time_hours: 10,
        estimated_cost_usd: 500,
        assigned_developer: developers[1],
        progress: 100,
        last_update: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        requirements: "- Stripe integration\n- Subscription management\n- Payment webhooks\n- Invoice generation",
        ai_summary:
          "This task involved implementing a complete payment processing system using Stripe, including subscription management and webhook handling for payment events.",
        stack: ["Next.js", "Stripe API", "Webhooks"],
      },
      {
        id: "task4",
        title: "Optimize Database Queries",
        description: "Improve performance of slow database queries and implement proper indexing.",
        status: "Open",
        priority: "Medium",
        project_id: projectId,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_time_hours: 6,
        estimated_cost_usd: 300,
        assigned_developer: null,
        requirements: "- Query optimization\n- Index creation\n- Performance testing\n- Documentation",
        ai_summary:
          "This task focuses on improving database performance by optimizing slow queries and implementing proper indexing strategies.",
        stack: ["PostgreSQL", "Supabase", "SQL"],
      },
      {
        id: "task5",
        title: "Implement Real-time Notifications",
        description: "Create a notification system that delivers real-time updates to users via websockets.",
        status: "In Progress",
        priority: "Low",
        project_id: projectId,
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        estimated_time_hours: 8,
        estimated_cost_usd: 400,
        assigned_developer: developers[2],
        progress: 25,
        last_update: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        messages: 1,
        requirements:
          "- WebSocket integration\n- Notification preferences\n- Read/unread status\n- Notification history",
        ai_summary:
          "This task involves building a real-time notification system using WebSockets to deliver instant updates to users with support for preferences and history.",
        stack: ["WebSockets", "Supabase Realtime", "React"],
      },
    ]

    return mockTasks
  }

  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    if (activeTab === "pending") return task.status === "Open" || task.status === "open"
    if (activeTab === "in_progress") return task.status === "In Progress" || task.status === "in_progress"
    if (activeTab === "completed") return task.status === "Completed" || task.status === "completed"

    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        (task.assigned_developer?.name && task.assigned_developer.name.toLowerCase().includes(query))
      )
    }

    return true
  })

  if (loading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {selectedProject ? `Tasks for ${selectedProject.project_name}` : "Project Tasks"}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Skeleton className="h-10 w-full md:w-80" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  const handleViewTask = (task: any) => {
    setSelectedTask(task)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {selectedProject ? `Tasks for ${selectedProject.project_name}` : "Project Tasks"}
        </h1>
        <Button onClick={() => router.push("/submit-tasks")}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      {!selectedProject && !loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">You need to create a project first.</p>
              <Button onClick={() => router.push("/create-project")}>Create Project</Button>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={setupDatabase}>Try to fix</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as TaskStatus)}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <TabsList className="mb-2 sm:mb-0">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <span>📋 All Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <span>📝 Pending</span>
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="flex items-center gap-1">
                <span>⏳ In Progress</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-1">
                <span>✅ Completed</span>
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            {renderTaskList()}
          </TabsContent>
          <TabsTrigger value="pending" className="mt-0">
            {renderTaskList()}
          </TabsTrigger>
          <TabsContent value="in_progress" className="mt-0">
            {renderTaskList()}
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            {renderTaskList()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )

  function renderTaskList() {
    return filteredTasks.length > 0 ? (
      <div className="space-y-6">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center mb-3">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                    {getComplexityBadge(task.complexity)}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <span>
                      Created by <span className="font-medium text-foreground">{task.created_by || "Unknown"}</span>
                    </span>
                  </div>

                  {/* Project info badges */}
                  <div className="flex flex-wrap gap-2 text-sm mb-4">
                    <Badge variant="outline" className="flex items-center gap-1 bg-slate-50">
                      <Tag className="h-3.5 w-3.5" />
                      {task.project.name}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 bg-slate-50">
                      <Calendar className="h-3.5 w-3.5" />
                      Due: {formatDate(task.due_date)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 bg-slate-50">
                      <Code className="h-3.5 w-3.5" />
                      {task.framework}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{task.description}</p>

                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-xs text-muted-foreground">
                        Last updated: {formatLastUpdated(task.last_updated)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(task)}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/task/${task.id}/collaborate`}>
                        <Users2 className="mr-2 h-4 w-4" />
                        Task Space
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center gap-2 min-w-[140px] mt-4 md:mt-0">
                  <div className="text-right flex items-center gap-2">
                    <div className="relative group">
                      <div className="text-sm font-medium flex items-center">
                        Task Estimation
                        <span className="ml-1 cursor-help">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-muted-foreground"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 16v-4"></path>
                            <path d="M12 8h.01"></path>
                          </svg>
                        </span>
                      </div>
                      <div className="text-xl font-bold mt-1">${formatNumberWithCommas(task.ai_estimated_price)}</div>

                      {/* Fixed tooltip that stays visible when hovered */}
                      <div
                        className="fixed opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                            p-3 bg-black text-white text-xs rounded-md shadow-lg z-[9999]"
                        style={{
                          bottom: "calc(100% + 10px)",
                          right: "0",
                          width: "240px",
                          pointerEvents: "none",
                          transform: "translateY(0)",
                        }}
                      >
                        Estimated by VibeAlong AI. Actual work may be up to 10% more than the estimate.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{task.ai_estimated_hours} hours</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 px-6 py-4">
              <div className="flex flex-wrap gap-3 w-full">
                <Button variant="outline" onClick={() => handleViewTask(task)} className="flex-1 sm:flex-none">
                  🔍 View Details
                </Button>
                {!task.assigned_developer && (
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/tasks/${task.id}/assign`)}
                    className="flex-1 sm:flex-none"
                  >
                    👤 Assign Developer
                  </Button>
                )}
                <Button onClick={() => router.push(`/task/${task.id}/collaborate`)} className="flex-1 sm:flex-none">
                  🤝 Task Space
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    ) : (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-2">No tasks found</p>
        <p className="text-sm text-muted-foreground">
          {activeTab !== "all"
            ? `No ${activeTab.replace("_", " ")} tasks match your search criteria.`
            : "Create a new task to get started"}
        </p>
        <Button className="mt-4" onClick={() => router.push("/submit-tasks")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Task
        </Button>
      </div>
    )
  }

  function getPriorityBadge(priority: string) {
    let badgeColor = "bg-green-500" // Default to low priority
    if (priority === "High") {
      badgeColor = "bg-red-500"
    } else if (priority === "Medium") {
      badgeColor = "bg-yellow-500"
    }

    return <Badge className={`${badgeColor}`}>{priority}</Badge>
  }

  function getStatusBadge(status: string) {
    let badgeColor = "bg-yellow-500" // Default to pending
    let icon = <AlertCircle className="h-3 w-3" />

    if (status === "Completed" || status === "completed") {
      badgeColor = "bg-green-500"
      icon = <CheckCircle2 className="h-3 w-3" />
    } else if (status === "In Progress" || status === "in_progress") {
      badgeColor = "bg-blue-500"
      icon = <Clock4 className="h-3 w-3" />
    }

    return (
      <Badge className={`${badgeColor} flex items-center gap-1`}>
        {icon}
        {status}
      </Badge>
    )
  }

  function getComplexityBadge(complexity: string) {
    if (!complexity) return null

    const badgeColor = "bg-blue-500" // Default color
    return <Badge className={`${badgeColor}`}>{complexity}</Badge>
  }

  function formatDate(dateStr: string) {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString()
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  function formatLastUpdated(dateStr: string) {
    try {
      const date = new Date(dateStr)
      return date.toLocaleString()
    } catch (error) {
      console.error("Error formatting last updated date:", error)
      return "N/A"
    }
  }

  function formatNumberWithCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleViewDetails = (task: any) => {
    setSelectedTask(task)
    setIsDetailDialogOpen(true)
  }
}
