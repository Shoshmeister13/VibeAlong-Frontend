"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSettingUpTable, setIsSettingUpTable] = useState(false)
  const supabase = createClientComponentClient()

  // Function to set up the projects table if it doesn't exist
  const setupProjectsTable = async () => {
    try {
      setIsSettingUpTable(true)
      const response = await fetch("/api/setup-projects-table")
      if (!response.ok) {
        throw new Error("Failed to set up projects table")
      }
      return true
    } catch (err) {
      console.error("Error setting up projects table:", err)
      return false
    } finally {
      setIsSettingUpTable(false)
    }
  }

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from("vibe_projects")
          .select("*")
          .eq("vibe_coder_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)

          // Check if the error is because the table doesn't exist
          if (error.message.includes('relation "public.vibe_projects" does not exist')) {
            const success = await setupProjectsTable()
            if (success) {
              // Try fetching again after setting up the table
              const { data: retryData, error: retryError } = await supabase
                .from("vibe_projects")
                .select("*")
                .eq("vibe_coder_id", user.id)
                .order("created_at", { ascending: false })

              if (retryError) {
                setError("Failed to load projects after setup. Please try again.")
                setProjects([])
              } else {
                setProjects(Array.isArray(retryData) ? retryData : [])
              }
            } else {
              setError("Failed to set up projects database. Please try again.")
              setProjects([])
            }
          } else {
            setError("Failed to load projects. Please try again.")
            setProjects([])
          }
        } else {
          // Ensure projects is always an array
          setProjects(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        console.error("Exception in fetchProjects:", err)
        setError("An unexpected error occurred. Please try again.")
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [user, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "draft":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "archived":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  if (isLoading || isSettingUpTable) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>{isSettingUpTable ? "Setting up projects database..." : "Loading projects..."}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>
      {!projects || projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create your first project to get started.</p>
          <Link href="/dashboard/projects/new" className="mt-4">
            <Button>Create Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{project.project_name || project.name}</CardTitle>
                  <Badge className={getStatusColor(project.status)} variant="outline">
                    {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : "Draft"}
                  </Badge>
                </div>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {project.techStack && Array.isArray(project.techStack)
                    ? project.techStack.map((tech: string) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))
                    : project.stack && Array.isArray(project.stack)
                      ? project.stack.map((tech: string) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))
                      : null}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {project.collaborators || 0} collaborator{project.collaborators !== 1 ? "s" : ""}
                </div>
                <Link href={`/dashboard/projects/${project.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
