"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Brain, Zap, CheckCircle, BarChart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Task data structure
interface TaskTag {
  name: string
  color?: string
}

interface Task {
  id: string
  title: string
  description: string
  tags: TaskTag[]
  hours: number
  price: number
  completedCount: number
}

// Task data for each tab
const basicTasks: Task[] = [
  {
    id: "auth-setup",
    title: "User Auth Setup",
    description: "Implement secure user authentication with email/password and session management.",
    tags: [{ name: "Authentication" }, { name: "Security" }, { name: "Backend" }],
    hours: 4,
    price: 80,
    completedCount: 124,
  },
  {
    id: "supabase-setup",
    title: "Supabase DB Setup",
    description: "Set up Supabase database with proper schema, tables, and relationships.",
    tags: [{ name: "Database" }, { name: "Backend" }, { name: "Supabase" }],
    hours: 4,
    price: 80,
    completedCount: 98,
  },
  {
    id: "landing-page",
    title: "Landing Page in v0",
    description: "Create a responsive, modern landing page using v0 components.",
    tags: [{ name: "Frontend" }, { name: "UI/UX" }, { name: "Responsive" }],
    hours: 3,
    price: 60,
    completedCount: 155,
  },
  {
    id: "navigation",
    title: "Navigation & Routing",
    description: "Implement app navigation with proper routing and page transitions.",
    tags: [{ name: "Frontend" }, { name: "Navigation" }],
    hours: 3.5,
    price: 70,
    completedCount: 87,
  },
  {
    id: "form-submission",
    title: "Form + Submission",
    description: "Create form components with validation and database submission.",
    tags: [{ name: "Forms" }, { name: "UI" }, { name: "DB Integration" }],
    hours: 4,
    price: 80,
    completedCount: 212,
  },
  {
    id: "email-integration",
    title: "Email Send Integration",
    description: "Integrate email sending functionality for notifications and user communications.",
    tags: [{ name: "Email" }, { name: "Backend" }, { name: "Transactions" }],
    hours: 3,
    price: 60,
    completedCount: 76,
  },
]

const mediumTasks: Task[] = [
  {
    id: "stripe-checkout",
    title: "Stripe Checkout Integration",
    description: "Implement Stripe payment processing with checkout flow and webhooks.",
    tags: [{ name: "Payments" }, { name: "Stripe" }, { name: "Backend" }],
    hours: 6,
    price: 120,
    completedCount: 54,
  },
  {
    id: "user-profile",
    title: "User Profile Page",
    description: "Create a user profile page with editable fields and avatar upload.",
    tags: [{ name: "Frontend" }, { name: "Forms" }, { name: "Auth" }],
    hours: 5.5,
    price: 110,
    completedCount: 68,
  },
  {
    id: "api-integration",
    title: "API Integration (Xano, etc.)",
    description: "Connect to external APIs and implement data fetching and caching.",
    tags: [{ name: "API" }, { name: "Backend" }, { name: "External Services" }],
    hours: 6,
    price: 120,
    completedCount: 42,
  },
  {
    id: "role-based-access",
    title: "Role-Based Access",
    description: "Implement role-based access control for different user types.",
    tags: [{ name: "Auth" }, { name: "Roles" }, { name: "Permissions" }],
    hours: 6,
    price: 120,
    completedCount: 39,
  },
  {
    id: "search-filters",
    title: "Search & Filters",
    description: "Add search functionality with filters and sorting options.",
    tags: [{ name: "Frontend" }, { name: "Querying" }, { name: "UX" }],
    hours: 6.5,
    price: 130,
    completedCount: 81,
  },
  {
    id: "seo-meta",
    title: "SEO & Meta Tags",
    description: "Optimize site for search engines with proper meta tags and SEO best practices.",
    tags: [{ name: "SEO" }, { name: "Meta" }, { name: "Optimization" }],
    hours: 4.5,
    price: 90,
    completedCount: 63,
  },
]

const advancedTasks: Task[] = [
  {
    id: "openai-integration",
    title: "OpenAI Integration",
    description: "Integrate OpenAI API for AI-powered features and content generation.",
    tags: [{ name: "AI" }, { name: "OpenAI" }, { name: "Backend" }],
    hours: 8,
    price: 160,
    completedCount: 27,
  },
  {
    id: "multi-step-workflow",
    title: "Multi-Step Workflow",
    description: "Build a complex multi-step form with state management and validation.",
    tags: [{ name: "Frontend" }, { name: "Forms" }, { name: "Logic" }],
    hours: 7.5,
    price: 150,
    completedCount: 19,
  },
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Create a data visualization dashboard with charts and filters.",
    tags: [{ name: "Charts" }, { name: "Data" }, { name: "Visualization" }],
    hours: 9,
    price: 180,
    completedCount: 31,
  },
  {
    id: "oauth-login",
    title: "OAuth Login (Google, GitHub)",
    description: "Add social login options with OAuth providers like Google and GitHub.",
    tags: [{ name: "Auth" }, { name: "OAuth" }, { name: "User" }],
    hours: 7,
    price: 140,
    completedCount: 23,
  },
  {
    id: "chat-system",
    title: "Chat/Comment System",
    description: "Implement a real-time chat or comment system with notifications.",
    tags: [{ name: "Realtime" }, { name: "Messaging" }, { name: "UI" }],
    hours: 9.5,
    price: 190,
    completedCount: 15,
  },
  {
    id: "internationalization",
    title: "Internationalization",
    description: "Add multi-language support with translation management.",
    tags: [{ name: "i18n" }, { name: "Multilang" }, { name: "Config" }],
    hours: 6.5,
    price: 130,
    completedCount: 11,
  },
]

