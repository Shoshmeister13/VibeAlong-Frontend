"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Sparkles, CheckCircle2, Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateAIResponse } from "@/app/actions/ai-actions"
import { saveTaskSteps } from "@/app/actions/task-step-actions"
import { toast } from "@/components/ui/use-toast"

// Add a new prop to check if the user is a developer
interface AITaskStepsProps {
  taskTitle: string
  taskDescription: string
  taskId?: string
  existingSteps?: { step: string; description?: string; completed?: boolean }[]
  onStepsGenerated?: (steps: { step: string; description?: string; completed?: boolean }[]) => void
  projectContext?: string
  readOnly?: boolean
  userRole?: string // Add this prop
}

// Update the destructuring to include userRole
export function AITaskSteps({
  taskTitle,
  taskDescription,
  taskId,
  existingSteps,
  onStepsGenerated,
  projectContext,
  readOnly = false,
  userRole = "", // Default to empty string
}: AITaskStepsProps) {
  const [steps, setSteps] = useState<{ step: string; description?: string; completed?: boolean }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateSteps = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // If there are existing steps, use them
      if (existingSteps && existingSteps.length > 0) {
        setSteps(existingSteps)
        setIsLoading(false)
        return
      }

      // Otherwise, generate new steps with AI
      const prompt = `
        Based on the following task, generate exactly 3 clear, actionable steps to complete it.
        For each step, provide a concise title (no more than 15 words) and a brief description (1-2 sentences).
        Format your response as a JSON array with objects containing "step" and "description" properties.
        
        Task Title: ${taskTitle}
        Task Description: ${taskDescription}
        ${projectContext ? `Project Context: ${projectContext}` : ""}
      `

      const response = await generateAIResponse(prompt)

      if (response.success && response.data) {
        try {
          // Try to parse the response as JSON
          let parsedSteps = []

          // Extract JSON from the response if it's wrapped in text
          const jsonMatch = response.data.match(/\[[\s\S]*\]/)
          const jsonString = jsonMatch ? jsonMatch[0] : response.data

          try {
            parsedSteps = JSON.parse(jsonString)
          } catch (parseError) {
            // If JSON parsing fails, try to extract steps manually
            const generatedSteps = response.data
              .split("\n")
              .filter((step) => step.trim().length > 0)
              .slice(0, 3)
              .map((step) => ({ step, description: "", completed: false }))

            parsedSteps = generatedSteps
          }

          // Ensure we have exactly 3 steps
          while (parsedSteps.length < 3) {
            parsedSteps.push({ step: `Step ${parsedSteps.length + 1}`, description: "", completed: false })
          }

          // Limit to 3 steps if we have more
          parsedSteps = parsedSteps.slice(0, 3)

          setSteps(parsedSteps)

          // Save steps to database if taskId is provided
          if (taskId) {
            saveStepsToDatabase(parsedSteps)
          }

          // Notify parent component if callback provided
          if (onStepsGenerated) {
            onStepsGenerated(parsedSteps)
          }
        } catch (parseError) {
          console.error("Error parsing AI response:", parseError)
          setError("Failed to parse AI response. Please try again.")
        }
      } else {
        setError("Failed to generate steps. Please try again.")
      }
    } catch (err) {
      console.error("Error generating steps:", err)
      setError("An error occurred while generating steps.")
    } finally {
      setIsLoading(false)
    }
  }

  const saveStepsToDatabase = async (stepsToSave: { step: string; description?: string; completed?: boolean }[]) => {
    if (!taskId) return

    setIsSaving(true)
    try {
      const result = await saveTaskSteps(taskId, stepsToSave)
      if (!result.success) {
        console.error("Error saving steps:", result.error)
      }
    } catch (error) {
      console.error("Error saving steps:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleStepCompletion = (index: number) => {
    // Only allow developers to toggle step completion
    if (userRole !== "developer" && !readOnly) {
      toast({
        title: "Permission denied",
        description: "Only developers can update task steps.",
        variant: "destructive",
      })
      return
    }

    const updatedSteps = [...steps]
    updatedSteps[index] = {
      ...updatedSteps[index],
      completed: !updatedSteps[index].completed,
    }
    setSteps(updatedSteps)

    // Save to database if taskId is provided
    if (taskId) {
      saveStepsToDatabase(updatedSteps)
    }

    // Notify parent component if callback provided
    if (onStepsGenerated) {
      onStepsGenerated(updatedSteps)
    }
  }

  const copyStepsToClipboard = () => {
    const stepsText = steps
      .map((step, index) => {
        return `${index + 1}. ${step.step}${step.description ? `\n   ${step.description}` : ""}`
      })
      .join("\n\n")

    navigator.clipboard.writeText(stepsText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    generateSteps()
  }, [taskTitle, taskDescription, projectContext])

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">Key Steps to Complete</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    VibeAlong AI
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Generated by VibeAlong AI based on task content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyStepsToClipboard}
              disabled={isLoading || steps.length === 0}
              className="h-8 px-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Generating steps...</span>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={generateSteps}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <ol className="list-decimal pl-5 space-y-4">
              {steps.map((step, index) => (
                <li key={index} className={`text-sm ${step.completed ? "text-muted-foreground" : ""}`}>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${step.completed ? "line-through opacity-70" : ""}`}>
                          {step.step}
                        </span>
                        {step.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      </div>
                      {step.description && (
                        <p
                          className={`mt-1 text-xs text-muted-foreground ${step.completed ? "line-through opacity-70" : ""}`}
                        >
                          {step.description}
                        </p>
                      )}
                    </div>
                    {!readOnly && userRole === "developer" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => toggleStepCompletion(index)}
                      >
                        {step.completed ? "Undo" : "Done"}
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {!readOnly && userRole === "developer" && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateSteps}
                  className="text-xs"
                  disabled={isLoading || isSaving}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {isSaving ? "Saving..." : "Regenerate Steps"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
