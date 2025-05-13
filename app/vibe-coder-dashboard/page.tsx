"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { SimplifiedTaskForm } from "@/components/tasks/simplified-task-form"
import { TaskList } from "@/components/tasks/task-list"
import { AiTaskSuggestions } from "@/components/tasks/ai-task-suggestions"
import { AiSuggestedTasks } from "@/components/tasks/ai-suggested-tasks"
import { BarChart3, Users, AlertCircle, Loader2, Edit } from "lucide-react"
import { getProjects } from "@/app/actions/project-actions"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MyDevelopers } from "@/components/dashboard/my-developers"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { MultiSelect } from "@/components/ui/multi-select"
import { TaskCreationModal } from "@/components/tasks/task-creation-modal"

// Helper function to normalize role format
function normalizeRole(role: string): string {
  return role?.toLowerCase().replace(/_/g, "-") || "vibe-coder"
}

export default function VibeCoderDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  // Step 1: Load session and user data
  useEffect(() => {
    const loadSession = async () => {
      try {
        setSessionLoading(true)
        console.log("Checking session...")

        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setAuthError("Failed to get session")
          return
        }

        if (!sessionData?.session) {
          console.log("No session found, redirecting to login")
          router.push("/auth/login")
          return
        }

        console.log("Session found:", sessionData.session.user.id)

        // Get user
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error("User error:", userError)
          setAuthError("Failed to get user data")
          return
        }

        if (!userData?.user) {
          console.log("No user found, redirecting to login")
          router.push("/auth/login")
          return
        }

        console.log("User data loaded:", userData.user.id)

        // Get and normalize role
        const rawRole = userData.user.user_metadata?.role || "vibe-coder"
        const normalizedRole = normalizeRole(rawRole)

        console.log("User role (raw):", rawRole)
        console.log("User role (normalized):", normalizedRole)

        // Check if user has the correct role
        if (normalizedRole !== "vibe-coder") {
          console.log("User has incorrect role:", normalizedRole)
          // Redirect to appropriate dashboard based on role
          if (normalizedRole === "developer" || normalizedRole === "developer-expert") {
            router.push("/expert-dashboard")
            return
          } else {
            router.push("/unauthorized")
            return
          }
        }

        setUser(userData.user)
      } catch (error) {
        console.error("Auth check error:", error)
        setAuthError("An error occurred while checking authentication")
      } finally {
        setSessionLoading(false)
      }
    }

    loadSession()
  }, [router])

  // Step 2: Load profile data after session is loaded
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return

      try {
        setProfileLoading(true)
        console.log("Loading profile for user:", user.id)

        // First try to fetch from vibe_coders table
        const { data: profileData, error: profileError } = await supabase
          .from("vibe_coders")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Profile error:", profileError)

          // If it's not a "no rows returned" error, set the error
          if (profileError.code !== "PGRST116") {
            setProfileError("Failed to load profile data")
            return
          }
        }

        // If no profile found in vibe_coders, try the profiles table as fallback
        if (!profileData) {
          console.log("No vibe_coder profile found, checking profiles table")
          const { data: legacyProfile, error: legacyError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()

          if (legacyError && legacyError.code !== "PGRST116") {
            console.error("Legacy profile error:", legacyError)
            setProfileError("Failed to load profile data")
            return
          }

          if (legacyProfile) {
            console.log("Legacy profile found:", legacyProfile)
            setProfile({
              ...legacyProfile,
              user_id: legacyProfile.id,
              full_name: legacyProfile.full_name || user.user_metadata?.full_name,
            })
          } else {
            // No profile found in either table, create a basic profile from user metadata
            console.log("No profile found, using user metadata")
            setProfile({
              user_id: user.id,
              full_name: user.user_metadata?.full_name || "Vibe Coder",
              email: user.email,
              profile_completed: false,
            })

            // Optionally set an error to prompt profile completion
            setProfileError("Profile not found. Please complete your profile setup.")
          }
        } else {
          console.log("Vibe coder profile found:", profileData)
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Profile load error:", error)
        setProfileError("An error occurred while loading your profile")
      } finally {
        setProfileLoading(false)
      }
    }

    loadProfile()
  }, [user, router])

  // Step 3: Load projects after profile is loaded
  useEffect(() => {
    const fetchProjects = async () => {
      if (!profile) return

      try {
        setIsLoading(true)
        console.log("Fetching projects...")

        const result = await getProjects()
        console.log("Projects result:", result)

        if (result.success && result.data.length > 0) {
          setProjects(result.data)
          setSelectedProject(result.data[0])
        } else {
          // Set empty projects array if no projects found
          setProjects([])
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
        // Continue with empty projects array
        setProjects([])
      } finally {
        setIsLoading(false)
      }
    }

    if (profile) {
      fetchProjects()
    }
  }, [profile])

  const handleCreateTask = () => {
    setActiveTab("new-task")
  }

  const handleEditProject = () => {
    if (selectedProject) {
      router.push(`/dashboard/projects/${selectedProject.id}/edit`)
    }
  }

  const handleAddAiTask = (task: { title: string; description: string; estimatedHours: number; budget: number }) => {
    // In a real implementation, this would call an API to create the task
    console.log("Adding AI task:", task)

    // Show success toast
    toast({
      title: "Task submitted successfully",
      description: `"${task.title}" has been added to your project.`,
    })

    // Redirect to tasks tab
    setActiveTab("tasks")
  }

  // Project stats for the overview
  const projectStats = [
    { title: "Total Tasks", value: "0", icon: <BarChart3 className="h-4 w-4 text-muted-foreground" /> },
    { title: "Active Developers", value: "0", icon: <Users className="h-4 w-4 text-muted-foreground" /> },
  ]

  // Show loading state while session is being checked
  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 rounded-full mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Loading session...</h2>
          <p className="text-muted-foreground">Please wait while we verify your session</p>
        </div>
      </div>
    )
  }

  // Show auth error if there's an issue with authentication
  if (authError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/auth/login")}>Return to Login</Button>
        </div>
      </div>
    )
  }

  // Show loading state while profile is being fetched
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 rounded-full mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Loading profile...</h2>
          <p className="text-muted-foreground">Please wait while we load your profile data</p>
        </div>
      </div>
    )
  }

  // Show profile error if there's an issue with the profile
  if (profileError && !profile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile Error</AlertTitle>
            <AlertDescription>{profileError}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/onboarding/vibe-coder")}>Complete Profile Setup</Button>
        </div>
      </div>
    )
  }

  // Show loading state while projects are being fetched
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vibe-Coder Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your projects, tasks, and developer collaborations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with action button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {selectedProject ? selectedProject.project_name : "Select a Project"}
            </h1>
            <p className="text-muted-foreground mt-1">Manage your projects, tasks, and developer collaborations</p>
          </div>
          {selectedProject && (
            <Button variant="outline" size="sm" onClick={handleEditProject} className="mt-1">
              <Edit className="h-4 w-4 mr-1" />
              Edit Project
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <TaskCreationModal
            projectId={selectedProject?.id || "default-project"}
            projectName={selectedProject?.project_name}
            buttonText="New Task"
          />
        </div>
      </div>

      {/* Profile completion warning if needed */}
      {profileError && profile && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Incomplete</AlertTitle>
          <AlertDescription>
            {profileError}
            <Button variant="link" className="p-0 h-auto ml-2" onClick={() => router.push("/onboarding/vibe-coder")}>
              Complete your profile
            </Button>
          </AlertDescription>
        </Alert>
      )}

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

      {/* AI Task Suggestions Section */}
      {selectedProject && (
        <div className="mb-8">
          <AiTaskSuggestions
            projectId={selectedProject.id}
            projectName={selectedProject.project_name}
            projectDescription={selectedProject.description || ""}
            projectStack={selectedProject.stack || []}
            onAddTask={handleAddAiTask}
          />
        </div>
      )}

      {/* AI-Suggested Tasks Section */}
      {selectedProject && (
        <div className="mb-8">
          <AiSuggestedTasks projectId={selectedProject.id} projectName={selectedProject.project_name} />
        </div>
      )}

      {/* Main content tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
                <p className="text-muted-foreground mb-4">Select a project from the sidebar to view tasks.</p>
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
              <p className="text-muted-foreground mb-4">Select a project from the sidebar to view tasks.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="new-task" className="space-y-4">
          {selectedProject ? (
            <div className="space-y-6">
              {/* Project indicator */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Create New Task</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-muted-foreground mr-2">Project:</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {selectedProject.project_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI-enhanced task form */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <SimplifiedTaskForm
                      projectId={selectedProject.id}
                      projectName={selectedProject.project_name}
                      useAI={true}
                    />

                    <div className="space-y-2 mt-6">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium">Required Skills & Technologies</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "AI Selection in Progress",
                              description: "Analyzing task description to suggest relevant technologies...",
                            })
                            // In a real implementation, this would call an AI action
                            setTimeout(() => {
                              toast({
                                title: "Technologies Selected",
                                description: "AI has suggested relevant technologies based on your task description.",
                              })
                            }, 1500)
                          }}
                          className="h-8 text-xs"
                        >
                          <span className="mr-1">✨</span> Auto-select with AI
                        </Button>
                      </div>

                      <MultiSelect
                        options={[
                          // Programming Languages
                          { label: "JavaScript", value: "javascript" },
                          { label: "TypeScript", value: "typescript" },
                          { label: "Python", value: "python" },
                          { label: "Java", value: "java" },
                          { label: "C#", value: "csharp" },
                          { label: "PHP", value: "php" },
                          { label: "Ruby", value: "ruby" },
                          { label: "Go", value: "go" },
                          { label: "Rust", value: "rust" },
                          { label: "Swift", value: "swift" },
                          { label: "Kotlin", value: "kotlin" },

                          // Frontend Frameworks
                          { label: "React", value: "react" },
                          { label: "Next.js", value: "nextjs" },
                          { label: "Vue.js", value: "vuejs" },
                          { label: "Angular", value: "angular" },
                          { label: "Svelte", value: "svelte" },

                          // Backend Frameworks
                          { label: "Express", value: "express" },
                          { label: "NestJS", value: "nestjs" },
                          { label: "Django", value: "django" },
                          { label: "Flask", value: "flask" },
                          { label: "Ruby on Rails", value: "rails" },
                          { label: "Laravel", value: "laravel" },

                          // Databases
                          { label: "PostgreSQL", value: "postgresql" },
                          { label: "MySQL", value: "mysql" },
                          { label: "MongoDB", value: "mongodb" },
                          { label: "Redis", value: "redis" },
                          { label: "Firebase", value: "firebase" },
                          { label: "Supabase", value: "supabase" },
                        ]}
                        selected={[]}
                        onChange={(selected) => console.log("Technologies selected:", selected)}
                        placeholder="Search and select required skills & technologies..."
                        searchable={true}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Select all skills and technologies that are required for this task
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="bg-muted/50 border-t pt-4 pb-3 px-6">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    <span>
                      Priority, time estimates, and budget will be automatically calculated by AI based on your task
                      description.
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">Select a project from the sidebar before creating a task.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
