"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Loader2, Mail, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

interface RegisterFormProps {
  defaultRole?: string
  onSuccess?: () => void
}

export function RegisterForm({ defaultRole = "developer", onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [registeredName, setRegisteredName] = useState("")
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      console.log("Starting registration process")

      // Sign up the user with Supabase directly
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
            role: defaultRole,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      // Create profile in database
      try {
        const profileData = {
          id: data.user?.id,
          email: values.email,
          full_name: values.name,
          role: defaultRole,
          profile_completed: false,
        }

        const { error: profileError } = await supabase.from("profiles").insert(profileData)

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      } catch (profileError) {
        console.error("Error creating profile:", profileError)
      }

      // Store registration data for the confirmation page
      localStorage.setItem(
        "pendingRegistration",
        JSON.stringify({
          email: values.email,
          name: values.name,
          role: defaultRole,
        }),
      )

      // Show confirmation screen
      setRegisteredEmail(values.email)
      setRegisteredName(values.name)
      setRegistrationComplete(true)

      toast({
        title: "Account created!",
        description: "Please check your email for confirmation instructions.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!registeredEmail) return

    setIsResending(true)
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: registeredEmail,
      })

      if (error) {
        throw error
      }

      setResendSuccess(true)
      toast({
        title: "Email resent",
        description: "We've sent another confirmation email to your address.",
      })
    } catch (error: any) {
      console.error("Error resending confirmation email:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to resend confirmation email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  // Show confirmation screen if registration is complete
  if (registrationComplete) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Confirm Your Email</CardTitle>
            <CardDescription>
              We've sent a confirmation email to <strong>{registeredEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Please check your inbox and click the confirmation link to complete your registration.
                {registeredName && <span> Thanks for joining us, {registeredName}!</span>}
              </p>
            </div>

            {resendSuccess && (
              <div className="flex items-center rounded-lg bg-green-50 p-3 text-green-800 text-sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Confirmation email resent successfully!</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button onClick={handleResendEmail} disabled={isResending || resendSuccess} className="w-full">
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Confirmation Email"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Show registration form if registration is not complete
  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
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
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  )
}
