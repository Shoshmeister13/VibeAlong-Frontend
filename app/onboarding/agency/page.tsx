"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProfilePictureUpload } from "@/components/onboarding/profile-picture-upload"
import { AgencyProfileForm } from "@/components/onboarding/agency-profile-form"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

export default function AgencyOnboardingPage() {
  const [step, setStep] = useState(1)
  const [userId, setUserId] = useState<string | null>(null)
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUserId() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          setUserId(user.id)

          // Check if profile is already completed
          const { data: profile } = await supabase
            .from("profiles")
            .select("profile_completed, avatar_url")
            .eq("id", user.id)
            .single()

          if (profile?.profile_completed) {
            // If profile is already completed, redirect to dashboard
            router.push("/dashboard")
            return
          }

          // If user already has an avatar, use it
          if (profile?.avatar_url) {
            setProfilePictureUrl(profile.avatar_url)
            setStep(2)
          }
        } else {
          // If no user is found, redirect to login
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    getUserId()
  }, [router, supabase])

  const handleProfilePictureComplete = (url: string) => {
    setProfilePictureUrl(url)
    setStep(2)
  }

  const handleProfilePictureSkip = () => {
    setStep(2)
  }

  const handleProfileComplete = async () => {
    try {
      // Mark profile as completed
      if (userId) {
        await supabase.from("profiles").update({ profile_completed: true }).eq("id", userId)
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error completing profile:", error)
      toast({
        title: "Error",
        description: "Failed to complete profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to continue.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Complete Your Agency Profile</h1>
        <p className="text-muted-foreground">Let's set up your agency profile so you can start finding projects.</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {step} of 2</span>
          <span>{step === 1 ? "50%" : "100%"} complete</span>
        </div>
        <Progress value={step === 1 ? 50 : 100} className="h-2" />
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <ProfilePictureUpload
              userId={userId}
              onComplete={handleProfilePictureComplete}
              onSkip={handleProfilePictureSkip}
            />
          )}

          {step === 2 && (
            <AgencyProfileForm
              userId={userId}
              profilePictureUrl={profilePictureUrl}
              onComplete={handleProfileComplete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
