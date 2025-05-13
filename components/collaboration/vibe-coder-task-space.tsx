"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Send,
  Paperclip,
  ChevronRight,
  FileIcon,
  ImageIcon,
  Info,
  Clock,
  CalendarDays,
  ListTodo,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Circle,
  DollarSign,
  Percent,
  Github,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { AITaskSteps } from "@/components/collaboration/ai-task-steps"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  content: string
  timestamp: Date
  attachments?: { name: string; type: string }[]
  isPinned?: boolean
}

interface VibeCoderTaskSpaceProps {
  task: any
  userId: string
  githubIntegration?: React.ReactNode
}

export function VibeCoderTaskSpace({ task, userId, githubIntegration }: VibeCoderTaskSpaceProps) {
  const [showSidebar, setShowSidebar] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: {
        id: "vibe-1",
        name: "Alex Johnson",
        role: "vibe_coder",
        avatar: "/abstract-aj.png",
      },
      content:
        "Hi there! I've set up the project and added you as a collaborator. Let me know if you have any questions about the requirements.",
      timestamp: new Date(Date.now() - 3600000 * 24),
      isPinned: true,
    },
    {
      id: "2",
      sender: {
        id: "dev-1",
        name: "Sarah Rodriguez",
        role: "developer",
        avatar: "/abstract-geometric-sr.png",
      },
      content:
        "Thanks for the access! I've looked through the requirements and I'll start working on it today. I might need some clarification on the API integration later.",
      timestamp: new Date(Date.now() - 3600000 * 12),
    },
    {
      id: "3",
      sender: {
        id: "vibe-1",
        name: "Alex Johnson",
        role: "vibe_coder",
        avatar: "/abstract-aj.png",
      },
      content: "Great! Here's a wireframe I created for the dashboard layout. Let me know what you think.",
      timestamp: new Date(Date.now() - 3600000 * 6),
      attachments: [{ name: "dashboard-wireframe.png", type: "image/png" }],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [openSections, setOpenSections] = useState({
    taskDetails: true,
    metrics: true,
    collaborationSteps: true,
    developerUpdates: true,
    taskSteps: true,
    github: true,
    githubAccess: true,
  })

  // Toggle section visibility
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return "Unknown date"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatChatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Platform-specific collaboration steps
  const getCollaborationSteps = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "v0":
        return [
          "Add developer's email to your V0 workspace",
          "Set appropriate permissions (Editor role)",
          "Share environment variables if needed",
          "Provide access to any necessary APIs",
        ]
      case "replit":
        return [
          "Invite developer to your Replit workspace",
          "Set up the project environment",
          "Share any necessary documentation",
          "Configure access permissions",
        ]
      case "lovable":
        return [
          "Add developer to your Lovable project",
          "Share design assets and specifications",
          "Provide access to the staging environment",
          "Set up communication channels",
        ]
      case "bolt":
        return [
          "Add developer to your Bolt workspace",
          "Share project tokens and credentials",
          "Configure developer access levels",
          "Set up version control access",
        ]
      default:
        return [
          "Add developer to your project workspace",
          "Share necessary credentials and tokens",
          "Provide documentation and requirements",
          "Set up communication channels",
        ]
    }
  }

  const collaborationSteps = getCollaborationSteps(task.project?.platform || "other")

  const toggleStepCompletion = (index: number) => {
    setCompletedSteps((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const completionPercentage = Math.round((completedSteps.length / collaborationSteps.length) * 100)

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: {
        id: userId,
        name: "Alex Johnson", // This would be the actual user's name
        role: "vibe_coder",
        avatar: "/abstract-aj.png",
      },
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputValue("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        sender: {
          id: userId,
          name: "Alex Johnson", // This would be the actual user's name
          role: "vibe_coder",
          avatar: "/abstract-aj.png",
        },
        content: `Shared a file: ${file.name}`,
        timestamp: new Date(),
        attachments: [{ name: file.name, type: file.type }],
      }

      setMessages([...messages, newMessage])
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header - Minimal */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/tasks" className="flex items-center">
              <img src="/vibealong-logo.png" alt="VibeAlong" className="h-8 w-auto mr-2" />
              <Button variant="ghost" size="sm" className="p-1">
                <ArrowLeft className="h-4 w-4" />
                <span className="ml-1 sr-only md:not-sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-lg font-semibold truncate max-w-[200px] md:max-w-md">{task.title}</h1>
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700"
            >
              {task.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowSidebar(!showSidebar)}
                  >
                    {showSidebar ? <ChevronRight className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showSidebar ? "Hide task details" : "Show task details"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Main Content - Chat-Focused Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area - Takes most of the space */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Task Summary Card */}
          <div className="p-4 pb-0">
            <Card className="border border-gray-200 dark:border-gray-800 mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ListTodo className="h-5 w-5 mr-2" />
                  Task Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    <Clock className="h-3 w-3" />
                    <span>{task.estimated_hours || 0} hours</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    <CalendarDays className="h-3 w-3" />
                    <span>Due: {formatDate(task.due_date || new Date())}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="text-xs font-medium">{task.progress || 0}%</span>
                  </div>
                  <Progress value={task.progress || 0} className="h-1" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-6 pb-4">
              {messages.map((message, index) => {
                // Check if we need to show a date separator
                const showDateHeader =
                  index === 0 || formatChatDate(message.timestamp) !== formatChatDate(messages[index - 1].timestamp)

                return (
                  <div key={message.id}>
                    {showDateHeader && (
                      <div className="flex justify-center my-4">
                        <Badge
                          variant="outline"
                          className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                        >
                          {formatChatDate(message.timestamp)}
                        </Badge>
                      </div>
                    )}

                    <div
                      className={`flex gap-3 ${
                        message.isPinned
                          ? "bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-800"
                          : ""
                      }`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {message.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{message.sender.name}</span>
                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0 h-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
                          >
                            {message.sender.role === "vibe_coder" ? "Vibe-Coder" : "Developer"}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm mt-1 whitespace-pre-wrap">{message.content}</div>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.attachments.map((attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs"
                              >
                                {attachment.type.startsWith("image/") ? (
                                  <ImageIcon className="h-3 w-3" />
                                ) : (
                                  <FileIcon className="h-3 w-3" />
                                )}
                                <span className="max-w-[120px] truncate">{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce delay-75" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce delay-150" />
                  </div>
                  <span>Someone is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-950">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-2"
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="flex-shrink-0 border-gray-300 dark:border-gray-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 border-gray-300 dark:border-gray-700 focus:ring-gray-400 dark:focus:ring-gray-600"
              />
              <Button
                type="submit"
                disabled={inputValue.trim() === ""}
                className="flex-shrink-0 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar - Collapsible */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "360px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto"
            >
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6">
                  {/* Metrics Section */}
                  <div className="border rounded-md overflow-hidden">
                    <div
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                      onClick={() => toggleSection("metrics")}
                    >
                      <h3 className="text-sm font-medium flex items-center">Task Metrics</h3>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {openSections.metrics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                    {openSections.metrics && (
                      <div className="p-3">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <Clock className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Hours Worked</p>
                              <p className="font-medium">{task.hours_worked || 0} hrs</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Current Cost</p>
                              <p className="font-medium">
                                $
                                {task.current_cost ||
                                  (task.hours_worked ? (task.hours_worked * task.hourly_rate).toFixed(2) : 0)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <Percent className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Budget Used</p>
                              <p className="font-medium">
                                {task.estimated_cost_usd
                                  ? `${Math.min(100, Math.round(((task.current_cost || 0) / task.estimated_cost_usd) * 100))}%`
                                  : "0%"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Collaboration Steps */}
                  <div className="border rounded-md overflow-hidden">
                    <div
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                      onClick={() => toggleSection("collaborationSteps")}
                    >
                      <h3 className="text-sm font-medium flex items-center">Collaboration Setup</h3>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {openSections.collaborationSteps ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {openSections.collaborationSteps && (
                      <div className="p-3">
                        <div className="space-y-2">
                          {task.project?.platform?.toLowerCase() === "v0" ? (
                            <>
                              <div
                                className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => toggleStepCompletion(0)}
                              >
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-600">
                                  {completedSteps.includes(0) ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </Button>
                                <span
                                  className={`text-sm ${
                                    completedSteps.includes(0) ? "line-through text-gray-400 dark:text-gray-500" : ""
                                  }`}
                                >
                                  1. Open your project in V0.
                                </span>
                              </div>
                              <div
                                className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => toggleStepCompletion(1)}
                              >
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-600">
                                  {completedSteps.includes(1) ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </Button>
                                <span
                                  className={`text-sm ${
                                    completedSteps.includes(1) ? "line-through text-gray-400 dark:text-gray-500" : ""
                                  }`}
                                >
                                  2. Click Invite Collaborators.
                                </span>
                              </div>
                              <div
                                className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => toggleStepCompletion(2)}
                              >
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-600">
                                  {completedSteps.includes(2) ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </Button>
                                <span
                                  className={`text-sm ${
                                    completedSteps.includes(2) ? "line-through text-gray-400 dark:text-gray-500" : ""
                                  }`}
                                >
                                  3. Enter your developer's email address.
                                </span>
                              </div>
                              <div
                                className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => toggleStepCompletion(3)}
                              >
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-600">
                                  {completedSteps.includes(3) ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </Button>
                                <span
                                  className={`text-sm ${
                                    completedSteps.includes(3) ? "line-through text-gray-400 dark:text-gray-500" : ""
                                  }`}
                                >
                                  4. Send the invite. They'll get an email invitation to join your project.
                                </span>
                              </div>
                            </>
                          ) : (
                            // Default steps for other platforms
                            collaborationSteps.map((step, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => toggleStepCompletion(index)}
                              >
                                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0 text-gray-600">
                                  {completedSteps.includes(index) ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                  ) : (
                                    <Circle className="h-5 w-5" />
                                  )}
                                </Button>
                                <span
                                  className={`text-sm ${
                                    completedSteps.includes(index)
                                      ? "line-through text-gray-400 dark:text-gray-500"
                                      : ""
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">Setup Progress</span>
                            <span className="text-sm font-medium">{completionPercentage}%</span>
                          </div>
                          <Progress value={completionPercentage} className="h-2" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Task Steps */}
                  <div className="border rounded-md overflow-hidden">
                    <div
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                      onClick={() => toggleSection("taskSteps")}
                    >
                      <h3 className="text-sm font-medium flex items-center">Task Steps</h3>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {openSections.taskSteps ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {openSections.taskSteps && (
                      <div className="p-3">
                        <AITaskSteps
                          taskTitle={task.title}
                          taskDescription={task.description}
                          taskId={task.id}
                          existingSteps={task.suggested_steps}
                          projectContext={task.project?.description}
                          userRole="vibe_coder"
                        />
                      </div>
                    )}
                  </div>

                  {/* GitHub Integration */}
                  {githubIntegration && (
                    <div className="border rounded-md overflow-hidden">
                      <div
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                        onClick={() => toggleSection("github")}
                      >
                        <h3 className="text-sm font-medium flex items-center">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub Integration
                        </h3>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          {openSections.github ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {openSections.github && <div className="p-3">{githubIntegration}</div>}
                    </div>
                  )}

                  {/* GitHub Access for Developer Section */}
                  <div className="border rounded-md overflow-hidden">
                    <div
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                      onClick={() => toggleSection("githubAccess")}
                    >
                      <h3 className="text-sm font-medium flex items-center">
                        <Lock className="h-4 w-4 mr-2" /> GitHub Access
                      </h3>
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {openSections.githubAccess ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {openSections.githubAccess && (
                      <div className="p-3">
                        <div className="space-y-4 bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            To let your developer work directly on your GitHub project, you need to invite them to your
                            connected repository.
                          </p>

                          <div>
                            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Developer GitHub Username
                            </h3>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700">
                              <Github className="h-3 w-3 text-gray-500" />
                              <span className="text-sm">{task.developer?.github_username || "samrivera92"}</span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Permission Level
                            </h3>
                            <Select defaultValue="collaborator">
                              <SelectTrigger className="w-full text-xs h-8">
                                <SelectValue placeholder="Select permission" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="collaborator">Add as collaborator (recommended)</SelectItem>
                                <SelectItem value="readonly">Read-only access</SelectItem>
                                <SelectItem value="manual">I'll manage manually</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => {
                              const repoUrl = task.project?.github_repository || "vibecoder/dashflow-ui"
                              window.open(`https://github.com/${repoUrl}/settings/access`, "_blank")
                            }}
                          >
                            Invite to GitHub Repo
                          </Button>

                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            VibeAlong never changes your GitHub repo. You have full control over permissions.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default VibeCoderTaskSpace
