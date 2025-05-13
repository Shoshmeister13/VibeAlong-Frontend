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
import type { SignupData } from "../unified-signup-wizard"
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

interface VibeCoderProfileStepProps {
  signupData: SignupData
  onUpdate: (data: Partial<SignupData>) => void
  onBack: () => void
  onComplete: () => void
}

export function VibeCoderProfileStep({ signupData, onUpdate, onBack, onComplete }: VibeCoderProfileStepProps) {
  const [isLoading, setIsLoading] = useState(false)
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
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      toast({
        title: "Error",
        description: "Account information is missing. Please go back and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            full_name: signupData.fullName,
            role: "vibe-coder",
            avatar_url: signupData.profilePictureUrl,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
      if (!data.user) throw new Error("User creation failed")

      const userId = data.user.id

      // Create profile record
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: signupData.fullName,
        email: signupData.email,
        role: "vibe-coder",
        avatar_url: signupData.profilePictureUrl,
        profile_completed: false, // Will be completed after email verification
      })

      if (profileError) throw profileError

      // Create vibe coder profile
      const { error: vibeCoderError } = await supabase.from("vibe_coder_profiles").insert({
        user_id: userId,
        full_name: signupData.fullName,
        tagline: values.tagline,
        frequent_task_types: values.frequentTaskTypes,
        vibe_coding_tools: values.vibeCodingTools,
        estimated_monthly_budget: Number(values.estimatedMonthlyBudget),
        profile_picture_url: signupData.profilePictureUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (vibeCoderError) throw vibeCoderError

      // Update signup data with profile information
      onUpdate({
        profileData: values,
      })

      // Complete the signup process
      onComplete()
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to complete signup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Vibe Coder Profile</h2>
        <p className="text-muted-foreground mt-1">Tell us about your projects and preferences</p>
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
                <FormDescription>A short description that appears under your name</FormDescription>
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

          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={onBack} type="button" disabled={isLoading}>
              Back
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Signup...
                </>
              ) : (
                "Complete Signup"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
