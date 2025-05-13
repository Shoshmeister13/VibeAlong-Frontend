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
  MessageSquare,
  DollarSign,
  User,
  MoreVertical,
  AlertCircle,
  FileText,
  Code,
  Sparkles,
} from "lucide-react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

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
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  {/* Header with title and badges */}
                  <div className="flex flex-wrap items-center mb-4 justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      <Badge
                        className={`${
                          task.status === "Completed" || task.status === "completed"
                            ? "bg-green-500"
                            : task.status === "In Progress" || task.status === "in_progress"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        } flex items-center gap-1`}
                      >
                        {task.status === "Completed" || task.status === "completed" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : task.status === "In Progress" || task.status === "in_progress" ? (
                          <Clock4 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {task.status}
                      </Badge>
                      <Badge
                        className={`${
                          task.priority === "High"
                            ? "bg-red-500"
                            : task.priority === "Medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleViewTask(task)}
                          >
                            <FileText className="h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => router.push(`/task/${task.id}/collaborate`)}
                          >
                            <MessageSquare className="h-4 w-4" /> Task Space
                          </DropdownMenuItem>
                          {!task.assigned_developer && (
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => router.push(`/dashboard/tasks/${task.id}/assign`)}
                            >
                              <User className="h-4 w-4" /> Assign Developer
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Task metadata */}
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Created: {new Date(task.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Developer Assignment */}
                    <div className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-1" />
                      {task.assigned_developer ? (
                        <div className="flex items-center">
                          <span className="mr-1">Assigned to:</span>
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarImage
                              src={task.assigned_developer?.avatar_url || "/placeholder.svg"}
                              alt={task.assigned_developer?.name}
                            />
                            <AvatarFallback>{task.assigned_developer?.name?.charAt(0) || "D"}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{task.assigned_developer?.name || "Unknown"}</span>
                        </div>
                      ) : (
                        <span className="text-yellow-600">Unassigned</span>
                      )}
                    </div>
                  </div>

                  {/* Task Description and AI Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-secondary/20 border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Description</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.description}</p>

                      {/* Tech Stack */}
                      {task.stack && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4" />
                            <span className="font-medium">Tech Stack</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {task.stack.map((tech: string) => (
                              <Badge key={tech} variant="secondary" className="bg-secondary/50">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-primary/5 border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-medium">AI Summary</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{task.ai_summary || "No AI summary available."}</p>

                      {/* Time and Budget Estimates */}
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="text-sm">
                          <span className="font-medium">Est. Time:</span>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {task.estimated_time_hours || "N/A"} hours
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Est. Budget:</span>
                          <div className="flex items-center text-muted-foreground">
                            <DollarSign className="h-4 w-4 mr-1" />${task.estimated_cost_usd || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar for in-progress tasks */}
                  {(task.status === "In Progress" || task.status === "in_progress") && task.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Last update: {task.last_update ? new Date(task.last_update).toLocaleString() : "N/A"}
                        </div>
                        {task.messages > 0 && (
                          <div className="flex items-center text-blue-600">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {task.messages} new message{task.messages > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
}
