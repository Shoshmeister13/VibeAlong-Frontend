"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Tag, DollarSign, Clock, CheckCircle2, XCircle, Clock4, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [filteredApplications, setFilteredApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  useEffect(() => {
    // Simulate loading data
    const loadApplications = async () => {
      setIsLoading(true)
      try {
        // Try to get applications from localStorage (for demo purposes)
        const storedApplications = localStorage.getItem("developerApplications")
        if (storedApplications) {
          const parsedApplications = JSON.parse(storedApplications)
          setApplications(parsedApplications)
          setFilteredApplications(parsedApplications)
        } else {
          // Fallback to default applications
          const defaultApplications = [
            {
              id: "app-1",
              task_id: "task-101",
              task_title: "User Authentication System",
              project_name: "E-commerce Platform",
              applied_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              status: "Accepted",
              budget: 300,
              estimated_hours: 10,
            },
            {
              id: "app-2",
              task_id: "task-102",
              task_title: "Product Filtering Component",
              project_name: "E-commerce Platform",
              applied_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              status: "Pending",
              budget: 180,
              estimated_hours: 6,
            },
            {
              id: "app-3",
              task_id: "task-103",
              task_title: "Admin Dashboard Analytics",
              project_name: "Mobile Banking App",
              applied_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              status: "Declined",
              budget: 250,
              estimated_hours: 8,
              feedback: "Selected a developer with more experience in data visualization.",
            },
          ]
          setApplications(defaultApplications)
          setFilteredApplications(defaultApplications)
        }
      } catch (error) {
        console.error("Error loading applications:", error)
      } finally {
        // Simulate network delay
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
    }

    loadApplications()
  }, [])

  useEffect(() => {
    // Filter applications based on search query and active tab
    let filtered = applications

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.task_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.project_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((app) => app.status.toLowerCase() === activeTab.toLowerCase())
    }

    setFilteredApplications(filtered)
  }, [searchQuery, activeTab, applications])

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return (
          <Badge className="bg-green-500 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Accepted
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
            <Clock4 className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "declined":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Declined
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Applications</h1>
        </div>

        <Skeleton className="h-10 w-full" />

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Applications</h1>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <h3 className="text-xl font-semibold">{app.task_title}</h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {app.project_name}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied: {new Date(app.applied_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {app.estimated_hours} hours
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />${app.budget}
                      </div>
                    </div>

                    {app.feedback && (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium">Feedback:</p>
                        <p className="text-sm text-muted-foreground">{app.feedback}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/dashboard/developer/task-details/${app.task_id}`)}
                      >
                        View Task Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      {app.status === "Accepted" && (
                        <Button onClick={() => router.push(`/dashboard/developer/tasks`)}>Go to My Tasks</Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No applications found</p>
          <p className="text-sm text-muted-foreground">Try applying to some tasks first</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/developer/available-tasks")}>
            Browse Available Tasks
          </Button>
        </div>
      )}
    </div>
  )
}
