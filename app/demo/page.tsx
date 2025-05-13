"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const totalSteps = 6

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAutoPlaying && currentStep < totalSteps - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = prev + 1
          if (nextStep >= totalSteps) {
            setIsAutoPlaying(false)
            return totalSteps - 1
          }
          return nextStep
        })
      }, 3000) // Change step every 3 seconds
    }

    return () => clearInterval(interval)
  }, [isAutoPlaying, currentStep])

  // Update progress when step changes
  useEffect(() => {
    setProgress((currentStep / (totalSteps - 1)) * 100)
  }, [currentStep])

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsAutoPlaying(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <SiteHeader />

      {/* Main content */}
      <main className="flex-grow">
        {/* Custom demo header */}
        <div className="bg-white border-b">
          <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold">VibeAlong Interactive Demo</h1>
              <p className="text-sm text-muted-foreground">See how developers and vibe-coders collaborate</p>
            </div>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={resetDemo}>
                Reset
              </Button>
              <Button variant={isAutoPlaying ? "destructive" : "default"} onClick={toggleAutoPlay}>
                {isAutoPlaying ? "Stop" : "Auto-Play"}
              </Button>
            </div>

            <Button variant="outline" onClick={handleNext} disabled={currentStep === totalSteps - 1}>
              Next
            </Button>
          </div>

          {/* Split screen demo */}
          <div className="grid md:grid-cols-2 gap-6 bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Left side - Vibe Coder */}
            <div className="border-r p-4">
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <h2 className="text-lg font-semibold text-center">Vibe Coder's View</h2>
              </div>

              {/* Step content for Vibe Coder */}
              <div className="h-[600px] overflow-hidden relative">
                {currentStep === 0 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <h3 className="text-xl font-bold mb-4">VibeAlong Dashboard</h3>
                      <p className="text-sm text-gray-500 mb-6">Welcome back, Alex! Here's your project overview.</p>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div>
                            <h4 className="font-medium">Active Projects</h4>
                            <p className="text-sm text-gray-500">2 projects in progress</p>
                          </div>
                          <span className="text-2xl font-bold">2</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                          <div>
                            <h4 className="font-medium">Completed Tasks</h4>
                            <p className="text-sm text-gray-500">This month</p>
                          </div>
                          <span className="text-2xl font-bold">7</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <div>
                            <h4 className="font-medium">Pending Tasks</h4>
                            <p className="text-sm text-gray-500">Awaiting developer</p>
                          </div>
                          <span className="text-2xl font-bold">1</span>
                        </div>
                      </div>

                      <div className="mt-8">
                        <Button className="w-full">Post a New Task</Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <h3 className="text-xl font-bold mb-4">Create New Task</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Describe your task in detail to find the right developer.
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Task Title</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            value="Fix authentication bug in login form"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            className="w-full p-2 border rounded-md h-24"
                            value="Users are getting 'Invalid credentials' error even with correct username/password. Need to fix the authentication logic in the login form component."
                          ></textarea>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Priority</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Required Skills</label>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">React</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Authentication
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">NextAuth</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">+ Add</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <Button className="w-full">Submit Task</Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <h3 className="text-xl font-bold mb-4">Task Analysis</h3>
                      <p className="text-sm text-gray-500 mb-6">Our AI is analyzing your task...</p>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-blue-50">
                          <h4 className="font-medium mb-2">Task Category</h4>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Bug Fix</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Authentication
                            </span>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-green-50">
                          <h4 className="font-medium mb-2">Estimated Complexity</h4>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Medium</span>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-amber-50">
                          <h4 className="font-medium mb-2">Suggested Price</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">$45</span>
                            <span className="text-sm text-gray-500">Based on complexity and required skills</span>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-purple-50">
                          <h4 className="font-medium mb-2">Estimated Time</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">1-2 hours</span>
                            <span className="text-sm text-gray-500">Based on similar tasks</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex gap-4">
                        <Button variant="outline" className="w-1/2">
                          Adjust
                        </Button>
                        <Button className="w-1/2">Publish Task</Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <h3 className="text-xl font-bold mb-4">Task Published</h3>
                      <p className="text-sm text-gray-500 mb-6">Your task is now live on the developer board.</p>

                      <div className="p-4 border rounded-lg bg-green-50 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <h4 className="font-medium">Task Status: Live</h4>
                        </div>
                        <p className="text-sm text-gray-600">Developers are now able to view and accept your task.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Fix authentication bug in login form</h4>
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Pending</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Users are getting 'Invalid credentials' error even with correct username/password...
                          </p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Posted just now</span>
                            <span className="font-medium">$45</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="font-medium mb-2">While you wait:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>Prepare any additional information developers might need</li>
                          <li>Check your notifications for developer questions</li>
                          <li>You'll be notified when a developer accepts your task</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <div className="bg-blue-50 p-3 rounded-lg mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <h3 className="font-medium">Developer Sarah has accepted your task!</h3>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-4">Task in Progress</h3>
                      <p className="text-sm text-gray-500 mb-6">A developer is now working on your task.</p>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Fix authentication bug in login form</h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              In Progress
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-800 text-xs font-medium">SD</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Sarah Developer</p>
                              <p className="text-xs text-gray-500">Full-Stack Developer</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-1">Progress</h5>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Started 10 minutes ago</span>
                            <span className="font-medium">Est. completion: 30 min</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <Button className="w-full">Open Collaboration Space</Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <div className="bg-green-50 p-3 rounded-lg mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <h3 className="font-medium">Task completed! Please review the solution.</h3>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-4">Task Completed</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        The developer has submitted a solution for your review.
                      </p>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Fix authentication bug in login form</h4>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Completed
                            </span>
                          </div>

                          <div className="p-3 bg-gray-50 rounded-lg mb-4">
                            <h5 className="text-sm font-medium mb-1">Developer Notes</h5>
                            <p className="text-sm text-gray-600">
                              Fixed the authentication bug. The issue was in the credential validation logic. I've also
                              added better error handling and improved the UX for login failures.
                            </p>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Completed in 45 minutes</span>
                            <span className="font-medium">$45</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Rate the solution:</h4>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-amber-400 cursor-pointer"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button variant="outline" className="w-1/2">
                            Request Changes
                          </Button>
                          <Button className="w-1/2">Approve & Pay</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Developer */}
            <div className="p-4">
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <h2 className="text-lg font-semibold text-center">Developer's View</h2>
              </div>

              {/* Step content for Developer */}
              <div className="h-[600px] overflow-hidden relative">
                {currentStep === 0 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <h3 className="text-xl font-bold mb-4">Developer Dashboard</h3>
                      <p className="text-sm text-gray-500 mb-6">Welcome back, Sarah! Here's your activity overview.</p>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div>
                            <h4 className="font-medium">Active Tasks</h4>
                            <p className="text-sm text-gray-500">Currently working on</p>
                          </div>
                          <span className="text-2xl font-bold">1</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                          <div>
                            <h4 className="font-medium">Completed Tasks</h4>
                            <p className="text-sm text-gray-500">This month</p>
                          </div>
                          <span className="text-2xl font-bold">12</span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <div>
                            <h4 className="font-medium">Earnings</h4>
                            <p className="text-sm text-gray-500">This month</p>
                          </div>
                          <span className="text-2xl font-bold">$580</span>
                        </div>
                      </div>

                      <div className="mt-8">
                        <Button className="w-full">Browse Available Tasks</Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <h3 className="text-xl font-bold mb-4">Available Tasks</h3>
                      <p className="text-sm text-gray-500 mb-6">Find tasks that match your skills and interests.</p>

                      <div className="mb-4">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full p-2 pl-8 border rounded-md"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 absolute left-2 top-3 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Update product catalog UI</h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">UI/UX</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Redesign the product catalog page to improve user experience...
                          </p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Posted 2 hours ago</span>
                            <span className="font-medium">$65</span>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Implement pagination for API results</h4>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                              Backend
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Add pagination to the products API endpoint to improve performance...
                          </p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Posted 3 hours ago</span>
                            <span className="font-medium">$55</span>
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg bg-blue-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Fix authentication bug in login form</h4>
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Bug Fix</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Users are getting 'Invalid credentials' error even with correct username/password...
                          </p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Posted just now</span>
                            <span className="font-medium">$45</span>
                          </div>
                          <div className="mt-3">
                            <Button size="sm" className="w-full">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <h3 className="text-xl font-bold mb-4">Task Details</h3>
                      <div className="flex justify-between items-center mb-6">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Bug Fix</span>
                        <span className="text-sm text-gray-500">Posted just now</span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Fix authentication bug in login form</h4>
                          <p className="text-sm text-gray-600 mt-2">
                            Users are getting 'Invalid credentials' error even with correct username/password. Need to
                            fix the authentication logic in the login form component.
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-1">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">React</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Authentication
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">NextAuth</span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Estimated Time</h4>
                            <p className="text-sm">1-2 hours</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Payment</h4>
                            <p className="text-lg font-bold">$45</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-1">Client</h4>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-800 text-xs font-medium">AC</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Alex Client</p>
                              <div className="flex items-center">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-amber-400"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                      />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <Button className="w-full">Jump on This Task</Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <div className="bg-blue-50 p-3 rounded-lg mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <h3 className="font-medium">You've accepted this task!</h3>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-4">Task Accepted</h3>
                      <p className="text-sm text-gray-500 mb-6">You're now working on this task.</p>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Fix authentication bug in login form</h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              In Progress
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Users are getting 'Invalid credentials' error even with correct username/password...
                          </p>

                          <div className="mb-4">
                            <h5 className="text-sm font-medium mb-1">Your Progress</h5>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Started just now</span>
                            <span className="font-medium">$45</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 space-y-4">
                        <Button className="w-full">Open Code Editor</Button>
                        <Button variant="outline" className="w-full">
                          Message Client
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6 h-[600px] overflow-auto">
                      <h3 className="text-xl font-bold mb-4">Code Editor</h3>
                      <p className="text-sm text-gray-500 mb-6">Fixing authentication bug in login form</p>

                      <div className="mb-4 flex justify-between items-center">
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">login-form.tsx</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">auth.ts</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">credentials.ts</span>
                        </div>
                        <span className="text-xs text-gray-500">Auto-saving...</span>
                      </div>

                      <div className="font-mono text-sm bg-gray-900 text-gray-200 p-4 rounded-lg mb-6 overflow-x-auto">
                        <pre className="whitespace-pre">
                          {`// credentials.ts
import { compare } from 'bcrypt';
import { db } from '@/lib/db';

export async function validateCredentials(
email: string,
password: string
) {
// BUG: Email comparison was case-sensitive
// const user = await db.user.findUnique({
//   where: { email },
// });

// FIX: Make email comparison case-insensitive
const user = await db.user.findFirst({
  where: {
    email: {
      equals: email,
      mode: 'insensitive',
    },
  },
});

if (!user) {
  return null;
}

// BUG: No timeout handling for bcrypt
// const isValid = await compare(password, user.password);

// FIX: Add timeout handling for bcrypt
let isValid = false;
try {
  isValid = await Promise.race([
    compare(password, user.password),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    ),
  ]);
} catch (error) {
  console.error('Password validation error:', error);
  return null;
}

if (!isValid) {
  return null;
}

return { id: user.id, name: user.name, email: user.email };
}`}
                        </pre>
                      </div>

                      <div className="p-4 border rounded-lg bg-amber-50 mb-6">
                        <h4 className="font-medium mb-2">Bug Analysis</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>Email comparison was case-sensitive, causing login failures</li>
                          <li>No timeout handling for bcrypt, causing potential hanging</li>
                          <li>Improved error logging for better debugging</li>
                        </ul>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-sm font-medium mb-1">Your Progress</h5>
                          <div className="w-40 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                        </div>
                        <Button size="sm">Submit Solution</Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="animate-fade-in">
                    <div className="bg-white rounded-lg border shadow-sm p-6">
                      <div className="bg-green-50 p-3 rounded-lg mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <h3 className="font-medium">Solution approved! Payment received.</h3>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-4">Task Completed</h3>
                      <p className="text-sm text-gray-500 mb-6">Great job! The client has approved your solution.</p>

                      <div className="p-4 border rounded-lg bg-green-50 mb-6">
                        <h4 className="font-medium mb-2">Payment Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Task payment</span>
                            <span className="font-medium">$45.00</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Platform fee (10%)</span>
                            <span className="text-sm">-$4.50</span>
                          </div>
                          <div className="border-t pt-2 mt-2 flex justify-between items-center">
                            <span className="font-medium">Net earnings</span>
                            <span className="font-bold">$40.50</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg mb-6">
                        <h4 className="font-medium mb-2">Client Feedback</h4>
                        <div className="flex mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-amber-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                              />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm italic">
                          "Perfect solution! Sarah quickly identified and fixed the authentication bug. The code is
                          clean and well-documented. Would definitely work with her again."
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg bg-blue-50">
                          <h4 className="font-medium mb-2">Your Stats Updated</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Completed Tasks</p>
                              <p className="font-bold">13</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total Earnings</p>
                              <p className="font-bold">$620.50</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Avg. Rating</p>
                              <p className="font-bold">4.9/5</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Response Rate</p>
                              <p className="font-bold">98%</p>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full">Find More Tasks</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
