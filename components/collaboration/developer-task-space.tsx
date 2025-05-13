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
import { toast } from "@/components/ui/use-toast"

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

interface DeveloperTaskSpaceProps {
  task: any
  userId: string
  className?: string
  githubIntegration?: React.ReactNode
}

export function DeveloperTaskSpace({ task, userId, className = "", githubIntegration }: DeveloperTaskSpaceProps) {
  const [showSidebar, setShowSidebar] = useState(true)
  const [collaborationSteps, setCollaborationSteps] = useState<Array<{ id: string; text: string; completed: boolean }>>(
    [],
  )
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
    collaborationSetup: true,
    taskSteps: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  useEffect(() => {
    const platform = task.project?.platform || "Other"
    const defaultSteps = getDefaultCollaborationSteps(platform)
    setCollaborationSteps(defaultSteps)

    // Check if this is the first visit to this task
    const setupKey = `task-setup-${task.id}-${userId}`
    const hasSetup = localStorage.getItem(setupKey)

    if (hasSetup) {
      // Load saved setup data
      try {
        const savedSetup = JSON.parse(localStorage.getItem(setupKey) || "{}")
        if (savedSetup.collaborationSteps) setCollaborationSteps(savedSetup.collaborationSteps)
      } catch (e) {
        console.error("Error loading saved setup:", e)
        // Fall back to default steps
        setCollaborationSteps(defaultSteps)
      }
    }
  }, [task.id, userId, task.project?.platform])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getDefaultCollaborationSteps = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "v0":
        return [
          { id: "1", text: "Add me as a collaborator in the V0 workspace", completed: false },
          { id: "2", text: "Share database credentials if needed", completed: false },
          { id: "3", text: "Provide access to design assets", completed: false },
        ]
      case "replit":
        return [
          { id: "1", text: "Invite me to your Replit workspace", completed: false },
          { id: "2", text: "Set appropriate permissions for editing", completed: false },
          { id: "3", text: "Share any external API keys needed", completed: false },
        ]
      case "lovable":
        return [
          { id: "1", text: "Add me to your Lovable project", completed: false },
          { id: "2", text: "Assign me to relevant components", completed: false },
          { id: "3", text: "Share access to design specifications", completed: false },
        ]
      default:
        return [
          { id: "1", text: "Add me to your development environment", completed: false },
          { id: "2", text: "Share necessary credentials", completed: false },
          { id: "3", text: "Provide access to required resources", completed: false },
        ]
    }
  }

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

  const toggleStepCompletion = (id: string) => {
    setCollaborationSteps((prevSteps) => {
      const updatedSteps = prevSteps.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))

      // Save updated steps
      const setupKey = `task-setup-${task.id}-${userId}`
      try {
        const savedSetup = JSON.parse(localStorage.getItem(setupKey) || "{}")
        localStorage.setItem(
          setupKey,
          JSON.stringify({
            ...savedSetup,
            collaborationSteps: updatedSteps,
          }),
        )
      } catch (e) {
        console.error("Error saving to localStorage:", e)
      }

      return updatedSteps
    })

    // Notify the Vibe Coder of step completion
    toast({
      title: "Step updated",
      description: "The Vibe Coder has been notified of your progress.",
    })
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: {
        id: userId,
        name: "Sarah Rodriguez", // This would be the actual user's name
        role: "developer",
        avatar: "/abstract-geometric-sr.png",
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
          name: "Sarah Rodriguez", // This would be the actual user's name
          role: "developer",
          avatar: "/abstract-geometric-sr.png",
        },
        content: `Shared a file: ${file.name}`,
        timestamp: new Date(),
        attachments: [{ name: file.name, type: file.type }],
      }

      setMessages([...messages, newMessage])
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
      {/* Sticky Header - Minimal */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/developer/tasks" className="flex items-center">
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
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6 pb-4">
              {/* Task Summary Card - Only visible at the top of chat */}
              <Card className="border border-gray-200 dark:border-gray-800 mb-6">
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
              animate={{ width: "320px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-y-auto"
            >
              <div className="p-4 space-y-6">
                {/* Task Details */}
                <div className="border rounded-md overflow-hidden">
                  <div
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                    onClick={() => toggleSection("details")}
                  >
                    <h3 className="text-sm font-medium flex items-center">Task Details</h3>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openSections.details ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  {openSections.details && (
                    <div className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Status</span>
                          <Badge
                            variant="outline"
                            className={
                              task.status === "In Progress"
                                ? "bg-yellow-500 text-white"
                                : task.status === "Completed"
                                  ? "bg-green-500 text-white"
                                  : task.status === "Review"
                                    ? "bg-purple-500 text-white"
                                    : undefined
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Due Date</span>
                          <span className="text-xs font-medium">{formatDate(task.due_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Estimated Hours</span>
                          <span className="text-xs font-medium">{task.estimated_hours || 0} hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Priority</span>
                          <Badge
                            variant="outline"
                            className={
                              task.priority === "High"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : task.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : "bg-green-100 text-green-800 border-green-200"
                            }
                          >
                            {task.priority || "Low"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="border rounded-md overflow-hidden">
                  <div
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                    onClick={() => toggleSection("project")}
                  >
                    <h3 className="text-sm font-medium flex items-center">Project Information</h3>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openSections.project ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  {openSections.project && (
                    <div className="p-3">
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-muted-foreground block">Project Name</span>
                          <span className="text-sm font-medium">{task.project?.name || "Untitled Project"}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Platform</span>
                          <span className="text-sm font-medium">{task.project?.platform || "Not specified"}</span>
                        </div>
                        {task.project?.description && (
                          <div>
                            <span className="text-xs text-muted-foreground block">Description</span>
                            <span className="text-sm">{task.project.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Vibe Coder Info */}
                <div className="border rounded-md overflow-hidden">
                  <div
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                    onClick={() => toggleSection("vibeCoder")}
                  >
                    <h3 className="text-sm font-medium flex items-center">Vibe Coder</h3>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openSections.vibeCoder ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  {openSections.vibeCoder && (
                    <div className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={task.vibe_coder?.avatar_url || "/abstract-aj.png"} alt="Vibe Coder" />
                          <AvatarFallback>{getInitials(task.vibe_coder?.full_name || "Vibe Coder")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{task.vibe_coder?.full_name || "Vibe Coder"}</p>
                          <p className="text-xs text-muted-foreground">{task.vibe_coder?.email || ""}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attachments */}
                <div className="border rounded-md overflow-hidden">
                  <div
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                    onClick={() => toggleSection("attachments")}
                  >
                    <h3 className="text-sm font-medium flex items-center">Attachments</h3>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openSections.attachments ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {openSections.attachments && (
                    <div className="p-3">
                      {task.attachments && task.attachments.length > 0 ? (
                        <div className="space-y-2">
                          {task.attachments.map((attachment: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded">
                                  {attachment.type?.includes("image") ? (
                                    <ImageIcon className="h-3.5 w-3.5 text-gray-500" />
                                  ) : (
                                    <FileIcon className="h-3.5 w-3.5 text-gray-500" />
                                  )}
                                </div>
                                <span className="text-xs">{attachment.name}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{attachment.size}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No attachments</p>
                      )}
                    </div>
                  )}
                  {githubIntegration}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
