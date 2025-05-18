"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, DollarSign, Star, Calendar, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeveloperDashboard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [earnings, setEarnings] = useState<any>({
    thisMonth: 0,
    pending: 0,
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Load tasks from localStorage or use mock data
      const storedTasks = localStorage.getItem("developerTasks")
      const tasksData = storedTasks
        ? JSON.parse(storedTasks)
        : [
            {
              id: "task-1",
              title: "Design User Dashboard",
              description: "Create wireframes and high-fidelity designs for the main user dashboard",
              status: "In Progress",
              priority: "High",
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              project: { name: "E-commerce Platform" },
              progress: 65,
            },
            {
              id: "task-2",
              title: "Implement Authentication Flow",
              description: "Set up user authentication with email verification and social login options",
              status: "In Progress",
              priority: "High",
              due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
              project: { name: "E-commerce Platform" },
              progress: 30,
            },
          ]

      // Add progress to tasks if not present
      const tasksWithProgress = tasksData.map((task) => ({
        ...task,
        progress: task.progress || Math.floor(Math.random() * 80) + 10,
      }))

      setTasks(tasksWithProgress)

      // Set mock earnings data
      setEarnings({
        thisMonth: 1250,
        pending: 450,
        total: 5750,
      })

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Calculate days remaining
  const getDaysRemaining = (dateString) => {
    const dueDate = new Date(dateString)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
      case "In Progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>
      case "Open":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            {priority}
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            {priority}
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            {priority}
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your tasks and earnings.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => router.push("/dashboard/developer/available-tasks")}>Find New Tasks</Button>
        </div>
      </div>

      {/* Quiz Screening Card */}
      <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Developer Screening Required</CardTitle>
          </div>
          <CardDescription>Complete the screening quiz to unlock task applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Estimated time: 5 minutes</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Before you can apply for tasks, you need to complete a short screening quiz to verify your development
              knowledge. The quiz consists of 10 multiple-choice questions.
            </p>
            <Button className="w-full sm:w-auto" onClick={() => router.push("/developer-screening/quiz")}>
              Start Screening Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Earnings This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">${earnings.thisMonth.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">${earnings.pending.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">${earnings.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Tasks */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Tasks</CardTitle>
          <CardDescription>Your active tasks and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-muted animate-pulse h-24 rounded-md" />
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/task/${task.id}/collaborate`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <div className="flex items-start gap-2 mb-2 md:mb-0">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.project.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  <div className="flex flex-wrap items-center justify-between mt-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Due {formatDate(task.due_date)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{getDaysRemaining(task.due_date)} days remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have any active tasks.</p>
              <Button className="mt-4" onClick={() => router.push("/dashboard/developer/available-tasks")}>
                Find Tasks
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Clients</CardTitle>
          <CardDescription>Clients you've worked with recently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-muted animate-pulse h-16 rounded-md" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <Avatar>
                      <AvatarImage src="/abstract-tech-logo.png" />
                      <AvatarFallback>TC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">TechCorp Inc.</p>
                      <p className="text-sm text-muted-foreground">E-commerce Platform</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                            fill={i < 4 ? "currentColor" : "none"}
                          />
                        ))}
                    </div>
                    <span className="text-sm font-medium">4.0</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <Avatar>
                      <AvatarImage src="/abstract-finance-growth.png" />
                      <AvatarFallback>FC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">FinEdge Solutions</p>
                      <p className="text-sm text-muted-foreground">Mobile Banking App</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`}
                            fill={i < 5 ? "currentColor" : "none"}
                          />
                        ))}
                    </div>
                    <span className="text-sm font-medium">5.0</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 hover:bg-slate-50 rounded-md transition-colors">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <Avatar>
                      <AvatarImage src="/interconnected-health.png" />
                      <AvatarFallback>HC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">HealthTrack</p>
                      <p className="text-sm text-muted-foreground">Fitness Tracking App</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4.5 ? "text-yellow-400" : "text-gray-300"}`}
                            fill={i < 4.5 ? "currentColor" : "none"}
                          />
                        ))}
                    </div>
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
