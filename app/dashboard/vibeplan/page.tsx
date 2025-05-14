"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CreditCard, Filter, Search, Users, Plus, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

// Task interface
interface Task {
  id: string
  title: string
  description: string
  estimate: number // hours
  credits: number
  priority: "High" | "Medium" | "Low"
  difficulty: "Easy" | "Medium" | "Hard"
  status: "todo" | "in-progress" | "done"
  category: string
  tags: string[]
}

// Mock data for the Vibe Plan tasks
const vibePlanTasks: Task[] = [
  {
    id: "task-1",
    title: "Fix Type Definitions",
    description: "Add proper TypeScript types to improve code quality and prevent runtime errors.",
    estimate: 8,
    credits: 80,
    priority: "High",
    difficulty: "Medium",
    status: "todo",
    category: "Code Quality",
    tags: ["TypeScript", "Refactoring"],
  },
  {
    id: "task-2",
    title: "Optimize Authentication Flow",
    description: "Improve user login and registration flow with better error handling and security.",
    estimate: 12,
    credits: 120,
    priority: "High",
    difficulty: "Hard",
    status: "todo",
    category: "Security",
    tags: ["Authentication", "UX"],
  },
  {
    id: "task-3",
    title: "Implement Form Validation",
    description: "Add consistent validation across all forms to improve user experience and data quality.",
    estimate: 6,
    credits: 60,
    priority: "Medium",
    difficulty: "Easy",
    status: "todo",
    category: "UX",
    tags: ["Forms", "Validation"],
  },
  {
    id: "task-4",
    title: "Optimize Image Loading",
    description: "Implement lazy loading and proper image optimization to improve page load times.",
    estimate: 4,
    credits: 40,
    priority: "Medium",
    difficulty: "Easy",
    status: "todo",
    category: "Performance",
    tags: ["Images", "Performance"],
  },
  {
    id: "task-5",
    title: "Add Server-Side Rendering",
    description: "Implement SSR for better SEO and initial page load performance.",
    estimate: 16,
    credits: 160,
    priority: "Medium",
    difficulty: "Hard",
    status: "todo",
    category: "Performance",
    tags: ["SSR", "SEO"],
  },
  {
    id: "task-6",
    title: "Implement Responsive Design Fixes",
    description: "Fix layout issues on mobile devices and ensure consistent experience across all screen sizes.",
    estimate: 10,
    credits: 100,
    priority: "High",
    difficulty: "Medium",
    status: "todo",
    category: "UX",
    tags: ["Responsive", "CSS"],
  },
  {
    id: "task-7",
    title: "Add Unit Tests",
    description: "Create comprehensive test suite for critical components and functions.",
    estimate: 14,
    credits: 140,
    priority: "Low",
    difficulty: "Medium",
    status: "todo",
    category: "Testing",
    tags: ["Testing", "Quality"],
  },
  {
    id: "task-8",
    title: "Implement Dark Mode",
    description: "Add dark mode support with theme toggle and system preference detection.",
    estimate: 8,
    credits: 80,
    priority: "Low",
    difficulty: "Medium",
    status: "todo",
    category: "UX",
    tags: ["Theming", "Accessibility"],
  },
]

