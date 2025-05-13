"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ProjectOverview } from "@/components/projects/project-overview"
import { TaskList } from "@/components/tasks/task-list"
import { ArrowLeft, Plus } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { getProject } from "@/lib/data-service"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedProject = getProject(params.id)
    setProject(fetchedProject)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Loading project...</h1>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Project not found</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">The project you are looking for does not exist.</p>
          <Link href="/dashboard/projects" className="mt-4">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          {project.status ? (
            <Badge variant="outline" className="ml-2">
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <ProjectOverview project={project} />
        </TabsContent>
        <TabsContent value="tasks" className="space-y-4">
          <TaskList projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