const codeReviewTasks: Task[] = [
  {
    id: "code-review",
    title: "Code Review & Feedback",
    description: "Get expert code review with actionable feedback and best practices.",
    tags: [{ name: "Review" }, { name: "Suggestions" }, { name: "GitHub" }],
    hours: 1.5,
    price: 30,
    completedCount: 256,
  },
]

interface AiSuggestedTasksProps {
  projectId?: string
  projectName?: string
}

export function AiSuggestedTasks({ projectId, projectName }: AiSuggestedTasksProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [assignmentOption, setAssignmentOption] = useState("auto-match")
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const handleHireTask = (task: Task) => {
    setSelectedTask(task)
    setSelectedTaskId(task.id)
    setIsDialogOpen(true)
  }

  const handleConfirmHire = () => {
    // In a real implementation, this would call an API to create the task
    console.log("Hiring task:", selectedTask, "Assignment option:", assignmentOption)
    setIsDialogOpen(false)

    // You would typically show a success message or redirect
  }

  // Function to render task cards
  const renderTaskCards = (tasks: Task[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className={`overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col h-full ${
              selectedTaskId === task.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleHireTask(task)}
          >
            <CardContent className="p-4 flex-1 flex flex-col">
              <h3 className="text-base font-semibold mb-1">{task.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs py-0.5">
                    {tag.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs font-medium">{task.hours} hours</span>
                </div>
                <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <CheckCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs font-medium">{task.completedCount}</span>
                </div>
                <div className="flex items-center px-2 py-1 bg-primary/10 rounded-md">
                  <DollarSign className="h-3 w-3 mr-1 text-primary" />
                  <span className="text-xs font-medium text-primary">${task.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  useEffect(() => {
    if (!isDialogOpen) {
      setSelectedTaskId(null)
    }
  }, [isDialogOpen])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-semibold">🧩 Build Faster with Ready-Made Tasks</h2>
      </div>

      {projectName && (
        <div className="text-sm text-muted-foreground mb-4">
          Based on your project <span className="font-medium text-foreground">{projectName}</span>, our AI recommends
          these tasks to help you move forward efficiently.
        </div>
      )}

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="basic" className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>Basic Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="medium" className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Medium Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1.5">
            <BarChart className="h-3.5 w-3.5" />
            <span>Advanced Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="code-review" className="flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5" />
            <span>Code Review</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {renderTaskCards(basicTasks)}
        </TabsContent>

        <TabsContent value="medium" className="space-y-4">
          {renderTaskCards(mediumTasks)}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {renderTaskCards(advancedTasks)}
        </TabsContent>

        <TabsContent value="code-review" className="space-y-4">
          {renderTaskCards(codeReviewTasks)}
        </TabsContent>
      </Tabs>

      {/* Hire Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Hire Developer for Task</DialogTitle>
            <DialogDescription>You're about to hire a developer for the following task:</DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left column - Task details */}
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">{selectedTask.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{selectedTask.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedTask.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs py-0.5">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-3">
                    <div className="flex items-center px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <Clock className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedTask.hours} hours</span>
                    </div>
                    <div className="flex items-center px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <CheckCircle className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedTask.completedCount} delivered</span>
                    </div>
                    <div className="flex items-center px-2.5 py-1.5 bg-primary/10 rounded-md">
                      <DollarSign className="h-4 w-4 mr-1.5 text-primary" />
                      <span className="text-sm font-medium text-primary">${selectedTask.price}</span>
                    </div>
                  </div>
                </div>

                {/* Right column - Additional info */}
                <div className="space-y-4">
                  {/* Three steps to complete the task */}
                  <div className="border rounded-md p-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1.5 text-primary" />
                      Three steps to complete this task
                    </h4>
                    <ol className="space-y-2 pl-5 list-decimal text-sm text-muted-foreground">
                      <li>Submit your task requirements and any specific details</li>
                      <li>Review and approve the developer's work plan</li>
                      <li>Receive completed work and provide feedback</li>
                    </ol>
                  </div>

                  {/* What you'll get section */}
                  <div className="border rounded-md p-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-1.5 text-primary" />
                      What you'll get
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a complete, production-ready implementation of {selectedTask.title.toLowerCase()}
                      with clean, well-documented code. The developer will provide all necessary files, documentation,
                      and instructions for integration into your project.
                    </p>
                  </div>
                </div>
              </div>

              {/* Assignment options - Full width */}
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">How would you like to assign this task?</h4>
                <RadioGroup
                  value={assignmentOption}
                  onValueChange={setAssignmentOption}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                  <div className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <RadioGroupItem value="auto-match" id="auto-match" />
                    <div className="grid gap-1">
                      <Label htmlFor="auto-match" className="font-medium">
                        Auto-match with best developer
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Our AI will match you with the best available developer for this task.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 p-2 rounded-md hover:bg-muted/50">
                    <RadioGroupItem value="select-developer" id="select-developer" />
                    <div className="grid gap-1">
                      <Label htmlFor="select-developer" className="font-medium">
                        Select a specific developer
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Choose from your preferred developers or browse available experts.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row justify-between items-center gap-2 border-t pt-4">
            <div className="text-sm font-medium">Total: ${selectedTask?.price || 0}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmHire}>Confirm & Hire</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
