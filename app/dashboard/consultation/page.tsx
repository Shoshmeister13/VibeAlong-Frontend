"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ConsultationChat } from "@/components/consultation/consultation-chat"
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Code,
  Download,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Plus,
  Zap,
  FileCode,
  BarChart,
  FileDown,
  Layers,
} from "lucide-react"

// Types for our consultation data
type ConsultationThread = {
  id: string
  title: string
  platform: string
  date: string
  status: "active" | "completed"
  lastMessage: string
  deliverables: Deliverable[]
}

type Deliverable = {
  id: string
  type: "code" | "document" | "roadmap" | "techstack"
  title: string
  description: string
  date: string
  url?: string
}

export default function DashboardConsultationPage() {
  const [view, setView] = useState<"threads" | "chat">("threads")
  const [activeThread, setActiveThread] = useState<ConsultationThread | null>(null)
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    platform: "v0",
  })

  // Mock consultation threads
  const [consultationThreads, setConsultationThreads] = useState<ConsultationThread[]>([
    {
      id: "cons-1",
      title: "E-commerce Platform Migration",
      platform: "v0",
      date: "2023-05-12",
      status: "completed",
      lastMessage: "Here's the final architecture diagram as we discussed. Let me know if you need any clarification.",
      deliverables: [
        {
          id: "del-1",
          type: "document",
          title: "Migration Strategy Document",
          description: "Step-by-step guide for migrating from Shopify to a custom solution",
          date: "2023-05-14",
          url: "#",
        },
        {
          id: "del-2",
          type: "techstack",
          title: "Recommended Tech Stack",
          description: "Next.js, Supabase, Stripe, and Vercel for deployment",
          date: "2023-05-13",
          url: "#",
        },
      ],
    },
    {
      id: "cons-2",
      title: "Mobile App Performance Optimization",
      platform: "Replit",
      date: "2023-06-03",
      status: "active",
      lastMessage: "I've analyzed your code and found several areas where we can improve performance.",
      deliverables: [
        {
          id: "del-3",
          type: "code",
          title: "Optimized Rendering Logic",
          description: "Refactored component to prevent unnecessary re-renders",
          date: "2023-06-05",
          url: "#",
        },
      ],
    },
  ])

  const handleStartConsultation = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a new consultation thread
    const newThread: ConsultationThread = {
      id: `cons-${Date.now()}`,
      title: formData.projectTitle,
      platform: formData.platform,
      date: new Date().toISOString().split("T")[0],
      status: "active",
      lastMessage: "Hello! I'm your VibeAlong Expert. How can I help with your project today?",
      deliverables: [],
    }

    setConsultationThreads([newThread, ...consultationThreads])
    setActiveThread(newThread)
    setView("chat")
  }

  const handleEndConsultation = () => {
    setView("threads")
  }

  const handleOpenThread = (thread: ConsultationThread) => {
    setActiveThread(thread)
    setView("chat")
  }

  const platformOptions = [
    { id: "v0", name: "v0", icon: <Code className="h-4 w-4" /> },
    { id: "Lovable", name: "Lovable", icon: <Zap className="h-4 w-4" /> },
    { id: "Replit", name: "Replit", icon: <FileCode className="h-4 w-4" /> },
    { id: "Other", name: "Other Platform", icon: <Lightbulb className="h-4 w-4" /> },
  ]

  // Helper function to get icon based on deliverable type
  const getDeliverableIcon = (type: string) => {
    switch (type) {
      case "code":
        return <Code className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      case "roadmap":
        return <LayoutDashboard className="h-4 w-4" />
      case "techstack":
        return <Layers className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Threads view
  if (view === "threads") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Expert Consultations</h1>
            <p className="text-muted-foreground mt-1">Get personalized guidance from our AI-enhanced experts</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Consultation
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Consultation threads */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Consultations</CardTitle>
                <CardDescription>Ongoing and past consultation threads</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {consultationThreads.length > 0 ? (
                    <div className="divide-y">
                      {consultationThreads.map((thread) => (
                        <div
                          key={thread.id}
                          className="p-4 hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleOpenThread(thread)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium truncate">{thread.title}</h3>
                            <Badge variant={thread.status === "active" ? "default" : "outline"}>
                              {thread.status === "active" ? "Active" : "Completed"}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            {new Date(thread.date).toLocaleDateString()}
                            <div className="mx-2 h-1 w-1 rounded-full bg-muted-foreground"></div>
                            {platformOptions.find((p) => p.id === thread.platform)?.icon}
                            <span className="ml-1">{thread.platform}</span>
                          </div>
                          <p className="text-sm truncate text-muted-foreground">{thread.lastMessage}</p>
                          {thread.deliverables.length > 0 && (
                            <div className="mt-2 flex items-center text-xs text-blue-600 dark:text-blue-400">
                              <FileDown className="h-3 w-3 mr-1" />
                              {thread.deliverables.length} deliverable{thread.deliverables.length > 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">No consultations yet</p>
                      <Button>Start your first consultation</Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Benefits card */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Why Get a Consultation?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Project Analysis</h3>
                    <p className="text-xs text-muted-foreground">
                      Get a comprehensive analysis of your project's scope and challenges
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <BarChart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Development Roadmap</h3>
                    <p className="text-xs text-muted-foreground">
                      Receive a suggested roadmap with milestones and priorities
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Tech Recommendations</h3>
                    <p className="text-xs text-muted-foreground">
                      Get expert suggestions on the best technologies for your needs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - New consultation form or deliverables */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Start a New Consultation</CardTitle>
                <CardDescription>
                  Tell us about your project to get personalized guidance from our AI expert.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStartConsultation} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      placeholder="E.g., E-commerce Website, Mobile App, Dashboard"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectDescription">Project Description</Label>
                    <Textarea
                      id="projectDescription"
                      placeholder="Briefly describe your project, goals, and any specific challenges..."
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      required
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Development Platform</Label>
                    <RadioGroup
                      value={formData.platform}
                      onValueChange={(value) => setFormData({ ...formData, platform: value })}
                      className="grid grid-cols-2 gap-4"
                    >
                      {platformOptions.map((platform) => (
                        <div key={platform.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={platform.id} id={platform.id} />
                          <Label htmlFor={platform.id} className="flex items-center gap-2 cursor-pointer">
                            {platform.icon}
                            {platform.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  onClick={handleStartConsultation}
                  disabled={!formData.projectTitle || !formData.projectDescription}
                >
                  Start Consultation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Deliverables section */}
            {consultationThreads.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Deliverables</CardTitle>
                  <CardDescription>Assets and recommendations from your consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="techstack">Tech Stack</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                      {consultationThreads.flatMap((thread) =>
                        thread.deliverables.map((deliverable) => (
                          <div key={deliverable.id} className="flex items-start p-3 rounded-lg border">
                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center mr-3">
                              {getDeliverableIcon(deliverable.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{deliverable.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {deliverable.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{deliverable.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  From: {thread.title} • {new Date(deliverable.date).toLocaleDateString()}
                                </span>
                                <Button variant="ghost" size="sm" className="h-7">
                                  <Download className="h-3.5 w-3.5 mr-1.5" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        )),
                      )}

                      {consultationThreads.flatMap((t) => t.deliverables).length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No deliverables yet</p>
                          <p className="text-sm mt-1">Start a consultation to receive expert recommendations</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Other tab contents would filter by type */}
                    <TabsContent value="code">{/* Code deliverables */}</TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Chat view
  if (view === "chat" && activeThread) {
    return (
      <div>
        <div className="mb-4">
          <Button variant="ghost" onClick={() => setView("threads")} className="mb-4">
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Back to Consultations
          </Button>
          <h1 className="text-2xl font-bold">{activeThread.title}</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            {new Date(activeThread.date).toLocaleDateString()}
            <div className="mx-2 h-1 w-1 rounded-full bg-muted-foreground"></div>
            {platformOptions.find((p) => p.id === activeThread.platform)?.icon}
            <span className="ml-1">{activeThread.platform}</span>
            <div className="mx-2 h-1 w-1 rounded-full bg-muted-foreground"></div>
            <Badge variant={activeThread.status === "active" ? "default" : "outline"} className="ml-1">
              {activeThread.status === "active" ? "Active" : "Completed"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ConsultationChat
              consultationData={{
                id: activeThread.id,
                projectTitle: activeThread.title,
                projectDescription: "Your project description here",
                platform: activeThread.platform,
              }}
              userId="user-123"
              onEndConsultation={handleEndConsultation}
            />
          </div>

          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deliverables</CardTitle>
                <CardDescription>Assets from this consultation</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {activeThread.deliverables.length > 0 ? (
                  <div className="divide-y">
                    {activeThread.deliverables.map((deliverable) => (
                      <div key={deliverable.id} className="p-4">
                        <div className="flex items-center gap-2 mb-1">
                          {getDeliverableIcon(deliverable.type)}
                          <h4 className="font-medium text-sm">{deliverable.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{deliverable.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(deliverable.date).toLocaleDateString()}
                          </span>
                          <Button variant="ghost" size="sm" className="h-7">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">No deliverables yet</p>
                    <p className="text-xs mt-1">Deliverables will appear here as they are created</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="outline" className="w-full" size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Request Deliverable
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 px-3">
                  What's the best architecture for my project?
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 px-3">
                  How should I structure my database?
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm h-auto py-2 px-3">
                  What are the potential scalability challenges?
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Fallback
  return <div>Loading...</div>
}
