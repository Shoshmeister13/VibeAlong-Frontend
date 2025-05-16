"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Sparkles,
  Zap,
  Code,
  FileText,
  Download,
  BarChart,
  Database,
  X,
  Clock,
  DollarSign,
  Terminal,
  Check,
  ClipboardCheck,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react"
import Link from "next/link"
import { primaryVibePlatforms } from "@/components/vibe-platform-logos"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"
import { DeveloperSignupForm } from "@/components/developer-signup-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HomePage() {
  // State to control banner visibility
  const [showBanner, setShowBanner] = useState(true)
  // State to control consultation section visibility (hidden by default)
  const [showConsultationSection, setShowConsultationSection] = useState(false)

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
  const supabaseContext = useSupabase()
  const supabase = supabaseContext?.supabase

  useEffect(() => {
    // If there's an auth code in the URL, handleAuthCode()
  }, [code, supabase])

  // Only check session if explicitly requested via a query param
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) return

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
    if (redirectToDashboard === "true" && !code && supabase) {
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
      {/* Sticky VibeCheck Banner */}
      {showBanner && (
        <div className="sticky top-16 z-40 w-full border-b bg-gradient-to-r from-gray-800 to-black text-white shadow-md animate-in fade-in duration-300">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div className="flex items-center justify-center relative">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 flex items-center justify-center bg-white rounded-full w-8 h-8 shadow-sm animate-pulse aspect-square">
                  <span className="text-lg" style={{ lineHeight: 1 }}>
                    ✨
                  </span>
                </div>
                <p className="text-sm font-medium sm:text-base">
                  Ready to see if your project vibes? Run a free <span className="font-bold">VibeCheck</span> today!
                </p>
                <Link href="/vibecheck/start">
                  <Button
                    size="sm"
                    className="bg-white text-gray-800 hover:bg-gray-100 hover:text-black transition-transform hover:scale-105"
                  >
                    Start VibeCheck 🩺
                  </Button>
                </Link>
              </div>
              <button
                className="absolute right-0 text-white/80 hover:text-white transition-all hover:rotate-90"
                aria-label="Dismiss banner"
                onClick={() => setShowBanner(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex-1">
        {/* Hero Section - White Background */}
        <section className="relative overflow-hidden py-24 md:py-36 bg-white">
          <div className="absolute inset-0 -z-10 noise-bg opacity-5"></div>
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="animate-in mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                <span className="inline-block">Turn Your Vibe-Coding Gig</span>
                <br />
                <span className="inline-block">into Production Ready Software</span>
              </h1>
              <p className="animate-in delay-100 mb-8 text-xl text-muted-foreground">
                VibeAlong empowers AI-assisted coders with the tools and vetted experts to transform their creative
                ideas into production-ready applications.
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
          </div>
        </section>

        {/* AI Command Center Section - Moved below hero */}
        <section className="py-28 bg-black text-white" id="how-it-works">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Say Hello to Your Vibe Coding HQ 👋
              </h2>
              <p className="mt-4 text-xl text-white/70 leading-relaxed">
                VibeAlong is the AI-centric platform that empowers today&apos;s and tomorrow&apos;s AI-assisted coders.
                We provide a central command center to manage, hire, and accelerate your development tasks.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <ClipboardCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Project Assessment</h3>
                <p className="text-white/70 mb-4">
                  Our AI-powered assessment tool analyzes your project requirements and codebase to provide detailed
                  insights and recommendations for successful implementation and deployment
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Run a comprehensive VibeCheck</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Configure your project settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Get an initial project evaluation</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-enhanced Expert Consultation</h3>
                <p className="text-white/70 mb-4">
                  Connect with our AI-matched experts who provide personalized guidance on architecture, technology
                  choices, and development strategies tailored to your specific project needs
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Connect with specialized developers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Receive personalized guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Develop a strategic roadmap</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <LayoutDashboard className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Central Command for Hiring Vetted AI-Coding Experts</h3>
                <p className="text-white/70 mb-4">
                  VibeAlong manages a network of vetted experts who can jump into your projects and tasks for both short
                  and long-term purposes in a snap, helping you accelerate development and launch faster
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Track all project activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Manage development tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Accelerate your development cycle</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider-wave"></div>

        {/* VibeCheck Section - Formerly "What is VibeAlong" */}
        <section className="py-28 section-accent">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Vibe Coding? You Should Probably
                <br />
                Get a VibeCheck 🩺
              </h2>
              <p className="text-xl leading-relaxed mb-8">
                It all starts with a clear overview of your project. Our VibeCheck provides a comprehensive analysis of
                your codebase, architecture, and development needs to identify opportunities and potential challenges
                before they become problems.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-10 border border-gray-200/20">
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-6">
                  <div className="flex flex-col items-center p-6 rounded-lg bg-white/5 backdrop-blur-sm w-full md:w-1/3">
                    <FileText className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Project Analysis</h3>
                    <p className="text-sm text-center">
                      Get a detailed breakdown of your project&apos;s structure, dependencies, and technical
                      requirements
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-6 rounded-lg bg-white/5 backdrop-blur-sm w-full md:w-1/3">
                    <BarChart className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Opportunity Mapping</h3>
                    <p className="text-sm text-center">
                      Identify key areas for improvement and optimization in your development workflow
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-6 rounded-lg bg-white/5 backdrop-blur-sm w-full md:w-1/3">
                    <Zap className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Expert Matching</h3>
                    <p className="text-sm text-center">
                      Get matched with the perfect experts for your specific project needs and tech stack
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link href="/vibecheck/start">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      Start Your Free VibeCheck
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                No commitment required. Get valuable insights about your project in minutes.
              </p>
            </div>
          </div>
        </section>

        {/* AI Consultation Feature Section - Hidden for now */}
        {showConsultationSection && (
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
                          Get a comprehensive analysis of your project&apos;s scope, challenges, and opportunities.
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
                            &quot;Based on your project description, I recommend a React frontend with a Node.js
                            backend. Let&apos;s discuss your specific requirements and create a roadmap for your
                            development journey.&quot;
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
        )}

        {/* Decorative divider */}
        <div className="section-divider-wave"></div>

        {/* Developer Application Form Section */}
        <section
          id="developer-application"
          className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200"
        >
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Apply as a Vibe Expert 👨‍💻</h2>
              <p className="text-xl text-muted-foreground">
                Join our network of expert developers and help vibe-coders turn their AI-generated code into
                production-ready applications.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border p-6 bg-background">
                <h3 className="text-xl font-semibold mb-4">❤️ Why Developers Love VibeAlong</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Competitive Rates</h4>
                      <p className="text-sm text-muted-foreground">
                        Earn $10-50/hr based on our AI task assignment and standardized pricing engine.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Flexible Schedule</h4>
                      <p className="text-sm text-muted-foreground">
                        Work when you want, where you want. No minimum hours required.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Instant Matching</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI matches you with tasks that fit your skills and availability.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Diverse Projects</h4>
                      <p className="text-sm text-muted-foreground">
                        Work on a variety of projects across different technologies and industries.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-lg bg-muted p-4">
                  <h4 className="font-medium mb-2">Developer Testimonial</h4>
                  <blockquote className="text-sm italic text-muted-foreground">
                    &quot;VibeAlong has been a game-changer for my freelance career. I can pick up tasks when I have
                    free time, and the pay is competitive. The platform makes it easy to collaborate with vibe-coders
                    and deliver high-quality solutions.&quot;
                  </blockquote>
                  <div className="mt-3 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Developer" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-xs text-muted-foreground">Full-Stack Developer</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-6 bg-background">
                <DeveloperSignupForm isDeveloperFocused={true} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
