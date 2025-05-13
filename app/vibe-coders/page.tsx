"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Check,
  Code,
  Zap,
  DollarSign,
  Calendar,
  RefreshCw,
  Palette,
  Database,
  Construction,
  Bot,
  Server,
  Shield,
  Briefcase,
  Play,
  Bug,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { primaryVibePlatforms } from "@/components/vibe-platform-logos"
import { Bolt } from "@/components/vibe-platform-icons"

export default function VibeCodersPage() {
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
                <span className="text-muted-foreground">For Vibe Coders</span>
              </div>
              <h1 className="animate-in mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Elevate Your Vibe Coding Journey 🚀
              </h1>
              <p className="animate-in delay-100 mb-8 text-xl text-muted-foreground">
                Get expert help to transform your AI-generated code into production-ready applications with our network
                of skilled developers.
              </p>
              <div className="animate-in delay-200 flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/vibe-coder-signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    See Demo
                    <Play className="ml-2 h-4 w-4" />
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

        {/* Decorative divider */}
        <div className="section-divider"></div>

        {/* Vision Statement Section */}
        <section className="py-28 section-accent">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">✨ Why VibeAlong?</h2>
              <p className="text-xl leading-relaxed mb-8">
                We bridge the gap between AI-generated code and production-ready applications. As a vibe coder, you can
                focus on creativity and ideation while our expert developers handle the technical implementation.
              </p>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <Code className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Expert Developers</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Access a network of vetted developers with expertise across various technologies and frameworks
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Rapid Implementation</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Turn your vibe-coded projects into working applications faster than traditional development
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-lg border bg-background/80 backdrop-blur-sm w-full md:w-1/3">
                  <DollarSign className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Cost-Effective</h3>
                  <p className="text-sm text-center text-muted-foreground">
                    Pay only for the help you need with transparent pricing and no long-term commitments
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
                Our streamlined process connects you with skilled developers to turn your vibe-coded projects into
                reality
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
                <h3 className="text-xl font-semibold mb-2">1. Submit Project</h3>
                <p className="text-white/70 mb-4">Share your vibe-coded project and requirements with our platform</p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Upload your code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Describe your goals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Set your timeline</span>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Get Matched</h3>
                <p className="text-white/70 mb-4">
                  Our AI matches you with the perfect developer for your specific needs
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Skill-based matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Experience verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Availability confirmation</span>
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
                  Work directly with your developer in our real-time collaborative environment
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Live code sessions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Integrated chat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Progress tracking</span>
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">4. Get Results</h3>
                <p className="text-white/70 mb-4">
                  Receive your production-ready application and deploy with confidence
                </p>
                <ul className="text-sm text-left space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Quality assurance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Deployment support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">Documentation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider"></div>

        {/* What You'll Get Section */}
        <section className="py-28 section-accent" id="what-youll-get">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16 animate-in">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">🛠️ What You'll Get</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                From quick fixes to complete implementations, our developers deliver what you need
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Quick Fixes Column */}
              <div className="animate-in delay-100 space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">⚡ Quick Fixes</h3>
                  <p className="text-muted-foreground mt-2">Rapid solutions for specific issues</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: <Bug className="h-5 w-5" />,
                      title: "Bug Fixes",
                      description: "Resolve errors in your code",
                    },
                    {
                      icon: <RefreshCw className="h-5 w-5" />,
                      title: "API Integration",
                      description: "Connect to external services",
                    },
                    {
                      icon: <Palette className="h-5 w-5" />,
                      title: "UI Improvements",
                      description: "Enhance design & responsiveness",
                    },
                    {
                      icon: <Bolt className="h-5 w-5" />,
                      title: "Performance Optimization",
                      description: "Speed up your application",
                    },
                    {
                      icon: <Database className="h-5 w-5" />,
                      title: "Database Setup",
                      description: "Configure data storage",
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

              {/* Complete Projects Column */}
              <div className="animate-in delay-200 space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-amber-100 text-amber-600 mb-4">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">📅 Complete Projects</h3>
                  <p className="text-muted-foreground mt-2">End-to-end implementation of your vision</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      icon: <Construction className="h-5 w-5" />,
                      title: "Full-Stack Development",
                      description: "Front-end to back-end solutions",
                    },
                    {
                      icon: <Bot className="h-5 w-5" />,
                      title: "AI Integration",
                      description: "Implement ML/AI capabilities",
                    },
                    {
                      icon: <Server className="h-5 w-5" />,
                      title: "Infrastructure Setup",
                      description: "Cloud deployment & scaling",
                    },
                    {
                      icon: <Shield className="h-5 w-5" />,
                      title: "Security Implementation",
                      description: "Protect your application",
                    },
                    {
                      icon: <Briefcase className="h-5 w-5" />,
                      title: "Ongoing Support",
                      description: "Maintenance & updates",
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
              <h3 className="text-xl font-semibold mb-4">Ready to transform your vibe-coded project?</h3>
              <Link href="/vibe-coder-signup" className="scroll-smooth">
                <Button size="lg" className="animate-pulse">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider-wave"></div>

        {/* Testimonials Section - Black Background */}
        <section className="py-28 bg-black text-white" id="testimonials">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">💬 What Our Clients Say</h2>
              <p className="mt-4 text-lg text-white/70">
                Hear from vibe coders who have transformed their projects with VibeAlong
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-white/20 p-6 bg-black/80">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah K." />
                      <AvatarFallback>SK</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Sarah K.</h3>
                      <p className="text-sm text-white/70">Startup Founder</p>
                    </div>
                  </div>
                  <p className="text-white/90 italic">
                    "VibeAlong helped me turn my AI-generated prototype into a fully functional MVP in just two weeks.
                    The developer they matched me with understood exactly what I needed."
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-white/20 p-6 bg-black/80">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Michael T." />
                      <AvatarFallback>MT</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Michael T.</h3>
                      <p className="text-sm text-white/70">Product Manager</p>
                    </div>
                  </div>
                  <p className="text-white/90 italic">
                    "I was stuck with a complex API integration that my vibe-coded project couldn't handle. VibeAlong's
                    developer fixed it in hours, saving me days of frustration."
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-white/20 p-6 bg-black/80">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya M." />
                      <AvatarFallback>PM</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">Priya M.</h3>
                      <p className="text-sm text-white/70">Non-Technical Founder</p>
                    </div>
                  </div>
                  <p className="text-white/90 italic">
                    "As someone without coding experience, VibeAlong was a game-changer. I could create with AI and then
                    have experts make it production-ready without learning to code."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider"></div>

        {/* Pricing Section */}
        <section className="py-28 section-accent" id="pricing">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">💰 Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose the plan that fits your project needs and budget
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <div className="flex flex-col p-6 bg-white rounded-lg border shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Quick Fix</h3>
                  <div className="mt-2 text-3xl font-bold">$99</div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                <ul className="mb-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Single issue resolution</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>48-hour turnaround</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>1 revision included</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Code documentation</span>
                  </li>
                </ul>
                <Link href="/vibe-coder-signup" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="flex flex-col p-6 bg-primary text-primary-foreground rounded-lg border border-primary shadow-md relative">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">MOST POPULAR</span>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Project Boost</h3>
                  <div className="mt-2 text-3xl font-bold">$499</div>
                  <p className="text-sm text-primary-foreground/80">One-time payment</p>
                </div>
                <ul className="mb-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary-foreground" />
                    <span>Complete feature implementation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary-foreground" />
                    <span>1-week turnaround</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary-foreground" />
                    <span>3 revisions included</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary-foreground" />
                    <span>Code documentation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary-foreground" />
                    <span>Deployment assistance</span>
                  </li>
                </ul>
                <Link href="/vibe-coder-signup" className="w-full">
                  <Button variant="secondary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="flex flex-col p-6 bg-white rounded-lg border shadow-sm">
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Full Implementation</h3>
                  <div className="mt-2 text-3xl font-bold">$1,999</div>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                </div>
                <ul className="mb-6 space-y-2 flex-1">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>End-to-end project development</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Custom timeline</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Unlimited revisions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Comprehensive documentation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>Full deployment & support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>30-day post-launch support</span>
                  </li>
                </ul>
                <Link href="/vibe-coder-signup" className="w-full">
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="section-divider-wave"></div>

        {/* CTA Section - Black Background */}
        <section className="py-28 bg-black text-white" id="join-platform">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                🚀 Ready to Transform Your Project?
              </h2>
              <p className="text-xl leading-relaxed mb-8 text-white/80">
                Join VibeAlong today and connect with expert developers who can turn your vibe-coded projects into
                production-ready applications.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/vibe-coder-signup" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full bg-white text-black hover:bg-gray-100">
                    Sign Up Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10">
                    See Demo
                    <Play className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
