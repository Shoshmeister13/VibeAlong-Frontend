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
  developerCount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid number of developers.",
  }),
})

interface AgencyProfileFormProps {
  userId: string
  profilePictureUrl: string
  onComplete: () => void
}

export function AgencyProfileForm({ userId, profilePictureUrl, onComplete }: AgencyProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agencyName: "",
      contactEmail: "",
      website: "",
      developerCount: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Create agency profile
      const { error: agencyError } = await supabase.from("agency_profiles").insert({
        user_id: userId,
        agency_name: values.agencyName,
        contact_email: values.contactEmail,
        website: values.website || null,
        developer_count: Number(values.developerCount),
        logo_url: profilePictureUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (agencyError) throw agencyError

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
        <h2 className="text-2xl font-semibold">Agency Profile</h2>
        <p className="text-muted-foreground">Tell us about your agency to help clients find you.</p>
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

          <FormField
            control={form.control}
            name="developerCount"
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
