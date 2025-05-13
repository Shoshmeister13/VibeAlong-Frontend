"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Check } from "lucide-react"
import type { OnboardingData } from "../onboarding-wizard"

interface Step3SummaryProps {
  onboardingData: OnboardingData
  onBack: () => void
  onComplete: () => void
  isSubmitting: boolean
}

export function Step3Summary({ onboardingData, onBack, onComplete, isSubmitting }: Step3SummaryProps) {
  const roleDisplay = {
    developer: "Developer",
    "vibe-coder": "Vibe Coder",
    agency: "Agency",
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review Your Profile</h2>
        <p className="text-muted-foreground mt-1">Please review your information before completing signup</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
              <p>{onboardingData.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{onboardingData.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p>{roleDisplay[onboardingData.role]}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Profile Information</h3>
            {onboardingData.profileData && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(onboardingData.profileData).map(([key, value]) => {
                  // Skip complex objects or arrays for display
                  if (typeof value === "object") {
                    if (Array.isArray(value)) {
                      return (
                        <div key={key} className="col-span-2">
                          <h4 className="text-sm font-medium text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          </h4>
                          <p>{value.join(", ")}</p>
                        </div>
                      )
                    }
                    return null
                  }

                  // Skip empty values
                  if (value === "" || value === null || value === undefined) return null

                  return (
                    <div key={key} className={key === "tagline" ? "col-span-2" : ""}>
                      <h4 className="text-sm font-medium text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </h4>
                      <p>{value}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Check className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium">Email Confirmation Required</h3>
            <p className="text-sm text-muted-foreground">
              After completing signup, you'll need to confirm your email address before accessing your account.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={onBack} type="button">
          Back
        </Button>
        <Button onClick={onComplete} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing Signup...
            </>
          ) : (
            "Complete Signup"
          )}
        </Button>
      </div>
    </div>
  )
}
