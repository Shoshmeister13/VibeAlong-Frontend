"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Check,
  Code,
  Terminal,
  Zap,
  Clock,
  DollarSign,
  Calendar,
  Bug,
  RefreshCw,
  Palette,
  Database,
  Construction,
  Bot,
  Server,
  Shield,
  Briefcase,
  Play,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DeveloperSignupForm } from "@/components/developer-signup-form"
import { Bolt } from "@/components/vibe-platform-icons"
import Link from "next/link"
import { primaryVibePlatforms } from "@/components/vibe-platform-logos"
import { CollaborationDemo } from "@/components/collaboration-demo"

function ForDevelopersContent() {
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
                <span className="text-muted-foreground">Now accepting developer applications</span>
              </div>
              <h1 className="animate-in mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Your Dev Skills are (Still) Needed 🫵
              </h1>
              <p className="animate-in delay-100 mb-8 text-xl text-muted-foreground">
                Join VibeAlong as a developer and assist turning vibe-coded projects into production-ready applications
                while earning competitive rates.
              </p>
              <div className="animate-in delay-200 flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#join-waitlist"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("join-waitlist")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" className="w-full">
                    Apply as a Developer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    See Demo
                    <Play className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
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
        </section>

        {/* Decorative divider */}
        <div className="section-divider"></div>

        {/* Vision Statement Section */}
        <section className="py-28 section-accent">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">✨ Our Vision</h2>
              <p className="text-xl leading-relaxed mb-8">
                We envision a world where developers and vibe-coders collaborate seamlessly to transform AI-generated
                code into production-ready applications. By bridging the gap between AI creativity and human expertise,
                we're enabling the future of software development.
              </p>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <Code className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI Task Assignment</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    ML-powered matching algorithm connects developers with the perfect tasks based on skills and
                    availability
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">On-Demand Developers</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    API-like access to skilled developers ready to transform vibe-code into production-ready
                    applications
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <DollarSign className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Weekly Payouts</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Automated payment system with transparent pricing and secure transactions for completed work
                  </p>
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
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">🔄 How It Works</h2>
              <p className="mt-4 text-lg text-white/70">
                Our streamlined process connects skilled developers with vibe-coders to turn AI-generated code into
                production-ready applications
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Apply</h3>
                <p className="text-white/70 mb-4">
                  Submit your application with your skills, experience, and availability
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Complete developer profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Showcase your expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Set your availability</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Get Matched</h3>
                <p className="text-white/70 mb-4">
                  Our AI matches you with tasks that fit your skills and availability
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">AI-powered skill matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Real-time notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Choose tasks that interest you</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Collaborate</h3>
                <p className="text-white/70 mb-4">
                  Work directly with vibe-coders in real-time collaborative environments
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Real-time code collaboration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Integrated communication tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Solve problems efficiently</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-white/20 bg-black/80 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">4. Get Paid</h3>
                <p className="text-white/70 mb-4">Receive fair compensation for your expertise and time</p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">AI-determined fair rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Weekly payouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Multiple payment methods</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Add the CollaborationDemo component after the "How It Works" section - ONLY VISIBLE ON DESKTOP */}
        <div className="hidden md:block">
          <CollaborationDemo />
        </div>

        {/* Decorative divider */}
        <div className="section-divider"></div>

        {/* What You'll Work On Section */}
        <section className="py-28 section-accent" id="what-youll-work-on">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16 animate-in">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">🛠️ What You'll Work On</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From instant fixes to deep collaboration, VibeAlong lets you build, debug, and innovate.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* On-Demand Tasks Column */}
              <div className="animate-in delay-100 space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">⚡ On-Demand Tasks</h3>
                  <p className="text-muted-foreground mt-2">Quick fixes with immediate impact</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: <Bug className="h-5 w-5" />,
                      title: "Bug Fixes",
                      description: "Solve errors in seconds",
                    },
                    {
                      icon: <RefreshCw className="h-5 w-5" />,
                      title: "API Debugging",
                      description: "Integrate & troubleshoot APIs",
                    },
                    {
                      icon: <Palette className="h-5 w-5" />,
                      title: "UI Adjustments",
                      description: "Fix layout, responsiveness",
                    },
                    {
                      icon: <Bolt className="h-5 w-5" />,
                      title: "Performance Tweaks",
                      description: "Optimize speed",
                    },
                    {
                      icon: <Database className="h-5 w-5" />,
                      title: "Database Queries",
                      description: "Optimize SQL requests",
                    },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md hover:border-primary/50"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {task.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Long-Term Projects Column */}
              <div className="animate-in delay-200 space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 text-amber-600 mb-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">📅 Long-Term Projects</h3>
                  <p className="text-muted-foreground mt-2">Deep collaboration for complex solutions</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: <Construction className="h-5 w-5" />,
                      title: "Full Feature Development",
                      description: "Build tools from scratch",
                    },
                    {
                      icon: <Bot className="h-5 w-5" />,
                      title: "AI Model Integration",
                      description: "Implement AI-driven solutions",
                    },
                    {
                      icon: <Server className="h-5 w-5" />,
                      title: "Complex Backend Work",
                      description: "Optimize servers & APIs",
                    },
                    {
                      icon: <Shield className="h-5 w-5" />,
                      title: "Security & Compliance",
                      description: "Strengthen system security",
                    },
                    {
                      icon: <Briefcase className="h-5 w-5" />,
                      title: "End-to-End Product Support",
                      description: "Work closely with startups & teams",
                    },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-lg border bg-card transition-all hover:shadow-md hover:border-primary/50"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {task.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-16 text-center animate-in delay-300">
              <h3 className="text-xl font-semibold mb-4">Ready to start solving real problems?</h3>
              <a
                href="#join-waitlist"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("join-waitlist")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="scroll-smooth"
              >
                <Button size="lg" className="animate-pulse">
                  Join Now & Start Earning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider-wave"></div>

        {/* Requirements Section - Black Background */}
        <section className="py-28 bg-black text-white" id="requirements">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">📋 Developer Requirements</h2>
              <p className="mt-4 text-lg text-white/70">
                We're looking for skilled developers who can help vibe-coders turn their AI-generated code into
                production-ready applications
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-white/20 p-6 bg-black/80">
                <h3 className="text-xl font-semibold mb-4">🔍 What We're Looking For</h3>
                <ul className="space-y-3">
                  {[
                    "Proficiency in modern web development technologies",
                    "Experience with React, Next.js, or similar frameworks",
                    "Strong problem-solving and debugging skills",
                    "Ability to understand and improve AI-generated code",
                    "Good communication skills and fluent English",
                    "Reliable internet connection and availability",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-white/20 p-6 bg-black/80">
                <h3 className="text-xl font-semibold mb-4">🌟 Bonus Qualifications</h3>
                <ul className="space-y-3">
                  {[
                    "Experience with AI-assisted development tools",
                    "Familiarity with vibe-coding platforms",
                    "Background in mentoring or teaching coding",
                    "Full-stack development experience",
                    "Experience with TypeScript and strongly-typed languages",
                    "Portfolio of completed projects",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider"></div>

        {/* Application Form Section */}
        <section className="py-28 section-accent" id="join-waitlist">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">🚀 Apply to Join VibeAlong</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Fill out the form below to apply as a developer. We'll review your application and get back to you soon.
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
                    "VibeAlong has been a game-changer for my freelance career. I can pick up tasks when I have free
                    time, and the pay is competitive. The platform makes it easy to collaborate with vibe-coders and
                    deliver high-quality solutions."
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

      {/* Footer - Black Background */}
      <SiteFooter />
    </div>
  )
}

export default function ForDevelopersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const { supabase } = useSupabase()

  useEffect(() => {
    // If there's an auth code in the URL, redirect to the callback handler
    if (code) {
      console.log("Detected auth code in root URL, redirecting to callback handler")
      router.push(`/auth/callback?code=${code}`)
    }
  }, [code, router])

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
          router.push("/dashboard")
        } else {
          // Get role from profile or user metadata
          const role = profile?.role || session.user.user_metadata.role || "developer"
          // Normalize role for URL
          const normalizedRole = role === "vibe_coder" ? "vibe-coder" : role
          router.push(`/onboarding/${normalizedRole}`)
        }
      }
    }

    // Only check session if there's a redirect param in the URL
    const redirectToDashboard = searchParams.get("redirect")
    if (redirectToDashboard === "true" && !code) {
      checkSession()
    }
  }, [supabase, router, code, searchParams])

  // If there's a code, show a loading state
  if (code) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Verifying your email...</p>
      </div>
    )
  }

  // Otherwise, render the normal home page
  return <ForDevelopersContent />
}
