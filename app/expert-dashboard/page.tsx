"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExpertDashboard() {
  const [loading, setLoading] = useState(true)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [devProfile, setDevProfile] = useState<any>(null)
  const [availableProjects, setAvailableProjects] = useState<any[]>([])
  const [authError, setAuthError] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const router = useRouter()

  // Step 1: Load session and user data
  useEffect(() => {
    const loadSession = async () => {
      try {
        setSessionLoading(true)
        console.log("Checking session for expert dashboard...")

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
        setUserData(userData.user)
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
      if (!userData) return

      try {
        setProfileLoading(true)
        console.log("Loading profile for developer:", userData.id)

        // First try to fetch from devs table
        const { data: devData, error: devError } = await supabase
          .from("devs")
          .select("*")
          .eq("user_id", userData.id)
          .single()

        if (devError && devError.code !== "PGRST116") {
          console.error("Developer profile error:", devError)

          // If it's not a "no rows returned" error, set the error
          if (devError.code !== "PGRST116") {
            setProfileError("Failed to load developer profile")
            return
          }
        }

        // If no profile found in devs, try the profiles table as fallback
        if (!devData) {
          console.log("No developer profile found, checking profiles table")
          const { data: legacyProfile, error: legacyError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userData.id)
            .single()

          if (legacyError && legacyError.code !== "PGRST116") {
            console.error("Legacy profile error:", legacyError)
            setProfileError("Failed to load profile data")
            return
          }

          if (legacyProfile) {
            console.log("Legacy profile found:", legacyProfile)
            setDevProfile({
              ...legacyProfile,
              user_id: legacyProfile.id,
              full_name: legacyProfile.full_name || userData.user_metadata?.full_name,
            })
          } else {
            // No profile found in either table, create a basic profile from user metadata
            console.log("No profile found, using user metadata")
            setDevProfile({
              user_id: userData.id,
              full_name: userData.user_metadata?.full_name || "Developer Expert",
              email: userData.email,
              profile_completed: false,
            })

            // Optionally set an error to prompt profile completion
            setProfileError("Profile not found. Please complete your profile setup.")
          }
        } else {
          console.log("Developer profile found:", devData)
          setDevProfile(devData)
        }

        // Check role
        const role = userData.user_metadata?.role

        if (role !== "developer" && role !== "developer_expert") {
          console.log("User has incorrect role:", role)
          // Redirect to appropriate dashboard based on role
          if (role === "vibe-coder") {
            router.push("/vibe-coder-dashboard")
          } else {
            router.push("/unauthorized")
          }
        }
      } catch (error) {
        console.error("Profile load error:", error)
        setProfileError("An error occurred while loading your profile")
      } finally {
        setProfileLoading(false)
      }
    }

    loadProfile()
  }, [userData, router])

  // Step 3: Load projects after profile is loaded
  useEffect(() => {
    const fetchProjects = async () => {
      if (!devProfile) return

      try {
        setLoading(true)
        console.log("Fetching available projects...")

        // Fetch available projects (placeholder for now)
        setAvailableProjects([
          {
            id: "proj-1",
            title: "E-commerce Platform Enhancement",
            description: "Implement new features for an existing e-commerce platform",
            budget: 2500,
            duration: "2 weeks",
            skills: ["React", "Node.js", "PostgreSQL"],
            priority: "high",
          },
          {
            id: "proj-2",
            title: "Mobile App UI Redesign",
            description: "Redesign the user interface for a fitness tracking mobile app",
            budget: 1800,
            duration: "1 week",
            skills: ["React Native", "UI/UX", "Figma"],
            priority: "medium",
          },
          {
            id: "proj-3",
            title: "API Integration for Payment Gateway",
            description: "Integrate a new payment gateway API into an existing web application",
            budget: 1200,
            duration: "3 days",
            skills: ["API", "JavaScript", "Payment Processing"],
            priority: "low",
          },
        ])
      } catch (error) {
        console.error("Error fetching projects:", error)
        // Continue with empty projects array
        setAvailableProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [devProfile])

  // Helper function to get priority badge
  const getPriorityBadge = (priority: string) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium"
    switch (priority) {
      case "high":
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>High</span>
      case "medium":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Medium</span>
      case "low":
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Low</span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Normal</span>
    }
  }

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
  if (profileError && !devProfile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile Error</AlertTitle>
            <AlertDescription>{profileError}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/onboarding/developer")}>Complete Profile Setup</Button>
        </div>
      </div>
    )
  }

  // Show loading state while projects are being fetched
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome, Developer Expert</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-3/4 mt-1" />
                    <div className="mt-3 flex flex-wrap gap-1">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-6 w-16 rounded-full" />
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Welcome, {devProfile?.full_name || userData?.user_metadata?.full_name || "Developer Expert"} 👨‍💻
        </h1>
      </div>

      {/* Profile Completion Card */}
      {profileError && devProfile && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Complete your profile</h3>
                <p className="text-sm text-muted-foreground">
                  Add more details to your profile to increase your chances of getting projects.
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => router.push("/onboarding/developer")}>
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {/* Available Projects Section */}
        <Card>
          <CardHeader>
            <CardTitle>Available Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {availableProjects.length > 0 ? (
              <div className="space-y-4">
                {availableProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">Duration: {project.duration}</p>
                      </div>
                      <div>{getPriorityBadge(project.priority)}</div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {project.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex space-x-4 text-sm text-muted-foreground">
                        <span>Budget: ${project.budget}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm">Apply</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No projects available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back later for new opportunities.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Applications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground">You haven't applied to any projects yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Browse available projects and submit your first application.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Messages Section */}
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground">No messages yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Messages from project owners will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
