"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Rocket,
  ArrowRight,
  Wand2,
  Check,
  X,
  Loader2,
  Heart,
  Cpu,
  Bot,
  Zap,
  MousePointer,
  Wind,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

const platforms = [
  {
    id: "lovable",
    name: "Lovable",
    icon: Heart,
    logoPath: "/platform-logos/lovable-logo.jpeg",
  },
  {
    id: "replit",
    name: "Replit",
    icon: Cpu,
    logoPath: "/platform-logos/replit-logo.png",
  },
  {
    id: "v0",
    name: "V0",
    icon: Bot,
    logoPath: "/platform-logos/v0-logo.png",
  },
  {
    id: "bolt",
    name: "Bolt",
    icon: Zap,
    logoPath: "/platform-logos/bolt-logo.png",
  },
  {
    id: "cursor",
    name: "Cursor",
    icon: MousePointer,
    logoPath: "/platform-logos/cursor-logo.png",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    icon: Wind,
    logoPath: "/platform-logos/windsurf-logo.png",
  },
  {
    id: "other",
    name: "Other",
    icon: Wrench,
    logoPath: "/platform-logos/base44-logo.png",
  },
]

const stages = [
  {
    id: "just_starting",
    name: "Just starting",
    description: "I have an idea but haven't started building yet",
    icon: "💡",
  },
  { id: "mid_build", name: "Mid-build", description: "I've started building but need help to continue", icon: "🚧" },
  {
    id: "already_launched",
    name: "Already launched",
    description: "My project is live but needs improvements",
    icon: "🚀",
  },
]

