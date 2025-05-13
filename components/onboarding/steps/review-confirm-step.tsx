"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { OnboardingData } from "../onboarding-container"

interface ReviewConfirmStepProps {
  onboardingData: OnboardingData
  onBack: () => void
}

export function ReviewConfirmStep({ onboardingData, onBack }: ReviewConfirmStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleComplete() {
    setIsLoading(true)
    setError(null)

    try {
      const { userId, role } = onboardingData

      // 1. Update the profile with profile picture URL
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: onboardingData.fullName,
          tagline: onboardingData.tagline,
          avatar_url: onboardingData.profilePictureUrl,
          profile_completed: true,
        })
        .eq("id", userId)

      if (profileError) throw profileError

      // 2. Create role-specific profile
      if (role === "developer") {
        const { error: developerError } = await supabase.from("developer_profiles").insert({
          user_id: userId,
          full_name: onboardingData.fullName,
          tagline: onboardingData.tagline,
          experience_level: onboardingData.experienceLevel,
          skills: onboardingData.skills,
          vibe_coding_tools: onboardingData.vibeCodingTools,
          github_url: onboardingData.githubUrl,
          availability: onboardingData.availability,
          hourly_rate: onboardingData.hourlyRate,
          profile_picture_url: onboardingData.profilePictureUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (developerError) throw developerError
      } else if (role === "vibe-coder") {
        const { error: vibeCoderError } = await supabase.from("vibe_coder_profiles").insert({
          user_id: userId,
          full_name: onboardingData.fullName,
          tagline: onboardingData.tagline,
          frequent_task_types: onboardingData.frequentTaskTypes,
          vibe_coding_tools: onboardingData.vibeCodingTools,
          estimated_monthly_budget: onboardingData.estimatedMonthlyBudget,
          profile_picture_url: onboardingData.profilePictureUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (vibeCoderError) throw vibeCoderError
      } else if (role === "agency") {
        const { error: agencyError } = await supabase.from("agency_profiles").insert({
          user_id: userId,
          agency_name: onboardingData.agencyName,
          contact_email: onboardingData.contactEmail,
          website: onboardingData.website,
          developer_count: onboardingData.developerCount,
          logo_url: onboardingData.profilePictureUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (agencyError) throw agencyError
      }

      // 3. Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          profile_completed: true,
          avatar_url: onboardingData.profilePictureUrl,
        },
      })

      if (authError) throw authError

      // 4. Send email verification if not already verified
      const { data: userData } = await supabase.auth.getUser()

      if (userData.user && !userData.user.email_confirmed_at) {
        const { error: emailError } = await supabase.auth.resend({
          type: "signup",
          email: onboardingData.email,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })

        if (emailError) throw emailError
      }

      setIsComplete(true)

      toast({
        title: "Profile completed",
        description: "Your profile has been set up successfully.",
      })

      // Redirect to email verification page after 2 seconds
      setTimeout(() => {
        router.push("/email-verification")
      }, 2000)
    } catch (error: any) {
      console.error("Profile completion error:", error)
      setError(error.message || "Failed to complete profile setup. Please try again.")
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile setup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to render role-specific information
  const renderRoleSpecificInfo = () => {
    if (onboardingData.role === "developer") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Experience Level</h4>
              <p className="text-muted-foreground">
                {onboardingData.experienceLevel === "junior"
                  ? "Junior (0-2 years)"
                  : onboardingData.experienceLevel === "mid"
                    ? "Mid-Level (2-5 years)"
                    : onboardingData.experienceLevel === "senior"
                      ? "Senior (5+ years)"
                      : "Lead/Architect (8+ years)"}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Hourly Rate</h4>
              <p className="text-muted-foreground">${onboardingData.hourlyRate}/hour</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium">Skills</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {onboardingData.skills?.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium">Vibe-Coding Tools</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {onboardingData.vibeCodingTools?.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Availability</h4>
              <p className="text-muted-foreground">{onboardingData.availability}</p>
            </div>
            <div>
              <h4 className="font-medium">GitHub URL</h4>
              <p className="text-muted-foreground">{onboardingData.githubUrl || "Not provided"}</p>
            </div>
          </div>
        </>
      )
    } else if (onboardingData.role === "vibe-coder") {
      return (
        <>
          <div>
            <h4 className="font-medium">Frequent Task Types</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {onboardingData.frequentTaskTypes?.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium">Vibe-Coding Tools</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {onboardingData.vibeCodingTools?.map((tool) => (
                <span
                  key={tool}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium">Estimated Monthly Budget</h4>
            <p className="text-muted-foreground">${onboardingData.estimatedMonthlyBudget}/month</p>
          </div>
        </>
      )
    } else if (onboardingData.role === "agency") {
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Agency Name</h4>
              <p className="text-muted-foreground">{onboardingData.agencyName}</p>
            </div>
            <div>
              <h4 className="font-medium">Contact Email</h4>
              <p className="text-muted-foreground">{onboardingData.contactEmail}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Website</h4>
              <p className="text-muted-foreground">{onboardingData.website || "Not provided"}</p>
            </div>
            <div>
              <h4 className="font-medium">Number of Developers</h4>
              <p className="text-muted-foreground">{onboardingData.developerCount}</p>
            </div>
          </div>
        </>
      )
    }
    return null
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Profile Complete!</h3>
        <p className="text-muted-foreground mb-6">
          Your profile has been created successfully. Please check your email to verify your account.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review & Confirm</h2>
        <p className="text-muted-foreground mt-1">Review your information and complete your profile</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 border rounded-lg p-4">
        <div className="flex items-center gap-4">
          {onboardingData.profilePictureUrl ? (
            <img
              src={onboardingData.profilePictureUrl || "/placeholder.svg"}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xl font-medium">{onboardingData.fullName.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{onboardingData.fullName}</h3>
            <p className="text-muted-foreground">{onboardingData.tagline}</p>
          </div>
        </div>

        <div className="pt-4 space-y-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Email</h4>
              <p className="text-muted-foreground">{onboardingData.email}</p>
            </div>
            <div>
              <h4 className="font-medium">Role</h4>
              <p className="text-muted-foreground capitalize">{onboardingData.role.replace("-", " ")}</p>
            </div>
          </div>

          {renderRoleSpecificInfo()}
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={onBack} type="button">
          Back
        </Button>
        <Button onClick={handleComplete} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing Profile...
            </>
          ) : (
            "Complete Profile"
          )}
        </Button>
      </div>
    </div>
  )
}
