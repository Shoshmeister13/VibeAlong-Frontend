"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Monitor,
  Smartphone,
  Tablet,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  ArrowLeft,
  Rocket,
  CheckCircle2,
} from "lucide-react"

// Mock data for project
const mockProject = {
  projectName: "My AI Website",
  platform: "v0",
  description:
    "I'm building a website that uses AI to help users find the perfect recipes based on ingredients they have at home.",
  stage: "mid_build",
}

// Mock data for tasks
const mockTasks = [
  {
    title: "Add login with Supabase",
    description:
      "I need help implementing user authentication using Supabase in my app so users can save their favorite recipes.",
    priority: "high",
    timeEstimate: "3",
    budget: "$150",
  },
  {
    title: "Create recipe search API",
    description: "Need to build an API that takes ingredients as input and returns matching recipes from a database.",
    priority: "medium",
    timeEstimate: "5",
    budget: "$250",
  },
  {
    title: "Mobile responsive design",
    description: "Make sure the website looks good on mobile devices and tablets.",
    priority: "low",
    timeEstimate: "2",
    budget: "$100",
  },
]

export default function Showcase() {
  const router = useRouter()
  const [activeView, setActiveView] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [activePage, setActivePage] = useState<"create-project" | "submit-tasks" | "project-summary">("create-project")
  const [feedback, setFeedback] = useState<Record<string, string>>({
    "create-project": "",
    "submit-tasks": "",
    "project-summary": "",
  })
  const [ratings, setRatings] = useState<Record<string, boolean | null>>({
    "create-project": null,
    "submit-tasks": null,
    "project-summary": null,
  })

  const handleFeedbackChange = (page: string, value: string) => {
    setFeedback((prev) => ({
      ...prev,
      [page]: value,
    }))
  }

  const handleRating = (page: string, isPositive: boolean) => {
    setRatings((prev) => ({
      ...prev,
      [page]: isPositive,
    }))
  }

  const getViewportClass = () => {
    switch (activeView) {
      case "mobile":
        return "max-w-[375px]"
      case "tablet":
        return "max-w-[768px]"
      default:
        return "max-w-[1200px]"
    }
  }

  const getPageTitle = (page: string) => {
    switch (page) {
      case "create-project":
        return "Create Project"
      case "submit-tasks":
        return "Submit Tasks"
      case "project-summary":
        return "Project Summary"
      default:
        return page
    }
  }

  const navigateToPage = (direction: "next" | "prev") => {
    const pages = ["create-project", "submit-tasks", "project-summary"]
    const currentIndex = pages.indexOf(activePage)

    if (direction === "next" && currentIndex < pages.length - 1) {
      setActivePage(pages[currentIndex + 1] as any)
    } else if (direction === "prev" && currentIndex > 0) {
      setActivePage(pages[currentIndex - 1] as any)
    }
  }

  const renderCreateProjectPage = () => (
    <div className="p-6 bg-white rounded-lg border">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Let's Set Up Your Project</h1>
        <p className="text-muted-foreground">This helps us understand what kind of help you need.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Project Details
          </CardTitle>
          <CardDescription>
            Tell us about what you're building so we can match you with the perfect developer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                placeholder="My Awesome App"
                value={mockProject.projectName}
                readOnly
              />
              <p className="text-sm text-muted-foreground mt-1.5">What are you calling your project?</p>
            </div>

            <div>
              <label className="text-sm font-medium">Platform</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                value={mockProject.platform}
                readOnly
              >
                <option value="v0">V0</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1.5">Which AI platform are you building with?</p>
            </div>

            <div>
              <label className="text-sm font-medium">What are you building?</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                placeholder="I'm creating a website that helps people find the perfect pet..."
                value={mockProject.description}
                readOnly
              />
              <p className="text-sm text-muted-foreground mt-1.5">
                A brief description of your project and its purpose.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Current Stage</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                value={mockProject.stage}
                readOnly
              >
                <option value="mid_build">Mid-build</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1.5">How far along are you in your project?</p>
            </div>

            <div className="pt-4">
              <Button className="w-full">
                Continue to Tasks <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSubmitTasksPage = () => (
    <div className="p-6 bg-white rounded-lg border">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Add Your Vibe Tasks</h1>
        <p className="text-muted-foreground">Break down what you'd like a developer to help with.</p>
      </div>

      <div className="mb-8">
        <Card className="bg-muted/40">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{mockProject.projectName}</h3>
                <p className="text-sm text-muted-foreground">
                  {mockProject.platform} • {mockProject.stage.replace("_", " ")}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Edit Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add a New Task</CardTitle>
          <CardDescription>What specific things do you need help with? Add as many tasks as you need.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task Title</label>
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                placeholder="Add login with Supabase"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Task Description</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                placeholder="I need help implementing user authentication using Supabase in my app..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5">
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Time Estimate (hours)</label>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                  placeholder="2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Budget (optional)</label>
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1.5"
                  placeholder="$100"
                />
              </div>
            </div>

            <Button className="w-full mt-4">+ Add Task</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Tasks ({mockTasks.length})</CardTitle>
          <CardDescription>Review your tasks before continuing to the summary.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTasks.map((task, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium flex items-center">
                      {task.title}
                      <Badge
                        variant={
                          task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "outline"
                        }
                        className={`ml-2 ${task.priority === "medium" ? "bg-orange-500" : ""}`}
                      >
                        {task.priority}
                      </Badge>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
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
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </Button>
                </div>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {task.timeEstimate} hours
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    {task.budget}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Preview My Tasks <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )

  const renderProjectSummaryPage = () => (
    <div className="p-6 bg-white rounded-lg border">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your Project Is Ready for Developers</h1>
        <p className="text-muted-foreground">Review your project details and tasks before submitting.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Project Details
            </CardTitle>
            <Button variant="outline" size="sm">
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
                className="mr-2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{mockProject.projectName}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">
                  {mockProject.platform.charAt(0).toUpperCase() + mockProject.platform.slice(1)}
                </Badge>
                <Badge variant="outline">{mockProject.stage.replace("_", " ")}</Badge>
              </div>
            </div>

            <hr className="my-2" />

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Project Description</h4>
              <p>{mockProject.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Tasks ({mockTasks.length})</CardTitle>
            <Button variant="outline" size="sm">
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
                className="mr-2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Tasks
            </Button>
          </div>
          <CardDescription>These are the tasks you've created for developers to work on.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTasks.map((task, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "outline"
                    }
                    className={task.priority === "medium" ? "bg-orange-500" : ""}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </Badge>
                </div>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {task.timeEstimate} hours
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    {task.budget}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border p-4 mb-8">
        <div className="flex gap-2 items-start">
          <Rocket className="h-4 w-4 mt-0.5" />
          <div>
            <h3 className="font-medium">Ready to find your developer?</h3>
            <p className="text-sm text-muted-foreground">
              Once submitted, our team will review your project and match you with the perfect developer for your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
        <Button className="flex-1">
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
            className="mr-2"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Submit Project for Matching
        </Button>
      </div>
    </div>
  )

  const renderSuccessPage = () => (
    <div className="p-6 bg-white rounded-lg border">
      <Card>
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Project Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your project has been submitted and our team will match you with the perfect developer soon.
          </p>
          <Button>Return to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderPageContent = () => {
    switch (activePage) {
      case "create-project":
        return renderCreateProjectPage()
      case "submit-tasks":
        return renderSubmitTasksPage()
      case "project-summary":
        return renderProjectSummaryPage()
      default:
        return null
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Vibe-Coder Project Flow Showcase</h1>
        <p className="text-muted-foreground">Review and provide feedback on the multi-step flow for Vibe-Coders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Page Preview: {getPageTitle(activePage)}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={activeView === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView("desktop")}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeView === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView("tablet")}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeView === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveView("mobile")}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 border-b p-2 flex justify-between items-center">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-500 bg-white rounded px-2 py-1 flex-1 mx-4 text-center">
                    vibealong.com/{activePage}
                  </div>
                  <div className="w-4"></div>
                </div>
                <div
                  className={`overflow-auto transition-all duration-300 ${getViewportClass()}`}
                  style={{ maxHeight: "600px" }}
                >
                  {renderPageContent()}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigateToPage("prev")}
                disabled={activePage === "create-project"}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Page
              </Button>
              <Button onClick={() => navigateToPage("next")} disabled={activePage === "project-summary"}>
                Next Page <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Button
              variant={activePage === "create-project" ? "default" : "outline"}
              className="justify-start"
              onClick={() => setActivePage("create-project")}
            >
              1. Create Project
            </Button>
            <Button
              variant={activePage === "submit-tasks" ? "default" : "outline"}
              className="justify-start"
              onClick={() => setActivePage("submit-tasks")}
            >
              2. Submit Tasks
            </Button>
            <Button
              variant={activePage === "project-summary" ? "default" : "outline"}
              className="justify-start"
              onClick={() => setActivePage("project-summary")}
            >
              3. Project Summary
            </Button>
          </div>

          <Button variant="outline" className="w-full mb-6" onClick={() => router.push("/create-project")}>
            View Live Pages
          </Button>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Feedback
              </CardTitle>
              <CardDescription>
                Provide your comments and feedback on the {getPageTitle(activePage)} page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Your Comments</label>
                  <Textarea
                    placeholder="Share your thoughts on this page..."
                    className="min-h-[120px] mt-1.5"
                    value={feedback[activePage]}
                    onChange={(e) => handleFeedbackChange(activePage, e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Rate this page</label>
                  <div className="flex gap-2">
                    <Button
                      variant={ratings[activePage] === true ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRating(activePage, true)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" /> Like
                    </Button>
                    <Button
                      variant={ratings[activePage] === false ? "destructive" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => handleRating(activePage, false)}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" /> Needs Work
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Page Navigation</CardTitle>
              <CardDescription>
                The multi-step flow consists of three pages that guide Vibe-Coders through the process of creating a
                project and getting matched with developers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create-project" onValueChange={(value) => setActivePage(value as any)}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="create-project">1</TabsTrigger>
                  <TabsTrigger value="submit-tasks">2</TabsTrigger>
                  <TabsTrigger value="project-summary">3</TabsTrigger>
                </TabsList>
                <TabsContent value="create-project" className="pt-4">
                  <h3 className="font-medium mb-1">Create Project</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Users enter basic project information including name, platform, description, and current stage.
                  </p>
                  <Badge
                    variant={
                      ratings["create-project"] === true
                        ? "default"
                        : ratings["create-project"] === false
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {ratings["create-project"] === true
                      ? "Approved"
                      : ratings["create-project"] === false
                        ? "Needs Work"
                        : "Not Rated"}
                  </Badge>
                </TabsContent>
                <TabsContent value="submit-tasks" className="pt-4">
                  <h3 className="font-medium mb-1">Submit Tasks</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Users add individual tasks with details like title, description, priority, time estimate, and
                    budget.
                  </p>
                  <Badge
                    variant={
                      ratings["submit-tasks"] === true
                        ? "default"
                        : ratings["submit-tasks"] === false
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {ratings["submit-tasks"] === true
                      ? "Approved"
                      : ratings["submit-tasks"] === false
                        ? "Needs Work"
                        : "Not Rated"}
                  </Badge>
                </TabsContent>
                <TabsContent value="project-summary" className="pt-4">
                  <h3 className="font-medium mb-1">Project Summary</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Users review all project details and tasks before submitting for developer matching.
                  </p>
                  <Badge
                    variant={
                      ratings["project-summary"] === true
                        ? "default"
                        : ratings["project-summary"] === false
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {ratings["project-summary"] === true
                      ? "Approved"
                      : ratings["project-summary"] === false
                        ? "Needs Work"
                        : "Not Rated"}
                  </Badge>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
