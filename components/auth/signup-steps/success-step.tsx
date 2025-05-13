"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

interface SuccessStepProps {
  email: string
}

export function SuccessStep({ email }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
      <div className="rounded-full bg-green-100 p-3">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Account Created!</h2>
        <p className="text-muted-foreground">
          We've sent a confirmation email to <strong>{email}</strong>
        </p>
      </div>

      <div className="bg-muted p-4 rounded-lg max-w-md">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm text-left">
            <p className="font-medium">Please check your inbox and confirm your email address.</p>
            <p className="text-muted-foreground mt-1">
              After confirming your email, you'll be able to complete your profile and start using VibeAlong.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 w-full">
        <Button asChild className="w-full">
          <Link href="/auth/login">Go to Login</Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  )
}
