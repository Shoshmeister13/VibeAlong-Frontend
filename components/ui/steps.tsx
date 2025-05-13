import { CheckCircle } from "lucide-react"

interface StepsProps {
  currentStep: number
  totalSteps: number
  titles?: string[]
}

export function Steps({ currentStep, totalSteps, titles }: StepsProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center relative w-full">
              {/* Connector line */}
              {stepNumber < totalSteps && (
                <div
                  className={`absolute top-4 h-[2px] w-full left-1/2 -z-10 ${isCompleted ? "bg-primary" : "bg-muted"}`}
                />
              )}

              {/* Step circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {isCompleted ? <CheckCircle className="h-4 w-4" /> : <span className="text-sm">{stepNumber}</span>}
              </div>

              {/* Step title */}
              {titles && (
                <div
                  className={`mt-2 text-xs text-center ${
                    isActive || isCompleted ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  {titles[index]}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
