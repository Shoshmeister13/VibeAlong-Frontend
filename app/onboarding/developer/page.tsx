"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/browser-client"
import { OnboardingLayout } from "@/components/onboarding/onboarding-layout"
import { DeveloperStep1 } from "@/components/onboarding/developer/step1"
import { DeveloperStep2 } from "@/components/onboarding/developer/step2"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function DeveloperOnboardingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<{ id: string; full_name: string } | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [profilePictureUrl, setProfilePictureUrl] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if user is authenticated
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          router.push("/auth/login")
          return
        }

        // Check if email is confirmed
        if (!session.user.email_confirmed_at) {
          router.push("/auth/email-confirmation")
          return
        }

        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          toast({
            title: "Error",
            description: "Failed to load your profile. Please try again.",
            variant: "destructive",
          })
          return
        }

        // Check if profile is already completed
        const { data: developerProfile } = await supabase
          .from("developer_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()

        if (developerProfile) {
          // Profile already exists, redirect to dashboard
          router.push("/dashboard")
          return
        }

        setUserData({
          id: profile.id,
          full_name: profile.full_name,
        })
      } catch (error) {
        console.error("Auth check error:", error)
        toast({
          title: "Authentication Error",
          description: "Please sign in again to continue.",
          variant: "destructive",
        })
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleStep1Complete = (pictureUrl: string) => {
    setProfilePictureUrl(pictureUrl)
    setCurrentStep(2)
  }

  const handleStep2Complete = async (data: any) => {
    if (!userData) return

    setIsLoading(true)
    try {
      // Update profile with profile picture if provided
      if (profilePictureUrl) {
        await supabase.from("profiles").update({ avatar_url: profilePictureUrl }).eq("id", userData.id)
      }

      // Create developer profile
      const { error } = await supabase.from("developer_profiles").insert({
        user_id: userData.id,
        tagline: data.tagline,
        experience_level: data.experienceLevel,
        skills: data.skills,
        github_url: data.githubUrl || null,
        hourly_rate: data.hourlyRate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      // Mark profile as completed
      await supabase.from("profiles").update({ profile_completed: true }).eq("id", userData.id)

      toast({
        title: "Profile Completed",
        description: "Your developer profile has been created successfully!",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Profile creation error:", error)
      toast({
        title: "Error",
        description: "Failed to create your profile. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">Unable to load your profile.</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={2}
      title={`Welcome, ${userData.full_name}!`}
      description="Complete your developer profile to get started"
    >
      {currentStep === 1 && <DeveloperStep1 onComplete={handleStep1Complete} />}
      {currentStep === 2 && <DeveloperStep2 onComplete={handleStep2Complete} />}
    </OnboardingLayout>
  )
}
