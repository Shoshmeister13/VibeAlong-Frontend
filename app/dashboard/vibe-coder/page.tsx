"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SimplifiedTaskForm } from "@/components/tasks/simplified-task-form"
import { TaskList } from "@/components/tasks/task-list"
import { Plus, ChevronDown, BarChart3, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getProjects } from "@/app/actions/project-actions"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MyDevelopers } from "@/components/dashboard/my-developers"

export default function VibeCoderDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const result = await getProjects()
        if (result.success && result.data.length > 0) {
          setProjects(result.data)
          setSelectedProject(result.data[0])
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleProjectSelect = (project: any) => {
    setSelectedProject(project)
  }

  const handleCreateProject = () => {
    router.push("/create-project")
  }

  // Project stats for the overview
  const projectStats = [
    { title: "Total Tasks", value: "12", icon: <BarChart3 className="h-4 w-4 text-muted-foreground" /> },
    { title: "Active Developers", value: "3", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
  ]

  return (
    <div className="space-y-8">
      {/* Header with project selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vibe-Coder Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your projects, tasks, and developer collaborations</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 min-w-[180px]">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <>
                    {selectedProject ? selectedProject.name : "Select Project"}
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Projects</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className={selectedProject?.id === project.id ? "bg-muted" : ""}
                >
                  {project.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCreateProject}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setActiveTab("new-task")}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Project stats cards */}
      {selectedProject && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projectStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main content tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="new-task">New Task</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* My Developers Section */}
          <MyDevelopers />

          {/* Recent Tasks Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            {selectedProject ? (
              <TaskList projectId={selectedProject.id} limit={3} />
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No project selected. Please select or create a project.</p>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </div>
            )}
            {selectedProject && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={() => setActiveTab("tasks")}>
                  View All Tasks
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {selectedProject ? (
            <TaskList projectId={selectedProject.id} />
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No project selected. Please select or create a project.</p>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="new-task" className="space-y-4">
          {selectedProject ? (
            <SimplifiedTaskForm projectId={selectedProject.id} />
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">No project selected. Please select or create a project.</p>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
