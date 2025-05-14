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
  ExternalLink,
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

      {/* Progress bar - Fixed to top */}
      <div className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-200">
        <div className="container max-w-4xl mx-auto px-4 py-3">
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

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 px-4">
        {/* Why Get a Vibe Check - Only show in first step */}
        {step === -1 && (
          <div className="w-full max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Get a Vibe Check?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-black rounded-full p-2 mr-4 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Comprehensive Code Analysis</h3>
                </div>
                <p className="text-gray-600">
                  Get detailed insights into code quality, architecture, and performance with our AI-powered analysis.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-black rounded-full p-2 mr-4 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Customized Development Plan</h3>
                </div>
                <p className="text-gray-600">
                  Receive a prioritized roadmap of tasks with time estimates—complete them yourself or 4x faster with
                  our experts.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="bg-black rounded-full p-2 mr-4 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">Expert-Ready Task Board</h3>
                </div>
                <p className="text-gray-600">
                  Access a Kanban board with ready-to-implement tasks that you can complete or assign to our vetted
                  experts.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-start">
                <div className="text-4xl text-black opacity-50 mr-4 font-serif leading-none">"</div>
                <div>
                  <p className="text-gray-700 italic text-lg">
                    The VibeCheck saved us weeks of development time. The analysis identified issues we hadn't caught,
                    and the expert assistance helped us implement solutions 4x faster than we could have on our own.
                  </p>
                  <p className="text-gray-500 text-sm mt-3">— Alex Chen, CTO at TechStartup</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form steps */}
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {step === -1 && (
              <motion.div
                key="signup-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 shadow-md rounded-xl border border-gray-200">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-4">Join VibeAlong as a Vibe-Coder</h1>
                    <p className="text-gray-600">
                      Create your account to get started with VibeCheck and connect with top developers.
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <Button
                      onClick={handleGithubSignup}
                      className="w-full flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#1b1f23] text-white py-6 h-auto"
                      disabled={isLoading}
                    >
                      <Github className="h-5 w-5" />
                      <span className="text-base">Sign up with GitHub</span>
                      <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded ml-1">Recommended</span>
                    </Button>

                    <Button
                      onClick={handleGmailSignup}
                      className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-6 h-auto"
                      disabled={isLoading}
                    >
                      <Mail className="h-5 w-5 text-red-500" />
                      <span className="text-base">Sign up with Gmail</span>
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
                      {signupErrors.fullName && <p className="text-red-500 text-sm mt-1">{signupErrors.fullName}</p>}
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
                      {signupErrors.password && <p className="text-red-500 text-sm mt-1">{signupErrors.password}</p>}
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
                        {signupErrors.agreeTerms && <p className="text-red-500 text-sm">{signupErrors.agreeTerms}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={handleSignupSubmit}
                      className="w-full bg-black hover:bg-gray-800 text-white py-6 h-auto text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-4">🔗 Connect Your GitHub Project</h1>
                    <p className="text-gray-600 mb-2">
                      We'll scan your repo with <span className="font-semibold">read-only access</span> to generate your
                      VibeCheck report.
                    </p>
                    <p className="text-gray-600">No code will be changed.</p>
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

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <span className="bg-black text-white p-1 rounded-md mr-2">
                        <Github className="h-4 w-4" />
                      </span>
                      No GitHub? No problem - integrate your project with GitHub
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Open your first project on GitHub using one of the following options, and come back here when
                      you're done to start your VibeCheck.
                    </p>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <h4 className="font-semibold text-base mb-4">
                          I already use a vibe-coding platform and want to sync it to GitHub
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {primaryVibePlatforms.slice(0, 4).map((platform) => (
                            <div
                              key={platform.id}
                              className="bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-300 transition-all"
                            >
                              <div className="flex items-start">
                                <div
                                  className="flex-shrink-0 mr-3 bg-gray-50 p-1 rounded-md flex items-center justify-center"
                                  style={{ width: "32px", height: "32px" }}
                                >
                                  <div className="w-5 h-5 flex items-center justify-center">{platform.logo}</div>
                                </div>
                                <div>
                                  <p className="font-medium">{platform.name} Projects</p>
                                  <p className="text-sm text-gray-500 mb-2">
                                    {platform.id === "v0"
                                      ? "Export to GitHub from project settings → Integrations"
                                      : platform.id === "replit"
                                        ? "Use Git tab → Connect repository"
                                        : platform.id === "lovable"
                                          ? "Project dashboard → Export → GitHub"
                                          : "Settings → Integrations → GitHub"}
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={
                                      platform.id === "v0"
                                        ? openV0GithubDocs
                                        : platform.id === "replit"
                                          ? openReplitGithubDocs
                                          : undefined
                                    }
                                    className="text-xs flex items-center gap-1"
                                  >
                                    Connect <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        <h4 className="font-semibold text-base mb-3">I don't use GitHub or a vibe-coding platform</h4>
                        <p className="text-sm text-gray-500 mb-4">Create a GitHub account and start a new project.</p>
                        <div className="space-y-4">
                          <div className="flex items-start bg-white p-3 rounded-lg border border-gray-100">
                            <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                              1
                            </div>
                            <div>
                              <p className="font-medium">Sign up for a free GitHub account</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={openGithubSignup}
                                className="mt-2 flex items-center gap-1"
                              >
                                Create GitHub Account <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-start bg-white p-3 rounded-lg border border-gray-100">
                            <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                              2
                            </div>
                            <div>
                              <p className="font-medium">Create a new repository</p>
                              <p className="text-sm text-gray-500">
                                Click the "+" icon in the top right and select "New repository"
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start bg-white p-3 rounded-lg border border-gray-100">
                            <div className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                              3
                            </div>
                            <div>
                              <p className="font-medium">Upload your project files</p>
                              <p className="text-sm text-gray-500">
                                Use the "uploading an existing file" link on the empty repo page
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/5 p-4 rounded-lg border border-black/10 flex items-start mt-6">
                      <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5 text-black" />
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Pro tip:</span> Connecting to GitHub enables version control,
                        collaboration, and more detailed VibeCheck insights.
                      </p>
                    </div>
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
                  <h2 className="text-2xl font-bold mb-2">🛠️ Which platform are you using?</h2>
                  <p className="text-gray-600 mb-6">
                    Knowing your development platform helps us tailor our recommendations to your specific workflow and
                    tools.
                  </p>

                  <div className="mb-8">
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
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-50 rounded-md">
                            <img
                              src={
                                platform.id === "lovable"
                                  ? "/platform-logos/lovable-logo.jpeg"
                                  : `/platform-logos/${platform.id}-logo.png`
                              }
                              alt={platform.name}
                              className="max-w-full max-h-full object-contain"
                              width={24}
                              height={24}
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
                          selectedPlatform === "other"
                            ? "border-black bg-black/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handlePlatformSelect("other")}
                      >
                        <RadioGroupItem value="other" id="other" className="sr-only" />
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
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
                  </div>

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
                  <h2 className="text-2xl font-bold mb-2">📝 What's the title of your project?</h2>
                  <p className="text-gray-600 mb-6">
                    Your project name helps us understand its purpose and create more relevant suggestions for your
                    codebase.
                  </p>

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
                  <h2 className="text-2xl font-bold mb-2">📄 How would you describe your project?</h2>
                  <p className="text-gray-600 mb-6">
                    A brief description helps us understand your project's goals and audience, allowing us to provide
                    more targeted feedback.
                  </p>

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
                  <h2 className="text-2xl font-bold mb-2">🚀 What's your killer feature?</h2>
                  <p className="text-gray-600 mb-6">
                    Identifying your standout feature helps us prioritize our recommendations to enhance what makes your
                    project special.
                  </p>

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
                  <h2 className="text-2xl font-bold mb-2">🔮 What features are you planning to add later?</h2>
                  <p className="text-gray-600 mb-6">
                    Understanding your roadmap helps us suggest architecture improvements that will make future features
                    easier to implement.
                  </p>

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
                  <h2 className="text-2xl font-bold mb-2">😵 What's been challenging in your vibe-coding journey?</h2>
                  <p className="text-gray-600 mb-6">
                    Sharing your pain points allows us to focus on solutions for the specific obstacles you're facing in
                    your development process.
                  </p>

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
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">✨ Ready for your personalized VibeCheck!</h2>
                    <p className="text-gray-600">
                      We've gathered everything we need to provide you with tailored insights to help you ship faster
                      and better.
                    </p>
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
