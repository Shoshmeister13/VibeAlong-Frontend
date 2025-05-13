"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Steps } from "@/components/ui/steps"
import { AccountInfoStep } from "./signup-steps/account-info-step"
import { ProfilePictureStep } from "./signup-steps/profile-picture-step"
import { DeveloperProfileStep } from "./signup-steps/developer-profile-step"
import { VibeCoderProfileStep } from "./signup-steps/vibe-coder-profile-step"
import { AgencyProfileStep } from "./signup-steps/agency-profile-step"
import { SuccessStep } from "./signup-steps/success-step"
import { createClient } from "@/lib/supabase/client"

export type UserRole = "developer" | "vibe-coder" | "agency"

export type SignupData = {
  email: string
  password: string
  fullName: string
  role?: UserRole
  profilePictureUrl?: string
  profileData?: Record<string, any>
}

export function UnifiedSignupWizard() {
  const [step, setStep] = useState(1)
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    fullName: "",
  })
  const [isComplete, setIsComplete] = useState(false)
  const supabase = createClient()

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleComplete = () => {
    setIsComplete(true)
  }

  const totalSteps = 3
  const progressPercentage = (step / totalSteps) * 100

  const stepTitles = ["Account Information", "Profile Picture", "Role Details"]

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="space-y-4 mb-6">
        <Steps currentStep={step} totalSteps={totalSteps} titles={stepTitles} />
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Card className="p-6">
        {isComplete ? (
          <SuccessStep email={signupData.email} />
        ) : (
          <>
            {step === 1 && <AccountInfoStep initialData={signupData} onUpdate={updateSignupData} onNext={handleNext} />}

            {step === 2 && (
              <ProfilePictureStep
                initialData={signupData}
                onUpdate={updateSignupData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {step === 3 && signupData.role === "developer" && (
              <DeveloperProfileStep
                signupData={signupData}
                onUpdate={updateSignupData}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}

            {step === 3 && signupData.role === "vibe-coder" && (
              <VibeCoderProfileStep
                signupData={signupData}
                onUpdate={updateSignupData}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}

            {step === 3 && signupData.role === "agency" && (
              <AgencyProfileStep
                signupData={signupData}
                onUpdate={updateSignupData}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}
          </>
        )}
      </Card>
    </div>
  )
}
