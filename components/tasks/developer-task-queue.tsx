"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Clock, Zap, AlertCircle, CheckCircle2, Calendar, DollarSign } from "lucide-react"
import { vibePlatforms } from "@/components/vibe-platform-logos"

// Mock task data
const mockTasks = [
  {
    id: "task1",
    title: "Fix authentication bug in login form",
    description:
      "Users are unable to log in with correct credentials. Need to debug the authentication flow and fix the issue.",
    platform: "v0",
    projectUrl: "https://v0.dev/project/abc123",
    urgency: "high",
    taskType: "bug",
    estimatedTime: 2,
    estimatedCost: 50,
    complexity: "medium",
    requiredSkills: ["React", "Authentication", "API"],
    submittedAt: "2023-11-15T10:30:00Z",
    submittedBy: {
      id: "user1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "task2",
    title: "Implement responsive design for landing page",
    description:
      "The landing page doesn't look good on mobile devices. Need to implement responsive design to ensure it works well on all screen sizes.",
    platform: "loveable",
    projectUrl: "https://loveable.ai/projects/xyz789",
    urgency: "medium",
    taskType: "feature",
    estimatedTime: 3,
    estimatedCost: 75,
    complexity: "medium",
    requiredSkills: ["CSS", "Responsive Design", "Tailwind"],
    submittedAt: "2023-11-15T09:15:00Z",
    submittedBy: {
      id: "user2",
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "task3",
    title: "Optimize database queries for better performance",
    description: "The application is slow when loading data. Need to optimize database queries to improve performance.",
    platform: "replit",
    projectUrl: "https://replit.com/@username/project-name",
    urgency: "low",
    taskType: "optimization",
    estimatedTime: 4,
    estimatedCost: 100,
    complexity: "high",
    requiredSkills: ["SQL", "Database Optimization", "Backend"],
    submittedAt: "2023-11-14T16:45:00Z",
    submittedBy: {
      id: "user3",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

// Mock booking data
const mockBookings = [
  {
    id: "booking1",
    sessionLength: 3,
    preferredDate: "2023-11-20",
    preferredTime: "10:00",
    taskDescription: "Need help implementing a payment gateway integration with Stripe.",
    platform: "v0",
    projectUrl: "https://v0.dev/project/def456",
    skillsRequired: ["API Integration", "Payment Processing", "Security"],
    estimatedCost: 150,
    status: "pending",
    submittedBy: {
      id: "user4",
      name: "Emily Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "booking2",
    sessionLength: 6,
    preferredDate: "2023-11-22",
    preferredTime: "13:00",
    taskDescription: "Need to refactor the entire codebase to use TypeScript and improve code quality.",
    platform: "loveable",
    projectUrl: "https://loveable.ai/projects/pqr456",
    skillsRequired: ["TypeScript", "Refactoring", "Code Quality"],
    estimatedCost: 300,
    status: "pending",
    submittedBy: {
      id: "user5",
      name: "David Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export function DeveloperTaskQueue() {
  const [activeTab, setActiveTab] = React.useState("available")
  const [isAccepting, setIsAccepting] = React.useState<string | null>(null)

  const handleAcceptTask = async (taskId: string) => {
    setIsAccepting(taskId)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Task accepted",
        description: "You've successfully accepted this task. You can now start working on it.",
      })

      // In a real app, we would update the task status and move it to "my-tasks"
      setActiveTab("my-tasks")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAccepting(null)
    }
  }

  const handleAcceptBooking = async (bookingId: string) => {
    setIsAccepting(bookingId)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Booking accepted",
        description: "You've successfully accepted this booking. It has been added to your schedule.",
      })

      // In a real app, we would update the booking status and move it to "my-bookings"
      setActiveTab("my-bookings")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAccepting(null)
    }
  }

  const getPlatformLogo = (platformId: string) => {
    const platform = vibePlatforms.find((p) => p.id === platformId)
    return platform ? platform.logo : null
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case "bug":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "feature":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      case "optimization":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
      case "security":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="available">Available Tasks</TabsTrigger>
        <TabsTrigger value="bookings">Available Bookings</TabsTrigger>
        <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
        <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
      </TabsList>

      <TabsContent value="available" className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Available Tasks</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
              <option value="newest">Newest</option>
              <option value="urgency">Urgency</option>
              <option value="cost">Highest Paying</option>
            </select>
          </div>
        </div>

        {mockTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No available tasks</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All tasks have been claimed. Check back soon for new tasks.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTasks.map((task) => (
              <Card key={task.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6">{getPlatformLogo(task.platform)}</div>
                      <Badge variant="outline" className={getTaskTypeColor(task.taskType)}>
                        {task.taskType.charAt(0).toUpperCase() + task.taskType.slice(1)}
                      </Badge>
                    </div>
                    <Badge variant="outline" className={getUrgencyColor(task.urgency)}>
                      {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)} Priority
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{task.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col items-center justify-center rounded-md border p-2">
                      <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Time</span>
                      <span className="font-medium">{task.estimatedTime}h</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-md border p-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Pay</span>
                      <span className="font-medium">${task.estimatedCost}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-md border p-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Level</span>
                      <span className="font-medium capitalize">{task.complexity}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {task.requiredSkills.map((skill) => (
                      <span key={skill} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.submittedBy.avatar || "/placeholder.svg"} alt={task.submittedBy.name} />
                      <AvatarFallback>{task.submittedBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Submitted by {task.submittedBy.name}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleAcceptTask(task.id)}
                    disabled={isAccepting === task.id}
                  >
                    {isAccepting === task.id ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Accepting...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Accept Task
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="bookings" className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Available Bookings</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
              <option value="date">Soonest Date</option>
              <option value="duration">Duration</option>
              <option value="cost">Highest Paying</option>
            </select>
          </div>
        </div>

        {mockBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No available bookings</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no booking requests at the moment. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {mockBookings.map((booking) => (
              <Card key={booking.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6">{getPlatformLogo(booking.platform)}</div>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                        {booking.sessionLength} Hour Session
                      </Badge>
                    </div>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                      ${booking.estimatedCost}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">
                    Session on {booking.preferredDate} at {booking.preferredTime}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{booking.taskDescription}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {booking.skillsRequired.map((skill) => (
                        <span key={skill} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={booking.submittedBy.avatar || "/placeholder.svg"}
                        alt={booking.submittedBy.name}
                      />
                      <AvatarFallback>{booking.submittedBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Requested by {booking.submittedBy.name}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleAcceptBooking(booking.id)}
                    disabled={isAccepting === booking.id}
                  >
                    {isAccepting === booking.id ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Accepting...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Accept Booking
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="my-tasks" className="space-y-4 mt-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No active tasks</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't accepted any tasks yet. Browse available tasks to get started.
          </p>
          <Button className="mt-4" onClick={() => setActiveTab("available")}>
            Browse Available Tasks
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="my-bookings" className="space-y-4 mt-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't accepted any bookings yet. Browse available bookings to get started.
          </p>
          <Button className="mt-4" onClick={() => setActiveTab("bookings")}>
            Browse Available Bookings
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
