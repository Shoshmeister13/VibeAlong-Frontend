"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  LockIcon,
  Database,
  CreditCard,
  Mail,
  ArrowRight,
  Code,
  Zap,
  CheckCircle,
  ChevronRight,
  Star,
  Users,
  Clock,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"

// Import site header and footer
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"

export default function V0IntegrationPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const { supabase } = useSupabase()

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll")
      elements.forEach((element) => {
        const position = element.getBoundingClientRect()
        if (position.top < window.innerHeight - 100) {
          element.classList.add("animate-in")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check for auth code and redirect if needed
  useEffect(() => {
    if (code) {
      console.log("Detected auth code in URL, redirecting to callback handler")
      router.push(`/auth/callback?code=${code}`)
    }
  }, [code, router])

  // Check session if redirect param is present
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

  // Value proposition cards data
  const valuePropositionCards = [
    {
      icon: <Code className="h-8 w-8 text-white" />,
      title: "Build screens fast with AI",
      description: "Use v0.dev to rapidly generate beautiful UI components and screens with simple text prompts.",
      colorFrom: "from-purple-600",
      colorTo: "to-indigo-700",
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Let experts add backend, auth, payments",
      description: "Our vetted developers will implement all the functionality your app needs to work in production.",
      colorFrom: "from-blue-600",
      colorTo: "to-cyan-700",
    },
    {
      icon: <Zap className="h-8 w-8 text-white" />,
      title: "Focus on product — we handle the code",
      description: "Concentrate on your product vision while our experts handle all the technical implementation.",
      colorFrom: "from-emerald-600",
      colorTo: "to-teal-700",
    },
  ]

  // Expert services data
  const expertServices = [
    {
      icon: <LockIcon className="h-6 w-6" />,
      title: "Auth Setup",
      description: "Secure user authentication and authorization",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "API Connection",
      description: "Connect to any third-party API",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Database Integration",
      description: "Supabase/Xano setup and integration",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Stripe Checkout",
      description: "Payment processing and subscription management",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Automation",
      description: "Transactional emails and marketing automation",
    },
  ]

  // How it works steps data
  const howItWorksSteps = [
    {
      step: 1,
      title: "Build screens in v0.dev",
      description: "Create your UI with AI assistance",
      icon: <Code className="h-5 w-5" />,
    },
    {
      step: 2,
      title: "Publish your project",
      description: "Share your v0.dev project on VibeAlong",
      icon: <ArrowRight className="h-5 w-5" />,
    },
    {
      step: 3,
      title: "Add tasks",
      description: "Choose pre-made tasks or custom requests",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      step: 4,
      title: "Get matched",
      description: "We'll match you with the perfect expert",
      icon: <Users className="h-5 w-5" />,
    },
    {
      step: 5,
      title: "Track & approve",
      description: "Monitor progress and approve the final result",
      icon: <Star className="h-5 w-5" />,
    },
  ]

  // Task data for tabs
  const taskData = {
    frontend: [
      { task: "Implement responsive design", complexity: "Low", hours: 3, price: 60 },
      { task: "Add dark mode support", complexity: "Medium", hours: 4, price: 80 },
      { task: "Create animated transitions", complexity: "Medium", hours: 5, price: 100 },
      { task: "Build interactive components", complexity: "High", hours: 6, price: 120 },
      { task: "Optimize for performance", complexity: "Medium", hours: 4, price: 80 },
    ],
    backend: [
      { task: "Set up user authentication", complexity: "Medium", hours: 4, price: 80 },
      { task: "Create REST API endpoints", complexity: "Medium", hours: 5, price: 100 },
      { task: "Implement data validation", complexity: "Medium", hours: 3, price: 60 },
      { task: "Set up database models", complexity: "High", hours: 6, price: 120 },
      { task: "Add user roles and permissions", complexity: "High", hours: 5, price: 100 },
    ],
    integration: [
      { task: "Connect Supabase database", complexity: "Medium", hours: 4, price: 80 },
      { task: "Add Stripe checkout", complexity: "High", hours: 6, price: 120 },
      { task: "Set up email notifications", complexity: "Medium", hours: 3, price: 60 },
      { task: "Integrate with third-party APIs", complexity: "High", hours: 5, price: 100 },
      { task: "Set up file uploads to cloud storage", complexity: "Medium", hours: 4, price: 80 },
    ],
  }

  // Testimonial data
  const testimonials = [
    {
      quote: "VibeAlong helped me turn my idea into a real app in 3 days — without writing a line of code.",
      author: "Alex Chen",
      role: "Founder at StartupName",
      rating: 5,
    },
    {
      quote:
        "The developers at VibeAlong are incredible. They took my v0.dev designs and made them fully functional in record time.",
      author: "Sarah Johnson",
      role: "Product Manager",
      rating: 5,
    },
    {
      quote:
        "I was amazed at how quickly the team was able to implement complex features like authentication and payments.",
      author: "Michael Rodriguez",
      role: "Indie Developer",
      rating: 4,
    },
  ]

  // FAQ data
  const faqs = [
    {
      question: "How does the integration with v0.dev work?",
      answer:
        "You can design your UI with v0.dev, then share your project with VibeAlong. Our experts will implement the backend functionality, connect APIs, and make your design fully functional.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Pricing depends on the complexity of your project. We offer task-based pricing so you only pay for what you need. Most projects range from $60-$500 depending on requirements.",
    },
    {
      question: "How long does it take to complete a project?",
      answer:
        "Most projects are completed within 1-7 days, depending on complexity. Simple tasks like authentication or API integration can be done in 1-2 days.",
    },
    {
      question: "Do I own the code?",
      answer:
        "Yes, you own 100% of the code we deliver. We provide full source code access and you retain all intellectual property rights.",
    },
    {
      question: "What if I'm not satisfied with the work?",
      answer:
        "We offer a satisfaction guarantee. If you're not happy with the work, we'll revise it until you're satisfied or provide a refund.",
    },
  ]

  return (
    <>
      <SiteHeader />
      <main className="flex flex-col min-h-screen">
        {/* Hero Section with Gradient Background */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gray-900"></div>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%239C92AC" fillOpacity="0.15"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          ></div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg flex items-center gap-3">
                    <Image
                      src="/vibealong-logo.png"
                      alt="VibeAlong Logo"
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <span className="text-xl font-semibold text-white">+</span>
                    <Image src="/platform-logos/v0-logo.png" alt="v0.dev Logo" width={40} height={40} />
                  </div>
                  <Badge className="bg-white/20 text-white hover:bg-white/30 ml-2">NEW INTEGRATION</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  Get Help from a{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    v0.dev Expert
                  </span>
                </h1>
                <p className="text-xl text-white/70 max-w-2xl">
                  Work smarter with VibeAlong + v0.dev. Turn your AI-generated designs into fully functional
                  applications without writing a single line of code.
                </p>
                <div className="pt-6 flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-md">
                    <Link href="/signup">Start Building with an Expert</Link>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10 rounded-md"
                  >
                    <Link href="#how-it-works">See How It Works</Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div
                  className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1"
                  style={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
                  <Image
                    src="https://sjc.microlink.io/DALgH5-uN2OXcUZH93wwM17XGGKo0Td8oHHDHnHsAlTSoXRGhboRsubVu9q-8f1tWKwm2Y7kI9vvNDRgjFuLDw.jpeg"
                    alt="v0.dev Interface"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-white text-sm font-medium">Powered by AI</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center z-20 animate-pulse">
                  <Zap className="h-10 w-10 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-black py-6 border-y border-white/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-white/60">Projects Completed</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-white/60">Expert Developers</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-white">24h</div>
                <div className="text-sm text-white/60">Average Response Time</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl font-bold text-white">4.9/5</div>
                <div className="text-sm text-white/60">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why VibeAlong + v0.dev?</h2>
              <p className="text-lg text-gray-600">
                The perfect combination of AI-powered design and expert development to bring your ideas to life faster
                than ever.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {valuePropositionCards.map((item, index) => (
                <Card
                  key={index}
                  className="p-6 border-0 shadow-lg overflow-hidden relative group animate-on-scroll"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.colorFrom} ${item.colorTo}`}
                  ></div>
                  <div className="flex flex-col h-full">
                    <div
                      className={`w-14 h-14 rounded-lg bg-gradient-to-br ${item.colorFrom} ${item.colorTo} flex items-center justify-center mb-6`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600 flex-grow">{item.description}</p>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link
                        href="#"
                        className="inline-flex items-center text-sm font-medium text-black hover:underline"
                      >
                        Learn more
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What Experts Can Do */}
        <section className="py-20 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What VibeAlong Experts Can Help You With</h2>
              <p className="text-lg text-gray-600">
                Our experts can handle all aspects of your project, from frontend to backend and everything in between.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {expertServices.map((item, index) => (
                <Card
                  key={index}
                  className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-on-scroll"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4 text-white">
                      {item.icon}
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
              <p className="text-lg text-gray-600">
                A simple, streamlined process to take your v0.dev designs to a fully functional application.
              </p>
            </div>

            <div className="relative">
              {/* Desktop timeline line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-black to-gray-200 -translate-y-1/2 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {howItWorksSteps.map((item, index) => (
                  <div
                    key={index}
                    className="relative z-10 flex flex-col items-center text-center animate-on-scroll"
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-4 shadow-lg">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-white/70">Step</span>
                        <span className="font-bold">{item.step}</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 w-full">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3 mx-auto">
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Tasks Tabs */}
        <section className="py-20 bg-gray-50">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Popular Tasks</h2>
              <p className="text-lg text-gray-600">
                Browse our most requested tasks and see how our experts can help with your project.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 animate-on-scroll">
              <div className="flex border-b border-gray-200">
                {["Frontend Tasks", "Backend Tasks", "Integration Tasks"].map((tab, index) => (
                  <button
                    key={index}
                    className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
                      activeTab === index ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Task</TableHead>
                        <TableHead className="w-[20%]">Complexity</TableHead>
                        <TableHead className="text-right">Estimate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskData.frontend.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.task}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.complexity === "Low"
                                  ? "outline"
                                  : item.complexity === "Medium"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {item.complexity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>
                                {item.hours} hrs — ${item.price}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeTab === 1 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Task</TableHead>
                        <TableHead className="w-[20%]">Complexity</TableHead>
                        <TableHead className="text-right">Estimate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskData.backend.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.task}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.complexity === "Low"
                                  ? "outline"
                                  : item.complexity === "Medium"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {item.complexity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>
                                {item.hours} hrs — ${item.price}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeTab === 2 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60%]">Task</TableHead>
                        <TableHead className="w-[20%]">Complexity</TableHead>
                        <TableHead className="text-right">Estimate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taskData.integration.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.task}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.complexity === "Low"
                                  ? "outline"
                                  : item.complexity === "Medium"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {item.complexity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>
                                {item.hours} hrs — ${item.price}
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-white">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Clients Say</h2>
              <p className="text-lg text-gray-600">
                Don't just take our word for it. Here's what people are saying about VibeAlong.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item, index) => (
                <Card
                  key={index}
                  className="p-8 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 animate-on-scroll"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex mb-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                    </div>
                    <blockquote className="text-lg italic text-gray-700 mb-6 flex-grow">"{item.quote}"</blockquote>
                    <div className="flex items-center mt-auto">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                      <div>
                        <cite className="font-semibold block not-italic">{item.author}</cite>
                        <span className="text-sm text-gray-500">{item.role}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Got questions? We've got answers.</p>
            </div>

            <div className="space-y-4 animate-on-scroll">
              {faqs.map((item, index) => (
                <Card key={index} className="border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-black text-white relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%239C92AC" fillOpacity="0.15"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          ></div>

          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm p-12 rounded-2xl border border-white/20 animate-on-scroll">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to ship your v0.dev build?</h2>
                <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                  Get expert help to turn your v0.dev designs into a fully functional application.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-md">
                    <Link href="/signup">Hire a VibeAlong Expert</Link>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10 rounded-md"
                  >
                    <Link href="/demo">See Demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </>
  )
}
