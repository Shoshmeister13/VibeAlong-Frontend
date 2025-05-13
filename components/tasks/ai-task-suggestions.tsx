"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, Plus, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useAuth } from "@/components/providers/auth-provider"

interface Task {
  id: string
  title: string
  description: string
  estimatedHours: number
  budget: number
  skills: string[]
  reasoning?: string
}

interface AiTaskSuggestionsProps {
  projectId: string
  projectName: string
  projectDescription?: string
  projectStack?: string[]
  onAddTask: (task: { title: string; description: string; estimatedHours: number; budget: number }) => void
}

export function AiTaskSuggestions({
  projectId,
  projectName,
  projectDescription = "",
  projectStack = [],
  onAddTask,
}: AiTaskSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<Task[]>([])
  const { supabase } = useSupabase()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchSuggestions() {
      if (!user || !projectId) return

      setIsLoading(true)
      try {
        // In a real implementation, this would call an AI service
        // For now, we'll generate suggestions based on the project data
        const generatedSuggestions = await generateSuggestions(projectId, projectName, projectDescription, projectStack)
        setSuggestions(generatedSuggestions)
      } catch (error) {
        console.error("Error fetching task suggestions:", error)
        // Fallback to default suggestions
        setSuggestions(getDefaultSuggestions(projectName))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [user, projectId, projectName, projectDescription, projectStack, supabase])

  async function generateSuggestions(
    projectId: string,
    projectName: string,
    projectDescription: string,
    projectStack: string[],
  ): Promise<Task[]> {
    // In a real implementation, this would call your AI service with the project details
    // For now, we'll simulate an API call with a timeout
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate suggestions based on project name and stack
    const suggestions: Task[] = []

    if (projectStack.includes("React") || projectName.toLowerCase().includes("frontend")) {
      suggestions.push({
        id: `${projectId}-1`,
        title: "Implement responsive design system",
        description:
          "Create a comprehensive responsive design system that ensures the application works well on all devices from mobile to desktop. Include breakpoints, flexible layouts, and touch-friendly UI elements.",
        estimatedHours: 8,
        budget: 400,
        skills: ["Frontend", "CSS", "Responsive Design"],
        reasoning:
          "A responsive design system is essential for modern web applications to ensure a consistent user experience across all devices. This task will establish the foundation for all UI components.",
      })
    }

    if (projectStack.includes("API") || projectName.toLowerCase().includes("backend")) {
      suggestions.push({
        id: `${projectId}-2`,
        title: "Set up API authentication and security",
        description:
          "Implement secure authentication for the API including JWT tokens, rate limiting, and proper error handling. Ensure all endpoints are protected against common security vulnerabilities.",
        estimatedHours: 6,
        budget: 350,
        skills: ["Backend", "Security", "API"],
        reasoning:
          "Security is critical for any application with user data. This task will protect your API from unauthorized access and common security threats.",
      })
    }

    if (projectStack.includes("Database") || projectName.toLowerCase().includes("data")) {
      suggestions.push({
        id: `${projectId}-3`,
        title: "Optimize database queries and indexing",
        description:
          "Review and optimize database queries for performance. Create appropriate indexes, refactor slow queries, and implement caching where beneficial.",
        estimatedHours: 5,
        budget: 300,
        skills: ["Database", "Performance", "Optimization"],
        reasoning:
          "Database performance is often the bottleneck in applications. This task will improve response times and reduce server load as your application scales.",
      })
    }

    // Add generic suggestions if we don't have enough specific ones
    if (suggestions.length < 3) {
      suggestions.push({
        id: `${projectId}-4`,
        title: "Implement automated testing suite",
        description:
          "Set up a comprehensive testing framework with unit tests, integration tests, and end-to-end tests to ensure code quality and prevent regressions.",
        estimatedHours: 7,
        budget: 375,
        skills: ["Testing", "Quality Assurance", "Automation"],
        reasoning:
          "Automated testing is essential for maintaining code quality as your project grows. This task will help catch bugs early and provide confidence when making changes.",
      })

      suggestions.push({
        id: `${projectId}-5`,
        title: "Create user onboarding flow",
        description:
          "Design and implement an intuitive onboarding experience for new users that guides them through key features and helps them get started quickly.",
        estimatedHours: 6,
        budget: 325,
        skills: ["UX/UI", "Frontend", "User Experience"],
        reasoning:
          "A good onboarding experience significantly improves user retention. This task will help new users understand your application's value and how to use it effectively.",
      })
    }

    return suggestions.slice(0, 3) // Return only 3 suggestions
  }

  function getDefaultSuggestions(projectName: string): Task[] {
    return [
      {
        id: "default-1",
        title: "Set up authentication system",
        description: `Implement a secure authentication system for ${projectName} with login, registration, password reset, and email verification functionality.`,
        estimatedHours: 8,
        budget: 400,
        skills: ["Authentication", "Security", "Backend"],
        reasoning:
          "Authentication is a fundamental requirement for most applications. This task will secure user accounts and provide essential user management functionality.",
      },
      {
        id: "default-2",
        title: "Create responsive dashboard UI",
        description: `Design and implement a responsive dashboard interface for ${projectName} with charts, tables, and interactive components that work well on all devices.`,
        estimatedHours: 6,
        budget: 350,
        skills: ["UI/UX", "Frontend", "Responsive Design"],
        reasoning:
          "A well-designed dashboard is crucial for users to interact with and visualize their data. This task will create an intuitive interface for your core functionality.",
      },
      {
        id: "default-3",
        title: "Implement API integration",
        description: `Connect ${projectName} to external APIs for data retrieval and processing. Implement proper error handling and data caching.`,
        estimatedHours: 5,
        budget: 300,
        skills: ["API Integration", "Backend", "Data Processing"],
        reasoning:
          "Integrating with external services can extend your application's functionality and provide valuable data. This task will establish reliable connections to third-party services.",
      },
    ]
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Generating AI task suggestions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">🔮 AI-Suggested Tasks for Your Project</h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          VibeAlong AI
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Our AI has analyzed your project and suggests these tasks to help you move forward:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((task) => (
          <Dialog key={task.id}>
            <DialogTrigger asChild>
              <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="p-0">
                  <div className="p-4">
                    <h4 className="font-medium line-clamp-2 mb-2">{task.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{task.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {task.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        <span>{task.estimatedHours} hours</span>
                      </div>
                      <div className="flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" />
                        <span>${task.budget}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{task.title}</DialogTitle>
                <DialogDescription>Task details generated by VibeAlong AI for {projectName}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {task.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Estimated Time</h4>
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{task.estimatedHours} hours</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Budget</h4>
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>${task.budget}</span>
                    </div>
                  </div>
                </div>
                {task.reasoning && (
                  <div className="bg-muted/50 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-1 flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      Why This Task Matters
                    </h4>
                    <p className="text-sm text-muted-foreground">{task.reasoning}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    onAddTask({
                      title: task.title,
                      description: task.description,
                      estimatedHours: task.estimatedHours,
                      budget: task.budget,
                    })
                  }}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Submit This Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}
