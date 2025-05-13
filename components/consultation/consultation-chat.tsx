"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  Clock,
  Calendar,
  Lightbulb,
  Code,
  Zap,
  MessageSquare,
  CheckCircle2,
  Info,
  HelpCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ConsultationChatProps {
  consultationData: {
    id: string
    projectTitle: string
    projectDescription: string
    platform: string
  }
  userId: string
  onEndConsultation: () => void
}

export function ConsultationChat({ consultationData, userId, onEndConsultation }: ConsultationChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Initialize chat with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: `welcome-${Date.now()}`,
      role: "assistant" as const,
      content: `👋 Hi there! I'm your VibeAlong Expert. How can I help you with your ${consultationData.platform} project titled '${consultationData.projectTitle}'?`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }, [consultationData])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat loads
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, consultationData)
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyMessageToClipboard = (message: Message) => {
    navigator.clipboard.writeText(message.content)
    setCopiedMessageId(message.id)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const downloadTranscript = () => {
    const transcript = messages
      .map(
        (msg) =>
          `[${msg.timestamp.toLocaleString()}] ${msg.role === "user" ? "You" : "VibeAlong Expert"}: ${msg.content}`,
      )
      .join("\n\n")

    const element = document.createElement("a")
    const file = new Blob([transcript], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `consultation-${consultationData.projectTitle.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const platformIcons: Record<string, React.ReactNode> = {
    v0: <Code className="h-4 w-4" />,
    Lovable: <Zap className="h-4 w-4" />,
    Bolt: <Lightbulb className="h-4 w-4" />,
    Replit: <Code className="h-4 w-4" />,
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 flex flex-col">
        <Card className="flex-1 flex flex-col h-[calc(100vh-200px)]">
          <CardHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src="/vibealong-expert.png" alt="VibeAlong Expert" />
                <AvatarFallback className="bg-primary text-primary-foreground">VE</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <CardTitle className="text-base">VibeAlong Expert</CardTitle>
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </div>
                <CardDescription className="text-xs">{isLoading ? "Typing..." : "Online"}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={downloadTranscript}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download transcript</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={cn(
                          "group relative flex items-start gap-3 rounded-lg p-4",
                          message.role === "user"
                            ? "ml-auto max-w-[80%] bg-primary text-white"
                            : "mr-auto max-w-[80%] bg-muted",
                        )}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8 shrink-0 border-2 border-primary/20">
                            <AvatarImage src="/vibealong-expert.png" alt="VibeAlong Expert" />
                            <AvatarFallback className="bg-primary text-primary-foreground">VE</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <div className="prose prose-sm dark:prose-invert">
                            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyMessageToClipboard(message)}
                                >
                                  {copiedMessageId === message.id ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 shrink-0 border-2 border-primary">
                            <AvatarImage src="/user-profile.png" alt="You" />
                            <AvatarFallback className="bg-primary-foreground text-primary">You</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 rounded-lg p-4 mr-auto max-w-[80%] bg-muted"
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src="/vibealong-expert.png" alt="VibeAlong Expert" />
                      <AvatarFallback className="bg-primary text-primary-foreground">VE</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full gap-2">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[60px] flex-1 resize-none"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} className="h-auto">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-2 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="font-medium">{consultationData.projectTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Platform</p>
                  <Badge variant="outline" className="mt-1 flex w-fit items-center gap-1">
                    {platformIcons[consultationData.platform]}
                    {consultationData.platform}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm mt-1">{consultationData.projectDescription}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Consultation Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    Started {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{messages.length} messages</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="suggestions" className="mt-2 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm h-auto py-2 px-3"
                  onClick={() => {
                    setInputValue("What are the best practices for this type of project?")
                    inputRef.current?.focus()
                  }}
                >
                  What are the best practices for this type of project?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm h-auto py-2 px-3"
                  onClick={() => {
                    setInputValue(`What's a realistic timeline for my ${consultationData.platform} project?`)
                    inputRef.current?.focus()
                  }}
                >
                  What's a realistic timeline for my {consultationData.platform} project?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm h-auto py-2 px-3"
                  onClick={() => {
                    setInputValue("What are the potential challenges I might face?")
                    inputRef.current?.focus()
                  }}
                >
                  What are the potential challenges I might face?
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm h-auto py-2 px-3"
                  onClick={() => {
                    setInputValue("Can you recommend any tools or libraries for this project?")
                    inputRef.current?.focus()
                  }}
                >
                  Can you recommend any tools or libraries for this project?
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    <p className="font-medium text-sm">{consultationData.platform} Documentation</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Official documentation and guides for {consultationData.platform}
                  </p>
                  <Button variant="link" className="h-auto p-0 text-xs mt-1">
                    View Resource
                  </Button>
                </div>
                <div className="rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    <p className="font-medium text-sm">Community Forums</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect with other developers using {consultationData.platform}
                  </p>
                  <Button variant="link" className="h-auto p-0 text-xs mt-1">
                    View Resource
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button variant="outline" className="w-full" onClick={onEndConsultation}>
          End Consultation
        </Button>
      </div>
    </div>
  )
}

