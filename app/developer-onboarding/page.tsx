"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DeveloperSignupForm } from "@/components/developer-signup-form"
import { MobileHeader } from "@/components/developer-onboarding/mobile-header"
import { useState, useEffect } from "react"

export default function DeveloperOnboardingPage() {
  const [blackLogoUrl, setBlackLogoUrl] = useState<string | null>(null)
  const [whiteLogoUrl, setWhiteLogoUrl] = useState<string | null>(null)
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)

  useEffect(() => {
    // Set the URLs directly
    setBlackLogoUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Black%20logo%20and%20icon-XKKwWKWOeJNf9iAsx14lW9gh21SCSr.svg",
    )
    setWhiteLogoUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/White%20logo%20and%20icon-WdXRixjXShKDQukn0SmUtWPcnNPdYz.png",
    )
    setFaviconUrl("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Favicon-RKbMrPfexyqQM90WZVxl9nvPJk95YV.png")
  }, [])

  const handleScrollToForm = () => {
    const formElement = document.getElementById("developer-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MobileHeader />
      <main className="flex-1">
        <section className="bg-white py-12 md:py-20 text-center">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center mb-10">
              <img
                src={faviconUrl || "/placeholder.svg"}
                alt="VibeAlong Icon"
                className="h-20 w-20"
                onError={(e) => {
                  console.log("Error loading favicon image")
                  e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                }}
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Become a VibeAlong Developer Today
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-8">
              Join our platform and get paid for on-demand coding gigs and scheduled sessions. Turn vibe-coded projects
              into production-ready applications.
            </p>
            <Button size="lg" onClick={handleScrollToForm}>
              Apply as a Developer
            </Button>
          </div>
        </section>

        <section className="bg-black text-white py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-12 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black mb-4">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Apply</h3>
                <p className="text-gray-300">
                  Fill out our developer application form and showcase your skills and experience.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Take the Quiz</h3>
                <p className="text-gray-300">
                  Complete our technical assessment to verify your coding abilities and problem-solving skills.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white text-black mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Start Earning</h3>
                <p className="text-gray-300">
                  Once approved, access our task queue and start working on projects that match your skills.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-12 text-center">
              Sample Tasks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">React Component Development</h3>
                  <p className="text-gray-500 mb-4">
                    Create a responsive navigation menu with dropdown functionality for a SaaS dashboard.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded">React</span>
                    <span className="font-bold">$50-75</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">API Integration</h3>
                  <p className="text-gray-500 mb-4">
                    Implement authentication with Google OAuth and store user data in a PostgreSQL database.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-green-100 text-green-800 py-1 px-2 rounded">Backend</span>
                    <span className="font-bold">$100-150</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Bug Fixing</h3>
                  <p className="text-gray-500 mb-4">
                    Resolve performance issues in a Next.js application causing slow page loads and memory leaks.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-purple-100 text-purple-800 py-1 px-2 rounded">
                      Performance
                    </span>
                    <span className="font-bold">$75-100</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20" id="developer-form">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-6">
                  Apply to Join Our Developer Network
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-6">
                  We're looking for skilled developers who can turn vibe-coded projects into production-ready
                  applications. Fill out the form to start the application process.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Flexible Schedule</h3>
                      <p className="text-sm text-gray-500">
                        Work on your own time and choose tasks that fit your availability.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Competitive Pay</h3>
                      <p className="text-sm text-gray-500">
                        Earn competitive rates based on task complexity and your expertise.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary h-5 w-5"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Diverse Projects</h3>
                      <p className="text-sm text-gray-500">
                        Work on a variety of projects across different industries and technologies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Tabs defaultValue="developer" className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="developer">Developer Application</TabsTrigger>
                  </TabsList>
                  <TabsContent value="developer" className="p-0 border-0">
                    <DeveloperSignupForm />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black text-white py-12 md:py-20">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-6">
              Join Our Developer Community
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mb-8">
              Connect with other developers, share knowledge, and grow your skills while earning.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-black hover:bg-gray-200" asChild>
              <Link href="#developer-form">Apply Now</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 font-bold mb-4">
                <img
                  src={whiteLogoUrl || "/placeholder.svg"}
                  alt="VibeAlong Logo"
                  className="h-8"
                  onError={(e) => {
                    console.log("Error loading white logo image")
                    e.currentTarget.src = "/placeholder.svg?height=32&width=120"
                  }}
                />
              </Link>
              <p className="text-gray-400 max-w-md">
                VibeAlong connects businesses with skilled developers for on-demand coding gigs and scheduled sessions.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/developer-onboarding" className="text-gray-400 hover:text-white">
                    For Developers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 VibeAlong. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
