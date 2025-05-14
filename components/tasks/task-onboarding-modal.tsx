"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Github, Code, Cloud, Check, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface TaskOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
  onComplete: (setupData: {
    collaborationSteps: Array<{ id: string; text: string; completed: boolean }>
    taskSteps: Array<{ id: string; text: string; completed: boolean }>
    additionalNotes: string
  }) => void
}

export function TaskOnboardingModal({ isOpen, onClose, task, onComplete }: TaskOnboardingModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [collaborationSteps, setCollaborationSteps] = useState<Array<{ id: string; text: string; completed: boolean }>>(
    [],
  )
  const [taskSteps, setTaskSteps] = useState<Array<{ id: string; text: string; completed: boolean }>>([])
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [newStepText, setNewStepText] = useState("")
  const [isAddingStep, setIsAddingStep] = useState(false)

  // Generate default collaboration steps based on platform
  useEffect(() => {
    const platform = task.project?.platform || "Other"
    const defaultSteps = getDefaultCollaborationSteps(platform)
    setCollaborationSteps(defaultSteps)

    // Generate default task steps from AI suggestions
    if (task.suggested_steps && Array.isArray(task.suggested_steps)) {
      const formattedSteps = task.suggested_steps.map((step: any, index: number) => ({
        id: `task-${index + 1}`,
        text: typeof step === "string" ? step : step.step || step.description || `Step ${index + 1}`,
        completed: false,
      }))
      setTaskSteps(formattedSteps)
    } else {
      // Fallback default steps
      setTaskSteps([
        { id: "task-1", text: "Review requirements and project documentation", completed: false },
        { id: "task-2", text: "Set up development environment", completed: false },
        { id: "task-3", text: "Implement core functionality", completed: false },
      ])
    }
  }, [task])

  const getDefaultCollaborationSteps = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "v0":
        return [
          {
            id: "collab-1",
            text: "Request access to the project repository to start collaborating on code",
            completed: false,
          },
          { id: "collab-2", text: "Ask the Vibe Coder to add you to the V0 platform", completed: false },
          {
            id: "collab-3",
            text: "Ensure you have access to the necessary cloud resources and services",
            completed: false,
          },
        ]
      case "replit":
        return [
          { id: "collab-1", text: "Invite me to your Replit workspace", completed: false },
          { id: "collab-2", text: "Set appropriate permissions for editing", completed: false },
          { id: "collab-3", text: "Share any external API keys needed", completed: false },
        ]
      case "lovable":
        return [
          { id: "collab-1", text: "Add me to your Lovable project", completed: false },
          { id: "collab-2", text: "Assign me to relevant components", completed: false },
          { id: "collab-3", text: "Share access to design specifications", completed: false },
        ]
      default:
        return [
          { id: "collab-1", text: "Add me to your development environment", completed: false },
          { id: "collab-2", text: "Share necessary credentials", completed: false },
          { id: "collab-3", text: "Provide access to required resources", completed: false },
        ]
    }
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete({
      collaborationSteps,
      taskSteps,
      additionalNotes,
    })

    toast({
      title: "Task setup completed",
      description: "You're all set to start working on this task!",
    })

    onClose()

    // Navigate to task space
    if (task.id) {
      router.push(`/task/${task.id}/collaborate`)
    }
  }

  const toggleStepCompletion = (steps: any[], setSteps: any, id: string) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step)))
  }

  const startEditingStep = (id: string, currentText: string) => {
    setEditingStepId(id)
    setNewStepText(currentText)
  }

  const saveEditedStep = (steps: any[], setSteps: any, id: string) => {
    if (newStepText.trim()) {
      setSteps(steps.map((step) => (step.id === id ? { ...step, text: newStepText } : step)))
    }
    setEditingStepId(null)
    setNewStepText("")
  }

  const cancelEditingStep = () => {
    setEditingStepId(null)
    setNewStepText("")
  }

  const deleteStep = (steps: any[], setSteps: any, id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const addNewStep = (steps: any[], setSteps: any, prefix: string) => {
    if (newStepText.trim()) {
      const newId = `${prefix}-${Date.now()}`
      setSteps([...steps, { id: newId, text: newStepText, completed: false }])
      setNewStepText("")
    }
    setIsAddingStep(false)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return "Unknown date"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 1 ? "Task Setup" : currentStep === 2 ? "Task Steps" : "Task Summary"}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1
              ? "Let's set up your collaboration environment for this task."
              : currentStep === 2
                ? "Define the steps needed to complete this task."
                : "Review your task details before getting started."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <div className={`h-1 w-10 ${currentStep > 1 ? "bg-primary" : "bg-muted"}`}></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <div className={`h-1 w-10 ${currentStep > 2 ? "bg-primary" : "bg-muted"}`}></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
              >
                3
              </div>
            </div>
          </div>

          {/* Step 1: Task Setup */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Collaboration Setup
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete these steps to set up your collaboration with the Vibe Coder.
                </p>
              </div>

              {/* GitHub Repository Access */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Github className="h-5 w-5 text-blue-700 mt-1" />
                  <div>
                    <h4 className="font-medium">GitHub Repository Access</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Request access to the project repository to start collaborating on code.
                    </p>
                  </div>
                </div>
              </div>

              {/* V0 Access */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                  <Code className="h-5 w-5 text-purple-700 mt-1" />
                  <div>
                    <h4 className="font-medium">{task.project?.platform || "V0"} Access</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ask the Vibe Coder to add you to the {task.project?.platform || "V0"} platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cloud Environment Setup */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <Cloud className="h-5 w-5 text-green-700 mt-1" />
                  <div>
                    <h4 className="font-medium">Cloud Environment Setup</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ensure you have access to the necessary cloud resources and services.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Task Details</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium">Title</h4>
                        <p>{task.title}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Description</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {task.status && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {task.status}
                          </Badge>
                        )}
                        {task.priority && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            {task.priority} Priority
                          </Badge>
                        )}
                        {task.complexity && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            {task.complexity} Complexity
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Task Steps */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Task Steps
                </h3>
                <p className="text-sm text-muted-foreground">
                  Define the steps needed to complete this task. You can add, edit, or remove steps as needed.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  {taskSteps.map((step) => (
                    <div key={step.id} className="flex items-start gap-2 group">
                      <div
                        className={`flex-shrink-0 w-5 h-5 mt-0.5 border rounded cursor-pointer ${step.completed ? "bg-primary border-primary" : "border-gray-300"}`}
                        onClick={() => toggleStepCompletion(taskSteps, setTaskSteps, step.id)}
                      >
                        {step.completed && <Check className="h-4 w-4 text-white" />}
                      </div>

                      {editingStepId === step.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            value={newStepText}
                            onChange={(e) => setNewStepText(e.target.value)}
                            className="flex-1 text-sm"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => saveEditedStep(taskSteps, setTaskSteps, step.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={cancelEditingStep}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-start justify-between">
                          <span className={`text-sm ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                            {step.text}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => startEditingStep(step.id, step.text)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => deleteStep(taskSteps, setTaskSteps, step.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isAddingStep ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={newStepText}
                      onChange={(e) => setNewStepText(e.target.value)}
                      placeholder="Enter new step..."
                      className="flex-1 text-sm"
                    />
                    <Button size="sm" variant="outline" onClick={() => addNewStep(taskSteps, setTaskSteps, "task")}>
                      Add
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingStep(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setIsAddingStep(true)
                      setNewStepText("")
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                )}
              </div>

              <div className="space-y-2 mt-6">
                <h3 className="text-lg font-medium">Additional Notes</h3>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Add any additional notes or requirements for this task..."
                  className="w-full h-24 p-2 border rounded-md text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 3: Task Summary */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Task Summary
                </h3>
                <p className="text-sm text-muted-foreground">Review your task setup before getting started.</p>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Task Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Title:</span>
                        <span className="text-sm ml-2">{task.title}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Description:</span>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                      {task.deadline && (
                        <div>
                          <span className="text-sm font-medium">Deadline:</span>
                          <span className="text-sm ml-2">{formatDate(task.deadline)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Collaboration Steps</h4>
                    <div className="space-y-2">
                      {collaborationSteps.map((step) => (
                        <div key={step.id} className="flex items-start gap-2">
                          <div
                            className={`flex-shrink-0 w-5 h-5 mt-0.5 border rounded ${
                              step.completed ? "bg-primary border-primary" : "border-gray-300"
                            }`}
                          >
                            {step.completed && <Check className="h-4 w-4 text-white" />}
                          </div>
                          <span className="text-sm">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Task Steps</h4>
                    <div className="space-y-2">
                      {taskSteps.map((step) => (
                        <div key={step.id} className="flex items-start gap-2">
                          <div
                            className={`flex-shrink-0 w-5 h-5 mt-0.5 border rounded ${
                              step.completed ? "bg-primary border-primary" : "border-gray-300"
                            }`}
                          >
                            {step.completed && <Check className="h-4 w-4 text-white" />}
                          </div>
                          <span className="text-sm">{step.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {additionalNotes && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Additional Notes</h4>
                      <p className="text-sm text-muted-foreground">{additionalNotes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={currentStep === 1 ? onClose : handlePrevStep}>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleNextStep}>{currentStep < 3 ? "Next" : "Complete Setup"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
