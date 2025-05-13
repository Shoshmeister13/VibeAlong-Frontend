"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Clock,
  Calendar,
  Tag,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Code,
  ListChecks,
  RefreshCw,
  Smartphone,
  Laptop,
  Bug,
  PlusCircle,
  Wrench,
  Zap,
  LineChart,
  Shield,
  Layers,
} from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"

// AI Platform icons
import { V0, Claude, Copilot, CodeGPT, Codeium } from "@/components/vibe-platform-icons"

// Helper function to format numbers with commas
const formatNumberWithCommas = (num: number | undefined | null): string => {
  if (num === undefined || num === null) {
    return "0" // Return a default value when num is undefined or null
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Task types for better type safety
interface TaskStep {
  title: string
  description: string
}

type TaskType =
  | "feature"
  | "bug"
  | "enhancement"
  | "optimization"
  | "refactor"
  | "ui"
  | "api"
  | "security"
  | "analytics"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: "High" | "Medium" | "Low"
  created_at: string
  created_by?: string // Add this field
  project: { name: string }
  ai_estimated_price: number
  ai_estimated_hours: number
  ai_platform: string
  framework: string
  ai_suggested_steps: TaskStep[]
  isNew?: boolean
  complexity?: string
  taskType?: TaskType
  devices?: string[]
}

// Mock data for task steps
const taskStepsByType: Record<string, TaskStep[]> = {
  responsive: [
    {
      title: "Analyze Current Layout",
      description: "Review the existing components and identify breakpoints where the layout fails on mobile devices.",
    },
    {
      title: "Implement Responsive CSS",
      description: "Apply media queries and flexbox/grid layouts to ensure proper rendering across all screen sizes.",
    },
    {
      title: "Test and Optimize",
      description: "Test on various devices and browsers, then optimize for performance and accessibility.",
    },
  ],
  payment: [
    {
      title: "Set Up API Integration",
      description: "Configure API keys and environment variables for the payment gateway.",
    },
    {
      title: "Create Payment Flow",
      description: "Build the frontend components and server endpoints to handle payment processing.",
    },
    {
      title: "Implement Error Handling",
      description: "Add comprehensive error handling, validation, and security measures for the payment process.",
    },
  ],
  search: [
    {
      title: "Design Search Architecture",
      description: "Create the data structure and API endpoints needed for efficient searching.",
    },
    {
      title: "Build Search UI",
      description: "Develop the search interface with filters, sorting options, and real-time results.",
    },
    {
      title: "Optimize Performance",
      description: "Implement caching, pagination, and indexing to ensure fast search results.",
    },
  ],
  auth: [
    {
      title: "Set Up Authentication System",
      description: "Configure the authentication provider and implement the login/signup flows.",
    },
    {
      title: "Create Protected Routes",
      description: "Implement route guards and user role-based access control.",
    },
    {
      title: "Add Security Features",
      description: "Implement password policies, 2FA, and session management for enhanced security.",
    },
  ],
  api: [
    {
      title: "Design API Structure",
      description: "Create the API schema, endpoints, and data models.",
    },
    {
      title: "Implement Endpoints",
      description: "Build the API endpoints with proper validation, error handling, and documentation.",
    },
    {
      title: "Test and Optimize",
      description: "Write tests for the API and optimize for performance and scalability.",
    },
  ],
  ui: [
    {
      title: "Create Component Design",
      description: "Design the UI components following the project's design system.",
    },
    {
      title: "Implement Components",
      description: "Build the components with proper state management and event handling.",
    },
    {
      title: "Add Animations and Polish",
      description: "Enhance the UI with animations, transitions, and accessibility features.",
    },
  ],
  default: [
    {
      title: "Analyze Requirements",
      description: "Review the task requirements and create a detailed implementation plan.",
    },
    {
      title: "Implement Solution",
      description: "Develop the solution following best practices and project standards.",
    },
    {
      title: "Test and Document",
      description: "Write tests, documentation, and prepare for code review.",
    },
  ],
}

export default function AvailableTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [projectFilter, setProjectFilter] = useState("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTaskAlert, setNewTaskAlert] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [newTasksCount, setNewTasksCount] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  // Function to get appropriate task steps based on task title
  const getTaskSteps = (title: string): TaskStep[] => {
    if (title.toLowerCase().includes("responsive") || title.toLowerCase().includes("mobile")) {
      return taskStepsByType.responsive
    } else if (title.toLowerCase().includes("payment") || title.toLowerCase().includes("stripe")) {
      return taskStepsByType.payment
    } else if (title.toLowerCase().includes("search")) {
      return taskStepsByType.search
    } else if (title.toLowerCase().includes("auth") || title.toLowerCase().includes("login")) {
      return taskStepsByType.auth
    } else if (title.toLowerCase().includes("api")) {
      return taskStepsByType.api
    } else if (title.toLowerCase().includes("ui") || title.toLowerCase().includes("component")) {
      return taskStepsByType.ui
    } else {
      return taskStepsByType.default
    }
  }

  // Function to determine task type based on title and description
  const getTaskType = (title: string, description: string): TaskType => {
    const combinedText = (title + " " + description).toLowerCase()

    if (combinedText.includes("bug") || combinedText.includes("fix") || combinedText.includes("issue")) {
      return "bug"
    } else if (
      combinedText.includes("optimize") ||
      combinedText.includes("performance") ||
      combinedText.includes("speed")
    ) {
      return "optimization"
    } else if (
      combinedText.includes("refactor") ||
      combinedText.includes("clean") ||
      combinedText.includes("restructure")
    ) {
      return "refactor"
    } else if (combinedText.includes("ui") || combinedText.includes("interface") || combinedText.includes("design")) {
      return "ui"
    } else if (
      combinedText.includes("api") ||
      combinedText.includes("endpoint") ||
      combinedText.includes("integration")
    ) {
      return "api"
    } else if (combinedText.includes("security") || combinedText.includes("auth") || combinedText.includes("protect")) {
      return "security"
    } else if (
      combinedText.includes("analytics") ||
      combinedText.includes("track") ||
      combinedText.includes("metric")
    ) {
      return "analytics"
    } else if (
      combinedText.includes("enhance") ||
      combinedText.includes("improve") ||
      combinedText.includes("upgrade")
    ) {
      return "enhancement"
    } else {
      return "feature"
    }
  }

  // Function to determine devices based on title and description
  const getDevices = (title: string, description: string): string[] => {
    const combinedText = (title + " " + description).toLowerCase()
    const devices: string[] = []

    if (combinedText.includes("mobile") || combinedText.includes("phone") || combinedText.includes("responsive")) {
      devices.push("mobile")
    }

    if (combinedText.includes("desktop") || combinedText.includes("laptop") || !devices.length) {
      devices.push("desktop")
    }

    return devices
  }

  // Function to generate a random task
  const generateRandomTask = (): Task => {
    const platforms = ["V0", "Claude", "Copilot", "CodeGPT", "Codeium", "Lovable"]
    const frameworks = ["React", "Next.js", "Vue", "Angular", "Svelte", "Express", "Django", "Laravel"]
    const projectNames = [
      "E-commerce Platform",
      "Mobile Banking App",
      "Social Media Dashboard",
      "Learning Management System",
      "Healthcare Portal",
      "Real Estate Marketplace",
      "Fitness Tracking App",
      "Project Management Tool",
    ]
    const taskTypes = [
      "Implement responsive design",
      "Fix authentication bug",
      "Create data visualization component",
      "Optimize database queries",
      "Add accessibility features",
      "Implement dark mode",
      "Create API integration",
      "Build form validation",
      "Implement search functionality",
      "Create payment processing flow",
      "Build user dashboard",
      "Implement file upload feature",
      "Create notification system",
      "Build analytics dashboard",
      "Implement real-time chat",
    ]
    const complexities = ["Simple", "Moderate", "Complex"]

    const randomId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]
    const randomFramework = frameworks[Math.floor(Math.random() * frameworks.length)]
    const randomProject = projectNames[Math.floor(Math.random() * projectNames.length)]
    const randomTaskType = taskTypes[Math.floor(Math.random() * taskTypes.length)]
    const randomPriority = ["High", "Medium", "Low"][Math.floor(Math.random() * 3)] as "High" | "Medium" | "Low"
    const randomComplexity = complexities[Math.floor(Math.random() * complexities.length)]

    // More realistic time and price estimates based on complexity
    let baseHours = 0
    let hourlyRate = 0

    switch (randomComplexity) {
      case "Simple":
        baseHours = Math.floor(Math.random() * 6) + 2 // 2-8 hours
        hourlyRate = Math.floor(Math.random() * 20) + 30 // $30-50/hour
        break
      case "Moderate":
        baseHours = Math.floor(Math.random() * 16) + 8 // 8-24 hours
        hourlyRate = Math.floor(Math.random() * 30) + 40 // $40-70/hour
        break
      case "Complex":
        baseHours = Math.floor(Math.random() * 40) + 20 // 20-60 hours
        hourlyRate = Math.floor(Math.random() * 40) + 50 // $50-90/hour
        break
      default:
        baseHours = Math.floor(Math.random() * 10) + 5 // 5-15 hours
        hourlyRate = Math.floor(Math.random() * 30) + 35 // $35-65/hour
    }

    const randomHours = baseHours
    const randomPrice = Math.floor(randomHours * hourlyRate)
    const description = `This task involves ${randomTaskType.toLowerCase()} for our ${randomProject.toLowerCase()} using ${randomFramework}. The implementation should follow our coding standards and be well-tested.`

    // Get appropriate task steps based on the task type
    const taskSteps = getTaskSteps(randomTaskType)

    // Determine task type and devices
    const taskType = getTaskType(randomTaskType, description)
    const devices = getDevices(randomTaskType, description)

    // Add creator names
    const creatorNames = [
      "Alex Johnson",
      "Sam Rivera",
      "Taylor Kim",
      "Jordan Smith",
      "Casey Wong",
      "Morgan Lee",
      "Jamie Chen",
    ]
    const randomCreator = creatorNames[Math.floor(Math.random() * creatorNames.length)]

    return {
      id: randomId,
      title: `${randomTaskType} for ${randomProject}`,
      description,
      status: "Open",
      priority: randomPriority,
      created_at: new Date().toISOString(),
      created_by: randomCreator, // Add this line
      project: { name: randomProject },
      ai_estimated_hours: randomHours,
      ai_estimated_price: randomPrice,
      ai_platform: randomPlatform,
      framework: randomFramework,
      ai_suggested_steps: taskSteps,
      isNew: true,
      complexity: randomComplexity,
      taskType,
      devices,
    }
  }

  // Function to load tasks
  const loadTasks = useCallback(
    async (showLoading = true) => {
      if (showLoading) setIsLoading(true)
      try {
        // Try to get tasks from localStorage (for demo purposes)
        const storedTasks = localStorage.getItem("availableTasks")
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks)

          // Add task type and devices if they don't exist
          const enhancedTasks = parsedTasks.map((task: Task) => {
            if (!task.taskType) {
              task.taskType = getTaskType(task.title, task.description)
            }
            if (!task.devices) {
              task.devices = getDevices(task.title, task.description)
            }
            return task
          })

          setTasks(enhancedTasks)
          setFilteredTasks(enhancedTasks)

          // Update localStorage with enhanced tasks
          localStorage.setItem("availableTasks", JSON.stringify(enhancedTasks))
        } else {
          // Fallback to default tasks
          const defaultTasks: Task[] = [
            {
              id: "avail-1",
              title: "Mobile Responsive Layout",
              description:
                "Ensure all pages work correctly on mobile devices with proper responsive design. Focus on navigation, forms, and tables.",
              status: "Open",
              priority: "Medium",
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              project: { name: "E-commerce Platform" },
              ai_estimated_price: 320,
              ai_estimated_hours: 8,
              ai_platform: "V0",
              framework: "React",
              complexity: "Moderate",
              ai_suggested_steps: taskStepsByType.responsive,
              taskType: "ui",
              devices: ["mobile", "desktop"],
              created_by: "Alex Johnson",
            },
            {
              id: "avail-2",
              title: "Payment Gateway Integration",
              description:
                "Implement Stripe payment processing for checkout flow with support for credit cards, Apple Pay, and Google Pay.",
              status: "Open",
              priority: "High",
              created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              project: { name: "E-commerce Platform" },
              ai_estimated_price: 720,
              ai_estimated_hours: 12,
              ai_platform: "Claude",
              framework: "Next.js",
              complexity: "Complex",
              ai_suggested_steps: taskStepsByType.payment,
              taskType: "api",
              devices: ["desktop"],
              created_by: "Sam Rivera",
            },
            {
              id: "avail-3",
              title: "Search Functionality",
              description:
                "Implement product search with filters and sorting options. Should include autocomplete and support for fuzzy matching.",
              status: "Open",
              priority: "Medium",
              created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              project: { name: "Mobile Banking App" },
              ai_estimated_price: 270,
              ai_estimated_hours: 6,
              ai_platform: "Lovable",
              framework: "Vue",
              complexity: "Moderate",
              ai_suggested_steps: taskStepsByType.search,
              taskType: "feature",
              devices: ["mobile", "desktop"],
              created_by: "Taylor Kim",
            },
            {
              id: "avail-4",
              title: "User Authentication System",
              description:
                "Create a secure authentication system with email verification, password reset, and social login options.",
              status: "Open",
              priority: "High",
              created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              project: { name: "Healthcare Portal" },
              ai_estimated_price: 1350,
              ai_estimated_hours: 18,
              ai_platform: "V0",
              framework: "Next.js",
              complexity: "Complex",
              ai_suggested_steps: taskStepsByType.auth,
              taskType: "security",
              devices: ["desktop"],
              created_by: "Jordan Smith",
            },
            {
              id: "avail-5",
              title: "API Integration for Real Estate Listings",
              description:
                "Connect to the MLS API to fetch and display real estate listings with filtering and pagination.",
              status: "Open",
              priority: "Medium",
              created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
              project: { name: "Real Estate Marketplace" },
              ai_estimated_price: 540,
              ai_estimated_hours: 9,
              ai_platform: "CodeGPT",
              framework: "React",
              complexity: "Moderate",
              ai_suggested_steps: taskStepsByType.api,
              taskType: "api",
              devices: ["desktop"],
              created_by: "Casey Wong",
            },
            {
              id: "avail-6",
              title: "Fix Login Bug on Safari",
              description:
                "Address the authentication issue affecting Safari users. Users are unable to log in due to a cookie handling problem.",
              status: "Open",
              priority: "High",
              created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              project: { name: "Fitness Tracking App" },
              ai_estimated_price: 180,
              ai_estimated_hours: 4,
              ai_platform: "Copilot",
              framework: "React",
              complexity: "Simple",
              ai_suggested_steps: taskStepsByType.auth,
              taskType: "bug",
              devices: ["desktop", "mobile"],
              created_by: "Morgan Lee",
            },
            {
              id: "avail-7",
              title: "Performance Optimization for Dashboard",
              description:
                "Improve loading times and rendering performance of the analytics dashboard. Current load time exceeds 3 seconds.",
              status: "Open",
              priority: "Medium",
              created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
              project: { name: "Project Management Tool" },
              ai_estimated_price: 450,
              ai_estimated_hours: 10,
              ai_platform: "Codeium",
              framework: "Angular",
              complexity: "Moderate",
              ai_suggested_steps: taskStepsByType.default,
              taskType: "optimization",
              devices: ["desktop"],
              created_by: "Jamie Chen",
            },
          ]
          setTasks(defaultTasks)
          setFilteredTasks(defaultTasks)

          // Save to localStorage
          localStorage.setItem("availableTasks", JSON.stringify(defaultTasks))
        }

        // Update last updated time
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error loading tasks:", error)
        toast({
          title: "Error loading tasks",
          description: "There was a problem loading the available tasks.",
          variant: "destructive",
        })
      } finally {
        // Simulate network delay
        if (showLoading) {
          setTimeout(() => {
            setIsLoading(false)
          }, 1000)
        } else {
          setIsRefreshing(false)
        }
      }
    },
    [toast],
  )

  // Function to refresh tasks
  const refreshTasks = useCallback(() => {
    setIsRefreshing(true)
    setNewTasksCount(0)

    // Generate 1-3 new tasks
    const numNewTasks = Math.floor(Math.random() * 3) + 1
    const newTasks: Task[] = []

    for (let i = 0; i < numNewTasks; i++) {
      newTasks.push(generateRandomTask())
    }

    // Add new tasks to the existing ones
    setTasks((prevTasks) => {
      const updatedTasks = [...newTasks, ...prevTasks]
      localStorage.setItem("availableTasks", JSON.stringify(updatedTasks))
      return updatedTasks
    })

    // Show notification
    toast({
      title: `${numNewTasks} new task${numNewTasks > 1 ? "s" : ""} available`,
      description: "Pull down to refresh and see the latest tasks.",
    })

    // Update last updated time
    setLastUpdated(new Date())
    setNewTaskAlert(true)
    setTimeout(() => setNewTaskAlert(false), 3000)

    // Finish refreshing after a short delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 800)
  }, [toast])

  useEffect(() => {
    // Load initial tasks
    loadTasks()

    // Set up interval to add new tasks periodically
    const interval = setInterval(() => {
      // Increment new tasks counter
      setNewTasksCount((prev) => prev + 1)

      // Add a new task to the list but don't refresh the UI automatically
      const newTask = generateRandomTask()
      setTasks((prevTasks) => {
        const updatedTasks = [newTask, ...prevTasks]
        localStorage.setItem("availableTasks", JSON.stringify(updatedTasks))
        return updatedTasks
      })
    }, 45000) // Add a new task every 45 seconds

    return () => clearInterval(interval)
  }, [loadTasks])

  useEffect(() => {
    // Filter tasks based on search query and project filter
    let filtered = tasks

    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (projectFilter !== "all") {
      filtered = filtered.filter((task) => task.project.name === projectFilter)
    }

    setFilteredTasks(filtered)
  }, [searchQuery, projectFilter, tasks])

  const handleApply = (taskId: string) => {
    // Find the task
    const task = tasks.find((task) => task.id === taskId)

    if (!task) return

    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully.",
    })

    // In a real app, this would make an API call to submit the application
    // For demo purposes, we'll just update the local state
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem("availableTasks", JSON.stringify(updatedTasks))

    // Add to applications
    const newApplication = {
      id: `app-${Date.now()}`,
      task_id: taskId,
      task_title: task.title,
      project_name: task.project.name,
      applied_date: new Date().toISOString(),
      status: "Pending",
      budget: task.ai_estimated_price || 0,
      estimated_hours: task.ai_estimated_hours || 0,
    }

    // Get existing applications or initialize empty array
    const existingApplications = JSON.parse(localStorage.getItem("developerApplications") || "[]")
    const updatedApplications = [newApplication, ...existingApplications]
    localStorage.setItem("developerApplications", JSON.stringify(updatedApplications))

    setFilteredTasks(
      updatedTasks.filter(
        (task) =>
          (projectFilter === "all" || task.project.name === projectFilter) &&
          (!searchQuery ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    )

    // Navigate to applications page after a short delay
    setTimeout(() => {
      router.push("/dashboard/developer/applications")
    }, 1500)
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="default" className="bg-orange-500">
            Medium
          </Badge>
        )
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return null
    }
  }

  const getComplexityBadge = (complexity: string | undefined) => {
    switch (complexity?.toLowerCase()) {
      case "simple":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
            Simple
          </Badge>
        )
      case "moderate":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Moderate
          </Badge>
        )
      case "complex":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Complex
          </Badge>
        )
      default:
        return null
    }
  }

  // Update the getTaskTypeBadge function to include a label
  const getTaskTypeBadge = (taskType: TaskType | undefined) => {
    if (!taskType) return null

    const typeConfig = {
      feature: {
        icon: <PlusCircle className="h-3.5 w-3.5" />,
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        label: "Feature",
      },
      bug: { icon: <Bug className="h-3.5 w-3.5" />, bg: "bg-red-100", text: "text-red-800", label: "Bug Fix" },
      enhancement: {
        icon: <Zap className="h-3.5 w-3.5" />,
        bg: "bg-amber-100",
        text: "text-amber-800",
        label: "Enhancement",
      },
      optimization: {
        icon: <LineChart className="h-3.5 w-3.5" />,
        bg: "bg-sky-100",
        text: "text-sky-800",
        label: "Optimization",
      },
      refactor: {
        icon: <Layers className="h-3.5 w-3.5" />,
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        label: "Refactor",
      },
      ui: { icon: <Laptop className="h-3.5 w-3.5" />, bg: "bg-fuchsia-100", text: "text-fuchsia-800", label: "UI" },
      api: { icon: <Wrench className="h-3.5 w-3.5" />, bg: "bg-cyan-100", text: "text-cyan-800", label: "API" },
      security: {
        icon: <Shield className="h-3.5 w-3.5" />,
        bg: "bg-violet-100",
        text: "text-violet-800",
        label: "Security",
      },
      analytics: {
        icon: <LineChart className="h-3.5 w-3.5" />,
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Analytics",
      },
    }

    const config = typeConfig[taskType]

    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-gray-500">Task Category:</span>
        <Badge
          variant="outline"
          className={`flex items-center gap-1 ${config.bg} ${config.text} border-transparent font-medium`}
        >
          {config.icon}
          {config.label}
        </Badge>
      </div>
    )
  }

  // Update the getAIPlatformBadge function to include a label
  const getAIPlatformBadgeLabel = (platform: string) => {
    const platformColors: Record<string, { bg: string; text: string }> = {
      V0: { bg: "bg-purple-100", text: "text-purple-800" },
      Claude: { bg: "bg-indigo-100", text: "text-indigo-800" },
      Copilot: { bg: "bg-blue-100", text: "text-blue-800" },
      CodeGPT: { bg: "bg-green-100", text: "text-green-800" },
      Codeium: { bg: "bg-amber-100", text: "text-amber-800" },
      Lovable: { bg: "bg-pink-100", text: "text-pink-800" },
    }

    const colors = platformColors[platform] || { bg: "bg-gray-100", text: "text-gray-800" }

    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-gray-500">Development Platform:</span>
        <Badge variant="outline" className={`flex items-center gap-1 ${colors.bg} ${colors.text} border-transparent`}>
          <Sparkles className="h-3.5 w-3.5" />
          {platform}
        </Badge>
      </div>
    )
  }

  // Update the getDeviceBadges function to include a label
  const getDeviceBadges = (devices: string[] | undefined) => {
    if (!devices || !devices.length) return null

    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-gray-500">Device{devices.length > 1 ? "s" : ""}:</span>
        <div className="flex gap-1">
          {devices.map((device) => {
            if (device === "mobile") {
              return (
                <Badge
                  key={device}
                  variant="outline"
                  className="flex items-center gap-1 bg-gray-100 text-gray-800 border-transparent"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Mobile
                </Badge>
              )
            } else {
              return (
                <Badge
                  key={device}
                  variant="outline"
                  className="flex items-center gap-1 bg-gray-100 text-gray-800 border-transparent"
                >
                  <Laptop className="h-3.5 w-3.5" />
                  Desktop
                </Badge>
              )
            }
          })}
        </div>
      </div>
    )
  }

  const getAIPlatformIcon = (platform: string) => {
    switch (platform) {
      case "V0":
        return <V0 className="h-4 w-4" />
      case "Claude":
        return <Claude className="h-4 w-4" />
      case "Copilot":
        return <Copilot className="h-4 w-4" />
      case "CodeGPT":
        return <CodeGPT className="h-4 w-4" />
      case "Codeium":
        return <Codeium className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const formatLastUpdated = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) {
      return "Just now"
    } else if (diffMins === 1) {
      return "1 minute ago"
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`
    } else {
      const hours = Math.floor(diffMins / 60)
      if (hours === 1) {
        return "1 hour ago"
      } else {
        return `${hours} hours ago`
      }
    }
  }

  // Get unique project names for filter
  const projectNames = Array.from(new Set(tasks.map((task) => task.project.name)))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Available Tasks</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Skeleton className="h-10 w-full md:w-80" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Available Tasks</h1>

        <div className="flex items-center gap-4">
          {/* New task alert */}
          <AnimatePresence>
            {newTaskAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                New tasks available!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Last updated indicator */}
          <div className="text-sm text-muted-foreground hidden md:flex items-center">
            <span className="mr-1">Updated:</span>
            {formatLastUpdated(lastUpdated)}
          </div>

          {/* Refresh button */}
          <Button variant="outline" size="sm" onClick={refreshTasks} disabled={isRefreshing} className="relative">
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
            {newTasksCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {newTasksCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Project</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setProjectFilter("all")}>All Projects</DropdownMenuItem>
              {projectNames.map((name) => (
                <DropdownMenuItem key={name} onClick={() => setProjectFilter(name)}>
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={task.isNew ? { opacity: 0, y: -20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={task.isNew ? "relative" : ""}
              >
                {task.isNew && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10"
                  >
                    New
                  </motion.div>
                )}
                <Card
                  className={`overflow-hidden hover:shadow-md transition-shadow ${task.isNew ? "border-green-400" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-2">
                          <h3 className="text-xl font-semibold">{task.title}</h3>
                          {getPriorityBadge(task.priority)}
                          {getComplexityBadge(task.complexity)}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <span>
                            Created by <span className="font-bold text-black">{task.created_by || "Unknown"}</span>
                          </span>
                        </div>

                        {/* Project info badges */}
                        <div className="flex flex-col gap-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-500">Project:</span>
                            <Badge variant="outline" className="flex items-center gap-1 bg-slate-50">
                              <Tag className="h-3.5 w-3.5" />
                              {task.project.name}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-500">Created on:</span>
                            <Badge variant="outline" className="flex items-center gap-1 bg-slate-50">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(task.created_at).toLocaleDateString()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-500">Framework:</span>
                            <Badge variant="outline" className="flex items-center gap-1 bg-slate-50">
                              <Code className="h-3.5 w-3.5" />
                              {task.framework}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-gray-500">Task Description:</span>
                            <p className="text-sm line-clamp-2">{task.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                          <Button variant="outline" onClick={() => handleViewDetails(task)}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleApply(task.id)}>Apply for Task</Button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
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
                            <div className="text-2xl font-bold">${formatNumberWithCommas(task.ai_estimated_price)}</div>

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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{task.ai_estimated_hours} hours</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No available tasks found</p>
          <p className="text-sm text-muted-foreground">Check back later for new opportunities</p>
        </div>
      )}

      {/* Task Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTask?.title}
              {selectedTask?.complexity && getComplexityBadge(selectedTask.complexity)}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap gap-2 mt-2">
              <div className="flex gap-2">
                {selectedTask?.taskType && getTaskTypeBadge(selectedTask.taskType)}
                {getAIPlatformBadgeLabel(selectedTask?.ai_platform)}
                {selectedTask?.devices && getDeviceBadges(selectedTask.devices)}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{selectedTask?.description}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-medium">AI Suggested Steps</h4>
              </div>
              <ol className="space-y-4 text-sm text-muted-foreground">
                {selectedTask?.ai_suggested_steps?.map((step: TaskStep, index: number) => (
                  <li key={index} className="bg-muted/50 p-3 rounded-md">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {step.title}
                    </div>
                    <p className="mt-1 pl-8">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-purple-100 rounded-full p-1">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm">Generated by VibeAlong AI</span>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium">Estimated</div>
                <div className="text-lg font-bold">
                  ${formatNumberWithCommas(selectedTask?.ai_estimated_price)} • {selectedTask?.ai_estimated_hours} hrs
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
