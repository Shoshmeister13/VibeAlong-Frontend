"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, ArrowRight, Trash2, Clock, DollarSign, Sparkles, Loader2, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { createProject, createTask } from "@/app/actions/project-actions"

type Task = {
  id: string
  title: string
  description: string
  priority: string
  timeEstimate: string
  budget: string
}

export default function SubmitTasks() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [projectData, setProjectData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectCreationAttempted, setProjectCreationAttempted] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium") // Default priority
  const [timeEstimate, setTimeEstimate] = useState("2") // Default time estimate
  const [budget, setBudget] = useState("")

  // Form errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  })

  // AI enhancement states
  const [enhancingTitle, setEnhancingTitle] = useState(false)
  const [enhancingDescription, setEnhancingDescription] = useState(false)

  // AI estimation state
  const [showEstimates, setShowEstimates] = useState(false)

  useEffect(() => {
    // Load project data from localStorage
    const savedProject = localStorage.getItem("vibeProject")
    if (savedProject) {
      const parsedProject = JSON.parse(savedProject)
      setProjectData(parsedProject)

      // If we don't have a project ID yet, create the project in Supabase
      if (!parsedProject.id && !projectCreationAttempted) {
        createProjectInSupabase(parsedProject)
      } else if (parsedProject.id) {
        setProjectId(parsedProject.id)
      }
    } else {
      // If no project data, redirect back to create project
      router.push("/create-project")
    }

    // Load any saved tasks
    const savedTasks = localStorage.getItem("vibeTasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [router, projectCreationAttempted])

  // Create project in Supabase
  const createProjectInSupabase = async (project: any) => {
    setIsLoading(true)
    setProjectCreationAttempted(true)

    try {
      console.log("Creating project:", project)

      const result = await createProject({
        projectName: project.projectName,
        platform: project.platform,
        stage: project.stage,
        description: project.description || "",
      })

      console.log("Project creation result:", result)

      if (result.success && result.projectId) {
        // Update the project data with the ID from Supabase
        const updatedProject = { ...project, id: result.projectId }
        setProjectData(updatedProject)
        setProjectId(result.projectId)
        localStorage.setItem("vibeProject", JSON.stringify(updatedProject))

        toast({
          title: "Project saved",
          description: "Your project has been saved to your account.",
        })
      } else {
        console.error("Error creating project:", result)
        toast({
          title: "Error",
          description: result.message || "Failed to save project. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to save project:", error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Check if we should show estimates
  useEffect(() => {
    if (title.length >= 5 && description.length >= 20) {
      setShowEstimates(true)
    } else {
      setShowEstimates(false)
    }
  }, [title, description])

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
    }

    let isValid = true

    if (!title || title.length < 2) {
      newErrors.title = "Task title must be at least 2 characters."
      isValid = false
    }

    if (!description || description.length < 10) {
      newErrors.description = "Description must be at least 10 characters."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const addTask = async () => {
    if (!validateForm()) return
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project must be saved before adding tasks. Please try refreshing the page.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      priority: priority,
      timeEstimate: timeEstimate,
      budget: budget,
    }

    try {
      console.log("Creating task:", {
        title,
        description,
        priority,
        timeEstimate,
        budget,
        projectId,
      })

      // Save task to Supabase
      const result = await createTask({
        title,
        description,
        priority,
        timeEstimate,
        budget,
        projectId,
      })

      console.log("Task creation result:", result)

      if (result.success) {
        // Update local state
        const updatedTasks = [...tasks, { ...newTask, id: result.taskId }]
        setTasks(updatedTasks)
        localStorage.setItem("vibeTasks", JSON.stringify(updatedTasks))

        // Reset form
        setTitle("")
        setDescription("")

        toast({
          title: "Task added",
          description: "Your task has been added successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to add task",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to add task:", error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    localStorage.setItem("vibeTasks", JSON.stringify(updatedTasks))

    toast({
      title: "Task removed",
      description: "Your task has been removed.",
    })
  }

  const onContinue = () => {
    router.push("/dashboard/vibe-coder")
  }

  const enhanceTitle = () => {
    setEnhancingTitle(true)

    // Simulate AI enhancement with a timeout
    setTimeout(() => {
      const projectType = projectData?.platform || "web application"
      const enhancedTitles = [
        `Implement responsive ${projectType} authentication system`,
        `Create user-friendly ${projectType} onboarding flow`,
        `Develop secure API integration for ${projectType}`,
        `Design and build interactive dashboard for ${projectType}`,
        `Optimize ${projectType} performance and loading speed`,
      ]

      setTitle(enhancedTitles[Math.floor(Math.random() * enhancedTitles.length)])
      setEnhancingTitle(false)

      toast({
        title: "Title enhanced",
        description: "Your task title has been improved by AI.",
      })
    }, 1500)
  }

  const enhanceDescription = () => {
    setEnhancingDescription(true)

    // Simulate AI enhancement with a timeout
    setTimeout(() => {
      const projectType = projectData?.platform || "web application"
      const taskType = title || "feature"

      const enhancedDescription = `This task involves implementing a robust ${taskType.toLowerCase()} for our ${projectType}. The implementation should follow industry best practices and ensure compatibility across all major platforms. Key requirements include:

1. Clean, maintainable code with proper documentation
2. Responsive design that works on mobile and desktop
3. Comprehensive error handling and user feedback
4. Integration with existing systems and APIs
5. Performance optimization to ensure fast load times`

      setDescription(enhancedDescription)
      setEnhancingDescription(false)

      toast({
        title: "Description enhanced",
        description: "Your task description has been improved by AI.",
      })
    }, 2000)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="ml-2">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="default" className="ml-2 bg-orange-500">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="ml-2">
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Add Your Vibe Tasks</h1>
        <p className="text-muted-foreground">Break down what you'd like a developer to help with.</p>
      </div>

      {projectData && (
        <div className="mb-8">
          <Card className="bg-muted/40">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{projectData.projectName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {projectData.platform} • {projectData.stage?.replace("_", " ")}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push("/create-project")}>
                  Edit Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add a New Task</CardTitle>
          <CardDescription>What specific things do you need help with? Add as many tasks as you need.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Task Title
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={enhanceTitle}
                  disabled={enhancingTitle}
                  className="h-8 px-2 text-xs"
                >
                  {enhancingTitle ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-1 h-3 w-3" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              </div>
              <Input
                id="title"
                placeholder="Add login with Supabase"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Task Description
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={enhanceDescription}
                  disabled={enhancingDescription}
                  className="h-8 px-2 text-xs"
                >
                  {enhancingDescription ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-1 h-3 w-3" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="description"
                placeholder="I need help implementing user authentication using Supabase in my app..."
                className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="space-y-4">
              {!showEstimates ? (
                <div className="p-4 border border-dashed rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">VibeAlong AI</Badge>
                    <h4 className="font-medium">Task Estimates</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete your task title and add a detailed description to receive AI-generated estimates from
                    certified VibeAlong developers.
                  </p>
                </div>
              ) : (
                <div className="p-4 border rounded-lg bg-blue-50 animate-fadeIn">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      VibeAlong AI
                    </Badge>
                    <h4 className="font-medium">Task Estimates</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our AI analyzes your task details to provide accurate estimates from certified VibeAlong developers:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Clock className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Estimated Timeline</h5>
                        <p className="text-lg font-bold">4-6 hours</p>
                        <p className="text-xs text-muted-foreground">Based on task complexity</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <DollarSign className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">Estimated Price</h5>
                        <p className="text-lg font-bold">$200-$300</p>
                        <p className="text-xs text-muted-foreground">By certified VibeAlong developers</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-green-100">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Estimates are automatically updated as you modify your task details
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={addTask} className="w-full mt-4" disabled={isLoading || !projectId}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : !projectId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {tasks.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Tasks ({tasks.length})</CardTitle>
            <CardDescription>Review your tasks before continuing to the summary.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {task.title}
                        {getPriorityBadge(task.priority)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask(task.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.timeEstimate} hours
                    </div>
                    {task.budget && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {task.budget}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={onContinue} className="w-full">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {tasks.length === 0 && (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No tasks added yet. Add your first task above!</p>
        </div>
      )}
    </div>
  )
}
