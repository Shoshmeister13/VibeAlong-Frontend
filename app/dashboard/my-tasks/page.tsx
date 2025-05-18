"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Calendar,
  Briefcase,
  Code,
  ArrowUpRight,
  MoreHorizontal,
  AlertCircle,
  Loader2,
  MessageSquare,
  User,
  UserPlus,
  Info,
  Clock,
  DollarSign,
  Calculator,
  Sparkles,
  Star,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { assignDeveloperToTask } from "@/lib/task-helpers"
import { TaskEstimationDisplay } from "@/components/tasks/task-estimation-display"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { TaskCreationModal } from "@/components/tasks/task-creation-modal"

export default function MyTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [filteredTasks, setFilteredTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [selectedTaskForDialog, setSelectedTaskForDialog] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // Add state for the developer profile dialog
  const [selectedDeveloper, setSelectedDeveloper] = useState<any>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false)
  const [developerToHire, setDeveloperToHire] = useState<any>(null)

  const [isSuggestedOpen, setIsSuggestedOpen] = useState(false)

  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)

  // Fetch user session and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Try to get user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error fetching session:", sessionError)
          setError("Failed to authenticate user")
          return
        }

        if (sessionData?.session?.user) {
          setUser(sessionData.session.user)
        }

        // Try to get tasks from localStorage first (for demo purposes)
        const storedTasks = localStorage.getItem("mockTasks")
        if (storedTasks) {
          try {
            const parsedTasks = JSON.parse(storedTasks)
            setTasks(parsedTasks)
            setFilteredTasks(parsedTasks)
            setIsLoading(false)
            return
          } catch (parseError) {
            console.error("Error parsing stored tasks:", parseError)
            // Continue to fetch from API if parsing fails
          }
        }

        // If no stored tasks or parsing failed, generate mock data
        const mockTasks = generateMockTasks()
        setTasks(mockTasks)
        setFilteredTasks(mockTasks)

        // Store for future use
        localStorage.setItem("mockTasks", JSON.stringify(mockTasks))
      } catch (err) {
        console.error("Error in data fetching:", err)
        setError("An unexpected error occurred")

        // Fallback to mock data
        const mockTasks = generateMockTasks()
        setTasks(mockTasks)
        setFilteredTasks(mockTasks)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Filter tasks based on active tab and search query
  useEffect(() => {
    if (tasks.length === 0) return

    let filtered = [...tasks]

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter((task) => {
        if (activeTab === "open") return task.status === "Open"
        if (activeTab === "in-progress") return task.status === "In Progress"
        if (activeTab === "completed") return task.status === "Completed"
        return true
      })
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.assigned_developer?.name?.toLowerCase().includes(query),
      )
    }

    setFilteredTasks(filtered)
  }, [activeTab, searchQuery, tasks])

  // Generate mock tasks for demo purposes
  const generateMockTasks = () => {
    return [
      {
        id: "task-1",
        title: "Design User Dashboard",
        description: "Create wireframes and high-fidelity designs for the main user dashboard",
        status: "Open",
        priority: "High",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_developer: { name: "Alex Johnson" },
        budget: 500,
        estimated_hours: 20,
        progress: 0,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        project: { name: "User Portal" },
        framework: "React",
        complexity: "Moderate",
        platform: "V0",
        taskType: "UI/UX Design",
      },
      {
        id: "task-2",
        title: "Implement Authentication Flow",
        description: "Set up user authentication with email verification and social login options",
        status: "In Progress",
        priority: "High",
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_developer: {
          name: "Maria Garcia",
          avatar: "/abstract-geometric-sr.png",
          rating: 4.9,
          hourlyRate: 50,
          skills: ["React", "Next.js", "UI/UX"],
          availability: "Away",
          completedTasks: 47,
          bio: "UI/UX specialist with strong frontend development skills. I create beautiful and functional user interfaces.",
        },
        budget: 800,
        estimated_hours: 30,
        progress: 65,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        project: { name: "Authentication Service" },
        framework: "Next.js",
        complexity: "Complex",
        platform: "Lovable",
        taskType: "Feature Development",
      },
      {
        id: "task-3",
        title: "API Integration for Products",
        description: "Connect to the product database API and implement data fetching",
        status: "In Progress",
        priority: "Medium",
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_developer: { name: "David Kim" },
        budget: 600,
        estimated_hours: 25,
        progress: 40,
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        project: { name: "Product Catalog" },
        framework: "Express",
        complexity: "Moderate",
        platform: "Replit",
        taskType: "Server-side Logic",
      },
      {
        id: "task-4",
        title: "Mobile Responsive Layout",
        description: "Ensure all pages work correctly on mobile devices",
        status: "Open",
        priority: "Medium",
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_developer: null,
        budget: 400,
        estimated_hours: 15,
        progress: 0,
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        project: { name: "Frontend Redesign" },
        framework: "React",
        complexity: "Simple",
        platform: "V0",
        taskType: "Bug Fixes",
      },
      {
        id: "task-5",
        title: "Payment Gateway Integration",
        description: "Implement Stripe payment processing for checkout flow",
        status: "Completed",
        priority: "High",
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        assigned_developer: { name: "Sarah Wilson" },
        budget: 1000,
        estimated_hours: 40,
        progress: 100,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        project: { name: "E-commerce Platform" },
        framework: "Next.js",
        complexity: "Complex",
        platform: "Other",
        taskType: "QA Automation",
      },
    ]
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date"
    }
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "In Progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600"
      case "Medium":
        return "text-amber-600"
      case "Low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  // Navigate to task detail page
  const handleViewTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTaskForDialog(task)
      setIsDetailDialogOpen(true)
    } else {
      router.push(`/dashboard/tasks/${taskId}`)
    }
  }

  // Navigate to task collaboration space
  const handleOpenTaskSpace = (taskId: string) => {
    router.push(`/task/${taskId}/collaborate`)
  }

  // Add the handleViewProfile function
  const handleViewProfile = (developer: any) => {
    setSelectedDeveloper(developer)
    setIsProfileDialogOpen(true)
  }

  // Handle opening the hiring confirmation modal
  const handleOpenHiringModal = (developer: any, task: any) => {
    setDeveloperToHire(developer)
    setSelectedTaskForDialog(task)
    setIsHiringModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-medium">Loading tasks...</h3>
        <p className="text-muted-foreground mt-2">Please wait while we fetch your tasks</p>
      </div>
    )
  }

  if (error && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-medium">Error loading tasks</h3>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button onClick={() => router.refresh()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track all tasks across your projects</p>
        </div>
        <TaskCreationModal
          projectId={tasks[0]?.project?.id || "default-project"}
          projectName={tasks[0]?.project?.name}
          buttonText="Create New Task"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 overflow-x-auto">
            <TabsTrigger value="all">📋 All Tasks</TabsTrigger>
            <TabsTrigger value="open">📝 Open</TabsTrigger>
            <TabsTrigger value="in-progress">⏳ In Progress</TabsTrigger>
            <TabsTrigger value="completed">✅ Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks by title or description..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-medium">No tasks found</h3>
            <p className="text-muted-foreground max-w-md">
              {searchQuery
                ? "No tasks match your search criteria. Try adjusting your filters or search query."
                : activeTab !== "all"
                  ? `You don't have any ${activeTab.replace("-", " ")} tasks at the moment.`
                  : "You don't have any tasks yet. Create a new task to get started."}
            </p>
            <TaskCreationModal projectId="default-project" buttonText="Create Your First Task" className="mt-2" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    <Badge
                      variant="outline"
                      className={`bg-${task.complexity === "Complex" ? "purple" : task.complexity === "Moderate" ? "blue" : "green"}-100 text-${task.complexity === "Complex" ? "purple" : task.complexity === "Moderate" ? "blue" : "green"}-800 hover:bg-${task.complexity === "Complex" ? "purple" : task.complexity === "Moderate" ? "blue" : "green"}-200`}
                    >
                      {task.complexity || "Basic"}
                    </Badge>
                    {task.platform && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {task.platform}
                      </Badge>
                    )}
                    {task.taskType && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200"
                      >
                        {task.taskType === "Bug Fixes" && <AlertCircle className="h-3.5 w-3.5" />}
                        {task.taskType === "Feature Development" && <Code className="h-3.5 w-3.5" />}
                        {task.taskType === "QA Automation" && <Calculator className="h-3.5 w-3.5" />}
                        {task.taskType === "Server-side Logic" && <Briefcase className="h-3.5 w-3.5" />}
                        {task.taskType === "UI/UX Design" && <User className="h-3.5 w-3.5" />}
                        {task.taskType}
                      </Badge>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewTask(task.id)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenTaskSpace(task.id)}>Open Task Space</DropdownMenuItem>
                      <DropdownMenuItem>Edit Task</DropdownMenuItem>
                      {task.status !== "Completed" && <DropdownMenuItem>Mark as Completed</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pb-3 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left column - Task info */}
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <h3
                        className="text-xl font-semibold cursor-pointer hover:text-primary"
                        onClick={() => handleViewTask(task.id)}
                      >
                        {task.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2">{task.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{task.project?.name || "General Task"}</span>
                      </div>

                      {task.framework && (
                        <div className="flex items-center gap-1.5">
                          <Code className="h-4 w-4 text-muted-foreground" />
                          <span>{task.framework}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Created: {new Date(task.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Developer info */}
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {task.assigned_developer ? (
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">Assigned to:</span>
                          <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden mr-1">
                              <img
                                src={task.assigned_developer?.avatar || `/abstract-aj.png`}
                                alt={task.assigned_developer.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="font-medium text-sm">{task.assigned_developer.name}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  </div>

                  {/* Right column - Task metrics */}
                  <div className="space-y-3 bg-slate-50 p-3 rounded-md">
                    <div>
                      <TaskEstimationDisplay
                        price={task.budget}
                        hours={task.estimated_hours}
                        size="sm"
                        position="above-date"
                        className="ml-0 w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Due date:</span>
                      <Badge variant="outline" className="flex items-center gap-1 bg-slate-100">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(task.due_date)}</span>
                      </Badge>
                    </div>

                    {task.status === "In Progress" && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-medium">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Developers section for Open tasks */}
                {task.status === "Open" && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium">Developers for this Task</h4>
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        View All
                      </Button>
                    </div>

                    {/* Applied Developers - Compact version */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                      <h5 className="text-xs font-medium text-blue-700 mb-2">👋 Applied Developers (2)</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {/* Developer 1 */}
                        <div className="bg-slate-50 p-3 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                  <img
                                    src="/abstract-aj.png"
                                    alt="Alex Johnson"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Alex Johnson</p>
                                <div className="flex items-center">
                                  <span className="text-yellow-500 text-xs mr-1">★</span>
                                  <span className="text-xs">4.8</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() =>
                                handleOpenHiringModal(
                                  {
                                    name: "Alex Johnson",
                                    avatar: "/abstract-aj.png",
                                    rating: 4.8,
                                    hourlyRate: 45,
                                  },
                                  task,
                                )
                              }
                            >
                              <UserPlus className="h-3 w-3 mr-1" /> Hire
                            </Button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs flex-1"
                              onClick={() =>
                                handleViewProfile({
                                  name: "Alex Johnson",
                                  avatar: "/abstract-aj.png",
                                  rating: 4.8,
                                  hourlyRate: 45,
                                  skills: ["React", "TypeScript", "Node.js"],
                                  availability: "Available now",
                                  completedTasks: 32,
                                  bio: "Full-stack developer with 5 years of experience specializing in React and Node.js applications.",
                                })
                              }
                            >
                              <User className="h-3 w-3 mr-1" /> View Profile
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                              <MessageSquare className="h-3 w-3 mr-1" /> Send Message
                            </Button>
                          </div>
                        </div>

                        {/* Developer 2 */}
                        <div className="bg-slate-50 p-3 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                  <img
                                    src="/abstract-geometric-sr.png"
                                    alt="Sarah Rodriguez"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-gray-300 border-2 border-white"></div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Sarah Rodriguez</p>
                                <div className="flex items-center">
                                  <span className="text-yellow-500 text-xs mr-1">★</span>
                                  <span className="text-xs">4.9</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() =>
                                handleOpenHiringModal(
                                  {
                                    name: "Sarah Rodriguez",
                                    avatar: "/abstract-geometric-sr.png",
                                    rating: 4.9,
                                    hourlyRate: 50,
                                  },
                                  task,
                                )
                              }
                            >
                              <UserPlus className="h-3 w-3 mr-1" /> Hire
                            </Button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs flex-1"
                              onClick={() =>
                                handleViewProfile({
                                  name: "Sarah Rodriguez",
                                  avatar: "/abstract-geometric-sr.png",
                                  rating: 4.9,
                                  hourlyRate: 50,
                                  skills: ["React", "Next.js", "UI/UX"],
                                  availability: "Away",
                                  completedTasks: 47,
                                  bio: "UI/UX specialist with strong frontend development skills. I create beautiful and functional user interfaces.",
                                })
                              }
                            >
                              <User className="h-3 w-3 mr-1" /> View Profile
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs flex-1">
                              <MessageSquare className="h-3 w-3 mr-1" /> Send Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Suggested Developers - Collapsible Section (Simplified) */}
                    <Collapsible
                      open={isSuggestedOpen}
                      onOpenChange={setIsSuggestedOpen}
                      className="border border-slate-200 rounded-md overflow-hidden"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 p-2 hover:from-blue-100 hover:to-purple-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="bg-amber-100 p-1 rounded-full">
                              <Sparkles className="h-4 w-4 text-amber-500" />
                            </div>
                            <h5 className="text-sm font-medium">VibealongAI Suggested Developers (3)</h5>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm">
                            {isSuggestedOpen ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="p-3 bg-gradient-to-b from-slate-50 to-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Suggested Developer cards would go here - simplified for space */}
                          {["Michael Chen", "Priya Sharma", "James Wilson"].map((name, index) => (
                            <div
                              key={name}
                              className="flex items-center justify-between bg-white p-2 rounded-md border border-slate-200"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={
                                      index === 0
                                        ? "/stylized-initials.png"
                                        : index === 1
                                          ? "/abstract-geometric-sr.png"
                                          : "/abstract-aj.png"
                                    }
                                    alt={name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{name}</p>
                                  <div className="flex items-center">
                                    <span className="text-yellow-500 text-xs mr-1">★</span>
                                    <span className="text-xs">{4.7 - index * 0.1}</span>
                                  </div>
                                </div>
                              </div>
                              <Button size="sm" className="h-7 text-xs">
                                <UserPlus className="h-3 w-3 mr-1" /> Invite
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0 pb-3 flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => handleViewTask(task.id)}>
                  View Details
                </Button>
                <Button onClick={() => handleOpenTaskSpace(task.id)}>
                  Task Space
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
                {task.status === "Completed" && !task.rating_submitted && (
                  <Button
                    variant="secondary"
                    className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
                    onClick={() => {
                      setSelectedTaskForDialog(task)
                      setIsRatingDialogOpen(true)
                    }}
                  >
                    <Star className="mr-2 h-4 w-4 fill-yellow-500 text-yellow-500" />
                    Rate Developer
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* Task Detail Dialog */}
      <TaskDetailDialog
        task={selectedTaskForDialog}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
      />
      {/* Developer Profile Dialog */}
      {selectedDeveloper && (
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Developer Profile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={selectedDeveloper.avatar || "/placeholder.svg"}
                  alt={selectedDeveloper.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{selectedDeveloper.name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{selectedDeveloper.rating}</span>
              </div>
              <Badge
                className={`mt-2 ${selectedDeveloper.availability?.includes("Available") ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
              >
                {selectedDeveloper.availability}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{selectedDeveloper.bio}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedDeveloper.skills?.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Stats</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded-md text-center">
                    <p className="text-2xl font-bold">{selectedDeveloper.completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Tasks Completed</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md text-center">
                    <p className="text-2xl font-bold">{selectedDeveloper.rating}</p>
                    <p className="text-xs text-muted-foreground">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="w-full" onClick={() => setIsProfileDialogOpen(false)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button className="w-full" variant="default">
                Hire for this Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Hiring Confirmation Modal */}
      <Dialog open={isHiringModalOpen} onOpenChange={setIsHiringModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Hiring</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {developerToHire && (
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={developerToHire.avatar || "/placeholder.svg"}
                    alt={developerToHire.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{developerToHire.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{developerToHire.rating}</span>
                  </div>
                </div>
              </div>
            )}
            <p className="text-muted-foreground mb-4">
              Are you sure you want to hire this developer for this task? Once confirmed, they will be assigned to the
              task and notified.
            </p>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Task Details</h4>
              <div className="bg-slate-50 p-3 rounded-md">
                <p className="font-medium">{selectedTaskForDialog?.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedTaskForDialog?.description}</p>

                <div className="mt-4 space-y-2">
                  {/* Budget with info icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">Budget:</span>
                      <span className="text-sm">${selectedTaskForDialog?.budget}</span>
                      <div className="relative group">
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-48">
                          Maximum budget allocated for this task. Final payment may vary based on actual hours worked.
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />${selectedTaskForDialog?.budget}
                    </Badge>
                  </div>

                  {/* Hours with info icon and AI indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">Estimated Hours:</span>
                      <span className="text-sm">{selectedTaskForDialog?.estimated_hours} hrs</span>
                      <div className="relative group">
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-48">
                          AI-generated estimate based on task complexity and requirements. Actual hours may vary.
                        </div>
                      </div>
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" title="AI-generated estimate" />
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {selectedTaskForDialog?.estimated_hours} hours
                    </Badge>
                  </div>

                  {/* Total cost with AI indicator */}
                  <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">Estimated Total:</span>
                      <span className="text-sm font-semibold">${selectedTaskForDialog?.budget}</span>
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" title="AI-generated estimate" />
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />${selectedTaskForDialog?.budget}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsHiringModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                // Close the modal
                setIsHiringModalOpen(false)

                if (!selectedTaskForDialog || !developerToHire) return

                // Prepare developer data
                const developerData = {
                  ...developerToHire,
                  id: developerToHire.id || "dev-" + Date.now(),
                }

                // Assign the developer to the task
                await assignDeveloperToTask(selectedTaskForDialog.id, developerData.id, developerData)

                // Update local state
                const updatedTasks = tasks.map((t) => {
                  if (t.id === selectedTaskForDialog.id) {
                    return {
                      ...t,
                      status: "In Progress",
                      assigned_developer: developerData,
                      developer_id: developerData.id,
                      progress: 0,
                    }
                  }
                  return t
                })

                // Update local state
                setTasks(updatedTasks)
                setFilteredTasks(updatedTasks)

                // Store updated tasks in localStorage for demo persistence
                localStorage.setItem("mockTasks", JSON.stringify(updatedTasks))

                // Navigate to the task space
                router.push(`/task/${selectedTaskForDialog.id}/task-space`)
              }}
            >
              Confirm Hiring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Task Rating Dialog */}
      {selectedTaskForDialog && (
        <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Rate Developer Performance</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      selectedTaskForDialog.assigned_developer?.avatar ||
                      `https://avatar.vercel.sh/${selectedTaskForDialog.assigned_developer?.name || "dev"}?size=80`
                    }
                    alt={selectedTaskForDialog.assigned_developer?.name || "Developer"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedTaskForDialog.assigned_developer?.name || "Developer"}</p>
                  <p className="text-xs text-muted-foreground">Task: {selectedTaskForDialog.title}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Quality Rating */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">Quality of Work</h4>
                      <p className="text-xs text-muted-foreground">
                        How satisfied are you with the quality of the delivered work?
                      </p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={`quality-${star}`}
                          type="button"
                          className="focus:outline-none p-1"
                          onClick={() => {
                            const updatedTask = { ...selectedTaskForDialog, quality_rating: star }
                            setSelectedTaskForDialog(updatedTask)
                          }}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= (selectedTaskForDialog.quality_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Management Rating */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">Time Management</h4>
                      <p className="text-xs text-muted-foreground">
                        How well did the developer manage time and meet deadlines?
                      </p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={`time-${star}`}
                          type="button"
                          className="focus:outline-none p-1"
                          onClick={() => {
                            const updatedTask = { ...selectedTaskForDialog, time_rating: star }
                            setSelectedTaskForDialog(updatedTask)
                          }}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= (selectedTaskForDialog.time_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Availability Rating */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium">Availability & Communication</h4>
                      <p className="text-xs text-muted-foreground">
                        How responsive and available was the developer during the task?
                      </p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={`availability-${star}`}
                          type="button"
                          className="focus:outline-none p-1"
                          onClick={() => {
                            const updatedTask = { ...selectedTaskForDialog, availability_rating: star }
                            setSelectedTaskForDialog(updatedTask)
                          }}
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= (selectedTaskForDialog.availability_rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="review" className="text-sm font-medium">
                  Review (Optional)
                </label>
                <Textarea
                  id="review"
                  placeholder="Share your experience working with this developer..."
                  value={selectedTaskForDialog.review || ""}
                  onChange={(e) => {
                    const updatedTask = { ...selectedTaskForDialog, review: e.target.value }
                    setSelectedTaskForDialog(updatedTask)
                  }}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (
                    !selectedTaskForDialog.quality_rating ||
                    !selectedTaskForDialog.time_rating ||
                    !selectedTaskForDialog.availability_rating
                  ) {
                    toast({
                      title: "Rating required",
                      description: "Please provide ratings for all three categories",
                      variant: "destructive",
                    })
                    return
                  }

                  try {
                    // In a real app, you would submit this to your backend
                    // For now, we'll just close the dialog and show a success message
                    toast({
                      title: "Rating submitted",
                      description: "Thank you for rating this developer!",
                    })

                    // Update the task in our local state to show it's been rated
                    const updatedTasks = tasks.map((t) => {
                      if (t.id === selectedTaskForDialog.id) {
                        return { ...t, rating_submitted: true }
                      }
                      return t
                    })

                    setTasks(updatedTasks)
                    setFilteredTasks(updatedTasks)
                    setIsRatingDialogOpen(false)
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to submit rating. Please try again.",
                      variant: "destructive",
                    })
                  }
                }}
              >
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
