"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowLeft, Clock, DollarSign, Rocket, Edit, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ProjectSummary() {
  const router = useRouter()
  const [projectData, setProjectData] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Load project data from localStorage
    const savedProject = localStorage.getItem("vibeProject")
    if (savedProject) {
      setProjectData(JSON.parse(savedProject))
    } else {
      // If no project data, redirect back to create project
      router.push("/create-project")
    }

    // Load tasks
    const savedTasks = localStorage.getItem("vibeTasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // If no tasks, redirect back to submit tasks
      router.push("/submit-tasks")
    }
  }, [router])

  function getStageLabel(stage: string) {
    switch (stage) {
      case "just_starting":
        return "Just starting"
      case "mid_build":
        return "Mid-build"
      case "already_launched":
        return "Already launched"
      default:
        return stage
    }
  }

  function getPlatformLabel(platform: string) {
    return platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  function handleSubmit() {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // In a real implementation, you would send the data to your backend here
      // and handle the response accordingly
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="container max-w-3xl py-10">
        <Card>
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Project Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your project has been submitted and our team will match you with the perfect developer soon.
            </p>
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your Project Is Ready for Developers</h1>
        <p className="text-muted-foreground">Review your project details and tasks before submitting.</p>
      </div>

      {projectData && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Project Details
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push("/create-project")}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{projectData.projectName}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{getPlatformLabel(projectData.platform)}</Badge>
                  <Badge variant="outline">{getStageLabel(projectData.stage)}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Project Description</h4>
                <p>{projectData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Tasks ({tasks.length})</CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push("/submit-tasks")}>
              <Edit className="h-4 w-4 mr-2" /> Edit Tasks
            </Button>
          </div>
          <CardDescription>These are the tasks you've created for developers to work on.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task, index) => (
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
      </Card>

      <Alert className="mb-8">
        <Rocket className="h-4 w-4" />
        <AlertTitle>Ready to find your developer?</AlertTitle>
        <AlertDescription>
          Once submitted, our team will review your project and match you with the perfect developer for your needs.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.push("/submit-tasks")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
        </Button>
        <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>Submitting...</>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" /> Submit Project for Matching
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
