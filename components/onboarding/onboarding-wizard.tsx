"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Step1Form } from "./steps/step1-form"
import { Step2DeveloperForm } from "./steps/step2-developer-form"
import { Step2VibeCoderForm } from "./steps/step2-vibe-coder-form"
import { Step2AgencyForm } from "./steps/step2-agency-form"
import { Step3Summary } from "./steps/step3-summary"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"

export type UserRole = "developer" | "vibe-coder" | "agency"

export type OnboardingData = {
  fullName: string
  email: string
  password: string
  role: UserRole
  userId?: string
  profileData?: Record<string, any>
  profilePicture?: File
}

export function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    fullName: "",
    email: "",
    password: "",
    role: "developer", // Default role
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = async (data?: Partial<OnboardingData>) => {
    if (data) {
      updateOnboardingData(data)
    }

    // If moving from step 1 to step 2, create the user account
    if (step === 1) {
      setIsSubmitting(true)
      try {
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: onboardingData.email,
          password: onboardingData.password,
          options: {
            data: {
              full_name: onboardingData.fullName,
              role: onboardingData.role,
            },
          },
        })

        if (authError) throw authError
        if (!authData.user) throw new Error("User creation failed")

        const userId = authData.user.id

        // Create profile record
        const { error: profileError } = await supabase.from("profiles").insert({
          id: userId,
          full_name: onboardingData.fullName,
          email: onboardingData.email,
          role: onboardingData.role,
          profile_completed: false,
        })

        if (profileError) throw profileError

        // Update onboardingData with userId
        updateOnboardingData({ userId })

        // Move to step 2
        setStep(2)
      } catch (error: any) {
        console.error("Error creating user:", error)
        toast({
          title: "Error",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // For other steps, just move to the next step
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleComplete = async (finalData?: Partial<OnboardingData>) => {
    if (finalData) {
      updateOnboardingData(finalData)
    }

    setIsSubmitting(true)

    try {
      // Update Supabase auth user with emailRedirectTo
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

      await supabase.auth.updateUser({
        data: {
          profile_completed: true,
        },
        options: {
          emailRedirectTo: `${siteUrl}/dashboard`,
        },
      })

      // Update profile to mark as completed
      if (onboardingData.userId) {
        await supabase
          .from("profiles")
          .update({
            profile_completed: true,
          })
          .eq("id", onboardingData.userId)
      }

      // Redirect to email confirmation page
      router.push("/email-confirmation")
    } catch (error: any) {
      console.error("Error completing onboarding:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSteps = 3
  const progressPercentage = (step / totalSteps) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-center">Create Your Account</h1>
        <p className="text-muted-foreground text-center mt-2">Join VibeAlong and start collaborating</p>
      </div>

      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <div className={step >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>Step 1: Account</div>
          <div className={step >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>Step 2: Profile</div>
          <div className={step >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>Step 3: Summary</div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Card className="p-6">
        {step === 1 && <Step1Form initialData={onboardingData} onNext={handleNext} isSubmitting={isSubmitting} />}

        {step === 2 && onboardingData.role === "developer" && (
          <Step2DeveloperForm
            onboardingData={onboardingData}
            onNext={handleNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 2 && onboardingData.role === "vibe-coder" && (
          <Step2VibeCoderForm
            onboardingData={onboardingData}
            onNext={handleNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 2 && onboardingData.role === "agency" && (
          <Step2AgencyForm
            onboardingData={onboardingData}
            onNext={handleNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 3 && (
          <Step3Summary
            onboardingData={onboardingData}
            onBack={handleBack}
            onComplete={handleComplete}
            isSubmitting={isSubmitting}
          />
        )}
      </Card>
    </div>
  )
}
