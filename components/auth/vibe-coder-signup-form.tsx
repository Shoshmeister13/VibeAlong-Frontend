"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Code, Zap, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export function VibeCoderSignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const router = useRouter()

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
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

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Use the API route to create and sign in the user
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up")
      }

      toast({
        title: "Success!",
        description: "Welcome to VibeAlong! You're now signed in.",
      })

      // Redirect directly to create project page
      router.push("/create-project")
    } catch (error: any) {
      console.error("Signup error:", error)
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
    <div className="flex min-h-screen">
      {/* Side Section */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white p-8 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-12">
            <Image src="/icon.png" alt="VibeAlong Logo" width={40} height={40} className="h-10 w-auto" />
            <span className="text-xl font-bold">VibeAlong</span>
          </Link>

          <h1 className="text-4xl font-bold mb-6">Become a Vibe-Coder & start creating magic</h1>
          <p className="text-xl mb-8">Turn your ideas into reality with our network of top-tier developers.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Rapid development</h3>
              <p className="text-white/70">Get your projects built in record time by skilled developers.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Quality code guaranteed</h3>
              <p className="text-white/70">Our devs deliver clean, maintainable code that just works.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Find your perfect match</h3>
              <p className="text-white/70">Connect with developers who match your style and vision.</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-white/50 text-sm">© 2023 VibeAlong. All rights reserved.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 text-center md:hidden mb-8">
            <Image src="/icon.png" alt="VibeAlong Logo" width={80} height={80} className="mb-2" />
            <h1 className="text-3xl font-bold">Join VibeAlong as a Vibe-Coder</h1>
            <p className="text-muted-foreground">Start your project, get matched with top devs.</p>
          </div>

          <div className="hidden md:block mb-6">
            <h1 className="text-3xl font-bold mb-2">Join as a Vibe-Coder</h1>
            <p className="text-muted-foreground">Start your project, get matched with top devs.</p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
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
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create My Account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
