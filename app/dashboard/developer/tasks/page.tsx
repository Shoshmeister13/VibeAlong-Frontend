"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Loader2, ArrowRight, Calendar, Tag, Code, Users2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"

// Helper function to format numbers with commas
const formatNumberWithCommas = (num: number | undefined | null): string => {
  if (num === undefined || num === null) {
    return "0" // Return a default value when num is undefined or null
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function DeveloperTasksPage() {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      try {
        // Get tasks from localStorage (set by the navigation component)
        const storedTasks = localStorage.getItem("developerTasks")
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks))
        } else {
          // Fallback mock data if localStorage is empty
          setTasks([
            {
              id: "task-1",
              title: "Design User Dashboard",
              description:
                "Create wireframes and high-fidelity designs for the main user dashboard with responsive layouts for mobile and desktop. Focus on user experience and accessibility.",
              status: "In Progress",
              priority: "High",
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              project: { name: "E-commerce Platform" },
              created_by: "Alex Johnson",
              created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              framework: "React",
              progress: 65,
              last_updated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              ai_estimated_price: 450,
              ai_estimated_hours: 10,
              complexity: "Moderate",
              ai_suggested_steps: [
                {
                  title: "Research & Planning",
                  description: "Analyze user needs and create wireframes for the dashboard layout",
                },
                {
                  title: "Design Components",
                  description: "Create UI components following the design system guidelines",
                },
                {
                  title: "Implement Responsive Design",
                  description: "Ensure the dashboard works well on all device sizes",
                },
              ],
              devices: ["desktop", "mobile"],
            },
            {
              id: "task-2",
              title: "Implement Authentication Flow",
              description:
                "Set up user authentication with email verification and social login options. Implement secure password reset functionality and account recovery options.",
              status: "In Progress",
              priority: "High",
              due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              project: { name: "E-commerce Platform" },
              created_by: "Sam Rivera",
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              framework: "Next.js",
              progress: 30,
              last_updated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              ai_estimated_price: 720,
              ai_estimated_hours: 16,
              complexity: "Complex",
              ai_suggested_steps: [
                {
                  title: "Set Up Authentication Provider",
                  description: "Configure the authentication service and environment variables",
                },
                {
                  title: "Implement Login/Signup Flows",
                  description: "Create the UI components and server endpoints for authentication",
                },
                {
                  title: "Add Social Login & Security Features",
                  description: "Implement OAuth providers and security best practices",
                },
              ],
              devices: ["desktop"],
            },
            {
              id: "task-3",
              title: "Optimize Product Search",
              description:
                "Improve the search functionality with filters, sorting options, and autocomplete suggestions. Focus on performance and relevance of search results.",
              status: "Completed",
              priority: "Medium",
              due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              project: { name: "E-commerce Platform" },
              created_by: "Taylor Kim",
              created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              framework: "Vue",
              progress: 100,
              last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              ai_estimated_price: 380,
              ai_estimated_hours: 8,
              complexity: "Moderate",
              ai_suggested_steps: [
                {
                  title: "Analyze Current Search Implementation",
                  description: "Review the existing search functionality and identify bottlenecks",
                },
                {
                  title: "Implement Improved Search Algorithm",
                  description: "Enhance the search with better relevance ranking and filtering",
                },
                {
                  title: "Add Autocomplete & Performance Optimizations",
                  description: "Implement autocomplete suggestions and optimize for speed",
                },
              ],
              devices: ["desktop", "mobile"],
            },
          ])
        }
      } catch (error) {
        console.error("Error loading tasks:", error)
        // Set empty array if there's an error
        setTasks([])
      } finally {
        setLoading(false)
      }
    }, 800) // Simulate network delay

    return () => clearTimeout(timer)
  }, [])

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "in-progress") return task.status?.toLowerCase() === "in progress"
    if (activeTab === "completed") return task.status?.toLowerCase() === "completed"
    return true
  })

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>
      case "in progress":
        return <Badge className="bg-yellow-500 text-white">In Progress</Badge>
      case "review":
        return <Badge className="bg-purple-500 text-white">Review</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Helper function to get priority badge
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

  // Helper function to get complexity badge
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

  // Format date to readable string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return "No date"
    }
  }

  // Format last updated time
  const formatLastUpdated = (dateString: string) => {
    try {
      const date = new Date(dateString)
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
        } else if (hours < 24) {
          return `${hours} hours ago`
        } else {
          const days = Math.floor(hours / 24)
          if (days === 1) {
            return "1 day ago"
          } else {
            return `${days} days ago`
          }
        }
      }
    } catch (e) {
      return "Unknown"
    }
  }

  const handleViewDetails = (task: any) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h3 className="text-xl font-medium">Loading your tasks...</h3>
        <p className="text-muted-foreground">Please wait while we fetch your data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <div className="flex items-center gap-4">
          {/* Last updated indicator */}
          <div className="text-sm text-muted-foreground hidden md:flex items-center">
            <span className="mr-1">Updated:</span>
            {formatLastUpdated(lastUpdated.toISOString())}
          </div>

          {/* Refresh button */}
          <Button variant="outline" size="sm" onClick={() => setLastUpdated(new Date())} className="relative">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">📋 All Tasks</TabsTrigger>
          <TabsTrigger value="in-progress">⏳ In Progress</TabsTrigger>
          <TabsTrigger value="completed">✅ Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
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
                              Created by{" "}
                              <span className="font-medium text-foreground">{task.created_by || "Unknown"}</span>
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
                              <div className="text-xl font-bold mt-1">
                                ${formatNumberWithCommas(task.ai_estimated_price)}
                              </div>

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
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-muted p-6 rounded-lg text-center">
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "all"
                  ? "You don't have any tasks assigned to you yet."
                  : `You don't have any ${activeTab.replace("-", " ")} tasks.`}
              </p>
              <Link href="/dashboard/developer/available-tasks">
                <Button>Browse Available Tasks</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
                {getStatusBadge(selectedTask?.status)}
                <Badge variant="outline" className="flex items-center gap-1 bg-slate-50">
                  <Calendar className="h-3.5 w-3.5" />
                  Due: {selectedTask && formatDate(selectedTask.due_date)}
                </Badge>
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
                <CheckCircle className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-medium">AI Suggested Steps</h4>
              </div>
              <ol className="space-y-4 text-sm text-muted-foreground">
                {selectedTask?.ai_suggested_steps?.map((step: any, index: number) => (
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

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Progress</h4>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Completion</span>
                  <span className="text-sm font-medium">{selectedTask?.progress}%</span>
                </div>
                <Progress value={selectedTask?.progress} className="h-2" />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    Last updated: {selectedTask && formatLastUpdated(selectedTask.last_updated)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-right">
                <div className="text-sm font-medium">Estimated</div>
                <div className="text-lg font-bold">
                  ${formatNumberWithCommas(selectedTask?.ai_estimated_price)} • {selectedTask?.ai_estimated_hours} hrs
                </div>
              </div>

              <Button asChild>
                <Link href={`/task/${selectedTask?.id}/collaborate`}>
                  <Users2 className="mr-2 h-4 w-4" />
                  Open Task Space
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
