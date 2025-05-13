"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProfileCompletionLayout } from "./profile-completion-layout"
import { Code, Users, Building } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { toast } from "@/components/ui/use-toast"

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, updateUserProfile } = useAuth()
  const supabase = createClient()

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
  }

  const handleContinue = async () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You need to select a role to continue.",
        variant: "destructive",
      })
      return
    }

    if (!user?.id) {
      toast({
        title: "Authentication error",
        description: "You need to be logged in to continue. Please refresh and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log(`Updating role to ${selectedRole} for user ${user.id}`)

      // Update user profile with selected role
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: selectedRole,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("Profile update error:", profileError)
        throw profileError
      }

      // Also update user metadata
      await updateUserProfile({ role: selectedRole as any })

      // Normalize role for redirect
      const normalizedRole = selectedRole === "vibe_coder" ? "vibe-coder" : selectedRole

      // Redirect to appropriate onboarding page based on role
      const redirectPath = `/onboarding/${normalizedRole}`
      console.log(`Redirecting to ${redirectPath}`)
      router.push(redirectPath)
    } catch (error: any) {
      console.error("Role selection error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProfileCompletionLayout
      step={1}
      totalSteps={2}
      title="Welcome to VibeAlong"
      description="Let's get started by selecting your role"
      stepLabels={["Role Selection", "Profile Details"]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Select Your Role</CardTitle>
          <CardDescription>Choose the role that best describes how you'll use VibeAlong</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === "developer" ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => handleRoleSelect("developer")}
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Developer</h3>
                <p className="text-sm text-muted-foreground">
                  I want to work on development tasks and get paid for my skills
                </p>
              </div>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === "vibe-coder" ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => handleRoleSelect("vibe-coder")}
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Vibe Coder</h3>
                <p className="text-sm text-muted-foreground">
                  I want to post tasks and hire developers to work on my projects
                </p>
              </div>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === "agency" ? "border-primary bg-primary/5" : "hover:border-primary/50"
            }`}
            onClick={() => handleRoleSelect("agency")}
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Agency</h3>
                <p className="text-sm text-muted-foreground">
                  I represent a development agency looking to find projects for my team
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleContinue} disabled={!selectedRole || isLoading}>
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </ProfileCompletionLayout>
  )
}
