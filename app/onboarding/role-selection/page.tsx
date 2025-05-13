"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function RoleSelectionPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [roleLoading, setRoleLoading] = useState<string | null>(null)

  useEffect(() => {
    // Simple function to check session
    const checkSession = async () => {
      try {
        console.log("Checking session on role selection page")
        const supabase = createClient()

        // Get session
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Session error:", error)
          throw error
        }

        if (!data.session) {
          console.log("No session found")
          // Instead of redirecting, just show an error
          setError("No active session found. Please log in again.")
          setLoading(false)
          return
        }

        console.log("Session found:", data.session.user.id)
        setUserId(data.session.user.id)
        setLoading(false)
      } catch (err: any) {
        console.error("Error checking session:", err)
        setError(err.message || "Failed to load session")
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const handleRoleSelect = async (role: string) => {
    if (!userId) {
      setError("No user ID found. Please log in again.")
      return
    }

    setRoleLoading(role)

    try {
      console.log(`Selecting role: ${role}`)
      const supabase = createClient()

      // Convert role format if needed to match database constraint
      // The database expects: 'developer', 'vibe-coder', 'agency'
      // But the constraint might be expecting 'vibe_coder' instead of 'vibe-coder'
      let dbRole = role
      if (role === "vibe-coder") {
        dbRole = "vibe_coder"
      }

      console.log(`Using database role format: ${dbRole}`)

      // Update profile
      const { error: profileError } = await supabase.from("profiles").update({ role: dbRole }).eq("id", userId)

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw profileError
      }

      // Update user metadata - keep the UI format in metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: { role },
      })

      if (userError) {
        console.error("User update error:", userError)
        // Continue anyway
      }

      console.log("Role updated successfully, redirecting")

      // Redirect to role-specific onboarding
      window.location.href = `/onboarding/${role}`
    } catch (err: any) {
      console.error("Error selecting role:", err)
      setError(err.message || "Failed to select role")
      setRoleLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p className="mb-6">{error}</p>
          <div className="flex flex-col gap-2">
            <a href="/auth/login" className="w-full py-2 px-4 bg-primary text-white rounded text-center">
              Back to Login
            </a>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 border border-gray-300 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome to VibeAlong</h1>
        <p className="text-center text-gray-500 mb-8">Please select your role to continue</p>

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect("developer")}
            disabled={roleLoading !== null}
            className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
          >
            <div className="flex-1 text-left">
              <h3 className="font-medium">Developer</h3>
              <p className="text-sm text-gray-500">Work on coding tasks</p>
            </div>
            {roleLoading === "developer" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </button>

          <button
            onClick={() => handleRoleSelect("vibe-coder")}
            disabled={roleLoading !== null}
            className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
          >
            <div className="flex-1 text-left">
              <h3 className="font-medium">Vibe Coder</h3>
              <p className="text-sm text-gray-500">Post tasks for developers</p>
            </div>
            {roleLoading === "vibe-coder" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </button>

          <button
            onClick={() => handleRoleSelect("agency")}
            disabled={roleLoading !== null}
            className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 flex items-center"
          >
            <div className="flex-1 text-left">
              <h3 className="font-medium">Agency</h3>
              <p className="text-sm text-gray-500">Represent a development agency</p>
            </div>
            {roleLoading === "agency" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
