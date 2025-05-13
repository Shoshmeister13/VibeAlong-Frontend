"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Check, Edit2, Info, Plus, Sparkles, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DeveloperSetupModalProps {
  isOpen: boolean
  onClose: () => void
  task: any
  onSetupComplete: (setupData: {
    collaborationSteps: Array<{ id: string; text: string; completed: boolean }>
    taskSteps: Array<{ id: string; text: string; completed: boolean }>
    dueDate: Date | undefined
  }) => void
}

export function DeveloperSetupModal({ isOpen, onClose, task, onSetupComplete }: DeveloperSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [collaborationSteps, setCollaborationSteps] = useState<Array<{ id: string; text: string; completed: boolean }>>(
    [],
  )
  const [taskSteps, setTaskSteps] = useState<Array<{ id: string; text: string; completed: boolean }>>([])
  const [dueDate, setDueDate] = useState<Date | undefined>(task.due_date ? new Date(task.due_date) : undefined)

  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [newStepText, setNewStepText] = useState("")
  const [isAddingStep, setIsAddingStep] = useState(false)

  // Generate default collaboration steps based on platform
  useEffect(() => {
    const platform = task.project?.platform || "Other"
    const defaultSteps = getDefaultCollaborationSteps(platform)
    setCollaborationSteps(defaultSteps)

    // Generate default task steps
    const defaultTaskSteps = [
      { id: "task-1", text: "Review requirements and project documentation", completed: false },
      { id: "task-2", text: "Set up development environment", completed: false },
      { id: "task-3", text: "Implement core functionality", completed: false },
    ]
    setTaskSteps(defaultTaskSteps)
  }, [task.project?.platform])

  const getDefaultCollaborationSteps = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "v0":
        return [
          { id: "collab-1", text: "Add me as a collaborator in the V0 workspace", completed: false },
          { id: "collab-2", text: "Share database credentials if needed", completed: false },
          { id: "collab-3", text: "Provide access to design assets", completed: false },
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
    onSetupComplete({
      collaborationSteps,
      taskSteps,
      dueDate,
    })
    onClose()
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Task Setup</DialogTitle>
          <DialogDescription>
            Let's get you set up for this task. Complete these steps to get started.
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

          {/* Step 1: Collaboration Setup */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Collaboration Setup</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[250px] text-xs">
                        These steps help establish the collaboration environment between you and the Vibe Coder.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p className="text-sm text-muted-foreground">
                Complete these steps to set up your collaboration with the Vibe Coder.
              </p>

              <div className="space-y-2 mt-4">
                {collaborationSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-2 group">
                    <div
                      className={`flex-shrink-0 w-5 h-5 mt-0.5 border rounded cursor-pointer ${step.completed ? "bg-primary border-primary" : "border-gray-300"}`}
                      onClick={() => toggleStepCompletion(collaborationSteps, setCollaborationSteps, step.id)}
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
                          onClick={() => saveEditedStep(collaborationSteps, setCollaborationSteps, step.id)}
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
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-destructive"
                            onClick={() => deleteStep(collaborationSteps, setCollaborationSteps, step.id)}
                          >
                            <Trash2 className="h-3 w-3" />
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
                    placeholder="Enter new step..."
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addNewStep(collaborationSteps, setCollaborationSteps, "collab")}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingStep(false)
                      setNewStepText("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setIsAddingStep(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              )}
            </div>
          )}

          {/* Step 2: Task Steps */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Task Completion Steps</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Sparkles className="h-3 w-3 mr-1" /> AI Generated
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                These are suggested steps to complete your task. Feel free to edit them to match your workflow.
              </p>

              <div className="space-y-2 mt-4">
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
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-destructive"
                            onClick={() => deleteStep(taskSteps, setTaskSteps, step.id)}
                          >
                            <Trash2 className="h-3 w-3" />
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
                    placeholder="Enter new step..."
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    className="flex-1 text-sm"
                  />
                  <Button size="sm" variant="ghost" onClick={() => addNewStep(taskSteps, setTaskSteps, "task")}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setIsAddingStep(false)
                      setNewStepText("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setIsAddingStep(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
              )}
            </div>
          )}

          {/* Step 3: Due Date */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Set Due Date</h3>
              <p className="text-sm text-muted-foreground">
                When do you expect to complete this task? This helps with planning and expectations.
              </p>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="mt-6">
                <Label>Task Summary</Label>
                <div className="mt-2 p-4 border rounded-md bg-muted/20">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Task:</span>
                      <span className="text-sm ml-2">{task.title}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Collaboration Steps:</span>
                      <span className="text-sm ml-2">{collaborationSteps.length} steps defined</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Task Steps:</span>
                      <span className="text-sm ml-2">{taskSteps.length} steps defined</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Due Date:</span>
                      <span className="text-sm ml-2">{dueDate ? format(dueDate, "PPP") : "Not set"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevStep}>
              Back
            </Button>
          )}
          <Button onClick={handleNextStep}>{currentStep < 3 ? "Next" : "Complete Setup"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
