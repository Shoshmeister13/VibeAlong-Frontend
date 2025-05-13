"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function ConfirmEmailPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard after a short delay
    // This page is no longer needed as we're skipping email confirmation
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Redirecting to Dashboard</CardTitle>
          <CardDescription>Email confirmation is no longer required</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="rounded-full bg-primary/10 p-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              You'll be redirected to your dashboard automatically.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={() => router.push("/dashboard")} className="w-full">
            Go to Dashboard Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
