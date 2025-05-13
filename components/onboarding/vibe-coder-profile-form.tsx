"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
  tagline: z
    .string()
    .min(5, {
      message: "Tagline must be at least 5 characters.",
    })
    .max(100, {
      message: "Tagline must not exceed 100 characters.",
    }),
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

interface VibeCoderProfileFormProps {
  userId: string
  profilePictureUrl: string
  onComplete: () => void
}

export function VibeCoderProfileForm({ userId, profilePictureUrl, onComplete }: VibeCoderProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagline: "",
      frequentTaskTypes: [],
      vibeCodingTools: [],
      estimatedMonthlyBudget: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Create vibe coder profile
      const { error: vibeCoderError } = await supabase.from("vibe_coder_profiles").insert({
        user_id: userId,
        tagline: values.tagline,
        frequent_task_types: values.frequentTaskTypes,
        vibe_coding_tools: values.vibeCodingTools,
        estimated_monthly_budget: Number(values.estimatedMonthlyBudget),
        profile_picture_url: profilePictureUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (vibeCoderError) throw vibeCoderError

      // Complete onboarding
      onComplete()
    } catch (error: any) {
      console.error("Profile submission error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Vibe Coder Profile</h2>
        <p className="text-muted-foreground">
          Tell us about your project needs and preferences to help find the right developers.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product Manager building the next big thing"
                    {...field}
                    className="resize-none"
                    rows={2}
                  />
                </FormControl>
                <FormDescription>A brief description of yourself or your project (max 100 characters)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
