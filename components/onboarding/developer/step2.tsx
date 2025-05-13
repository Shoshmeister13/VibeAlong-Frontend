"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  tagline: z
    .string()
    .min(5, {
      message: "Tagline must be at least 5 characters",
    })
    .max(100, {
      message: "Tagline must not exceed 100 characters",
    }),
  experienceLevel: z.string({
    required_error: "Please select your experience level",
  }),
  skills: z.array(z.string()).min(1, {
    message: "Please select at least one skill",
  }),
  githubUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  hourlyRate: z.coerce.number().min(1, { message: "Hourly rate must be at least 1" }),
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

interface DeveloperStep2Props {
  onComplete: (data: {
    tagline: string
    experienceLevel: string
    skills: string[]
    githubUrl: string
    hourlyRate: number
  }) => void
}

export function DeveloperStep2({ onComplete }: DeveloperStep2Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagline: "",
      experienceLevel: "",
      skills: [],
      githubUrl: "",
      hourlyRate: 0,
    },
  })

  const isSubmitting = form.formState.isSubmitting

  function onSubmit(values: z.infer<typeof formSchema>) {
    onComplete(values)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Developer Details</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your skills and experience to help match you with the right projects.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Tagline</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Full-stack developer specializing in React and Node.js"
                    {...field}
                    className="resize-none"
                  />
                </FormControl>
                <FormDescription>A brief description of your professional expertise</FormDescription>
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
                    placeholder="Select your skills"
                  />
                </FormControl>
                <FormDescription>Select all the technologies you're proficient in</FormDescription>
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
                <FormDescription>Link to your GitHub profile</FormDescription>
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
                  Completing...
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
