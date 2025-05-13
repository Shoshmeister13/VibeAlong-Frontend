"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
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
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
})

interface AgencyProfileFormProps {
  onboardingData: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onBack: () => void
  onComplete: () => void
}

export function AgencyProfileForm({ onboardingData, onUpdate, onBack, onComplete }: AgencyProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agencyName: "",
      contactEmail: onboardingData.email || "",
      website: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!onboardingData.email || !onboardingData.password || !onboardingData.fullName) {
      toast({
        title: "Error",
        description: "Account information is missing. Please go back and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // IMPORTANT: This is where we create the Supabase auth user - at the end of step 3
      const { data, error } = await supabase.auth.signUp({
        email: onboardingData.email,
        password: onboardingData.password,
        options: {
          data: {
            full_name: onboardingData.fullName,
            role: "agency",
          },
          emailRedirectTo: "https://www.vibealong.dev/dashboard",
        },
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("User creation failed")
      }

      const userId = data.user.id

      // Create the profile record
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: values.agencyName,
        email: onboardingData.email,
        role: "agency",
        profile_completed: true,
      })

      if (profileError) {
        throw profileError
      }

      // Create the agency profile
      const { error: agencyError } = await supabase.from("agency_profiles").insert({
        user_id: userId,
        agency_name: values.agencyName,
        contact_email: values.contactEmail,
        website: values.website || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (agencyError) {
        throw agencyError
      }

      // Update onboarding data with profile information
      onUpdate({
        profileData: values,
      })

      // Complete the onboarding process
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
        <h2 className="text-xl font-semibold">Agency Profile</h2>
        <p className="text-muted-foreground mt-1">Tell us about your agency</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
