"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Steps } from "@/components/ui/steps"

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
  title: string
  description: string
}

export function OnboardingLayout({ children, currentStep, totalSteps, title, description }: OnboardingLayoutProps) {
  return (
    <div className="container max-w-3xl py-10 px-4 md:py-16">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Steps currentStep={currentStep} totalSteps={totalSteps} titles={["Profile Picture", "Developer Details"]} />
        </div>

        <Card>
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  )
}
