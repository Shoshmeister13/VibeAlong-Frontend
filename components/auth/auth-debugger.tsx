"use client"

import { useState, useEffect } from "react"
import { useSupabase } from "@/components/providers/supabase-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function AuthDebugger() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [profileInfo, setProfileInfo] = useState<any>(null)
  const { supabase } = useSupabase()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSessionInfo(session)

        if (session?.user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          setProfileInfo(profile)
        }
      } catch (error) {
        console.error("Auth debug error:", error)
      }
    }

    checkAuth()
  }, [supabase])

  const handleResendConfirmation = async () => {
    if (!sessionInfo?.user?.email) {
      toast({
        title: "Error",
        description: "No user email found",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: sessionInfo.user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast({
        title: "Email Sent",
        description: "Confirmation email has been resent",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend email",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auth Debugger</CardTitle>
        <CardDescription>Use this tool to debug authentication issues</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Session Status</h3>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
            {sessionInfo ? JSON.stringify(sessionInfo, null, 2) : "No session found"}
          </pre>
        </div>

        <div>
          <h3 className="font-medium mb-2">Profile Status</h3>
          <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
            {profileInfo ? JSON.stringify(profileInfo, null, 2) : "No profile found"}
          </pre>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResendConfirmation} disabled={!sessionInfo?.user?.email}>
            Resend Confirmation Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
