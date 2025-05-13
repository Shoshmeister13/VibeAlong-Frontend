"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import supabase from "@/lib/supabase"

export default function CreateProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const createUserProfile = async () => {
      try {
        setIsLoading(true)

        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          setError("Failed to get session. Please try logging in again.")
          setIsLoading(false)
          return
        }

        if (!sessionData.session) {
          router.push("/auth/login")
          return
        }

        // Get user data
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error("User error:", userError)
          setError("Failed to get user data. Please try logging in again.")
          setIsLoading(false)
          return
        }

        if (!userData.user) {
          router.push("/auth/login")
          return
        }

        setUser(userData.user)

        // Get role from user metadata
        const role = userData.user.user_metadata?.role || "vibe-coder"
        const userId = userData.user.id
        const email = userData.user.email || ""
        const fullName = userData.user.user_metadata?.full_name || ""

        // Create profile based on role
        if (role === "vibe-coder") {
          // Create vibe_coders profile
          const { error: vibeCoderError } = await supabase.from("vibe_coders").insert({
            user_id: userId,
            email: email,
            name: fullName,
            created_at: new Date().toISOString(),
          })

          if (vibeCoderError) {
            console.error("Error creating vibe_coders profile:", vibeCoderError)
            setError("Failed to create your profile. Please try again.")
            setIsLoading(false)
            return
          }
        } else if (role === "developer" || role === "developer_expert") {
          // Create developer_profiles profile
          const { error: developerError } = await supabase.from("developer_profiles").insert({
            user_id: userId,
            email: email,
            name: fullName,
            created_at: new Date().toISOString(),
          })

          if (developerError) {
            console.error("Error creating developer_profiles profile:", developerError)
            setError("Failed to create your profile. Please try again.")
            setIsLoading(false)
            return
          }
        }

        // Update general profiles table
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: userId,
          email: email,
          full_name: fullName,
          role: role,
          profile_completed: true,
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("Error updating profiles table:", profileError)
        }

        // Redirect to appropriate dashboard
        if (role === "developer" || role === "developer_expert") {
          router.push("/expert-dashboard")
        } else {
          router.push("/vibe-coder-dashboard")
        }
      } catch (error) {
        console.error("Error creating profile:", error)
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    createUserProfile()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Setting Up Your Profile</CardTitle>
            <CardDescription className="text-center">Please wait while we create your profile...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Profile Setup Error</CardTitle>
            <CardDescription className="text-center text-red-500">{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              We encountered an issue while setting up your profile. Please try again or contact support if the problem
              persists.
            </p>
            <Button onClick={() => router.push("/auth/login")}>Return to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
