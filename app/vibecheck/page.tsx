"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Code, FileCode, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function VibeCheckPage() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-black mb-6"
          >
            Get Your Project Vibe Check
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-10 bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <h2 className="text-2xl font-semibold mb-4 text-black">Why Get a Vibe Check?</h2>
            <p className="text-gray-600 mb-6">
              Our AI-powered Vibe Check analyzes your codebase to identify strengths, weaknesses, and opportunities for
              improvement. In just minutes, you'll receive:
            </p>

            <ul className="space-y-4 mb-6">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-black flex items-center justify-center mt-0.5 mr-3">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-black">Comprehensive Code Analysis</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Get detailed insights into your code quality, architecture, and performance with our AI-powered
                    analysis.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-black flex items-center justify-center mt-0.5 mr-3">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-black">Customized Development Plan</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Receive a prioritized roadmap of tasks with time estimates for DIY or with VibeAlong experts (4x
                    faster).
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-black flex items-center justify-center mt-0.5 mr-3">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-black">Expert-Ready Task Board</span>
                  <p className="text-gray-600 text-sm mt-1">
                    Access a Kanban board with ready-to-implement tasks that you can complete yourself or assign to our
                    vetted experts.
                  </p>
                </div>
              </li>
            </ul>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 italic">
                "The Vibe Check saved us weeks of development time by identifying critical issues and providing a clear
                roadmap for improvement. The expert assistance option was a game-changer for our team."
              </p>
              <p className="text-gray-500 text-sm mt-2">— Sarah Chen, CTO at TechFlow</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          <Card
            className={`border-2 transition-all duration-300 ${
              isHovered ? "border-gray-300 shadow-md" : "border-gray-200 shadow"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4">
                    <FileCode className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upload Your Code</h3>
                  <p className="text-gray-600">
                    Upload a ZIP file of your project for a comprehensive analysis of your codebase.
                  </p>
                </div>
                <div className="mt-auto">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white" size="lg" asChild>
                    <Link href="/vibecheck/start">
                      Upload Code <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-2 transition-all duration-300 ${
              !isHovered ? "border-gray-300 shadow-md" : "border-gray-200 shadow"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Connect GitHub Repository</h3>
                  <p className="text-gray-600">
                    Connect your GitHub repository for a seamless analysis of your codebase.
                  </p>
                </div>
                <div className="mt-auto">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white" size="lg" asChild>
                    <Link href="/vibecheck/start">
                      Connect GitHub <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4 relative">
                <span className="text-white font-bold">1</span>
                <div className="absolute h-1 bg-gray-300 w-full right-0 top-1/2 transform translate-x-1/2 hidden md:block"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Your Code</h3>
              <p className="text-gray-600 text-sm">Upload your code or connect your GitHub repository for analysis.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4 relative">
                <span className="text-white font-bold">2</span>
                <div className="absolute h-1 bg-gray-300 w-full right-0 top-1/2 transform translate-x-1/2 hidden md:block"></div>
              </div>
              <h3 className="text-lg font-medium mb-2">Get Your Analysis</h3>
              <p className="text-gray-600 text-sm">Our AI analyzes your code and generates a comprehensive report.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Implement Solutions</h3>
              <p className="text-gray-600 text-sm">
                Choose to implement solutions yourself or hire our vetted experts.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
