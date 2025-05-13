"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Clock, DollarSign, Send, Play, CheckCircle2, ArrowRight } from "lucide-react"
import { V0 } from "@/components/vibe-platform-icons"
import { LiveCodingEnvironment } from "@/components/demo/live-coding-environment"
import { TaskCard } from "@/components/demo/task-card"
import { PaymentSummary } from "@/components/demo/payment-summary"

export function AnimatedSplitScreen() {
  // State to track the current step in the flow
  const [step, setStep] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)
  const [progress, setProgress] = useState(0)

  // Task details
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    platform: "",
    urgency: "",
    price: 0,
  })

  // Auto-advance steps when autoPlay is enabled
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (autoPlay && step < 12) {
      timer = setTimeout(() => {
        setStep((prev) => prev + 1)
      }, 3000)
    }

    return () => clearTimeout(timer)
  }, [autoPlay, step])

  // Update progress based on current step
  useEffect(() => {
    setProgress(Math.min(100, (step / 12) * 100))
  }, [step])

  // Handle task form input
  const handleTaskInput = (field: string, value: string | number) => {
    setTaskDetails((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-fill for demo purposes
    if (field === "title" && value === "Fix authentication bug") {
      setTimeout(() => {
        setTaskDetails((prev) => ({
          ...prev,
          description:
            "Users are unable to log in with correct credentials. Need to debug the authentication flow and fix the issue.",
          platform: "v0",
          urgency: "high",
          price: 45,
        }))
      }, 500)
    }
  }

  // Reset the demo
  const resetDemo = () => {
    setStep(0)
    setTaskDetails({
      title: "",
      description: "",
      platform: "",
      urgency: "",
      price: 0,
    })
    setAutoPlay(false)
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Demo controls */}
      {showControls && (
        <div className="mb-6 p-4 bg-black/5 dark:bg-white/5 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                disabled={step === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((prev) => Math.min(12, prev + 1))}
                disabled={step === 12}
              >
                Next
              </Button>
              <Button variant={autoPlay ? "default" : "outline"} size="sm" onClick={() => setAutoPlay(!autoPlay)}>
                {autoPlay ? (
                  <span className="flex items-center">
                    Playing <Clock className="ml-2 h-3 w-3 animate-spin" />
                  </span>
                ) : (
                  <span className="flex items-center">
                    Auto Play <Play className="ml-2 h-3 w-3" />
                  </span>
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Step {step} of 12</span>
              <Button variant="ghost" size="sm" onClick={resetDemo}>
                Reset Demo
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowControls(false)}>
                Hide Controls
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      )}

      {!showControls && (
        <Button variant="outline" size="sm" className="mb-4" onClick={() => setShowControls(true)}>
          Show Controls
        </Button>
      )}

      {/* Split screen container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-[600px] md:h-[700px] overflow-hidden">
        {/* Left side - Vibe Coder's View */}
        <div className="relative rounded-xl border overflow-hidden bg-background shadow-md">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 text-center text-sm font-medium">
            Vibe Coder's View
          </div>
          <div className="pt-10 p-4 h-full overflow-auto">
            <AnimatePresence mode="wait">
              {/* Step 0-1: Login Screen */}
              {step < 2 && (
                <motion.div
                  key="vibe-login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center"
                >
                  <div className="w-full max-w-sm mx-auto">
                    <Card>
                      <CardHeader className="text-center">
                        <CardTitle>Welcome to VibeAlong</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Input type="email" placeholder="Email" value="vibecoder@example.com" readOnly />
                          </div>
                          <div className="space-y-2">
                            <Input type="password" placeholder="Password" value="••••••••" readOnly />
                          </div>
                          <Button type="button" className="w-full" onClick={() => step === 0 && setStep(1)}>
                            {step === 0 ? "Log In" : "Logging in..."}
                            {step === 1 && <Clock className="ml-2 h-4 w-4 animate-spin" />}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Step 2-3: Dashboard */}
              {step >= 2 && step < 4 && (
                <motion.div
                  key="vibe-dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Dashboard</h2>
                      <p className="text-muted-foreground">Welcome back, Vibe Coder!</p>
                    </div>
                    <Button onClick={() => step === 2 && setStep(3)} className={step === 3 ? "animate-pulse" : ""}>
                      Post a Task
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">2 tasks in progress</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completed This Month</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">7</div>
                        <p className="text-xs text-muted-foreground">+3 from last month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                            <div className="text-sm">Task completed: Add user profile page</div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                            <div className="text-sm">New developer joined: Sarah D.</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Step 4-5: Create Task Form */}
              {step >= 4 && step < 6 && (
                <motion.div
                  key="vibe-create-task"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">Post a New Task</h2>
                    <p className="text-muted-foreground">Describe what you need help with</p>
                  </div>

                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Task Title</label>
                      <Input
                        placeholder="E.g., Fix authentication bug"
                        value={taskDetails.title}
                        onChange={(e) => handleTaskInput("title", e.target.value)}
                        className={step === 4 ? "animate-pulse border-blue-500" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Task Description</label>
                      <Textarea
                        placeholder="Describe what you need help with in detail..."
                        className="min-h-[100px]"
                        value={taskDetails.description}
                        onChange={(e) => handleTaskInput("description", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Vibe-Coding Platform</label>
                        <Select
                          value={taskDetails.platform}
                          onValueChange={(value) => handleTaskInput("platform", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="v0">
                              <div className="flex items-center gap-2">
                                <V0 className="h-4 w-4" />
                                <span>v0</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Urgency Level</label>
                        <Select
                          value={taskDetails.urgency}
                          onValueChange={(value) => handleTaskInput("urgency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - Within 24 hours</SelectItem>
                            <SelectItem value="medium">Medium - Within 12 hours</SelectItem>
                            <SelectItem value="high">High - ASAP (Priority)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="w-full"
                      disabled={!taskDetails.title || !taskDetails.description}
                      onClick={() => step === 4 && setStep(5)}
                    >
                      {step === 4 ? "Continue" : "Analyzing task..."}
                      {step === 5 && <Clock className="ml-2 h-4 w-4 animate-spin" />}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 6: AI Pricing & Categorization */}
              {step === 6 && (
                <motion.div
                  key="vibe-ai-pricing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">Task Analysis</h2>
                    <p className="text-muted-foreground">Our AI has analyzed your task</p>
                  </div>

                  <Card className="mb-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center">
                        <Check className="mr-2 h-5 w-5 text-green-500" />
                        Task Analysis Complete
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">Task Category</h3>
                          <div className="flex mt-1">
                            <Badge variant="outline" className="mr-2">
                              Bug Fix
                            </Badge>
                            <Badge variant="outline" className="mr-2">
                              Authentication
                            </Badge>
                            <Badge variant="outline">Frontend</Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">Estimated Complexity</h3>
                          <div className="flex items-center mt-1">
                            <div className="w-full bg-secondary h-2 rounded-full">
                              <div className="bg-amber-500 h-2 rounded-full w-[60%]"></div>
                            </div>
                            <span className="ml-2 text-sm">Medium</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium">Suggested Price</h3>
                          <div className="flex items-center mt-1">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <span className="text-2xl font-bold">${taskDetails.price}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Based on task complexity and urgency level
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => setStep(7)}>
                        Publish Task
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 7: Task Published */}
              {step === 7 && (
                <motion.div
                  key="vibe-task-published"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">Task Published</h2>
                    <p className="text-muted-foreground">Your task is now live on the public board</p>
                  </div>

                  <Card className="mb-6 border-green-500">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="rounded-full bg-green-100 p-3">
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                      </div>
                      <h3 className="text-center text-xl font-semibold mb-2">Task Successfully Published!</h3>
                      <p className="text-center text-muted-foreground mb-4">
                        Your task is now visible to all developers on the platform.
                      </p>

                      <div className="border rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{taskDetails.title}</h4>
                          <Badge variant={taskDetails.urgency === "high" ? "destructive" : "outline"}>
                            {taskDetails.urgency === "high"
                              ? "High Priority"
                              : taskDetails.urgency === "medium"
                                ? "Medium Priority"
                                : "Low Priority"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{taskDetails.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <V0 className="h-4 w-4 mr-1" />
                            <span className="text-xs">{taskDetails.platform}</span>
                          </div>
                          <div className="text-sm font-semibold">${taskDetails.price}</div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Average pickup time for similar tasks:</p>
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-1 text-amber-500" />
                          <span className="font-medium">~5 minutes</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setStep(8)}>
                        View Task Board
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}

              {/* Step 8-9: Waiting for Developer */}
              {step >= 8 && step < 10 && (
                <motion.div
                  key="vibe-waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">Task Board</h2>
                    <p className="text-muted-foreground">Monitor your tasks and their status</p>
                  </div>

                  <Tabs defaultValue="active">
                    <TabsList className="mb-4">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="all">All Tasks</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="space-y-4">
                      <TaskCard
                        title={taskDetails.title}
                        description={taskDetails.description}
                        platform={taskDetails.platform}
                        urgency={taskDetails.urgency}
                        price={taskDetails.price}
                        status={step === 8 ? "waiting" : "in-progress"}
                        developer={
                          step === 9
                            ? {
                                name: "Alex Developer",
                                avatar: "/placeholder.svg?height=40&width=40",
                              }
                            : undefined
                        }
                      />

                      <TaskCard
                        title="Add user profile page"
                        description="Create a user profile page with avatar upload functionality"
                        platform="v0"
                        urgency="medium"
                        price={35}
                        status="in-progress"
                        developer={{
                          name: "Sarah Developer",
                          avatar: "/placeholder.svg?height=40&width=40",
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {/* Step 10-12: Task Completion & Payment */}
              {step >= 10 && step <= 12 && (
                <motion.div
                  key="vibe-completion"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  {step === 10 && (
                    <div className="h-full flex flex-col">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Live Collaboration</h2>
                        <p className="text-muted-foreground">Watch as the developer fixes your issue</p>
                      </div>

                      <LiveCodingEnvironment role="viewer" />
                    </div>
                  )}

                  {step === 11 && (
                    <div className="h-full">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Task Completed</h2>
                        <p className="text-muted-foreground">The developer has fixed the issue</p>
                      </div>

                      <Card className="mb-6 border-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-center mb-4">
                            <div className="rounded-full bg-green-100 p-3">
                              <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                          </div>
                          <h3 className="text-center text-xl font-semibold mb-2">Bug Fix Completed!</h3>
                          <p className="text-center text-muted-foreground mb-4">
                            Alex has fixed the authentication bug in your login form.
                          </p>

                          <div className="border rounded-lg p-4 mb-4">
                            <h4 className="font-medium mb-2">Developer Notes:</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              "I found that the login form wasn't properly handling the authentication token. I've fixed
                              the issue by updating the token validation logic and adding proper error handling. All
                              tests are now passing."
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button variant="outline" className="w-full" onClick={() => setStep(12)}>
                            Review Changes
                          </Button>
                          <Button className="w-full" onClick={() => setStep(12)}>
                            Approve & Pay
                            <Check className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}

                  {step === 12 && (
                    <div className="h-full">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Payment Complete</h2>
                        <p className="text-muted-foreground">Task has been successfully completed</p>
                      </div>

                      <PaymentSummary
                        taskTitle={taskDetails.title}
                        developer={{
                          name: "Alex Developer",
                          avatar: "/placeholder.svg?height=40&width=40",
                        }}
                        amount={taskDetails.price}
                      />

                      <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                          How would you rate your experience with Alex?
                        </p>
                        <div className="flex justify-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} className="text-yellow-400 hover:text-yellow-500 focus:outline-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-8 h-8"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side - Developer's View */}
        <div className="relative rounded-xl border overflow-hidden bg-background shadow-md">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-teal-500 text-white p-2 text-center text-sm font-medium">
            Developer's View
          </div>
          <div className="pt-10 p-4 h-full overflow-auto">
            <AnimatePresence mode="wait">
              {/* Step 0-1: Login Screen */}
              {step < 2 && (
                <motion.div
                  key="dev-login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center"
                >
                  <div className="w-full max-w-sm mx-auto">
                    <Card>
                      <CardHeader className="text-center">
                        <CardTitle>Developer Portal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="space-y-2">
                            <Input type="email" placeholder="Email" value="developer@example.com" readOnly />
                          </div>
                          <div className="space-y-2">
                            <Input type="password" placeholder="Password" value="••••••••" readOnly />
                          </div>
                          <Button type="button" className="w-full" onClick={() => step === 0 && setStep(1)}>
                            {step === 0 ? "Log In" : "Logging in..."}
                            {step === 1 && <Clock className="ml-2 h-4 w-4 animate-spin" />}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {/* Step 2-7: Developer Dashboard */}
              {step >= 2 && step < 8 && (
                <motion.div
                  key="dev-dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">Task Board</h2>
                      <p className="text-muted-foreground">Available tasks for you</p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Balance: $230
                      </Badge>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Developer" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Input placeholder="Search tasks..." className="w-full" />
                  </div>

                  <Tabs defaultValue="available">
                    <TabsList className="mb-4">
                      <TabsTrigger value="available">Available</TabsTrigger>
                      <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>

                    <TabsContent value="available" className="space-y-4">
                      {/* New task appears when Vibe Coder publishes it */}
                      {step >= 7 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Card className={step === 8 ? "border-blue-500 animate-pulse" : ""}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium">{taskDetails.title}</h3>
                                <Badge variant={taskDetails.urgency === "high" ? "destructive" : "outline"}>
                                  {taskDetails.urgency === "high"
                                    ? "High Priority"
                                    : taskDetails.urgency === "medium"
                                      ? "Medium Priority"
                                      : "Low Priority"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {taskDetails.description}
                              </p>
                              <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                  <V0 className="h-4 w-4 mr-1" />
                                  <span className="text-xs">{taskDetails.platform}</span>
                                </div>
                                <div className="text-sm font-semibold">${taskDetails.price}</div>
                              </div>
                              <Button className="w-full" onClick={() => step === 8 && setStep(9)}>
                                Jump on Task
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">Create responsive navbar</h3>
                            <Badge variant="outline">Medium Priority</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            Need to implement a responsive navbar that collapses into a hamburger menu on mobile
                            devices.
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <V0 className="h-4 w-4 mr-1" />
                              <span className="text-xs">v0</span>
                            </div>
                            <div className="text-sm font-semibold">$30</div>
                          </div>
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">Optimize database queries</h3>
                            <Badge variant="outline">Low Priority</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            The application is running slow due to inefficient database queries. Need to optimize them.
                          </p>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <V0 className="h-4 w-4 mr-1" />
                              <span className="text-xs">v0</span>
                            </div>
                            <div className="text-sm font-semibold">$55</div>
                          </div>
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {/* Step 9-12: Developer Working on Task */}
              {step >= 9 && step <= 12 && (
                <motion.div
                  key="dev-working"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  {step === 9 && (
                    <div className="h-full">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Task Details</h2>
                        <p className="text-muted-foreground">You've accepted this task</p>
                      </div>

                      <Card className="mb-6">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{taskDetails.title}</h3>
                            <Badge variant={taskDetails.urgency === "high" ? "destructive" : "outline"}>
                              {taskDetails.urgency === "high"
                                ? "High Priority"
                                : taskDetails.urgency === "medium"
                                  ? "Medium Priority"
                                  : "Low Priority"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{taskDetails.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <V0 className="h-4 w-4 mr-1" />
                              <span className="text-xs">{taskDetails.platform}</span>
                            </div>
                            <div className="text-sm font-semibold">${taskDetails.price}</div>
                          </div>

                          <div className="border-t pt-4 mt-4">
                            <h4 className="font-medium mb-2">Project Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Project URL:</span>
                                <a href="#" className="text-blue-500 hover:underline">
                                  https://example.com/project
                                </a>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Repository:</span>
                                <a href="#" className="text-blue-500 hover:underline">
                                  github.com/example/repo
                                </a>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => setStep(10)}>
                            Start Working
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}

                  {step === 10 && (
                    <div className="h-full flex flex-col">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Live Coding Session</h2>
                        <p className="text-muted-foreground">Fixing authentication bug</p>
                      </div>

                      <LiveCodingEnvironment role="editor" />
                    </div>
                  )}

                  {step === 11 && (
                    <div className="h-full">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Submit Solution</h2>
                        <p className="text-muted-foreground">Complete the task and submit your solution</p>
                      </div>

                      <Card className="mb-6">
                        <CardContent className="pt-6">
                          <h3 className="font-semibold mb-4">Task Completion Form</h3>

                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">What changes did you make?</label>
                              <Textarea
                                className="mt-1 min-h-[100px]"
                                value="I found that the login form wasn't properly handling the authentication token. I've fixed the issue by updating the token validation logic and adding proper error handling. All tests are now passing."
                                readOnly
                              />
                            </div>

                            <div>
                              <label className="text-sm font-medium">Files changed</label>
                              <div className="mt-1 border rounded-md p-2 text-sm">
                                <div className="flex items-center justify-between py-1">
                                  <span>auth.js</span>
                                  <Badge variant="outline">Modified</Badge>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                  <span>login-form.jsx</span>
                                  <Badge variant="outline">Modified</Badge>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                  <span>auth.test.js</span>
                                  <Badge variant="outline">Modified</Badge>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <input type="checkbox" id="tested" className="mr-2" checked readOnly />
                              <label htmlFor="tested" className="text-sm">
                                I've tested my changes and they work as expected
                              </label>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" onClick={() => setStep(12)}>
                            Submit Solution
                            <Send className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}

                  {step === 12 && (
                    <div className="h-full">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold">Payment Received</h2>
                        <p className="text-muted-foreground">Task completed successfully</p>
                      </div>

                      <Card className="mb-6 border-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-center mb-4">
                            <div className="rounded-full bg-green-100 p-3">
                              <CheckCircle2 className="h-8 w-8 text-green-500" />
                            </div>
                          </div>
                          <h3 className="text-center text-xl font-semibold mb-2">Payment Received!</h3>
                          <p className="text-center text-muted-foreground mb-4">
                            You've been paid ${taskDetails.price} for completing this task.
                          </p>

                          <div className="border rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Task Payment</span>
                              <span className="font-semibold">${taskDetails.price}.00</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-muted-foreground">Platform Fee (5%)</span>
                              <span className="text-sm text-muted-foreground">
                                -${(taskDetails.price * 0.05).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="font-medium">Net Earnings</span>
                              <span className="font-semibold">${(taskDetails.price * 0.95).toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                            <div>
                              <span className="text-sm font-medium">New Balance</span>
                              <div className="text-2xl font-bold">${(230 + taskDetails.price * 0.95).toFixed(2)}</div>
                            </div>
                            <Button variant="outline" size="sm">
                              Withdraw
                            </Button>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" onClick={() => setStep(2)}>
                            Back to Task Board
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
