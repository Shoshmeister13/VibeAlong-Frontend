"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, Trash2, Check, X, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { saveTaskSteps, updateTaskStepStatus } from "@/app/actions/task-step-actions"

interface AITaskStepsProps {
  taskTitle?: string
  taskDescription?: string
  taskId: string
  existingSteps?: Array<{ step: string; description?: string; completed?: boolean }> | null
  projectContext?: string
  userRole?: string
  steps?: any[] // For compatibility with the other component
}

export function AITaskSteps({
  taskTitle = "Task",
  taskDescription = "",
  taskId,
  existingSteps = [],
  projectContext = "",
  userRole = "developer",
  steps: propSteps,
}: AITaskStepsProps) {
  // Handle both formats of steps data
  const initialSteps = Array.isArray(propSteps)
    ? propSteps.map((step, index) => ({
        id: step.id || `step-${index}`,
        step: step.title || step.step,
        description: step.description,
        completed: step.completed || false,
      }))
    : Array.isArray(existingSteps)
      ? existingSteps.map((step, index) => ({
          id: `step-${index}`,
          step: step.step,
          description: step.description,
          completed: step.completed || false,
        }))
      : []

  const [steps, setSteps] =
    useState<Array<{ id: string; step: string; description?: string; completed: boolean }>>(initialSteps)
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [newStepText, setNewStepText] = useState("")
  const [newStepDescription, setNewStepDescription] = useState("")
  const [isAddingStep, setIsAddingStep] = useState(false)

  const isDeveloper = userRole === "developer"

  useEffect(() => {
    // If no steps are provided, generate them
    if (steps.length === 0) {
      generateSteps()
    }
  }, [])

  const generateSteps = async () => {
    setIsGenerating(true)

    try {
      // In a real app, this would be an API call to an AI service
      // For demo purposes, we'll simulate a delay and return mock data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock AI-generated steps based on the task title and description
      const generatedSteps = [
        {
          id: "step-1",
          step: "Analyze requirements",
          description: "Review the task requirements and create a detailed plan",
          completed: false,
        },
        {
          id: "step-2",
          step: "Set up project structure",
          description: "Create the necessary files and folder structure",
          completed: false,
        },
        {
          id: "step-3",
          step: "Implement core functionality",
          description: "Develop the main features of the task",
          completed: false,
        },
        {
          id: "step-4",
          step: "Add styling and responsive design",
          description: "Make the UI look good on all device sizes",
          completed: false,
        },
        {
          id: "step-5",
          step: "Test and debug",
          description: "Ensure everything works as expected",
          completed: false,
        },
      ]

      setSteps(generatedSteps)

      // Save the generated steps to the database
      await saveTaskSteps(taskId, generatedSteps)
    } catch (error) {
      console.error("Error generating steps:", error)
      toast({
        title: "Error generating steps",
        description: "There was an error generating the steps. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleStepCompletion = async (id: string) => {
    if (!isDeveloper) {
      toast({
        title: "Permission denied",
        description: "Only developers can mark steps as completed.",
        variant: "destructive",
      })
      return
    }

    const updatedSteps = steps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))

    setSteps(updatedSteps)

    try {
      // Update the step status in the database
      await updateTaskStepStatus({
        taskId,
        stepId: id,
        completed: updatedSteps.find((step) => step.id === id)?.completed || false,
      })
    } catch (error) {
      console.error("Error updating step status:", error)
      // Revert on error
      setSteps(steps)
      toast({
        title: "Error updating step",
        description: "There was an error updating the step status.",
        variant: "destructive",
      })
    }
  }

  const saveEditedStep = async (id: string) => {
    if (!isDeveloper) {
      toast({
        title: "Permission denied",
        description: "Only developers can edit steps.",
        variant: "destructive",
      })
      return
    }

    if (newStepText.trim()) {
      const updatedSteps = steps.map((step) =>
        step.id === id
          ? {
              ...step,
              step: newStepText,
              description: newStepDescription || step.description,
            }
          : step,
      )

      setSteps(updatedSteps)

      try {
        // Save the updated steps to the database
        await saveTaskSteps(taskId, updatedSteps)
      } catch (error) {
        console.error("Error saving edited step:", error)
        toast({
          title: "Error saving step",
          description: "There was an error saving the edited step.",
          variant: "destructive",
        })
      }
    }

    setEditingStepId(null)
    setNewStepText("")
    setNewStepDescription("")
  }

  const cancelEditingStep = () => {
    setEditingStepId(null)
    setNewStepText("")
    setNewStepDescription("")
  }

  const deleteStep = async (id: string) => {
    if (!isDeveloper) {
      toast({
        title: "Permission denied",
        description: "Only developers can delete steps.",
        variant: "destructive",
      })
      return
    }

    const updatedSteps = steps.filter((step) => step.id !== id)
    setSteps(updatedSteps)

    try {
      // Save the updated steps to the database
      await saveTaskSteps(taskId, updatedSteps)
    } catch (error) {
      console.error("Error deleting step:", error)
      toast({
        title: "Error deleting step",
        description: "There was an error deleting the step.",
        variant: "destructive",
      })
    }
  }

  const addNewStep = () => {
    if (!isDeveloper) {
      toast({
        title: "Permission denied",
        description: "Only developers can add steps.",
        variant: "destructive",
      })
      return
    }

    setIsAddingStep(true)
  }

  const saveNewStep = async () => {
    if (!isDeveloper) {
      toast({
        title: "Permission denied",
        description: "Only developers can add steps.",
        variant: "destructive",
      })
      return
    }

    if (newStepText.trim()) {
      const newStep = {
        id: `step-${Date.now()}`,
        step: newStepText,
        description: newStepDescription,
        completed: false,
      }

      const updatedSteps = [...steps, newStep]
      setSteps(updatedSteps)

      try {
        // Save the updated steps to the database
        await saveTaskSteps(taskId, updatedSteps)
      } catch (error) {
        console.error("Error adding new step:", error)
        toast({
          title: "Error adding step",
          description: "There was an error adding the new step.",
          variant: "destructive",
        })
      }
    }

    setIsAddingStep(false)
    setNewStepText("")
    setNewStepDescription("")
  }

  const cancelNewStep = () => {
    setIsAddingStep(false)
    setNewStepText("")
    setNewStepDescription("")
  }

  return (
    <Card className="w-full border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{taskTitle}</CardTitle>
        {taskDescription && <p className="text-sm text-gray-500 dark:text-gray-400">{taskDescription}</p>}
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center py-4">
            <Sparkles className="mr-2 h-4 w-4 animate-spin text-gray-600" />
            <span className="text-gray-600 dark:text-gray-300">Generating steps...</span>
          </div>
        ) : (
          <ul className="list-none pl-0 space-y-3">
            {steps.map((step) => (
              <li key={step.id} className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0">
                <div className="flex items-start space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStepCompletion(step.id)}
                          disabled={!isDeveloper}
                          className="p-1 h-auto"
                        >
                          {step.completed ? (
                            <Check className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isDeveloper ? "Mark as complete/incomplete" : "Only developers can mark steps"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {editingStepId === step.id ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        type="text"
                        value={newStepText}
                        onChange={(e) => setNewStepText(e.target.value)}
                        placeholder="Step text"
                        className="border-gray-300 dark:border-gray-700"
                      />
                      <Textarea
                        placeholder="Step description"
                        value={newStepDescription}
                        onChange={(e) => setNewStepDescription(e.target.value)}
                        className="border-gray-300 dark:border-gray-700"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => saveEditedStep(step.id)}
                          className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditingStep}
                          className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div
                        className={`font-medium ${step.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-gray-100"}`}
                      >
                        {step.step}
                      </div>
                      {step.description && (
                        <div
                          className={`text-sm mt-1 ${step.completed ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}
                        >
                          {step.description}
                        </div>
                      )}
                    </div>
                  )}

                  {editingStepId !== step.id && (
                    <div className="flex space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (isDeveloper) {
                                  setEditingStepId(step.id)
                                  setNewStepText(step.step)
                                  setNewStepDescription(step.description || "")
                                } else {
                                  toast({
                                    title: "Permission denied",
                                    description: "Only developers can edit steps.",
                                    variant: "destructive",
                                  })
                                }
                              }}
                              disabled={!isDeveloper}
                              className="p-1 h-auto"
                            >
                              <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isDeveloper ? "Edit step" : "Only developers can edit steps"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteStep(step.id)}
                              disabled={!isDeveloper}
                              className="p-1 h-auto"
                            >
                              <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isDeveloper ? "Delete step" : "Only developers can delete steps"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {isAddingStep ? (
          <div className="space-y-2 mt-4">
            <Input
              type="text"
              placeholder="Step text"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              className="border-gray-300 dark:border-gray-700"
            />
            <Textarea
              placeholder="Step description"
              value={newStepDescription}
              onChange={(e) => setNewStepDescription(e.target.value)}
              className="border-gray-300 dark:border-gray-700"
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={saveNewStep}
                className="bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cancelNewStep}
                className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full mt-4 border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={addNewStep}
            disabled={!isDeveloper}
          >
            <Plus className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Add Step
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
