"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, CheckCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  description: string
  priority: string
  category: string
  stack: string[]
  estimated_time_hours: number
  estimated_cost_usd: number
  status: string
  vibe_coder_id: string
  created_at: string
  profiles: {
    full_name: string
  }
  ai_time_estimate?: number
  budget?: number
  ai_steps?: string[]
}

interface DeveloperQueueProps {
  initialTasks?: Task[]
  quizPassed?: boolean | null
}

// Mock data for available tasks
const mockTasks = [
  {
    id: "task-1",
    title: "Build a responsive landing page",
    description: "Create a modern, responsive landing page with animations and contact form",
    priority: "medium",
    category: "Frontend",
    stack: ["React", "Tailwind CSS"],
    estimated_time_hours: 4,
    estimated_cost_usd: 80,
    status: "Open",
    vibe_coder_id: "user-1",
    created_at: "2023-11-15T10:30:00Z",
    profiles: {
      full_name: "Alex Johnson",
    },
    ai_time_estimate: 3,
    budget: 60,
    ai_steps: [
      "Design the basic layout and structure of the landing page",
      "Implement responsive design for various screen sizes",
      "Add interactive elements and animations to enhance user experience",
    ],
  },
  {
    id: "task-2",
    title: "Fix authentication bug in React app",
    description: "Debug and fix issues with user authentication flow in a React application",
    priority: "high",
    category: "Debugging",
    stack: ["React", "Firebase"],
    estimated_time_hours: 2,
    estimated_cost_usd: 40,
    status: "Open",
    vibe_coder_id: "user-2",
    created_at: "2023-11-14T14:20:00Z",
    profiles: {
      full_name: "Sarah Miller",
    },
    ai_time_estimate: 2.5,
    budget: 50,
    ai_steps: [
      "Identify the root cause of the authentication bug",
      "Implement a fix to resolve the authentication issue",
      "Test the authentication flow thoroughly to ensure it works correctly",
    ],
  },
  {
    id: "task-3",
    title: "Implement dark mode toggle",
    description: "Add dark mode functionality to an existing Next.js application",
    priority: "low",
    category: "Feature",
    stack: ["Next.js", "Tailwind CSS"],
    estimated_time_hours: 3,
    estimated_cost_usd: 60,
    status: "Open",
    vibe_coder_id: "user-3",
    created_at: "2023-11-13T09:15:00Z",
    profiles: {
      full_name: "Michael Brown",
    },
    ai_time_estimate: 2,
    budget: 40,
    ai_steps: [
      "Set up the project environment and dependencies",
      "Implement the core functionality following the requirements",
      "Test thoroughly and submit for review",
    ],
  },
]

export function DeveloperQueue({ initialTasks, quizPassed }: DeveloperQueueProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks || mockTasks)
  const [claimingTaskId, setClaimingTaskId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleClaimTask = async (taskId: string) => {
    // Check if quiz is passed from localStorage
    const quizPassed = localStorage.getItem("devQuizPassed") === "true"

    if (!quizPassed) {
      toast({
        title: "Quiz Required",
        description: "Complete your screening quiz to unlock this task.",
        variant: "destructive",
      })
      return
    }

    setClaimingTaskId(taskId)

    try {
      // In a real app, this would call your API
      // const result = await claimTask(taskId)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const result = { success: true }

      if (result.success) {
        toast({
          title: "Task Application Submitted",
          description: "Your application has been submitted successfully.",
          variant: "default",
        })

        // Remove the task from the list
        setTasks(tasks.filter((task) => task.id !== taskId))

        // Redirect to the applications tab after a short delay
        setTimeout(() => {
          router.push(`/dashboard/tasks/${taskId}`)
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: "Failed to apply for task. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      console.error("Error claiming task:", error)
    } finally {
      setClaimingTaskId(null)
    }
  }

  const getDifficultyBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-500 text-white">Complex</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Intermediate</Badge>
      case "low":
        return <Badge className="bg-green-500 text-white">Basic</Badge>
      case "urgent":
        return <Badge className="bg-purple-500 text-white">Advanced</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  if (tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px] text-center">
          <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Open Tasks</h3>
          <p className="text-muted-foreground max-w-md">
            There are currently no open tasks available. Check back later or explore other opportunities in the
            platform.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                {getDifficultyBadge(task.priority)}
                <Badge variant="outline">{task.category}</Badge>
              </div>
              <CardTitle className="line-clamp-2">{task.title}</CardTitle>
              <CardDescription className="line-clamp-3">{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-4">
                {task.stack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="bg-secondary/50">
                    {tech}
                  </Badge>
                ))}
              </div>
              {/* AI-generated Task Summary Section */}
              <div className="mt-2 mb-4 border border-primary/10 rounded-md overflow-hidden">
                <div className="bg-primary/5 px-3 py-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M12 2a5 5 0 0 0-5 5v14a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z"></path>
                    <path d="M9.5 8a2.5 2.5 0 0 1 5 0v8a2.5 2.5 0 0 1-5 0V8Z"></path>
                    <path d="M6 10a6 6 0 0 1 12 0v3a6 6 0 0 1-12 0v-3z"></path>
                    <path d="m8 18 4-4 4 4"></path>
                  </svg>
                  <span className="text-sm font-medium">AI-generated Task Summary</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Generated by VibeAlong AI</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="p-3">
                  {/* Key Steps Section */}
                  <div className="mb-3">
                    <div className="text-xs font-medium mb-1">✨ Key Steps to Complete:</div>
                    <ul className="text-xs text-muted-foreground pl-4 space-y-1 list-disc">
                      {/* Use actual AI steps if available, otherwise use placeholders */}
                      {task.ai_steps ? (
                        task.ai_steps.map((step, index) => (
                          <li key={index} className="line-clamp-1 flex items-start">
                            <span>{step}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="line-clamp-1">Set up the project environment and dependencies</li>
                          <li className="line-clamp-1">Implement the core functionality following the requirements</li>
                          <li className="line-clamp-1">Test thoroughly and submit for review</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Estimates Section */}
                  {(task.ai_time_estimate || task.budget) && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {task.ai_time_estimate && (
                        <div className="flex items-center">
                          <span className="mr-1.5 text-primary">⏱</span>
                          <span>
                            Est. Time: <span className="font-medium">{task.ai_time_estimate}h</span>
                          </span>
                        </div>
                      )}
                      {task.budget && (
                        <div className="flex items-center">
                          <span className="mr-1.5 text-primary">💰</span>
                          <span>
                            Est. Budget: <span className="font-medium">${task.budget}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">Posted by: {task.profiles.full_name}</div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Button
                      className="w-full"
                      onClick={() => handleClaimTask(task.id)}
                      disabled={claimingTaskId === task.id || quizPassed === false}
                    >
                      {claimingTaskId === task.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          Apply for Task
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </TooltipTrigger>
                {quizPassed === false && (
                  <TooltipContent>
                    <p>Complete your screening quiz to unlock this task.</p>
                  </TooltipContent>
                )}
              </Tooltip>

              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
                <span className="sr-only">View project details</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  )
}
