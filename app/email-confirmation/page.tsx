"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailConfirmationPage() {
  const router = useRouter()
  const email =
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("pendingDevProfile") || "{}")?.email : ""

  useEffect(() => {
    // Check if we have pending profile data
    const pendingProfile = localStorage.getItem("pendingDevProfile")
    if (!pendingProfile) {
      // No pending profile, redirect to signup
      router.push("/signup-dev")
    }
  }, [router])

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Check your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a confirmation link to <span className="font-medium">{email || "your email address"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Please click the link in the email to verify your account. After verification, you'll be able to log in and
            complete your profile setup.
          </p>
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Waiting for email confirmation...</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.location.href = `mailto:${email || ""}`
            }}
          >
            Open email app
          </Button>
          <Button className="w-full" onClick={() => router.push("/auth/login")}>
            Continue to login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
