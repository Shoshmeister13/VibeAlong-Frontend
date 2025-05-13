"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MessageSquare,
  FileIcon,
  Calendar,
  Clock,
  BarChart,
  PanelRight,
  PanelLeft,
  Paperclip,
  Send,
  ImageIcon,
  RefreshCw,
  FileText,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { AITaskSteps } from "@/components/collaboration/ai-task-steps"
import { PlatformSetupInstructions } from "@/components/collaboration/platform-setup-instructions"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedTaskSpaceProps {
  task: any
  userId: string
  userRole: string
}

export function EnhancedTaskSpace({ task, userId, userRole }: EnhancedTaskSpaceProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [messages, setMessages] = useState<any[]>([])
  const [updates, setUpdates] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [updateContent, setUpdateContent] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [uploadDescription, setUploadDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      // Simulate API delay for a more realistic experience
      await new Promise((resolve) => setTimeout(resolve, 800))

      try {
        // Mock messages data
        const mockMessages = [
          {
            id: "msg-1",
            task_id: task.id,
            sender_id: task.vibe_coder_id,
            content:
              "Hi there! I've created this task for implementing the dashboard UI. Let me know if you have any questions about the requirements.",
            attachments: [],
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            sender: task.vibe_coder,
          },
          {
            id: "msg-2",
            task_id: task.id,
            sender_id: task.developer_id,
            content:
              "Thanks for the details. I've looked through the requirements and I'll start working on it today. I might need some clarification on the chart components later.",
            attachments: [],
            created_at: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
            sender: task.developer,
          },
          {
            id: "msg-3",
            task_id: task.id,
            sender_id: task.vibe_coder_id,
            content: "Great! Here's a wireframe I created for the dashboard layout. Let me know what you think.",
            attachments: [
              {
                name: "dashboard-wireframe.png",
                type: "image/png",
                size: 1240000,
              },
            ],
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            sender: task.vibe_coder,
          },
          {
            id: "msg-4",
            task_id: task.id,
            sender_id: task.developer_id,
            content:
              "The wireframe looks good. I'll use it as a reference. I've set up the project structure and will start implementing the components now.",
            attachments: [],
            created_at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
            sender: task.developer,
          },
        ]

        setMessages(mockMessages)

        // Mock updates data
        const mockUpdates = [
          {
            id: "update-1",
            task_id: task.id,
            user_id: task.vibe_coder_id,
            content: "Started working on the initial wireframes. Will share designs tomorrow.",
            progress: 15,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            user: task.vibe_coder,
          },
          {
            id: "update-2",
            task_id: task.id,
            user_id: task.developer_id,
            content: "Set up the project repository and initial structure. Looking at the requirements now.",
            progress: 25,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            user: task.developer,
          },
          {
            id: "update-3",
            task_id: task.id,
            user_id: task.vibe_coder_id,
            content: "Completed the main dashboard design. Ready for implementation.",
            progress: 35,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            user: task.vibe_coder,
          },
        ]

        setUpdates(mockUpdates)

        // Mock files data
        const mockFiles = [
          {
            id: "file-1",
            task_id: task.id,
            uploader_id: task.vibe_coder_id,
            file_name: "dashboard-wireframe.png",
            file_type: "image/png",
            file_size: 1240000,
            file_url: "/placeholder.svg?height=800&width=1200",
            description: "Initial wireframe for the dashboard layout",
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            uploader: task.vibe_coder,
          },
          {
            id: "file-2",
            task_id: task.id,
            uploader_id: task.developer_id,
            file_name: "project-structure.pdf",
            file_type: "application/pdf",
            file_size: 450000,
            file_url: "#",
            description: "Project structure and architecture document",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            uploader: task.developer,
          },
          {
            id: "file-3",
            task_id: task.id,
            uploader_id: task.vibe_coder_id,
            file_name: "final-design.fig",
            file_type: "application/octet-stream",
            file_size: 3500000,
            file_url: "#",
            description: "Final design file with all components and screens",
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            uploader: task.vibe_coder,
          },
        ]

        setFiles(mockFiles)
      } catch (error) {
        console.error("Error in fetch data function:", error)
        // Provide fallback data even if there's an error
        setMessages([])
        setUpdates([])
        setFiles([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // No need for real-time subscriptions in UI/UX development mode
    // We'll simulate real-time updates with local state changes
  }, [task.id])

  useEffect(() => {
    // Scroll to bottom of messages when new messages arrive
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeTab])

  const handleSendMessage = async () => {
    if (inputValue.trim() === "" && attachments.length === 0) return

    setIsSending(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create attachment data from files
      const attachmentData = attachments.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }))

      // For demo, simulate message sent
      const mockMessage = {
        id: `msg-${Date.now()}`,
        task_id: task.id,
        sender_id: userId,
        content: inputValue,
        attachments: attachmentData,
        created_at: new Date().toISOString(),
        sender: userRole === "vibe_coder" ? task.vibe_coder : task.developer,
      }

      setMessages((current) => [...current, mockMessage])
      setInputValue("")
      setAttachments([])
    } catch (err) {
      console.error("Error in send message function:", err)
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmitUpdate = async () => {
    if (updateContent.trim() === "") return

    setIsSubmittingUpdate(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Calculate new progress based on existing updates
      let newProgress = task.progress || 0
      if (updates.length > 0) {
        // Increment progress by 5-10% from the last update
        const lastProgress = updates[0].progress || 0
        newProgress = Math.min(100, lastProgress + Math.floor(Math.random() * 6) + 5)
      } else {
        // First update, set progress between 10-20%
        newProgress = Math.floor(Math.random() * 11) + 10
      }

      // For demo, simulate update submitted
      const mockUpdate = {
        id: `update-${Date.now()}`,
        task_id: task.id,
        user_id: userId,
        content: updateContent,
        progress: newProgress,
        created_at: new Date().toISOString(),
        user: userRole === "vibe_coder" ? task.vibe_coder : task.developer,
      }

      setUpdates((current) => [mockUpdate, ...current])
      setUpdateContent("")
    } catch (err) {
      console.error("Error in submit update function:", err)
    } finally {
      setIsSubmittingUpdate(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...filesArray])
    }
  }

  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setUploadFiles(filesArray)
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleRemoveUploadFile = (index: number) => {
    setUploadFiles(uploadFiles.filter((_, i) => i !== index))
  }

  const triggerFileInput = (type: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type
      fileInputRef.current.click()
    }
  }

  const triggerUploadInput = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click()
    }
  }

  const handleUploadFiles = async () => {
    if (uploadFiles.length === 0) return

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo, simulate file uploaded
      for (const file of uploadFiles) {
        const mockFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          task_id: task.id,
          uploader_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: file.type.startsWith("image/") ? "/placeholder.svg?height=800&width=1200" : "#",
          description: uploadDescription,
          created_at: new Date().toISOString(),
          uploader: userRole === "vibe_coder" ? task.vibe_coder : task.developer,
        }

        setFiles((current) => [mockFile, ...current])
      }

      setUploadFiles([])
      setUploadDescription("")
      setIsUploadDialogOpen(false)
    } catch (err) {
      console.error("Error in upload files function:", err)
    }
  }

  const getBackLink = () => {
    if (userRole === "developer") {
      return "/dashboard/developer/tasks"
    } else {
      return "/dashboard/tasks"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return "Unknown date"
    }
  }

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      return "Unknown time"
    }
  }

  const formatLastUpdated = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)

      if (diffMins < 1) {
        return "Just now"
      } else if (diffMins === 1) {
        return "1 minute ago"
      } else if (diffMins < 60) {
        return `${diffMins} minutes ago`
      } else {
        const hours = Math.floor(diffMins / 60)
        if (hours === 1) {
          return "1 hour ago"
        } else if (hours < 24) {
          return `${hours} hours ago`
        } else {
          const days = Math.floor(hours / 24)
          if (days === 1) {
            return "1 day ago"
          } else {
            return `${days} days ago`
          }
        }
      }
    } catch (e) {
      return "Unknown"
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-6 w-6 text-red-500" />
    } else {
      return <FileIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const isVibeCoderView = userRole === "vibe_coder"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={getBackLink()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {isVibeCoderView ? "Vibe-Coder" : "Developer"} Task Space
          </h1>
        </div>
        <Badge
          variant={task.status === "Open" ? "outline" : "default"}
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

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Due: {formatDate(task.due_date)}</span>
              <span className="text-xs">•</span>
              <Clock className="h-4 w-4" />
              <span>Est: {task.estimated_hours} hours</span>
            </div>
          </CardHeader>
        </Card>

        <div className="flex gap-6">
          <div className={`flex-1 transition-all ${showSidebar ? "md:w-2/3" : "w-full"}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="overview" className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="files" className="flex items-center gap-1">
                    <FileIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Files</span>
                  </TabsTrigger>
                  <TabsTrigger value="updates" className="flex items-center gap-1">
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Updates</span>
                  </TabsTrigger>
                </TabsList>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="hidden md:flex"
                >
                  {showSidebar ? (
                    <>
                      <PanelRight className="h-4 w-4 mr-1" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <PanelLeft className="h-4 w-4 mr-1" />
                      Show Details
                    </>
                  )}
                </Button>
              </div>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Task Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{task.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Completion</span>
                          <span className="text-sm font-medium">{updates[0]?.progress || task.progress || 0}%</span>
                        </div>
                        <Progress value={updates[0]?.progress || task.progress || 0} className="h-2" />
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            Last updated: {formatLastUpdated(updates[0]?.created_at || task.last_updated)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <AITaskSteps
                    taskTitle={task.title}
                    taskDescription={task.description}
                    taskId={task.id}
                    existingSteps={task.suggested_steps}
                    projectContext={task.project?.description}
                  />

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Platform Setup</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PlatformSetupInstructions
                        platform={task.project?.platform || "Other"}
                        isVibeCoder={userRole === "vibe_coder"}
                        taskId={task.id}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <Card className="h-[calc(100vh-300px)]">
                  <CardHeader className="border-b py-3">
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Task Discussion
                    </CardTitle>
                  </CardHeader>
                  <div className="flex flex-col h-[calc(100%-60px)]">
                    <ScrollArea className="flex-1 p-4">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                            <p className="text-sm text-muted-foreground">Loading messages...</p>
                          </div>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-20" />
                            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div key={message.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={
                                    message.sender?.avatar_url ||
                                    `https://avatar.vercel.sh/${message.sender?.id || "user"}?size=32`
                                  }
                                  alt={message.sender?.full_name}
                                />
                                <AvatarFallback>{message.sender?.full_name?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{message.sender?.full_name}</span>
                                  <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                                    {message.sender?.role === "vibe_coder" ? "Vibe-Coder" : "Developer"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(message.created_at)}
                                  </span>
                                </div>
                                <div className="text-sm mt-1 whitespace-pre-wrap">{message.content}</div>
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {message.attachments.map((attachment: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                                      >
                                        <FileIcon className="h-3 w-3" />
                                        <span className="max-w-[120px] truncate">{attachment.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>

                    <div className="border-t p-4">
                      {attachments.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                              <FileIcon className="h-3 w-3" />
                              <span className="max-w-[120px] truncate">{file.name}</span>
                              <button
                                onClick={() => handleRemoveAttachment(index)}
                                className="ml-1 rounded-full hover:bg-background p-0.5"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleSendMessage()
                        }}
                        className="flex gap-2"
                      >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline" size="icon" className="flex-shrink-0">
                              <Paperclip className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => triggerFileInput("image/*")}>
                              <ImageIcon className="mr-2 h-4 w-4" />
                              <span>Image</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => triggerFileInput("*/*")}>
                              <FileIcon className="mr-2 h-4 w-4" />
                              <span>File</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Input
                          placeholder="Type a message..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="flex-1"
                          disabled={isSending}
                        />
                        <Button
                          type="submit"
                          disabled={isSending || (inputValue.trim() === "" && attachments.length === 0)}
                        >
                          {isSending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Shared Files</h3>
                  <Button onClick={() => setIsUploadDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading files...</p>
                    </div>
                  </div>
                ) : files.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center h-40 text-center">
                      <FileIcon className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                      <p className="text-muted-foreground mb-4">No files have been shared yet</p>
                      <Button onClick={() => setIsUploadDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload First File
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map((file) => (
                      <Card key={file.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex items-start">
                            <div className="p-4 flex items-center justify-center bg-muted h-full">
                              {getFileIcon(file.file_type)}
                            </div>
                            <div className="p-4 flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate max-w-[200px]">{file.file_name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {formatFileSize(file.file_size)}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 mb-2">{file.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage
                                      src={
                                        file.uploader?.avatar_url ||
                                        `https://avatar.vercel.sh/${file.uploader?.id || "user"}?size=32`
                                      }
                                      alt={file.uploader?.full_name}
                                    />
                                    <AvatarFallback>{file.uploader?.full_name?.charAt(0) || "U"}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs">{file.uploader?.full_name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{formatDate(file.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Submit Progress Update</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmitUpdate()
                      }}
                      className="space-y-4"
                    >
                      <Textarea
                        placeholder="Share your progress update, challenges, or next steps..."
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmittingUpdate || updateContent.trim() === ""}>
                          {isSubmittingUpdate ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Submit Update
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recent Updates</h3>

                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading updates...</p>
                      </div>
                    </div>
                  ) : updates.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center h-40 text-center">
                        <RefreshCw className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
                        <p className="text-muted-foreground">No updates have been posted yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {updates.map((update) => (
                        <Card key={update.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={update.user?.avatar_url || `https://avatar.vercel.sh/${update.user?.id}?size=32`}
                                  alt={update.user?.full_name}
                                />
                                <AvatarFallback>{update.user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{update.user?.full_name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {update.user?.role === "vibe_coder" ? "Vibe-Coder" : "Developer"}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">{formatDate(update.created_at)}</span>
                                </div>
                                <p className="text-sm mt-2 mb-3">{update.content}</p>
                                <div className="mt-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-muted-foreground">Progress</span>
                                    <span className="text-xs font-medium">{update.progress}%</span>
                                  </div>
                                  <Progress value={update.progress} className="h-1.5" />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <AnimatePresence>
            {showSidebar && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:block w-1/3 max-w-xs"
              >
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Task Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Team</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                task.vibe_coder?.avatar_url || `https://avatar.vercel.sh/${task.vibe_coder?.id}?size=32`
                              }
                              alt={task.vibe_coder?.full_name}
                            />
                            <AvatarFallback>{task.vibe_coder?.full_name?.charAt(0) || "V"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{task.vibe_coder?.full_name}</div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-xs mr-2">
                                Vibe-Coder
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                task.developer?.avatar_url || `https://avatar.vercel.sh/${task.developer?.id}?size=32`
                              }
                              alt={task.developer?.full_name}
                            />
                            <AvatarFallback>{task.developer?.full_name?.charAt(0) || "D"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{task.developer?.full_name}</div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-xs mr-2">
                                Developer
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Created</span>
                          <span className="text-sm">{formatDate(task.created_at)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Due Date</span>
                          <span className="text-sm">{formatDate(task.due_date)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Last Update</span>
                          <span className="text-sm">
                            {formatLastUpdated(updates[0]?.created_at || task.last_updated)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Activity Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Messages</span>
                          <span className="text-sm">{messages.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Files</span>
                          <span className="text-sm">{files.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Updates</span>
                          <span className="text-sm">{updates.length}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Project</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Name</span>
                          <span className="text-sm">{task.project?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Platform</span>
                          <span className="text-sm">{task.project?.platform || "Other"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* File Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogDescription>Share files related to this task with your collaborator.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 transition-colors hover:border-muted-foreground/50">
              <input type="file" ref={uploadInputRef} onChange={handleUploadFileChange} className="hidden" multiple />
              <div className="flex flex-col items-center justify-center text-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-1">Drag files here or click to upload</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload any file type up to 10MB</p>
                <Button type="button" onClick={triggerUploadInput}>
                  Select Files
                </Button>
              </div>
            </div>

            {uploadFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Files</h4>
                <div className="space-y-2">
                  {uploadFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : (
                          <FileIcon className="h-4 w-4" />
                        )}
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUploadFile(index)}
                        className="h-8 w-8 p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Add a description for these files..."
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadFiles} disabled={uploadFiles.length === 0}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
