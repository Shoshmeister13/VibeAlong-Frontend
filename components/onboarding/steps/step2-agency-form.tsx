"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { OnboardingData } from "../onboarding-wizard"

const formSchema = z.object({
  agencyName: z.string().min(2, {
    message: "Agency name must be at least 2 characters.",
  }),
  contactEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  totalDevelopers: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid number of developers.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
})

interface Step2AgencyFormProps {
  onboardingData: OnboardingData
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  isSubmitting: boolean
}

export function Step2AgencyForm({ onboardingData, onNext, onBack, isSubmitting }: Step2AgencyFormProps) {
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agencyName: "",
      contactEmail: onboardingData.email || "",
      totalDevelopers: "",
      website: "",
    },
  })

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!onboardingData.userId) {
      console.error("User ID is missing")
      return
    }

    try {
      // Create agency profile
      const { error: agencyError } = await supabase.from("agency_profiles").insert({
        user_id: onboardingData.userId,
        agency_name: values.agencyName,
        contact_email: values.contactEmail,
        website: values.website || null,
        total_developers: Number(values.totalDevelopers) || 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (agencyError) throw agencyError

      // Move to next step
      onNext({
        profileData: values,
      })
    } catch (error) {
      console.error("Error saving agency profile:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Agency Profile</h2>
        <p className="text-muted-foreground mt-1">Tell us about your agency</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="agencyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agency Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Development" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@acme.com" {...field} />
                </FormControl>
                <FormDescription>Email address for agency communications</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalDevelopers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Developers</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="10" {...field} />
                </FormControl>
                <FormDescription>How many developers work at your agency?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://acme.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={onBack} type="button">
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
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
