"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface QuizTimerProps {
  totalSeconds: number
  onTimeUp: () => void
}

export function QuizTimer({ totalSeconds, onTimeUp }: QuizTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeUp, totalSeconds])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const percentage = (secondsLeft / totalSeconds) * 100

  // Determine color based on time remaining
  const getColorClass = () => {
    if (percentage > 50) return "text-green-600"
    if (percentage > 25) return "text-amber-500"
    return "text-red-600"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Clock className={`h-4 w-4 mr-2 ${getColorClass()}`} />
          <span className={`font-mono font-medium ${getColorClass()}`}>
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Time Remaining</span>
      </div>
      <Progress
        value={percentage}
        className="h-2"
        indicatorClassName={percentage > 50 ? "bg-green-600" : percentage > 25 ? "bg-amber-500" : "bg-red-600"}
      />
    </div>
  )
}
