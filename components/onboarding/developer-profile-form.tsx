"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  experienceLevel: z.string({
    required_error: "Please select your experience level.",
  }),
  skills: z.array(z.string()).min(1, {
    message: "Please select at least one skill.",
  }),
  vibeCodingTools: z.array(z.string()).min(1, {
    message: "Please select at least one vibe-coding tool.",
  }),
  githubUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  availability: z.string({
    required_error: "Please select your availability.",
  }),
  hourlyRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid hourly rate greater than 0.",
  }),
})

const skillOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Django", value: "django" },
  { label: "Flask", value: "flask" },
  { label: "Ruby", value: "ruby" },
  { label: "Ruby on Rails", value: "rails" },
  { label: "PHP", value: "php" },
  { label: "Laravel", value: "laravel" },
  { label: "Vue.js", value: "vuejs" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Java", value: "java" },
  { label: "Spring Boot", value: "spring" },
  { label: "C#", value: "csharp" },
  { label: ".NET", value: "dotnet" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "SQL", value: "sql" },
  { label: "MongoDB", value: "mongodb" },
  { label: "GraphQL", value: "graphql" },
  { label: "AWS", value: "aws" },
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "DevOps", value: "devops" },
  { label: "Mobile Development", value: "mobile" },
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

interface DeveloperProfileFormProps {
  userId: string
  profilePictureUrl: string
  onComplete: () => void
}

export function DeveloperProfileForm({ userId, profilePictureUrl, onComplete }: DeveloperProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagline: "",
      experienceLevel: "",
      skills: [],
      vibeCodingTools: [],
      githubUrl: "",
      availability: "",
      hourlyRate: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Create developer profile
      const { error: developerError } = await supabase.from("developer_profiles").insert({
        user_id: userId,
        tagline: values.tagline,
        experience_level: values.experienceLevel,
        skills: values.skills,
        vibe_coding_tools: values.vibeCodingTools,
        github_url: values.githubUrl || null,
        availability: values.availability,
        hourly_rate: Number(values.hourlyRate),
        profile_picture_url: profilePictureUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (developerError) throw developerError

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
        <h2 className="text-2xl font-semibold">Developer Profile</h2>
        <p className="text-muted-foreground">
          Tell us about your skills and experience to help match you with the right projects.
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
                    placeholder="Full-stack developer specializing in React and Node.js"
                    {...field}
                    className="resize-none"
                    rows={2}
                  />
                </FormControl>
                <FormDescription>A brief description of yourself (max 100 characters)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid-Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    <SelectItem value="lead">Lead/Architect (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={skillOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select skills..."
                  />
                </FormControl>
                <FormDescription>Select all the technologies you're proficient in</FormDescription>
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
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/yourusername" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time (40+ hrs/week)</SelectItem>
                    <SelectItem value="part-time">Part-Time (20-30 hrs/week)</SelectItem>
                    <SelectItem value="freelance">Freelance (Flexible hours)</SelectItem>
                    <SelectItem value="occasional">Occasional (5-15 hrs/week)</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How much time can you dedicate to VibeAlong projects?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate (USD)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="50" {...field} />
                </FormControl>
                <FormDescription>Your preferred hourly rate for development work</FormDescription>
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