export default function VibePlanPage() {
  const [tasks, setTasks] = useState<Task[]>(vibePlanTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")

  // Calculate totals
  const totalEstimate = tasks.reduce((sum, task) => sum + task.estimate, 0)
  const totalCredits = tasks.reduce((sum, task) => sum + task.credits, 0)
  const highPriorityCount = tasks.filter((task) => task.priority === "High").length

  // Filter tasks based on search query and active filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (!activeFilter) return matchesSearch

    return (
      matchesSearch &&
      (task.priority.toLowerCase() === activeFilter.toLowerCase() ||
        task.difficulty.toLowerCase() === activeFilter.toLowerCase() ||
        task.category.toLowerCase() === activeFilter.toLowerCase())
    )
  })

  // Group tasks by status for Kanban view
  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress")
  const doneTasks = filteredTasks.filter((task) => task.status === "done")

  // Function to move a task to a different status
  const moveTask = (taskId: string, newStatus: "todo" | "in-progress" | "done") => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  // Function to render a task card
  const renderTaskCard = (task: Task) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-base">{task.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => moveTask(task.id, "todo")}>Move to To Do</DropdownMenuItem>
              <DropdownMenuItem onClick={() => moveTask(task.id, "in-progress")}>Move to In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => moveTask(task.id, "done")}>Move to Done</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Assign to Expert</DropdownMenuItem>
              <DropdownMenuItem>Mark as DIY</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs py-0.5">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{task.estimate} hours</span>
          </div>
          <div className="flex items-center">
            <CreditCard className="h-3.5 w-3.5 mr-1" />
            <span>{task.credits} credits</span>
          </div>
          <Badge
            variant={task.priority === "High" ? "default" : "outline"}
            className={`text-xs ${task.priority === "High" ? "bg-black" : ""}`}
          >
            {task.priority}
          </Badge>
        </div>
      </div>
    </motion.div>
  )

  // Calculate summary values
  const totalTasks = tasks.length
  const estimatedTime = tasks.reduce((sum, task) => sum + task.estimate, 0)
  const vibeAlongTime = Math.ceil(estimatedTime / 4)
  const estimatedCredits = tasks.reduce((sum, task) => sum + task.credits, 0)

  const summary = {
    totalTasks: tasks.length,
    completedTasks: doneTasks.length,
    estimatedHours: estimatedTime,
    remainingHours: totalEstimate - estimatedTime,
    vibeAlongCount: vibeAlongTime,
    vibeAlongActive: Math.floor(vibeAlongTime / 2),
    credits: estimatedCredits,
    creditsUsed: Math.floor(estimatedCredits / 3),
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Vibe Plan</h1>
          <p className="text-gray-600 mt-1">AI-generated development roadmap based on your VibeCheck results</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Export Plan
          </Button>
          <Button className="bg-black hover:bg-gray-800">Hire Expert</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
            <span className="text-xl">📋</span>
          </div>
          <p className="text-2xl font-bold mt-1">{summary.totalTasks}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{summary.completedTasks} completed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Est. Time</h3>
            <span className="text-xl">⏱️</span>
          </div>
          <p className="text-2xl font-bold mt-1">{summary.estimatedHours}h</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{summary.remainingHours}h remaining</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">VibeAlong</h3>
            <span className="text-xl">🚀</span>
          </div>
          <p className="text-2xl font-bold mt-1">{summary.vibeAlongCount}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{summary.vibeAlongActive} active</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Credits</h3>
            <span className="text-xl">💰</span>
          </div>
          <p className="text-2xl font-bold mt-1">{summary.credits}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{summary.creditsUsed} used this month</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Tabs defaultValue="kanban" onValueChange={(value) => setViewMode(value as "kanban" | "list")}>
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2 h-9">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filter
                <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setActiveFilter("High")}>High Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("Medium")}>Medium Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("Low")}>Low Priority</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setActiveFilter("Easy")}>Easy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("Medium")}>Medium</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter("Hard")}>Hard</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveFilter(null)}>Clear Filters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilter && (
            <Badge variant="outline" className="ml-2">
              {activeFilter}
              <button className="ml-1 text-gray-400 hover:text-gray-600" onClick={() => setActiveFilter(null)}>
                ×
              </button>
            </Badge>
          )}
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                To Do ({todoTasks.length})
              </h2>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {todoTasks.map(renderTaskCard)}
              {todoTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm border border-dashed rounded-md">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                In Progress ({inProgressTasks.length})
              </h2>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map(renderTaskCard)}
              {inProgressTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm border border-dashed rounded-md">
                  No tasks in progress
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Done ({doneTasks.length})
              </h2>
            </div>
            <div className="space-y-3">
              {doneTasks.map(renderTaskCard)}
              {doneTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm border border-dashed rounded-md">
                  No completed tasks yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
            <div className="col-span-5">Task</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1 text-center">Priority</div>
            <div className="col-span-1 text-center">Hours</div>
            <div className="col-span-1 text-center">Credits</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {filteredTasks.map((task) => (
            <div key={task.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
              <div className="col-span-5">
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
              </div>
              <div className="col-span-2">
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
              </div>
              <div className="col-span-1 text-center">
                <Badge
                  variant={task.priority === "High" ? "default" : "outline"}
                  className={`text-xs ${task.priority === "High" ? "bg-black" : ""}`}
                >
                  {task.priority}
                </Badge>
              </div>
              <div className="col-span-1 text-center text-sm">{task.estimate}</div>
              <div className="col-span-1 text-center text-sm">{task.credits}</div>
              <div className="col-span-2 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {task.status === "todo" ? "To Do" : task.status === "in-progress" ? "In Progress" : "Done"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => moveTask(task.id, "todo")}>Move to To Do</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveTask(task.id, "in-progress")}>
                      Move to In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => moveTask(task.id, "done")}>Move to Done</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">No tasks match your search or filter criteria</div>
          )}
        </div>
      )}

      {/* Expert Assistance Section */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Need help with these tasks?</h2>
            <p className="text-gray-600 mt-1">
              Our vetted experts can complete your development plan 4x faster with higher quality.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="whitespace-nowrap" asChild>
              <a href="/consultation">Book Consultation</a>
            </Button>
            <Button className="bg-black hover:bg-gray-800 whitespace-nowrap">
              <Users className="mr-2 h-4 w-4" />
              Hire Expert Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
