"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import type { OnboardingData } from "../onboarding-container"

const formSchema = z.object({
  frequentTaskTypes: z.array(z.string()).min(1, {
    message: "Please select at least one task type.",
  }),
  vibeCodingTools: z.array(z.string()).min(1, {
    message: "Please select at least one vibe-coding tool.",
  }),
  estimatedMonthlyBudget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Please enter a valid monthly budget.",
  }),
})

const taskTypeOptions = [
  { label: "Bug Fixing", value: "bug_fixing" },
  { label: "Feature Development", value: "feature_development" },
  { label: "UI/UX Implementation", value: "ui_implementation" },
  { label: "Security", value: "security" },
  { label: "Performance Optimization", value: "performance_optimization" },
  { label: "Code Review", value: "code_review" },
  { label: "Testing", value: "testing" },
  { label: "Documentation", value: "documentation" },
  { label: "DevOps", value: "devops_tasks" },
  { label: "Database", value: "database" },
]

const vibeCodingToolsOptions = [
  { label: "GitHub Copilot", value: "github_copilot" },
  { label: "ChatGPT", value: "chatgpt" },
  { label: "Claude", value: "claude" },
  { label: "Vercel v0", value: "vercel_v0" },
  { label: "Cursor", value: "cursor" },
  { label: "Cody", value: "cody" },
  { label: "Replit GhostWriter", value: "ghostwriter" },
  { label: "Amazon CodeWhisperer", value: "codewhisperer" },
  { label: "Tabnine", value: "tabnine" },
  { label: "Other AI Coding Tools", value: "other_ai_tools" },
]

interface VibeCoderSpecificStepProps {
  onboardingData: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function VibeCoderSpecificStep({ onboardingData, updateData, onNext, onBack }: VibeCoderSpecificStepProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequentTaskTypes: onboardingData.frequentTaskTypes || [],
      vibeCodingTools: onboardingData.vibeCodingTools || [],
      estimatedMonthlyBudget: onboardingData.estimatedMonthlyBudget
        ? String(onboardingData.estimatedMonthlyBudget)
        : "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Update onboarding data
      updateData({
        frequentTaskTypes: values.frequentTaskTypes,
        vibeCodingTools: values.vibeCodingTools,
        estimatedMonthlyBudget: Number(values.estimatedMonthlyBudget),
      })

      // Move to next step
      onNext()
    } catch (error: any) {
      console.error("Vibe Coder info error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save Vibe Coder information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Vibe Coder Information</h2>
        <p className="text-muted-foreground mt-1">Tell us about your projects and preferences</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="frequentTaskTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequent Task Types</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={taskTypeOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select task types..."
                  />
                </FormControl>
                <FormDescription>Select the types of tasks you'll be posting</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vibeCodingTools"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vibe-Coding Tools Used</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={vibeCodingToolsOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select tools..."
                  />
                </FormControl>
                <FormDescription>Select all the AI coding tools you use</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedMonthlyBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Monthly Budget (USD)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="1000" {...field} />
                </FormControl>
                <FormDescription>Your estimated monthly budget for hiring developers</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={onBack} type="button">
              Back
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
