"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export function DirectLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Try to sign in directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          // Try the manual confirmation API
          const response = await fetch("/api/auth/manual-confirm", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          })

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.error || "Failed to bypass confirmation")
          }

          if (result.success) {
            toast({
              title: "Login successful!",
              description: "Redirecting to your dashboard...",
            })

            // Redirect to onboarding
            window.location.href = result.redirectTo || "/onboarding/role-selection"
            return
          } else {
            toast({
              title: "Email confirmation required",
              description: result.message || "Please check your email for confirmation instructions.",
              variant: "destructive",
            })

            // Store email for the confirmation page
            localStorage.setItem(
              "pendingRegistration",
              JSON.stringify({
                email: values.email,
              }),
            )

            // Redirect to confirmation page
            window.location.href = "/auth/confirm-email"
            return
          }
        } else {
          throw error
        }
      }

      if (data.user) {
        toast({
          title: "Login successful!",
          description: "Redirecting to your dashboard...",
        })

        // Check if profile exists and is completed
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, profile_completed")
          .eq("id", data.user.id)
          .single()

        if (profile && !profile.profile_completed) {
          // Redirect to onboarding
          window.location.href = "/onboarding/role-selection"
        } else {
          // Redirect to dashboard
          window.location.href = "/dashboard"
        }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to log in. Please check your credentials.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Direct Login</h1>
        <p className="text-muted-foreground">Use this form to bypass email confirmation</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login & Continue"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
