"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Role = "developer" | "vibe-coder" | "agency"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<Role>("vibe-coder")
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  })

  const router = useRouter()

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      role: "",
    }
    let isValid = true

    if (!fullName || fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters"
      isValid = false
    }

    if (!email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setIsLoading(true)

    try {
      console.log("Creating user with email:", email, "and role:", role)

      // Step 1: Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
          // Skip email confirmation completely
          emailRedirectTo: undefined,
        },
      })

      if (error) {
        console.error("Signup error:", error)
        throw error
      }

      if (!data.user) {
        throw new Error("User creation failed")
      }

      console.log("User created successfully:", data.user.id)
      const userId = data.user.id

      // Step 2: Store user details in the appropriate profile table
      try {
        // Convert UI role format to database format if needed
        let dbRole = role
        let profileTable = ""

        if (dbRole === "vibe-coder") {
          dbRole = "vibe_coder"
          profileTable = "vibe_coders"
        } else if (dbRole === "developer") {
          profileTable = "devs"
        } else if (dbRole === "agency") {
          profileTable = "agency_profiles"
        }

        console.log(`Creating profile in ${profileTable} table`)

        const profileData = {
          user_id: userId,
          full_name: fullName,
          email,
          profile_completed: false, // Start with incomplete profile
        }

        const { error: profileError } = await supabase.from(profileTable).insert(profileData)

        if (profileError) {
          console.error(`${profileTable} creation error:`, profileError)
          // Non-critical error, continue with sign-in
        } else {
          console.log(`${profileTable} created successfully`)
        }
      } catch (profileError) {
        // If profiles table doesn't exist, just log the error and continue
        console.error("Profile creation error (non-critical):", profileError)
      }

      // Step 3: Sign in the user immediately
      console.log("Signing in user automatically")
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("Auto sign-in error:", signInError)
        throw signInError
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })

      // For new users, redirect to appropriate onboarding
      if (role === "developer") {
        router.push("/onboarding/developer")
      } else if (role === "vibe-coder") {
        router.push("/onboarding/vibe-coder")
      } else {
        router.push("/onboarding/agency")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "Failed to sign up. Please try again.")
      toast({
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Create an account</h2>
        <p className="text-muted-foreground">Enter your information to get started</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">I am a...</label>
          <RadioGroup
            value={role}
            onValueChange={(value) => setRole(value as Role)}
            className="flex flex-col space-y-1"
            disabled={isLoading}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="developer" id="developer" />
              <label htmlFor="developer" className="text-sm font-normal">
                Developer - I want to work on projects
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="vibe-coder" id="vibe-coder" />
              <label htmlFor="vibe-coder" className="text-sm font-normal">
                Vibe Coder - I need help with my projects
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="agency" id="agency" />
              <label htmlFor="agency" className="text-sm font-normal">
                Agency - I represent a development agency
              </label>
            </div>
          </RadioGroup>
          {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
        </div>

        <div className="pt-4 flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
