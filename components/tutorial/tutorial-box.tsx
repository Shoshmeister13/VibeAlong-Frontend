"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TutorialStep {
  id: string
  title: string
  description: string
  targetElement: string // CSS selector for the element to highlight
  position: "top" | "right" | "bottom" | "left"
}

interface TutorialBoxProps {
  step: TutorialStep
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  isLastStep?: boolean
  isFirstStep?: boolean
  className?: string
}

export function TutorialBox({
  step,
  onClose,
  onNext,
  onPrevious,
  isLastStep = false,
  isFirstStep = false,
  className,
}: TutorialBoxProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const positionTutorial = () => {
      const targetElement = document.querySelector(step.targetElement)
      if (!targetElement) return

      const rect = targetElement.getBoundingClientRect()
      const boxWidth = 320 // Width of our tutorial box
      const boxHeight = 180 // Approximate height of our tutorial box
      const margin = 12 // Margin from the target element

      let top = 0
      let left = 0

      switch (step.position) {
        case "top":
          top = rect.top - boxHeight - margin
          left = rect.left + rect.width / 2 - boxWidth / 2
          break
        case "right":
          top = rect.top + rect.height / 2 - boxHeight / 2
          left = rect.right + margin
          break
        case "bottom":
          top = rect.bottom + margin
          left = rect.left + rect.width / 2 - boxWidth / 2
          break
        case "left":
          top = rect.top + rect.height / 2 - boxHeight / 2
          left = rect.left - boxWidth - margin
          break
      }

      // Ensure the box stays within viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left < 10) left = 10
      if (left + boxWidth > viewportWidth - 10) left = viewportWidth - boxWidth - 10
      if (top < 10) top = 10
      if (top + boxHeight > viewportHeight - 10) top = viewportHeight - boxHeight - 10

      setPosition({ top, left })
    }

    positionTutorial()
    window.addEventListener("resize", positionTutorial)
    return () => window.removeEventListener("resize", positionTutorial)
  }, [step])

  return (
    <Card
      className={cn("fixed z-50 w-80 shadow-lg animate-in fade-in zoom-in-95 duration-200", className)}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="absolute -top-2 -right-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full bg-white shadow-md hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
        <div className="flex justify-between">
          {!isFirstStep && (
            <Button variant="outline" size="sm" onClick={onPrevious}>
              Previous
            </Button>
          )}
          {isFirstStep && <div />}
          {!isLastStep ? (
            <Button size="sm" onClick={onNext}>
              Next
            </Button>
          ) : (
            <Button size="sm" onClick={onClose}>
              Got it
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
