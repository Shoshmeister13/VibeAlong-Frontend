"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { TutorialBox, type TutorialStep } from "./tutorial-box"

// Define tutorial steps for each role
const developerTutorialSteps: TutorialStep[] = [
  {
    id: "dev-dashboard",
    title: "Developer Dashboard",
    description: "Your central hub for managing tasks, tracking earnings, and viewing your performance metrics.",
    targetElement: "[data-tutorial='dashboard']",
    position: "bottom",
  },
  {
    id: "dev-available-tasks",
    title: "Available Tasks",
    description: "Browse and apply for tasks that match your skills and expertise.",
    targetElement: "[data-tutorial='available-tasks']",
    position: "right",
  },
  {
    id: "dev-knowledge-hub",
    title: "Knowledge Hub",
    description: "Take quizzes and tests to earn badges and advance your developer level from Vetted to Platinum.",
    targetElement: "[data-tutorial='knowledge-hub']",
    position: "right",
  },
  {
    id: "dev-collaboration",
    title: "Collaboration Space",
    description: "Work directly with Vibe Coders in real-time on assigned tasks.",
    targetElement: "[data-tutorial='collaboration']",
    position: "bottom",
  },
  {
    id: "dev-earnings",
    title: "Earnings Tracker",
    description: "Monitor your earnings, payment history, and upcoming payments.",
    targetElement: "[data-tutorial='earnings']",
    position: "left",
  },
]

const vibeCoderTutorialSteps: TutorialStep[] = [
  {
    id: "vibe-dashboard",
    title: "Vibe Coder Dashboard",
    description: "Your command center for managing projects, tasks, and developer collaborations.",
    targetElement: "[data-tutorial='dashboard']",
    position: "bottom",
  },
  {
    id: "vibe-task-creation",
    title: "Task Creation",
    description: "Create detailed tasks with AI assistance to find the perfect developer match.",
    targetElement: "[data-tutorial='create-task']",
    position: "right",
  },
  {
    id: "vibe-developer-matching",
    title: "Developer Matching",
    description: "Browse AI-matched developers based on your task requirements and their expertise.",
    targetElement: "[data-tutorial='developers']",
    position: "right",
  },
  {
    id: "vibe-collaboration",
    title: "Collaboration Space",
    description: "Set up your preferred coding environment and collaborate with developers in real-time.",
    targetElement: "[data-tutorial='collaboration']",
    position: "bottom",
  },
  {
    id: "vibe-billing",
    title: "Credit Management",
    description: "Purchase and manage credits to pay for developer services with volume discounts.",
    targetElement: "[data-tutorial='billing']",
    position: "left",
  },
]

type TutorialContextType = {
  showTutorial: (role: "developer" | "vibe-coder") => void
  hideTutorial: () => void
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined)

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [activeTutorial, setActiveTutorial] = useState<"developer" | "vibe-coder" | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const showTutorial = (role: "developer" | "vibe-coder") => {
    setActiveTutorial(role)
    setCurrentStepIndex(0)
  }

  const hideTutorial = () => {
    setActiveTutorial(null)
    setCurrentStepIndex(0)
  }

  const nextStep = () => {
    const steps = activeTutorial === "developer" ? developerTutorialSteps : vibeCoderTutorialSteps
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      hideTutorial()
    }
  }

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const steps = activeTutorial === "developer" ? developerTutorialSteps : vibeCoderTutorialSteps
  const currentStep = activeTutorial ? steps[currentStepIndex] : null

  return (
    <TutorialContext.Provider value={{ showTutorial, hideTutorial }}>
      {children}
      {currentStep && (
        <TutorialBox
          step={currentStep}
          onClose={hideTutorial}
          onNext={nextStep}
          onPrevious={previousStep}
          isFirstStep={currentStepIndex === 0}
          isLastStep={currentStepIndex === steps.length - 1}
        />
      )}
    </TutorialContext.Provider>
  )
}

export const useTutorial = () => {
  const context = useContext(TutorialContext)
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider")
  }
  return context
}
