import type { ReactNode } from "react"
import { Progress } from "@/components/ui/progress"

interface ProfileCompletionLayoutProps {
  children: ReactNode
  step: number
  totalSteps: number
  title: string
  description: string
  stepLabels: string[]
}

export function ProfileCompletionLayout({
  children,
  step,
  totalSteps,
  title,
  description,
  stepLabels,
}: ProfileCompletionLayoutProps) {
  const progress = (step / totalSteps) * 100

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          {stepLabels.map((label, index) => (
            <span key={index} className={index < step ? "font-medium text-primary" : ""}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {children}
    </div>
  )
}
