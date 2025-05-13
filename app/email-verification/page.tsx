"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Mail, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function EmailVerificationPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        const user = data.session.user
        setEmail(user.email)

        // Check if email is already verified
        if (user.email_confirmed_at) {
          window.location.href = "/dashboard"
        }
      } else {
        // Try to get from session storage
        const storedData = sessionStorage.getItem("signupData")
        if (storedData) {
          const { email } = JSON.parse(storedData)
          setEmail(email)
        }
      }

      setIsLoading(false)
    }

    checkSession()
  }, [supabase])

  const handleResendEmail = async () => {
    if (!email) return

    setIsResending(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      toast({
        title: "Verification email resent",
        description: "Please check your inbox for the verification link.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <Card>
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col items-center text-center space-y-6 py-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Verify your email</h2>
              <p className="text-muted-foreground">
                We've sent a verification email to <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg w-full">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 mt-0.5 text-primary" />
                <div className="text-sm text-left">
                  <p className="font-medium">Please verify your email to continue</p>
                  <p className="text-muted-foreground mt-1">
                    Check your inbox and click the verification link to activate your account. You won't be able to
                    access your dashboard until your email is verified.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <Button variant="outline" className="w-full" onClick={handleResendEmail} disabled={isResending}>
                {isResending ? "Resending..." : "Resend verification email"}
              </Button>

              <p className="text-xs text-muted-foreground">
                Didn't receive an email? Check your spam folder or click the button above to resend.
              </p>
            </div>

            <div className="w-full pt-4 border-t">
              <Link href="/auth/login">
                <Button variant="link" className="w-full">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
