"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, DollarSign, ArrowRight, Calendar, CheckCircle, XCircle, Clock3 } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for applications
// In a real app, this would come from your API/database
const mockApplications = [
  {
    id: "app-1",
    taskId: "task-1",
    title: "Build a responsive landing page",
    description: "Create a modern, responsive landing page with animations and contact form",
    status: "pending",
    appliedAt: "2023-11-15T10:30:00Z",
    estimatedHours: 4,
    budget: 80,
    priority: "medium",
    stack: ["React", "Tailwind CSS"],
  },
  {
    id: "app-2",
    taskId: "task-2",
    title: "Fix authentication bug in React app",
    description: "Debug and fix issues with user authentication flow in a React application",
    status: "accepted",
    appliedAt: "2023-11-12T14:20:00Z",
    estimatedHours: 2,
    budget: 40,
    priority: "high",
    stack: ["React", "Firebase"],
  },
  {
    id: "app-3",
    taskId: "task-3",
    title: "Implement dark mode toggle",
    description: "Add dark mode functionality to an existing Next.js application",
    status: "rejected",
    appliedAt: "2023-11-10T09:15:00Z",
    estimatedHours: 3,
    budget: 60,
    priority: "low",
    stack: ["Next.js", "Tailwind CSS"],
    rejectionReason: "Client found another developer with more experience in this area",
  },
]

type Application = (typeof mockApplications)[0]

export function MyApplications() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch from your API
    const fetchApplications = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setApplications(mockApplications)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock3 className="h-3 w-3" />
            <span>Pending review</span>
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="default" className="bg-green-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Accepted</span>
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

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

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">You haven't applied to any tasks yet.</p>
        <Button onClick={() => router.push("/dashboard/developer/tasks")}>Browse Available Tasks</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{application.title}</CardTitle>
              {getStatusBadge(application.status)}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Applied: {formatDate(application.appliedAt)}
              </span>
              {getPriorityBadge(application.priority)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{application.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {application.stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="bg-secondary/50">
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {application.estimatedHours} hours
              </div>
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />${application.budget}
              </div>

              {application.status === "accepted" && (
                <Button size="sm" className="ml-auto">
                  Start Work
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}

              {application.status === "pending" && (
                <Button variant="outline" size="sm" className="ml-auto">
                  View Details
                </Button>
              )}

              {application.status === "rejected" && application.rejectionReason && (
                <div className="w-full mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Reason:</span> {application.rejectionReason}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