// Helper function to generate AI responses based on user input and project context
function generateAIResponse(userMessage: string, consultationData: any): string {
  const { projectTitle, platform } = consultationData
  const lowerCaseMessage = userMessage.toLowerCase()

  // Check for common questions and provide contextual responses
  if (lowerCaseMessage.includes("feature") || lowerCaseMessage.includes("functionality")) {
    return `Based on your ${platform} project "${projectTitle}", I recommend focusing on these key features:\n\n1. User authentication and profile management\n2. Real-time data synchronization\n3. Responsive UI that works across devices\n4. Analytics to track user engagement\n\nWould you like me to elaborate on any of these features specifically?`
  }

  if (lowerCaseMessage.includes("cost") || lowerCaseMessage.includes("price") || lowerCaseMessage.includes("budget")) {
    return `For a ${platform} project like "${projectTitle}", costs typically depend on complexity and timeline. A project of this nature usually ranges from $5,000-15,000 for MVP development.\n\nThis includes:\n- Design and development\n- Testing and deployment\n- Basic maintenance\n\nWould you like a more detailed breakdown based on your specific requirements?`
  }

  if (
    lowerCaseMessage.includes("timeline") ||
    lowerCaseMessage.includes("how long") ||
    lowerCaseMessage.includes("deadline")
  ) {
    return `For your ${platform} project "${projectTitle}", a typical timeline would be:\n\n- Planning & Design: 2-3 weeks\n- Development: 4-8 weeks\n- Testing & Refinement: 2 weeks\n- Deployment: 1 week\n\nTotal: 9-14 weeks from start to finish. This can be adjusted based on your specific requirements and priorities.`
  }

  if (lowerCaseMessage.includes("help") || lowerCaseMessage.includes("assistance")) {
    return `I'd be happy to help with your ${platform} project "${projectTitle}"! I can provide guidance on:\n\n- Technical architecture\n- Feature prioritization\n- Development best practices\n- Integration options\n- Performance optimization\n\nWhat specific aspect of your project would you like assistance with?`
  }

  if (lowerCaseMessage.includes("best practice") || lowerCaseMessage.includes("recommend")) {
    return `For ${platform} projects like "${projectTitle}", here are some best practices I recommend:\n\n1. **Component Architecture**: Use a modular approach with reusable components\n\n2. **State Management**: Implement a clean state management pattern appropriate for your app size\n\n3. **Testing Strategy**: Set up unit and integration tests early\n\n4. **Performance Optimization**: Implement code splitting and lazy loading\n\n5. **Documentation**: Maintain clear documentation for APIs and components\n\nWould you like me to elaborate on any of these areas?`
  }

  // Default response if no specific topic is detected
  return `Thanks for sharing that information about your ${platform} project "${projectTitle}". To provide you with the most helpful guidance, could you tell me more about your specific goals or challenges you're facing with this project?`
}
