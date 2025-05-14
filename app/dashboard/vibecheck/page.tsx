"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Brain, Puzzle, ArrowRight, Github, FileArchiveIcon as FileZip } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface ProjectInfo {
  projectName: string
  selectedTools: string[]
  projectStage: string
  hiringPlan: string
  projectGoal: string
}

interface CodeSource {
  type: string
  value: string
}

export default function VibeCheckResultsPage() {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null)
  const [codeSource, setCodeSource] = useState<CodeSource | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("good")

  useEffect(() => {
    // Load saved data from localStorage
    const loadData = () => {
      try {
        const savedProjectInfo = localStorage.getItem("vibecheck_project_info")
        const savedCodeSource = localStorage.getItem("vibecheck_code_source")

        if (savedProjectInfo) {
          setProjectInfo(JSON.parse(savedProjectInfo))
        }

        if (savedCodeSource) {
          setCodeSource(JSON.parse(savedCodeSource))
        }
      } catch (error) {
        console.error("Error loading saved data:", error)
      } finally {
        // Simulate loading time for better UX
        setTimeout(() => setIsLoading(false), 1500)
      }
    }

    loadData()
  }, [])

  const getVibeScore = () => {
    // In a real app, this would be calculated based on the analysis
    return {
      score: 8.5,
      maxScore: 10,
      averageScore: 7.2,
      letter: "B+",
      color: "bg-black",
      description: "Good foundation with room for improvement",
    }
  }

  const vibeScore = getVibeScore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-xl font-medium text-gray-700">Analyzing your code...</p>
          <p className="mt-2 text-gray-500">This will just take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-black">Your Vibe Check Results 🎉</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Here's our analysis of your project: {projectInfo?.projectName || "Your Project"}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Vibe Score</CardTitle>
                <div className="flex flex-col items-center">
                  <Badge className="text-2xl py-1.5 px-4 font-bold bg-black text-white">{vibeScore.score}/10</Badge>
                  <div className="text-xs mt-1">
                    <span className="text-gray-600">Avg: {vibeScore.averageScore.toFixed(1)}/10</span>
                    {vibeScore.score !== vibeScore.averageScore && (
                      <span
                        className={`ml-1 ${vibeScore.score > vibeScore.averageScore ? "text-gray-800" : "text-gray-600"}`}
                      >
                        ({vibeScore.score > vibeScore.averageScore ? "+" : ""}
                        {Math.round((vibeScore.score / vibeScore.averageScore - 1) * 100)}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <CardDescription className="text-base">{vibeScore.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex space-x-2 border-b pb-4 mb-6">
                <Button
                  variant={activeSection === "good" ? "default" : "outline"}
                  onClick={() => setActiveSection("good")}
                  className="flex items-center bg-black text-white hover:bg-gray-800"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Strengths
                </Button>
                <Button
                  variant={activeSection === "attention" ? "default" : "outline"}
                  onClick={() => setActiveSection("attention")}
                  className="flex items-center bg-black text-white hover:bg-gray-800"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Needs Attention
                </Button>
                <Button
                  variant={activeSection === "suggestions" ? "default" : "outline"}
                  onClick={() => setActiveSection("suggestions")}
                  className="flex items-center bg-black text-white hover:bg-gray-800"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Suggestions
                </Button>
              </div>

              <div className="space-y-6">
                {activeSection === "good" && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-xl font-medium flex items-center">
                      <CheckCircle className="mr-2 h-6 w-6 text-black" />
                      Things that look good
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Clean project structure", desc: "Your files are well-organized" },
                        { title: "Good use of components", desc: "Modular design approach" },
                        { title: "Responsive design", desc: "Works well on mobile and desktop" },
                        { title: "Proper error handling", desc: "Errors are caught and managed" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <h4 className="font-medium text-black">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSection === "attention" && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-xl font-medium flex items-center">
                      <AlertTriangle className="mr-2 h-6 w-6 text-black" />
                      Things that need attention
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Missing type definitions", desc: "Some files lack proper TypeScript types" },
                        { title: "Inconsistent naming conventions", desc: "Variable and function naming is mixed" },
                        { title: "Performance optimizations", desc: "Some components could be more efficient" },
                        { title: "Authentication flow", desc: "Security improvements recommended" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <h4 className="font-medium text-black">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSection === "suggestions" && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="text-xl font-medium flex items-center">
                      <Brain className="mr-2 h-6 w-6 text-black" />
                      AI suggestions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Implement SSR", desc: "Server-side rendering for better SEO" },
                        { title: "Add test coverage", desc: "Implement unit and integration tests" },
                        { title: "Form validation", desc: "Add consistent validation across forms" },
                        { title: "Image optimization", desc: "Use next/image for better performance" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <h4 className="font-medium text-black">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="space-y-4 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-xl font-medium flex items-center">
                    <Puzzle className="mr-2 h-6 w-6 text-black" />
                    Pre-made tasks to fix issues
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Fix Type Definitions",
                        desc: "Add proper TypeScript types to improve code quality",
                        icon: "📘",
                      },
                      {
                        title: "Optimize Authentication",
                        desc: "Improve user login and registration flow",
                        icon: "🔐",
                      },
                      {
                        title: "Add Form Validation",
                        desc: "Implement consistent validation across all forms",
                        icon: "✅",
                      },
                      {
                        title: "Performance Optimization",
                        desc: "Improve loading times and reduce bundle size",
                        icon: "⚡",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">{item.icon}</span>
                          <div>
                            <h4 className="font-medium text-black">{item.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-2 shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle>Your Vibe Plan</CardTitle>
              <CardDescription>AI-generated development roadmap for your project</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Vibe Plan Summary */}
              <div className="space-y-3">
                <h3 className="text-base font-medium">Development Plan</h3>
                <p className="text-sm text-gray-600">
                  Based on your project analysis, we've created a customized development plan to address the issues and
                  implement the suggested improvements.
                </p>

                <div className="bg-gray-50 rounded-md p-4 border border-gray-200 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Estimated completion time:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <div className="text-sm text-gray-500">DIY Approach</div>
                      <div className="text-lg font-bold">~4 weeks</div>
                    </div>
                    <div className="bg-black text-white p-3 rounded">
                      <div className="text-sm">With VibeAlong Experts</div>
                      <div className="text-lg font-bold">~1 week</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    VibeAlong experts can complete tasks 4x faster with higher quality due to their specialized
                    experience.
                  </p>
                </div>
              </div>

              {/* Task Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium">Key Tasks</h3>
                  <Button variant="link" size="sm" className="text-sm p-0 h-auto" asChild>
                    <Link href="/dashboard/vibeplan">View Full Plan</Link>
                  </Button>
                </div>

                <div className="space-y-2">
                  {[
                    { title: "Fix Type Definitions", estimate: "8 hours", priority: "High" },
                    { title: "Optimize Authentication Flow", estimate: "12 hours", priority: "Medium" },
                    { title: "Implement Form Validation", estimate: "6 hours", priority: "Medium" },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
                    >
                      <div>
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="text-xs text-gray-500">Est: {task.estimate}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  These tasks can be completed by you or assigned to our vetted experts.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button className="w-full h-12 text-base bg-black hover:bg-gray-800 shadow-md" asChild>
                  <Link href="/dashboard/vibeplan" className="flex items-center justify-center">
                    View Complete Vibe Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button variant="outline" className="w-full h-12 text-base hover:bg-gray-50" asChild>
                  <Link href="/consultation">Book Expert Consultation</Link>
                </Button>
              </div>

              {/* Project Summary */}
              <div className="bg-gray-50 p-5 rounded-md border border-gray-200">
                <h3 className="font-medium mb-3 text-gray-800">Project Summary</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Project:</span>{" "}
                    <span className="text-gray-600">{projectInfo?.projectName || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tools:</span>{" "}
                    <span className="text-gray-600">{projectInfo?.selectedTools?.join(", ") || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Stage:</span>{" "}
                    <span className="text-gray-600">{projectInfo?.projectStage || "Not specified"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-2">Code Source:</span>{" "}
                    {codeSource?.type === "github" ? (
                      <span className="flex items-center text-gray-600">
                        <Github className="h-4 w-4 mr-1" /> GitHub Repository
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-600">
                        <FileZip className="h-4 w-4 mr-1" /> Uploaded ZIP
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
