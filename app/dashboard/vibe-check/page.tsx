"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Github,
  Upload,
  FileArchive,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  FileCode2,
  CheckSquare,
  BarChart3,
  Zap,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"

export default function VibeCheckPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [githubUrl, setGithubUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data for demonstration
  const mockResults = {
    score: 78,
    lastCheck: new Date(),
    insights: [
      {
        type: "critical",
        title: "Missing TypeScript configurations",
        description: "Your project lacks proper TypeScript configuration which may lead to type errors in production.",
        action: "Add tsconfig.json with strict mode enabled",
      },
      {
        type: "warning",
        title: "Outdated dependencies",
        description: "Several dependencies are outdated and may contain security vulnerabilities.",
        action: "Run npm audit fix to update dependencies",
      },
      {
        type: "improvement",
        title: "Inconsistent code formatting",
        description: "Code formatting is inconsistent across files which reduces maintainability.",
        action: "Add Prettier and ESLint configuration",
      },
      {
        type: "positive",
        title: "Good component structure",
        description: "Your React components follow best practices with proper separation of concerns.",
        action: null,
      },
    ],
    suggestedTasks: [
      {
        id: "task-1",
        title: "Set up proper TypeScript configuration",
        priority: "High",
        estimatedHours: 2,
      },
      {
        id: "task-2",
        title: "Update dependencies and fix security vulnerabilities",
        priority: "Medium",
        estimatedHours: 3,
      },
      {
        id: "task-3",
        title: "Implement consistent code formatting with Prettier",
        priority: "Medium",
        estimatedHours: 1,
      },
    ],
    fileBreakdown: [
      { name: "React Components", count: 24, issues: 5 },
      { name: "API Routes", count: 8, issues: 2 },
      { name: "Utility Functions", count: 12, issues: 3 },
      { name: "Configuration Files", count: 6, issues: 4 },
    ],
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true)

      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false)
        setIsAnalyzing(true)

        // Simulate analysis process
        setTimeout(() => {
          setIsAnalyzing(false)
          setHasResults(true)
        }, 3000)
      }, 2000)
    }
  }

  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (githubUrl) {
      setIsAnalyzing(true)

      // Simulate analysis process
      setTimeout(() => {
        setIsAnalyzing(false)
        setHasResults(true)
      }, 5000)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const runNewCheck = () => {
    setHasResults(false)
    setActiveTab("upload")
    setGithubUrl("")
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-amber-500"
    return "text-red-500"
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "improvement":
        return <Zap className="h-5 w-5 text-blue-500" />
      case "positive":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Vibe Check</h1>
          <p className="text-muted-foreground mt-1">
            Analyze your code for quality, best practices, and actionable improvements
          </p>
        </div>
        {hasResults && (
          <Button onClick={runNewCheck} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Run New Check
          </Button>
        )}
      </div>

      {!hasResults ? (
        <>
          <Card className="mb-8">
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <FileArchive className="h-4 w-4" />
                    Upload ZIP File
                  </TabsTrigger>
                  <TabsTrigger value="github" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    Connect GitHub
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      isUploading ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
                    }`}
                  >
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Upload your project as a ZIP file</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Drag and drop or click to browse your files
                        </p>
                      </div>
                      <Button onClick={triggerFileInput} disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Select ZIP File"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="github" className="space-y-4">
                  <form onSubmit={handleGithubSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="github-url" className="block text-sm font-medium mb-1">
                          GitHub Repository URL
                        </label>
                        <div className="flex gap-2">
                          <Input
                            id="github-url"
                            placeholder="https://github.com/username/repository"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="submit" disabled={!githubUrl || isAnalyzing}>
                            Connect
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          We&apos;ll only analyze public repositories or those you have access to
                        </p>
                      </div>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {isAnalyzing && (
            <Card>
              <CardHeader>
                <CardTitle>Analyzing Your Code</CardTitle>
                <CardDescription>
                  We&apos;re scanning your code for quality issues, best practices, and improvement opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Analyzing code structure...</span>
                    <span>65%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="space-y-8">
          {/* Results Summary Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Vibe Check Results</CardTitle>
                  <CardDescription>
                    Last checked: {format(mockResults.lastCheck, "MMMM d, yyyy 'at' h:mm a")}
                  </CardDescription>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1 leading-none">
                    <span className={getScoreColor(mockResults.score)}>{mockResults.score}</span>
                    <span className="text-muted-foreground text-lg">/100</span>
                  </div>
                  <Badge variant={mockResults.score >= 70 ? "default" : "outline"} className="font-normal">
                    {mockResults.score >= 80 ? "Excellent" : mockResults.score >= 60 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {mockResults.fileBreakdown.map((item, index) => (
                  <Card key={index} className="bg-muted/30">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-4">
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold">{item.count}</span>
                        {item.issues > 0 && (
                          <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                            {item.issues} issues
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actionable Insights */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Actionable Insights</h2>
            <div className="space-y-4">
              {mockResults.insights.map((insight, index) => (
                <Card key={index} className={insight.type === "critical" ? "border-red-200" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                      <div>
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                        <CardDescription>{insight.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  {insight.action && (
                    <CardFooter className="pt-0 pb-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <span>Recommended action:</span>
                        <span>{insight.action}</span>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Suggested Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Suggested Tasks</h2>
              <Button variant="outline" size="sm" className="gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {mockResults.suggestedTasks.map((task, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10">
                        <CheckSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline" className="font-normal">
                            {task.priority} Priority
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {task.estimatedHours} hours
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      Create Task <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Results</CardTitle>
              <CardDescription>Save or share your Vibe Check results</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <FileCode2 className="h-4 w-4" />
                Export as PDF
              </Button>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Export as CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
