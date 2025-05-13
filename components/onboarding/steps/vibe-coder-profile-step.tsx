"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    }),
  project_types: z.array(z.string()).min(1, {
    message: "Please select at least one project type.",
  }),
  company: z.string().optional(),
  is_hiring: z.boolean().default(false),
  budget_range: z.string().min(1, {
    message: "Please enter your typical budget range.",
  }),
})

interface VibeCodingProfileStepProps {
  onPrevious: () => void
  onComplete: (data: any) => void
}

export function VibeCodingProfileStep({ onPrevious, onComplete }: VibeCodingProfileStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      project_types: [],
      company: "",
      is_hiring: false,
      budget_range: "",
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const projectTypeOptions = [
    { label: "Web Applications", value: "web_apps" },
    { label: "Mobile Applications", value: "mobile_apps" },
    { label: "E-commerce", value: "ecommerce" },
    { label: "CMS", value: "cms" },
    { label: "API Development", value: "api" },
    { label: "Data Visualization", value: "data_viz" },
    { label: "AI/ML Integration", value: "ai_ml" },
    { label: "Blockchain", value: "blockchain" },
    { label: "IoT", value: "iot" },
    { label: "Enterprise Software", value: "enterprise" },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert project_types array to comma-separated string for storage
    const formattedData = {
      ...values,
      project_types: values.project_types.join(","),
      vibe_coder_profile: true,
    }

    await onComplete(formattedData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Vibe Coder Profile</h2>
        <p className="text-muted-foreground">Tell us about your project needs and preferences</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself and what you're looking to build..."
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>This will be displayed on your profile.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_types"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Types</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={projectTypeOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select project types..."
                  />
                </FormControl>
                <FormDescription>Select the types of projects you're interested in.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Your company name" {...field} />
                </FormControl>
                <FormDescription>If you're representing a company, enter its name here.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_hiring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I'm looking to hire developers</FormLabel>
                  <FormDescription>
                    Check this if you're actively looking to hire developers for your projects.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="budget_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typical Budget Range</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $5,000-$10,000" {...field} />
                </FormControl>
                <FormDescription>Enter your typical budget range for projects.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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
