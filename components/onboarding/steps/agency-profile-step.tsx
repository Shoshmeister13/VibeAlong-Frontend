"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  agency_name: z.string().min(2, {
    message: "Agency name must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  services: z.array(z.string()).min(1, {
    message: "Please select at least one service.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  team_size: z.string().min(1, {
    message: "Please enter your team size.",
  }),
})

interface AgencyProfileStepProps {
  onPrevious: () => void
  onComplete: (data: any) => void
}

export function AgencyProfileStep({ onPrevious, onComplete }: AgencyProfileStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agency_name: "",
      description: "",
      services: [],
      website: "",
      team_size: "",
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const serviceOptions = [
    { label: "Web Development", value: "web_dev" },
    { label: "Mobile Development", value: "mobile_dev" },
    { label: "UI/UX Design", value: "ui_ux" },
    { label: "E-commerce", value: "ecommerce" },
    { label: "CMS Development", value: "cms" },
    { label: "API Development", value: "api" },
    { label: "Cloud Services", value: "cloud" },
    { label: "DevOps", value: "devops" },
    { label: "AI/ML Solutions", value: "ai_ml" },
    { label: "Blockchain Development", value: "blockchain" },
    { label: "IoT Solutions", value: "iot" },
    { label: "Enterprise Software", value: "enterprise" },
    { label: "Consulting", value: "consulting" },
    { label: "Staff Augmentation", value: "staff_aug" },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert services array to comma-separated string for storage
    const formattedData = {
      ...values,
      services: values.services.join(","),
      agency_profile: true,
    }

    await onComplete(formattedData)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Agency Profile</h2>
        <p className="text-muted-foreground">Tell us about your agency and the services you offer</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="agency_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agency Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your agency name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about your agency and what you specialize in..." {...field} rows={4} />
                </FormControl>
                <FormDescription>This will be displayed on your profile.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Services</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={serviceOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select services..."
                  />
                </FormControl>
                <FormDescription>Select the services your agency offers.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://youragency.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="team_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Size</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="Number of team members" {...field} />
                </FormControl>
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
