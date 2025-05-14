import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
        secondary:
          "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        destructive:
          "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
        outline: "text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700",
        // Update complexity variants to use grayscale
        basic: "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100",
        intermediate: "border-transparent bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:text-white",
        complex: "border-transparent bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-300 dark:text-gray-900",
        // Add score variant
        score: "border-transparent bg-black text-white flex flex-col items-center justify-center p-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  score?: number
  maxScore?: number
  averageScore?: number
  showAverage?: boolean
}

function Badge({ className, variant, score, maxScore = 10, averageScore, showAverage = false, ...props }: BadgeProps) {
  if (score !== undefined) {
    const percentDiff = averageScore ? Math.round((score / averageScore - 1) * 100) : 0
    const percentText = percentDiff > 0 ? `+${percentDiff}%` : `${percentDiff}%`
    const percentClass = percentDiff > 0 ? "text-green-500" : percentDiff < 0 ? "text-red-500" : "text-gray-500"

    return (
      <div className="flex flex-col items-center">
        <div
          className={cn(badgeVariants({ variant: "score" }), "text-2xl py-1.5 px-4 font-bold", className)}
          {...props}
        >
          {score}/{maxScore}
        </div>
        {showAverage && averageScore !== undefined && (
          <div className="text-xs mt-1">
            <span className="text-gray-500">Avg: {averageScore.toFixed(1)}/10</span>
            <span className={`ml-1 ${percentClass}`}>({percentText})</span>
          </div>
        )}
      </div>
    )
  }

  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
