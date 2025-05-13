"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  agencyName: z.string().min(2, {
    message: "Agency name must be at least 2 characters",
  }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  contactEmail: z.string().email({
    message: "Please enter a valid email address",
  }),
  developerCount: z.coerce.number().min(1, { message: "Developer count must be at least 1" }),
})

interface AgencyStep2Props {
  onComplete: (data: {
    agencyName: string
    website: string
    contactEmail: string
    developerCount: number
  }) => void
}

export function AgencyStep2({ onComplete }: AgencyStep2Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agencyName: "",
      website: "",
      contactEmail: "",
      developerCount: 1,
    },
  })

  const isSubmitting = form.formState.isSubmitting

  function onSubmit(values: z.infer<typeof formSchema>) {
    onComplete(values)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Agency Details</h2>
        <p className="text-sm text-muted-foreground">Tell us about your agency to help clients find you.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
