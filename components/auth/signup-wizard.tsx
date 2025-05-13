"use client"

import { useState } from "react"
import { AccountInfoForm } from "./signup-steps/account-info-form"
import { RoleSelectionForm } from "./signup-steps/role-selection-form"
import { DeveloperProfileForm } from "./signup-steps/developer-profile-form"
import { VibeCoderProfileForm } from "./signup-steps/vibe-coder-profile-form"
import { AgencyProfileForm } from "./signup-steps/agency-profile-form"
import { SuccessStep } from "./signup-steps/success-step"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Steps } from "@/components/ui/steps"

export type UserRole = "developer" | "vibe-coder" | "agency"

export type SignupData = {
  email: string
  password: string
  fullName: string
  userId?: string
  role?: UserRole
  profileData?: Record<string, any>
}

export function SignupWizard() {
  const [step, setStep] = useState(1)
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    fullName: "",
  })
  const [isComplete, setIsComplete] = useState(false)

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

  const stepTitles = ["Account Information", "Role Selection", "Profile Setup"]

  return (
    <div className="space-y-6">
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
            {step === 1 && <AccountInfoForm initialData={signupData} onUpdate={updateSignupData} onNext={handleNext} />}

            {step === 2 && (
              <RoleSelectionForm
                initialData={signupData}
                onUpdate={updateSignupData}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {step === 3 && signupData.role === "developer" && (
              <DeveloperProfileForm
                signupData={signupData}
                onUpdate={updateSignupData}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}

            {step === 3 && signupData.role === "vibe-coder" && (
              <VibeCoderProfileForm
                signupData={signupData}
                onUpdate={updateSignupData}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}

            {step === 3 && signupData.role === "agency" && (
              <AgencyProfileForm
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
