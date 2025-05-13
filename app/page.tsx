"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Check } from "lucide-react"
import { Users } from "lucide-react"
import { Sparkles } from "lucide-react"
import { Zap } from "lucide-react"
import { Code } from "lucide-react"
import { Lightbulb } from "lucide-react"
import { Rocket } from "lucide-react"
import { FileText } from "lucide-react"
import { Download } from "lucide-react"
import { BarChart } from "lucide-react"
import { Database } from "lucide-react"
import { Minus } from "lucide-react"
import { X } from "lucide-react"
import Link from "next/link"
import { primaryVibePlatforms } from "@/components/vibe-platform-logos"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"

export default function HomePage() {
  // Form schema
  const formSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    bio: z.string().min(30, "Please tell us more about yourself (at least 30 characters)."),
    yearsOfExperience: z.string().optional(),
    githubUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
    aiPlatforms: z.array(z.string()).optional(),
  })

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      bio: "",
      yearsOfExperience: "",
      githubUrl: "",
      aiPlatforms: [],
    },
  })

  // Form submission handler
  const onSubmit = async (values) => {
    try {
      console.log("Form submitted:", values)
      // Here you would typically send the data to your backend

      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon.",
      })

      form.reset()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const { supabase } = useSupabase()

  useEffect(() => {
    // If there's an auth code in the URL, handle it
    const handleAuthCode = async () => {
      if (code) {
        console.log("Detected auth code in root URL")
        // Instead of redirecting, we'll handle it here
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            console.error("Error exchanging code for session:", error)
          } else {
            console.log("Successfully authenticated")
            window.location.href = "/dashboard" // Use window.location for full page navigation
          }
        } catch (err) {
          console.error("Error during authentication:", err)
        }
      }
    }

    handleAuthCode()
  }, [code, supabase.auth])

  // Only check session if explicitly requested via a query param
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Check if profile is completed
        const { data: profile } = await supabase
          .from("profiles")
          .select("profile_completed, role")
          .eq("id", session.user.id)
          .single()

        if (profile?.profile_completed) {
          window.location.href = "/dashboard"
        } else {
          // Get role from profile or user metadata
          const role = profile?.role || session.user.user_metadata.role || "developer"
          // Normalize role for URL
          const normalizedRole = role === "vibe_coder" ? "vibe-coder" : role
          window.location.href = `/onboarding/${normalizedRole}`
        }
      }
    }

    // Only check session if there's a redirect param in the URL
    const redirectToDashboard = searchParams.get("redirect")
    if (redirectToDashboard === "true" && !code) {
      checkSession()
    }
  }, [supabase, code, searchParams])

  // If there's a code, show a loading state
  if (code) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Verifying your email...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section - White Background */}
        <section className="relative overflow-hidden py-24 md:py-36 bg-white">
          <div className="absolute inset-0 -z-10 noise-bg opacity-5"></div>
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center rounded-full border border-primary/20 px-3 py-1 text-sm">
                <span className="mr-1 rounded-full bg-green-500 h-2 w-2 animate-pulse"></span>
                <span className="text-muted-foreground">Bridging AI and Human Expertise</span>
              </div>
              <h1 className="animate-in mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Where Vibe-Coders Work with Expert Developers
              </h1>
              <p className="animate-in delay-100 mb-8 text-xl text-muted-foreground">
                VibeAlong connects AI-assisted coders with professional developers to transform creative ideas into
                production-ready applications.
              </p>
              <div className="animate-in delay-200 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="#developer-application" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full">
                    <Code className="mr-2 h-4 w-4" /> Apply as Vibe Expert
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/vibe-coder-signup" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" /> Join as a Vibe-Coder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <p className="animate-in delay-300 mt-4 text-sm text-muted-foreground font-medium">Join more than 1400 Vibe Coders 🫵</p>

            {/* Platform Logos - Now part of Hero Section */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-2">Works with your favorite vibe-coding platforms</h2>
                <p className="text-muted-foreground">Seamlessly integrate with the tools you already use</p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 items-center">
                {primaryVibePlatforms.map((platform) => (
                  <div key={platform.id} className="flex flex-col items-center gap-2">
                    <div className="text-primary">{platform.logo}</div>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider"></div>

        {/* What is VibeAlong Section */}
        <section className="py-28 section-accent">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">✨ What is VibeAlong?</h2>
              <p className="text-xl leading-relaxed mb-8">
                VibeAlong is a collaborative platform that bridges the gap between AI-assisted coding and professional
                development. We connect vibe-coders who create with AI tools to expert developers who can transform
                those creations into production-ready applications.
              </p>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">For Vibe-Coders</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Get expert help to turn your AI-generated code into production-ready applications
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <Code className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">For Developers</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Apply your expertise to interesting projects and earn competitive rates
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">For Everyone</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Experience the future of collaborative software development powered by AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Consultation Feature Section */}
        <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100 overflow-hidden relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-200 blur-3xl"></div>
            <div className="absolute bottom-12 -left-24 w-64 h-64 rounded-full bg-indigo-200 blur-3xl"></div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left side - Content */}
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 mb-4">
                  <Sparkles className="mr-1 h-4 w-4" />
                  <span>Free AI-Enhanced Consultation</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                  Jump on a Free Consultation Chat with One of Our Vetted VibeAlong Experts!
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Get instant guidance on your project from our AI-enhanced experts. No commitment required - just
                  valuable insights to help you move forward.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Project Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Get a comprehensive analysis of your project's scope, challenges, and opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BarChart className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Product Planning</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive a suggested roadmap with milestones and development priorities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Database className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Tech Stack Recommendations</h3>
                      <p className="text-sm text-muted-foreground">
                        Get expert suggestions on the best technologies for your specific project needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Download className="h-4 w-4 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Exportable Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Export your consultation as a PDF or access it anytime in your project dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                <Link href="/consultation">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Right side - Image */}
              <div className="w-full lg:w-1/2 order-1 lg:order-2">
                <div className="relative">
                  {/* Expert image with chat overlay */}
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
                    {/* Expert image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src="/vibealong-experts.png"
                        alt="VibeAlong Experts"
                        width={600}
                        height={450}
                        className="object-cover w-full h-full"
                        priority
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                      {/* Expert badge */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
                          <Sparkles className="h-4 w-4 text-blue-300" />
                          <span className="text-white text-sm font-medium">VibeAlong Experts</span>
                        </div>
                        <div className="bg-blue-600 rounded-full px-3 py-1.5">
                          <span className="text-white text-sm font-medium">AI-Enhanced</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat preview */}
                    <div className="p-4 bg-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100">
                          <Image
                            src="/vibealong-expert.png"
                            alt="VibeAlong Expert"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">VibeAlong Expert</span>
                            <Sparkles className="h-3 w-3 text-blue-500" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-sm">
                          "Based on your project description, I recommend a React frontend with a Node.js backend. Let's
                          discuss your specific requirements and create a roadmap for your development journey."
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <span className="text-xs text-gray-500">Available 24/7</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">Free consultation</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                          <span>Start chatting</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider-wave"></div>

        {/* How It Works Section - Black Background */}
        <section className="py-28 bg-black text-white" id="how-it-works">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">🔄 How VibeAlong Works</h2>
              <p className="mt-4 text-lg text-white/70">
                Our platform creates a seamless workflow between vibe-coders and professional developers
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Create with AI</h3>
                <p className="text-white/70 mb-4">
                  Vibe-coders use AI tools to generate code and create project foundations
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Generate code with AI tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Prototype ideas quickly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Submit projects for expert help</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Connect & Collaborate</h3>
                <p className="text-white/70 mb-4">Our platform matches projects with the right developers</p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">AI-powered matching system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Real-time collaboration tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Transparent communication</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Launch & Scale</h3>
                <p className="text-white/70 mb-4">Transform ideas into production-ready applications</p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Production-ready code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Deployment assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Ongoing support options</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider"></div>

        {/* Comparison Table Section */}
        <section className="py-28 section-accent">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">🔍 How VibeAlong Compares</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                See how our platform stacks up against other development marketplaces
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-background">
                    <th className="p-4 text-left font-medium border-b">Features</th>
                    <th className="p-4 text-center font-medium border-b">
                      <div className="flex flex-col items-center">
                        <span className="text-primary font-bold">VibeAlong</span>
                        <span className="text-xs text-muted-foreground">AI-Developer Collaboration</span>
                      </div>
                    </th>
                    <th className="p-4 text-center font-medium border-b">
                      <div className="flex flex-col items-center">
                        <span>Freelance Marketplaces</span>
                        <span className="text-xs text-muted-foreground">Upwork, Fiverr, etc.</span>
                      </div>
                    </th>
                    <th className="p-4 text-center font-medium border-b">
                      <div className="flex flex-col items-center">
                        <span>Dev Agencies</span>
                        <span className="text-xs text-muted-foreground">Traditional agencies</span>
                      </div>
                    </th>
                    <th className="p-4 text-center font-medium border-b">
                      <div className="flex flex-col items-center">
                        <span>In-house Hiring</span>
                        <span className="text-xs text-muted-foreground">Full-time developers</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-medium">AI Integration</td>
                    <td className="p-4 text-center bg-green-50">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                      <span className="text-xs block mt-1">Native support</span>
                    </td>
                    <td className="p-4 text-center">
                      <Minus className="h-5 w-5 text-amber-500 mx-auto" />
                      <span className="text-xs block mt-1">Limited</span>
                    </td>
                    <td className="p-4 text-center">
                      <Minus className="h-5 w-5 text-amber-500 mx-auto" />
                      <span className="text-xs block mt-1">Varies</span>
                    </td>
                    <td className="p-4 text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                      <span className="text-xs block mt-1">Rarely</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Time to Start</td>
                    <td className="p-4 text-center bg-green-50">
                      <span className="font-medium">Hours</span>
                      <span className="text-xs block mt-1">Same-day matching</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">Days</span>
                      <span className="text-xs block mt-1">Hiring process</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">Weeks</span>
                      <span className="text-xs block mt-1">Discovery phase</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">Months</span>
                      <span className="text-xs block mt-1">Recruitment cycle</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Cost</td>
                    <td className="p-4 text-center bg-green-50">
                      <span className="font-medium">$</span>
                      <span className="text-xs block mt-1">Pay per task</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">$-$$</span>
                      <span className="text-xs block mt-1">Hourly or fixed</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">$$$</span>
                      <span className="text-xs block mt-1">Project-based</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">$$$$</span>
                      <span className="text-xs block mt-1">Salary + benefits</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Expert Vetting</td>
                    <td className="p-4 text-center bg-green-50">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                      <span className="text-xs block mt-1">Rigorous process</span>
                    </td>
                    <td className="p-4 text-center">
                      <Minus className="h-5 w-5 text-amber-500 mx-auto" />
                      <span className="text-xs block mt-1">Basic verification</span>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                      <span className="text-xs block mt-1">Agency standards</span>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                      <span className="text-xs block mt-1">Full interviews</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Specialized in AI-Generated Code</td>
                    <td className="p-4 text-center bg-green-50">
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                      <span className="text-xs block mt-1">Core focus</span>
                    </td>
                    <td className="p-4 text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                      <span className="text-xs block mt-1">Not specialized</span>
                    </td>
                    <td className="p-4 text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                      <span className="text-xs block mt-1">Rarely</span>
                    </td>
                    <td className="p-4 text-center">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                      <span className="text-xs block mt-1">No</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-medium">Commitment</td>
                    <td className="p-4 text-center bg-green-50">
                      <span className="font-medium">Flexible</span>
                      <span className="text-xs block mt-1">Task-based</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">Flexible</span>
                      <span className="text-xs block mt-1">Project-based</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">Medium</span>
                      <span className="text-xs block mt-1">Contract-based</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium">High</span>
                      <span className="text-xs block mt-1">Long-term</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-12 text-center">
              <Link href="/vibe-coder-signup">
                <Button size="lg">
                  Get Started with VibeAlong
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Changed to white background */}

        {/* Developer Application Form Section */}
        <section
          id="developer-application"
          className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200"
        >
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Apply as a Vibe Expert</h2>
              <p className="text-xl text-muted-foreground">
                Join our network of expert developers and help vibe-coders turn their AI-generated code into
                production-ready applications.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="John Doe" {...form.register("fullName")} />
                            {form.formState.errors.fullName && (
                              <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" {...form.register("email")} />
                            {form.formState.errors.email && (
                              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Tell us about yourself</Label>
                          <Textarea
                            id="bio"
                            placeholder="Share your experience with AI tools and development..."
                            className="min-h-[100px]"
                            {...form.register("bio")}
                          />
                          {form.formState.errors.bio && (
                            <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                            <Select onValueChange={(value) => form.setValue("yearsOfExperience", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Less than 1 year</SelectItem>
                                <SelectItem value="1">1 year</SelectItem>
                                <SelectItem value="2">2 years</SelectItem>
                                <SelectItem value="3">3 years</SelectItem>
                                <SelectItem value="5">5+ years</SelectItem>
                                <SelectItem value="10">10+ years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="githubUrl">GitHub Profile (Optional)</Label>
                            <Input
                              id="githubUrl"
                              placeholder="https://github.com/yourusername"
                              {...form.register("githubUrl")}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>AI Platforms you're familiar with</Label>
                          <div className="flex flex-wrap gap-2">
                            {["V0", "Cursor", "Replit", "Lovable", "Other"].map((platform) => (
                              <label
                                key={platform}
                                className="flex items-center space-x-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50"
                              >
                                <Checkbox
                                  id={`platform-${platform}`}
                                  onCheckedChange={(checked) => {
                                    const currentPlatforms = form.getValues("aiPlatforms") || []
                                    if (checked) {
                                      form.setValue("aiPlatforms", [...currentPlatforms, platform.toLowerCase()])
                                    } else {
                                      form.setValue(
                                        "aiPlatforms",
                                        currentPlatforms.filter((p) => p !== platform.toLowerCase()),
                                      )
                                    }
                                  }}
                                />
                                <span>{platform}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        <Sparkles className="mr-2 h-4 w-4" /> Submit Application
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
