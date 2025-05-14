"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    { number: 1, label: "Login", emoji: "🔐" },
    { number: 2, label: "Project", emoji: "🛠️" },
    { number: 3, label: "Code", emoji: "💻" },
    { number: 4, label: "Results", emoji: "🎉" },
  ]

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={cn(
              "flex flex-col items-center relative",
              index < currentStep ? "text-blue-600" : "text-gray-400",
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-300 relative z-10 bg-white",
                index < currentStep
                  ? "bg-black text-white"
                  : index === currentStep - 1
                    ? "border-2 border-black text-black shadow-md shadow-gray-100"
                    : "border-2 border-gray-300 text-gray-400",
              )}
            >
              {index < currentStep - 1 ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <span className="text-lg">{step.emoji}</span>
              )}
            </div>
            <span className="text-sm font-medium hidden md:block">{step.label}</span>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "absolute top-6 w-[calc(100vw/4-3rem)] h-0.5 left-12 -z-0",
                  index < currentStep - 1 ? "bg-black" : "bg-gray-300",
                )}
              ></div>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="h-2 bg-gray-200 rounded-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-black rounded-full"
          initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  )
}
