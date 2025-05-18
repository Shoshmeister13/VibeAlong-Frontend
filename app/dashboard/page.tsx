"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  LayoutDashboard,
  BarChart3,
  Zap,
  ListTodo,
  MessageSquare,
  Lightbulb,
  Bot,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskCreationModal } from "@/components/tasks/task-creation-modal"

export default function VibeDashboard() {
  const [userLoading, setUserLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [coder, setCoder] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [suggestedTasks, setSuggestedTasks] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClientComponentClient()

  // First, fetch the authenticated user
  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) {
          console.error("Auth error:", error)
          router.push("/auth/login")
          return
        }

        if (!user) {
          console.log("No user found, redirecting to login")
          router.push("/auth/login")
          return
        }

        console.log("User authenticated:", user.email)
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/auth/login")
      } finally {
        setUserLoading(false)
      }
    }

    fetchUser()
  }, [supabase, router])

  // Then, fetch the vibe_coder, project, and tasks data
  useEffect(() => {
    if (!user) return

    async function loadData() {
      try {
        // Step 1: Get the vibe_coder record
        const { data: coderData, error: coderError } = await supabase
          .from("vibe_coders")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (coderError) {
          console.log("No vibe_coder found or error:", coderError)
          // If no vibe_coder record, we'll just use the user ID directly
          setCoder({ id: user.id })
        } else {
          console.log("Vibe coder found:", coderData)
          setCoder(coderData)
        }

        // Step 2: Get the project using either coder.id or user.id
        const coderId = coderData?.id || user.id
        const { data: projectData, error: projectError } = await supabase
          .from("vibe_projects")
          .select("*")
          .eq("vibe_coder_id", coderId)
          .order("created_at", { ascending: false })
          .limit(1)

        if (projectError) {
          console.log("No project found or error:", projectError)
          setProject(null)
        } else if (projectData && projectData.length > 0) {
          console.log("Project found:", projectData[0])
          setProject(projectData[0])

          // Step 3: If project exists, get the tasks
          const { data: taskData, error: taskError } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", projectData[0].id)
            .order("created_at", { ascending: false })

          if (taskError) {
            console.log("Error fetching tasks:", taskError)
            setTasks([])
          } else {
            console.log("Tasks found:", taskData?.length || 0)
            setTasks(taskData || [])
          }

          // Generate some placeholder suggested tasks based on the project
          const placeholderSuggestions = [
            {
              id: "suggestion-1",
              title: `Add user authentication to ${projectData[0].project_name}`,
              description: "Implement secure login and registration functionality using Supabase Auth",
              priority: "high",
              estimated_hours: 4,
            },
            {
              id: "suggestion-2",
              title: "Create responsive dashboard layout",
              description: "Design and implement a mobile-friendly dashboard with key metrics and navigation",
              priority: "medium",
              estimated_hours: 6,
            },
            {
              id: "suggestion-3",
              title: "Set up automated testing",
              description: "Configure Jest and React Testing Library for component and integration tests",
              priority: "low",
              estimated_hours: 3,
            },
          ]
          setSuggestedTasks(placeholderSuggestions)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [user, supabase])

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "in_progress":
      case "in progress":
        return <Loader2 className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  // Helper function to get priority badge
  const getPriorityBadge = (priority: string) => {
    if (!priority) return null

    switch (priority.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge variant="default">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  // Show loading state while fetching data
  if (userLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-medium">Loading your dashboard...</h3>
        <p className="text-muted-foreground">Please wait while we fetch your data</p>
      </div>
    )
  }

  // If no project exists, show the empty state with CTA
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Welcome to VibeAlong! 👋</h2>
          <p className="text-lg mb-6">Let's get started by creating your first project</p>
          <div className="bg-muted p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-2">No project yet 🚧</h3>
            <p className="mb-6 text-muted-foreground">
              Create a project to start collaborating with developers and bring your ideas to life.
            </p>

            <Link href="/create-project">
              <Button size="lg" className="w-full sm:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Launch My Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Main dashboard with project and tasks
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          Welcome back, {user?.user_metadata?.full_name || user?.user_metadata?.name || "Vibe-Coder"} 👋
        </h1>
      </div>

      <div className="grid gap-6">
        {/* Projects Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <CardTitle>Current Project</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-br from-background to-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">{project.project_name}</CardTitle>
                  </div>
                  <CardDescription>Platform: {project.platform}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{project.description}</p>
                </CardContent>
                <CardFooter>
                  <Badge variant="outline">{project.stage || "Planning"}</Badge>
                </CardFooter>
              </Card>

              <Card className="bg-gradient-to-br from-background to-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">Project Stats</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Tasks:</span>
                      <span className="font-medium">{tasks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Open Tasks:</span>
                      <span className="font-medium">
                        {tasks.filter((t) => t.status?.toLowerCase() === "open").length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Completed:</span>
                      <span className="font-medium">
                        {tasks.filter((t) => t.status?.toLowerCase() === "completed").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-background to-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-1">
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => router.push("/submit-tasks")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Task
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() => router.push("/dashboard/messages")}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message Developers
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-start"
                      onClick={() =>
                        router.push(
                          `/consultation?projectId=${project.id}&projectName=${encodeURIComponent(project.project_name)}&platform=${encodeURIComponent(project.platform || "")}`,
                        )
                      }
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Get Free AI Expert Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-primary" />
                <CardTitle>Project Tasks</CardTitle>
              </div>
              <TaskCreationModal
                projectId={project?.id || "default-project"}
                projectName={project?.project_name}
                buttonVariant="outline"
                buttonSize="sm"
                buttonText="Add Task"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current">
              <TabsList className="mb-4 w-full overflow-x-auto">
                <TabsTrigger value="current" className="flex items-center gap-1">
                  <ListTodo className="h-4 w-4" />
                  Current Tasks
                </TabsTrigger>
                <TabsTrigger value="suggested" className="flex items-center gap-1">
                  <Lightbulb className="h-4 w-4" />
                  AI Suggested Tasks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="current">
                {tasks.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.slice(0, 6).map((task) => (
                      <Card key={task.id} className="overflow-hidden border-l-4 border-l-primary">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(task.status)}
                              <CardTitle className="text-base">{task.title}</CardTitle>
                            </div>
                            {getPriorityBadge(task.priority)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm line-clamp-2">{task.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
                          <div>Est: {task.estimated_hours || task.estimated_time_hours || "N/A"} hours</div>
                          <Link href={`/dashboard/tasks/${task.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <h3 className="text-lg font-medium mb-2">No tasks added yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Break down your project into tasks to start collaborating with developers.
                    </p>
                    <Button onClick={() => router.push("/submit-tasks")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Task
                    </Button>
                  </div>
                )}

                {tasks.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={() => router.push("/dashboard/tasks")}>
                      View All Tasks
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="suggested">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {suggestedTasks.map((task) => (
                    <Card key={task.id} className="overflow-hidden border-dashed border-l-4 border-l-purple-500">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            <CardTitle className="text-base">{task.title}</CardTitle>
                          </div>
                          {getPriorityBadge(task.priority)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2">{task.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
                        <div>Est: {task.estimated_hours} hours</div>
                        <Button variant="ghost" size="sm">
                          Add Task
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
