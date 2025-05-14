"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface StepNavigationProps {
  nextUrl?: string
  onNext?: () => Promise<boolean> | boolean
  isLastStep?: boolean
  isLoading?: boolean
  showConfetti?: boolean
}

export function StepNavigation({
  nextUrl,
  onNext,
  isLastStep = false,
  isLoading = false,
  showConfetti = false,
}: StepNavigationProps) {
  const router = useRouter()

  const handleNext = async () => {
    if (onNext) {
      const canProceed = await onNext()
      if (!canProceed) return
    }

    if (nextUrl) {
      router.push(nextUrl)
    }
  }

  return (
    <motion.div
      className="flex justify-between mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Button variant="outline" onClick={() => router.back()} className="group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Button>
      <Button
        onClick={handleNext}
        disabled={isLoading}
        className={`group ${isLastStep ? "bg-black hover:bg-gray-800 text-white" : "bg-black hover:bg-gray-800 text-white"}`}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            {isLastStep ? "View Results" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </Button>
    </motion.div>
  )
}
