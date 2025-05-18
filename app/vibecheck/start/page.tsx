"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Info,
  Github,
  Mail,
  Eye,
  EyeOff,
  Plus,
  CheckCircle2,
} from "lucide-react"
import { primaryVibePlatforms } from "@/components/vibe-platform-logos"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function VibeCheckStart() {
  const router = useRouter()
  const [step, setStep] = useState(-1) // Start with signup step (-1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vibeCheckRunning, setVibeCheckRunning] = useState(false)
  const [vibeCheckProgress, setVibeCheckProgress] = useState(0)
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [otherPlatform, setOtherPlatform] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authMethod, setAuthMethod] = useState<"email" | "github" | "gmail" | null>(null)
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [signupErrors, setSignupErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
  })
  const [answers, setAnswers] = useState({
    projectTitle: "",
    projectDescription: "",
    platform: "",
    killerFeature: "",
    plannedFeatures: [], // Store planned features as an array
    challenges: "",
  })
  const [newFeature, setNewFeature] = useState("")

  // Load saved answers from localStorage if available
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem("vibecheck_answers")
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers))
      }

      // Check if user is already logged in
      const isLoggedIn = localStorage.getItem("vibecoder_logged_in")
      if (isLoggedIn === "true") {
        setStep(0) // Skip signup step if already logged in
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }

    // Check if we have a step query param
    const params = new URLSearchParams(window.location.search)
    const stepParam = params.get("step")
    if (stepParam && !isNaN(Number.parseInt(stepParam))) {
      setStep(Number.parseInt(stepParam))
      // Clean up the URL
      window.history.replaceState({}, document.title, "/vibecheck/start")
    }
  }, [])

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (Object.values(answers).some((value) => value !== "")) {
      localStorage.setItem("vibecheck_answers", JSON.stringify(answers))
    }
  }, [answers])

  // Simulate VibeCheck progress
  useEffect(() => {
    if (vibeCheckRunning) {
      const interval = setInterval(() => {
        setVibeCheckProgress((prev) => {
          const newProgress = prev + Math.random() * 5
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [vibeCheckRunning])

  const validateSignupForm = () => {
    const errors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
    }
    let isValid = true

    // Validate full name
    if (!signupData.fullName.trim()) {
      errors.fullName = "Full name is required"
      isValid = false
    } else if (signupData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters"
      isValid = false
    }

    // Validate email
    if (!signupData.email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    // Only validate password for email signup
    if (authMethod === "email") {
      // Validate password
      if (!signupData.password) {
        errors.password = "Password is required"
        isValid = false
      } else if (signupData.password.length < 8) {
        errors.password = "Password must be at least 8 characters"
        isValid = false
      }

      // Validate confirm password
      if (!signupData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password"
        isValid = false
      } else if (signupData.password !== signupData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
        isValid = false
      }
    }

    // Validate terms agreement
    if (!signupData.agreeTerms) {
      errors.agreeTerms = "You must agree to the terms and conditions"
      isValid = false
    }

    setSignupErrors(errors)
    return isValid
  }

  const handleSignupSubmit = async () => {
    if (!validateSignupForm()) return

    setIsLoading(true)

    try {
      // Simulate API call for signup
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store login state in localStorage (in a real app, this would be a token or session)
      localStorage.setItem("vibecoder_logged_in", "true")
      localStorage.setItem("vibecoder_auth_method", authMethod || "email")
      localStorage.setItem("vibecoder_name", signupData.fullName)

      // Move to the next step
      setStep(0)
    } catch (error) {
      console.error("Error during signup:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignup = async () => {
    setAuthMethod("github")
    setIsLoading(true)

    try {
      // Simulate GitHub OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would be handled by the OAuth provider
      localStorage.setItem("vibecoder_logged_in", "true")
      localStorage.setItem("vibecoder_auth_method", "github")
      localStorage.setItem("vibecoder_name", "GitHub User")

      // Move to the next step
      setStep(0)
    } catch (error) {
      console.error("Error during GitHub signup:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGmailSignup = async () => {
    setAuthMethod("gmail")
    setIsLoading(true)

    try {
      // Simulate Gmail OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, this would be handled by the OAuth provider
      localStorage.setItem("vibecoder_logged_in", "true")
      localStorage.setItem("vibecoder_auth_method", "gmail")
      localStorage.setItem("vibecoder_name", "Gmail User")

      // Move to the next step
      setStep(0)
    } catch (error) {
      console.error("Error during Gmail signup:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubConnect = () => {
    // Simulate GitHub connection
    setVibeCheckRunning(true)
    setStep(1)
  }

  const handleInputChange = (field: keyof typeof answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignupInputChange = (field: keyof typeof signupData, value: any) => {
    setSignupData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSuggestionClick = (field: keyof typeof answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }))
    // Auto-advance after a short delay
    setTimeout(() => {
      if (step < totalSteps - 1) {
        setStep(step + 1)
      }
    }, 500)
  }

  const handlePlatformSelect = (value: string) => {
    setSelectedPlatform(value)
    if (value !== "other") {
      handleInputChange("platform", value)
    } else {
      handleInputChange("platform", otherPlatform)
    }
  }

  const handleOtherPlatformChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherPlatform(e.target.value)
    handleInputChange("platform", e.target.value)
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setAnswers((prev) => ({
        ...prev,
        plannedFeatures: [...prev.plannedFeatures, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setAnswers((prev) => ({
      ...prev,
      plannedFeatures: prev.plannedFeatures.filter((_, i) => i !== index),
    }))
  }

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > -1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call to process the VibeCheck
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save final answers to localStorage
      localStorage.setItem("vibecheck_answers", JSON.stringify(answers))

      // Redirect to results page
      router.push("/dashboard/vibecheck")
    } catch (error) {
      console.error("Error submitting VibeCheck:", error)
      setIsSubmitting(false)
    }
  }

  const openGithubSignup = () => {
    window.open("https://github.com/signup", "_blank")
  }

  const openV0GithubDocs = () => {
    window.open("https://v0.dev/docs/github-integration", "_blank")
  }

  const openReplitGithubDocs = () => {
    window.open("https://docs.replit.com/programming-ide/using-git-on-replit", "_blank")
  }

  const totalSteps = 8 // Signup + GitHub connection + 5 questions + confirmation
  const currentStepNumber = step + 2 // Adjust for display (starting from 1, with signup as step 1)

  // Replace dynamic suggestions with popular feature suggestions
  const generateSuggestions = () => {
    return [
      "🌙 Dark mode / Light mode toggle",
      "📱 Responsive mobile design",
      "🔒 Two-factor authentication",
      "🔍 Advanced search functionality",
      "🔔 Push notifications",
      "📊 Analytics dashboard",
    ]
  }

  const suggestions = generateSuggestions()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* VibeCheck Progress Indicator */}
      {vibeCheckRunning && (
        <div className="sticky top-0 z-50 w-full bg-black text-white py-2 px-4">
          <div className="container max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {vibeCheckProgress >= 100 ? (
                  <>
                    <div className="mr-2">🎉</div>
                    <span className="font-medium">
                      VibeCheck ready! Complete your project details to unlock insights!
                    </span>
                  </>
                ) : (
                  <>
                    <div className="animate-pulse mr-2">✨</div>
                    <span className="font-medium">VibeCheck running in the background</span>
                  </>
                )}
              </div>
              <div className="text-sm">{Math.round(vibeCheckProgress)}% complete</div>
            </div>
            <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300 ease-in-out"
                style={{ width: `${vibeCheckProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content */}

      {/* Progress bar - Above steps fields */}
      <div className="w-full max-w-4xl mx-auto mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-black flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </button>
            <div className="text-sm text-gray-500">
              Step {currentStepNumber} of {totalSteps}
            </div>
          </div>
          <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-black h-full transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form steps */}
      <div className="w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === -1 && (
            <div className="w-full max-w-6xl mx-auto">
              <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col items-center">
                  {/* Why Get a Vibe Check Section - Now First */}
                  <motion.div
                    key="why-vibecheck"
                    className="w-full max-w-3xl mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-3xl font-bold mb-3">Why Get a Vibe Check?</h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Transform your AI-generated code into production-ready software with expert insights.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 text-black mr-2" />
                          <h3 className="font-semibold">Code Analysis</h3>
                        </div>
                        <p className="text-sm text-gray-600">Get insights on code quality and architecture</p>
                      </div>

                      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 text-black mr-2" />
                          <h3 className="font-semibold">Development Plan</h3>
                        </div>
                        <p className="text-sm text-gray-600">Receive a prioritized roadmap with time estimates</p>
                      </div>

                      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-2">
                          <CheckCircle2 className="h-5 w-5 text-black mr-2" />
                          <h3 className="font-semibold">Expert Support</h3>
                        </div>
                        <p className="text-sm text-gray-600">Access vetted developers to implement tasks</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Signup Form - Now Second */}
                  <motion.div
                    key="signup-step"
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">First, Open Your Account</h1>
                        <p className="text-gray-600">Create an account to start your VibeCheck</p>
                      </div>

                      <div className="space-y-4 mb-6">
                        <Button
                          onClick={handleGithubSignup}
                          className="w-full flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#1b1f23] text-white py-2 h-10"
                          disabled={isLoading}
                        >
                          <Github className="h-4 w-4" />
                          <span>Sign up with GitHub</span>
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded ml-1">Recommended</span>
                        </Button>

                        <Button
                          onClick={handleGmailSignup}
                          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 h-10"
                          disabled={isLoading}
                        >
                          <Mail className="h-4 w-4 text-red-500" />
                          <span>Sign up with Gmail</span>
                        </Button>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300"></span>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="fullName" className="text-sm font-medium">
                            Full Name
                          </Label>
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            value={signupData.fullName}
                            onChange={(e) => handleSignupInputChange("fullName", e.target.value)}
                            className={`mt-1 ${signupErrors.fullName ? "border-red-500" : ""}`}
                          />
                          {signupErrors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{signupErrors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={signupData.email}
                            onChange={(e) => handleSignupInputChange("email", e.target.value)}
                            className={`mt-1 ${signupErrors.email ? "border-red-500" : ""}`}
                          />
                          {signupErrors.email && <p className="text-red-500 text-sm mt-1">{signupErrors.email}</p>}
                        </div>

                        <div>
                          <Label htmlFor="password" className="text-sm font-medium">
                            Password
                          </Label>
                          <div className="relative mt-1">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={signupData.password}
                              onChange={(e) => handleSignupInputChange("password", e.target.value)}
                              className={signupErrors.password ? "border-red-500 pr-10" : "pr-10"}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {signupErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{signupErrors.password}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={signupData.confirmPassword}
                            onChange={(e) => handleSignupInputChange("confirmPassword", e.target.value)}
                            className={`mt-1 ${signupErrors.confirmPassword ? "border-red-500" : ""}`}
                          />
                          {signupErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{signupErrors.confirmPassword}</p>
                          )}
                        </div>

                        <div className="flex items-start space-x-2 mt-4">
                          <Checkbox
                            id="terms"
                            checked={signupData.agreeTerms}
                            onCheckedChange={(checked) => handleSignupInputChange("agreeTerms", checked)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="terms"
                              className={`text-sm font-medium leading-none ${
                                signupErrors.agreeTerms ? "text-red-500" : "text-gray-900"
                              }`}
                            >
                              I agree to the Terms of Service and Privacy Policy
                            </label>
                            {signupErrors.agreeTerms && (
                              <p className="text-red-500 text-sm">{signupErrors.agreeTerms}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          onClick={handleSignupSubmit}
                          className="w-full bg-black hover:bg-gray-800 text-white py-2 h-10"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account & Continue"
                          )}
                        </Button>
                      </div>

                      <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <a href="/auth/login" className="text-black font-medium hover:underline">
                          Sign in
                        </a>
                      </p>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {step === 0 && (
            <motion.div
              key="github-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold mb-2">🔗 Connect Your GitHub Project</h1>
                  <p className="text-gray-600">
                    We'll scan your repo with read-only access to generate your VibeCheck.
                  </p>
                </div>

                {localStorage.getItem("vibecoder_auth_method") === "github" ? (
                  <div className="mb-8">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-start mb-6">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-green-800">GitHub Connected</h3>
                        <p className="text-green-700 text-sm">
                          Your GitHub account is connected. Select a repository to analyze.
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg divide-y">
                      <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">personal-website</h4>
                            <p className="text-sm text-gray-500">Last updated 2 days ago</p>
                          </div>
                          <Button size="sm" onClick={handleGithubConnect}>
                            Select
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">task-manager-app</h4>
                            <p className="text-sm text-gray-500">Last updated 1 week ago</p>
                          </div>
                          <Button size="sm" onClick={handleGithubConnect}>
                            Select
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">e-commerce-dashboard</h4>
                            <p className="text-sm text-gray-500">Last updated 3 weeks ago</p>
                          </div>
                          <Button size="sm" onClick={handleGithubConnect}>
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center mb-6">
                    <Button
                      onClick={handleGithubConnect}
                      className="bg-black hover:bg-gray-800 text-white px-6 py-6 h-auto text-base flex items-center gap-2 group"
                    >
                      <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Connect GitHub
                    </Button>
                  </div>
                )}

                <p className="text-sm text-gray-500 text-center mb-8">
                  You'll be able to choose the specific repo to scan.
                </p>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Github className="h-4 w-4 mr-2" />
                    No GitHub? Connect your project
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {primaryVibePlatforms.slice(0, 4).map((platform) => (
                      <div
                        key={platform.id}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-gray-300 transition-all flex items-center"
                      >
                        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md border border-gray-200 mr-3 flex-shrink-0 overflow-hidden">
                          <img
                            src={
                              platform.id === "lovable"
                                ? "/platform-logos/lovable-logo.jpeg"
                                : `/platform-logos/${platform.id}-logo.png`
                            }
                            alt={`${platform.name} logo`}
                            className="w-5 h-5 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder-4m6jx.png"
                              target.onerror = null
                            }}
                          />
                        </div>
                        <span className="font-medium">{platform.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-xs hover:bg-black hover:text-white"
                          onClick={
                            platform.id === "v0"
                              ? openV0GithubDocs
                              : platform.id === "replit"
                                ? openReplitGithubDocs
                                : undefined
                          }
                        >
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="link"
                    onClick={openGithubSignup}
                    className="text-sm text-gray-600 hover:text-black flex items-center mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create a new GitHub account
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="link"
                    onClick={handleNext}
                    className="w-full text-gray-500 hover:text-black flex items-center justify-center gap-1"
                  >
                    Skip GitHub connection for now
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="platform-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold mb-2">🛠️ Which platform are you using?</h1>
                  <p className="text-gray-600">Select your development platform</p>
                </div>

                <RadioGroup value={selectedPlatform} onValueChange={handlePlatformSelect} className="space-y-4">
                  {primaryVibePlatforms.map((platform) => (
                    <div
                      key={platform.id}
                      className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${
                        selectedPlatform === platform.id
                          ? "border-black bg-black/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePlatformSelect(platform.id)}
                    >
                      <RadioGroupItem value={platform.id} id={platform.id} className="sr-only" />
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-md border border-gray-200 overflow-hidden">
                        <img
                          src={
                            platform.id === "lovable"
                              ? "/platform-logos/lovable-logo.jpeg"
                              : `/platform-logos/${platform.id}-logo.png`
                          }
                          alt={`${platform.name} logo`}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder-4m6jx.png"
                            target.onerror = null
                          }}
                        />
                      </div>
                      <Label
                        htmlFor={platform.id}
                        className={`flex-grow font-medium text-base cursor-pointer ${
                          selectedPlatform === platform.id ? "text-black" : "text-gray-700"
                        }`}
                      >
                        {platform.name}
                      </Label>
                    </div>
                  ))}

                  <div
                    className={`flex items-center space-x-3 rounded-lg border p-4 cursor-pointer transition-all ${
                      selectedPlatform === "other" ? "border-black bg-black/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handlePlatformSelect("other")}
                  >
                    <RadioGroupItem value="other" id="other" className="sr-only" />
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-md border border-gray-200">
                      <span className="text-xl">🔧</span>
                    </div>
                    <div className="flex-grow">
                      <Label
                        htmlFor="other"
                        className={`font-medium text-base cursor-pointer ${
                          selectedPlatform === "other" ? "text-black" : "text-gray-700"
                        }`}
                      >
                        Other
                      </Label>
                      {selectedPlatform === "other" && (
                        <Input
                          value={otherPlatform}
                          onChange={handleOtherPlatformChange}
                          placeholder="Enter platform name..."
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                </RadioGroup>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="px-4">
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-black hover:bg-gray-800 text-white px-6 flex items-center gap-2 group"
                    disabled={!selectedPlatform || (selectedPlatform === "other" && !otherPlatform)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="project-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold mb-2">📝 Project Title</h2>
                <p className="text-gray-600 mb-4">What's your project called?</p>

                <div className="mb-8">
                  <Input
                    value={answers.projectTitle}
                    onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                    placeholder="e.g., TaskFlow Pro, DevConnect, HealthTrack AI..."
                    className="text-base p-4 h-auto"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="px-4">
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-black hover:bg-gray-800 text-white px-6 flex items-center gap-2 group"
                    disabled={!answers.projectTitle}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="project-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold mb-2">📄 Project Description</h2>
                <p className="text-gray-600 mb-4">Briefly describe your project and its goals</p>

                <div className="mb-8">
                  <Textarea
                    value={answers.projectDescription}
                    onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                    placeholder="My project is a collaborative task management app built with Next.js and Supabase. It allows remote teams to create, assign, and track tasks in real-time. The app features a kanban board interface, notification system, and integrates with calendar apps.

My target users are small to medium tech teams who need a lightweight alternative to complex project management tools. The app emphasizes simplicity and speed while maintaining powerful collaboration features.

I've implemented authentication, real-time updates, and basic analytics, but I'm looking to improve performance and add more advanced reporting features."
                    className="text-base p-4 min-h-[250px]"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="px-4">
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-black hover:bg-gray-800 text-white px-6 flex items-center gap-2 group"
                    disabled={!answers.projectDescription}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="killer-feature"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold mb-2">🚀 Key Feature</h2>
                <p className="text-gray-600 mb-4">What's your project's standout feature?</p>

                <div className="mb-8">
                  <Input
                    value={answers.killerFeature}
                    onChange={(e) => handleInputChange("killerFeature", e.target.value)}
                    placeholder="e.g., AI-powered task prioritization, Real-time collaboration, One-click deployment..."
                    className="text-base p-4 h-auto"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="px-4">
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-black hover:bg-gray-800 text-white px-6 flex items-center gap-2 group"
                    disabled={!answers.killerFeature}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="planned-features"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold mb-2">🔮 Planned Features</h2>
                <p className="text-gray-600 mb-4">What features do you plan to add next?</p>

                <div className="flex items-center space-x-3 mb-6">
                  <Input
                    type="text"
                    placeholder="Add your own feature idea..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-grow"
                  />
                  <Button type="button" onClick={handleAddFeature} disabled={!newFeature.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>

                <div className="mb-6">
                  {answers.plannedFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg flex items-center justify-between mb-2 border border-gray-100"
                    >
                      <span>{feature}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveFeature(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-3">Or choose from popular features:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {suggestions.map((suggestion) => (
                      <SuggestionCard
                        key={suggestion}
                        text={suggestion}
                        onClick={() => {
                          if (!answers.plannedFeatures.includes(suggestion)) {
                            setAnswers((prev) => ({
                              ...prev,
                              plannedFeatures: [...prev.plannedFeatures, suggestion],
                            }))
                          }
                        }}
                        isSelected={answers.plannedFeatures.includes(suggestion)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="px-4">
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-black hover:bg-gray-800 text-white px-6 flex items-center gap-2 group"
                    disabled={answers.plannedFeatures.length === 0}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold mb-2">😵 Development Challenges</h2>
                <p className="text-gray-600 mb-4">What obstacles are you facing?</p>

                <div className="mb-8">
                  <Textarea
                    value={answers.challenges}
                    onChange={(e) => handleInputChange("challenges", e.target.value)}
                    placeholder="e.g., Optimizing database queries for better performance, Implementing secure authentication, Handling real-time updates efficiently..."
                    className="text-base p-4 min-h-[120px]"
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="px-4">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-black hover:bg-gray-800 text-white px-6 flex items-center gap-2 group"
                    disabled={!answers.challenges || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        Generate Report
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 7 && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">✨ Ready for VibeCheck!</h2>
                  <p className="text-gray-600">We'll analyze your project and provide actionable insights</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
                  <h3 className="font-semibold text-base mb-4">Your Project Summary:</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-500 text-sm">Project Title:</span>
                      <p className="font-medium">{answers.projectTitle}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Platform:</span>
                      <p className="font-medium">{selectedPlatform === "other" ? otherPlatform : selectedPlatform}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Description:</span>
                      <p className="font-medium">{answers.projectDescription}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Killer Feature:</span>
                      <p className="font-medium">{answers.killerFeature}</p>
                    </div>
                  </div>
                </div>

                {vibeCheckProgress < 100 ? (
                  <div className="bg-black/5 p-4 rounded-lg mb-8 flex items-center border border-black/10">
                    <Info className="h-5 w-5 mr-2 text-black" />
                    <p className="text-sm">
                      Your VibeCheck is still running in the background. You can generate your report now, or wait for
                      it to complete for more detailed insights.
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg mb-8 flex items-center border border-green-100">
                    <Check className="h-5 w-5 mr-2 text-green-600" />
                    <p className="text-sm text-green-800">
                      VibeCheck complete! Your report is ready with full insights.
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} className="px-4">
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-6 h-auto text-base flex items-center gap-2 group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        Generate My Report
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Suggestion card component
function SuggestionCard({ text, onClick, isSelected }: { text: string; onClick: () => void; isSelected: boolean }) {
  return (
    <motion.div
      className={`
        p-3 rounded-lg border cursor-pointer transition-all
        ${isSelected ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400 bg-white"}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center">
        {isSelected ? <Check className="h-4 w-4 mr-2 flex-shrink-0" /> : null}
        <span className={isSelected ? "font-medium" : ""}>{text}</span>
      </div>
    </motion.div>
  )
}