export default function CreateProject() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")

  // Form state
  const [projectName, setProjectName] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [description, setDescription] = useState("")
  const [selectedStage, setSelectedStage] = useState("")

  // Form validation
  const [errors, setErrors] = useState({
    projectName: "",
    platform: "",
    description: "",
    stage: "",
  })

  async function generateImprovedDescription() {
    if (!projectName || projectName.length < 2) {
      toast({
        title: "Project name required",
        description: "Please enter a project name first to generate suggestions.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingDescription(true)
    try {
      // Simulate AI generation for now
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const improvedDescription = `${projectName} is an innovative application designed to streamline collaboration between developers and project owners. It provides intuitive tools for task management, code sharing, and real-time communication, making development processes more efficient and transparent. This platform aims to solve common challenges in remote development workflows while maintaining high quality standards.`

      setAiSuggestion(improvedDescription)
    } catch (error) {
      console.error("Error generating description:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate an improved description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  function acceptSuggestion() {
    setDescription(aiSuggestion)
    setAiSuggestion("")
    toast({
      title: "Suggestion applied",
      description: "The AI-improved description has been applied to your project.",
    })
  }

  function rejectSuggestion() {
    setAiSuggestion("")
  }

  function validateForm() {
    const newErrors = {
      projectName: "",
      platform: "",
      description: "",
      stage: "",
    }

    let isValid = true

    if (!projectName || projectName.length < 2) {
      newErrors.projectName = "Project name must be at least 2 characters."
      isValid = false
    }

    if (!selectedPlatform) {
      newErrors.platform = "Please select a platform."
      isValid = false
    }

    if (!description || description.length < 10) {
      newErrors.description = "Description must be at least 10 characters."
      isValid = false
    }

    if (!selectedStage) {
      newErrors.stage = "Please select your current stage."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const formData = {
        projectName,
        platform: selectedPlatform,
        description,
        stage: selectedStage,
      }

      // Generate AI task suggestions (simulated)
      const taskSuggestions = [
        {
          title: "Set up project structure",
          description:
            "Create the initial project structure with necessary files and folders. Set up the development environment and install required dependencies.",
          estimatedHours: 2,
          skills: "Project Management, Development Setup",
        },
        {
          title: "Design user interface mockups",
          description:
            "Create wireframes and mockups for the main user interfaces. Focus on user experience and intuitive navigation.",
          estimatedHours: 4,
          skills: "UI/UX Design, Wireframing",
        },
        {
          title: "Implement core functionality",
          description:
            "Develop the core features that define your project's main purpose. Focus on creating a minimal viable product that demonstrates the key value proposition.",
          estimatedHours: 8,
          skills: "Programming, Problem Solving",
        },
      ]

      // Store the project data and task suggestions in localStorage
      localStorage.setItem("vibeProject", JSON.stringify(formData))
      localStorage.setItem("taskSuggestions", JSON.stringify(taskSuggestions))

      toast({
        title: "Project created",
        description: "Your project details have been saved. Let's set up some tasks!",
      })

      // Navigate to the next step
      router.push("/submit-tasks")
    } catch (error) {
      console.error("Error saving project data:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Let's Set Up Your Project</h1>
        <p className="text-muted-foreground">This helps us understand what kind of help you need.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Project Details
          </CardTitle>
          <CardDescription>
            Tell us about what you're building so we can match you with the perfect developer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="My Awesome App"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">What are you calling your project?</p>
              {errors.projectName && <p className="text-sm text-destructive">{errors.projectName}</p>}
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platforms.map((platform) => {
                  const IconComponent = platform.icon
                  return (
                    <div
                      key={platform.id}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all",
                        selectedPlatform === platform.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/50 hover:bg-muted",
                      )}
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      <div className="w-12 h-12 flex items-center justify-center mb-2 rounded-full bg-muted overflow-hidden">
                        {platform.logoPath ? (
                          <Image
                            src={platform.logoPath || "/placeholder.svg"}
                            alt={`${platform.name} logo`}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        ) : (
                          <IconComponent className="h-6 w-6" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{platform.name}</span>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">Which AI platform are you building with?</p>
              {errors.platform && <p className="text-sm text-destructive">{errors.platform}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">What are you building?</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateImprovedDescription}
                  disabled={isGeneratingDescription}
                  className="flex items-center gap-1"
                >
                  {isGeneratingDescription ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3.5 w-3.5" />
                      <span>Improve with AI</span>
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="description"
                placeholder="I'm creating a website that helps people find the perfect pet..."
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">A brief description of your project and its purpose.</p>
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}

              {aiSuggestion && (
                <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-blue-700">AI Suggestion</h4>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={rejectSuggestion}
                        className="h-7 w-7 p-0 text-red-500"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={acceptSuggestion}
                        className="h-7 w-7 p-0 text-green-500"
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Accept</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{aiSuggestion}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Current Stage</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stages.map((stage) => (
                  <div
                    key={stage.id}
                    className={cn(
                      "flex flex-col p-4 border rounded-lg cursor-pointer transition-all",
                      selectedStage === stage.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted",
                    )}
                    onClick={() => setSelectedStage(stage.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{stage.icon}</span>
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{stage.description}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">How far along are you in your project?</p>
              {errors.stage && <p className="text-sm text-destructive">{errors.stage}</p>}
            </div>

            <div className="space-y-4 pt-4 border-t mt-6">
              <h3 className="text-lg font-semibold">🔗 Connect a GitHub Repository (Recommended)</h3>

              <p className="text-sm text-muted-foreground">
                Connecting your GitHub repo helps us track your build milestones automatically whenever you push new
                code. This gives developers visibility into your real progress — no manual logging needed. It's
                optional, but highly recommended.
              </p>

              <ul className="space-y-2 my-4">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">🎯</span>
                  <span>Track real progress — no timers or manual logs</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">⚡</span>
                  <span>Developers instantly see where your project stands</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary">🤝</span>
                  <span>Build trust through visible milestones</span>
                </li>
              </ul>

              <Button
                type="button"
                variant="outline"
                className="bg-black text-white hover:bg-gray-800 hover:text-white border-black"
                onClick={() => {
                  console.log("Connect GitHub clicked")
                  toast({
                    title: "GitHub Connection",
                    description: "GitHub OAuth flow would start here.",
                  })
                }}
              >
                🔐 Connect GitHub Repo
              </Button>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium mb-2">New to GitHub?</h4>
                <ol className="text-xs space-y-1 text-muted-foreground list-decimal pl-4">
                  <li>
                    Go to{" "}
                    <a
                      href="https://github.com/signup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      github.com/signup
                    </a>
                  </li>
                  <li>Choose a username, email, and password — it's free</li>
                  <li>Verify your email and you're ready to go!</li>
                </ol>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    Continue to Tasks <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
