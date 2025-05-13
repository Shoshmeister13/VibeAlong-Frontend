"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, MessageSquare, Paperclip, Smile, Send, Code, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ImageIcon } from "lucide-react"

// Mock data for developers
const developers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Frontend Developer",
    avatar: "/abstract-aj.png",
    online: true,
    lastSeen: new Date(),
    unread: 3,
  },
  {
    id: 2,
    name: "Sam Wilson",
    role: "Backend Developer",
    avatar: "/abstract-geometric-sr.png",
    online: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: 0,
  },
  {
    id: 3,
    name: "Jamie Smith",
    role: "Full Stack Developer",
    avatar: "/stylized-initials.png",
    online: true,
    lastSeen: new Date(),
    unread: 0,
  },
  {
    id: 4,
    name: "Taylor Reed",
    role: "UI/UX Designer",
    avatar: "/placeholder.svg",
    online: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: 5,
  },
]

// Mock messages
const initialMessages = [
  {
    id: 1,
    senderId: 1,
    text: "Hi there! I've started working on the authentication flow for your project.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
  {
    id: 2,
    senderId: "me",
    text: "That's great! How's the progress so far?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), // 1.5 hours ago
    read: true,
  },
  {
    id: 3,
    senderId: 1,
    text: "I've completed the login and registration forms. Working on the password reset functionality now.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
  },
  {
    id: 4,
    senderId: 1,
    text: "Here's a screenshot of the login form:",
    timestamp: new Date(Date.now() - 1000 * 60 * 59), // 59 minutes ago
    read: true,
    attachment: {
      type: "image",
      url: "/placeholder.svg?height=300&width=400",
      name: "login-form-screenshot.png",
    },
  },
  {
    id: 5,
    senderId: "me",
    text: "Looks good! Can you make the login button a bit more prominent?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: true,
  },
  {
    id: 6,
    senderId: 1,
    text: "Sure, I'll increase the button size and add a subtle shadow. I'll also improve the form validation feedback.",
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    read: false,
  },
  {
    id: 7,
    senderId: 1,
    text: "I've also prepared some code for the authentication API integration:",
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    read: false,
    attachment: {
      type: "code",
      content: `async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
}`,
      language: "javascript",
    },
  },
  {
    id: 8,
    senderId: 1,
    text: "Let me know if you have any questions about the implementation!",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
  },
]

export default function MessagesPage() {
  const [selectedDeveloper, setSelectedDeveloper] = useState(developers[0])
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const filteredDevelopers = developers.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Simulate developer typing
  useEffect(() => {
    if (selectedDeveloper && selectedDeveloper.id === 1) {
      const timer = setTimeout(() => {
        setIsTyping(true)

        // After 3 seconds, send a new message
        const typingTimer = setTimeout(() => {
          setIsTyping(false)
          const newMessage = {
            id: messages.length + 1,
            senderId: 1,
            text: "I've updated the login button design. Check it out!",
            timestamp: new Date(),
            read: false,
            attachment: {
              type: "image",
              url: "/placeholder.svg?height=300&width=400&text=Updated+Login+Button",
              name: "updated-login-button.png",
            },
          }
          setMessages([...messages, newMessage])
        }, 3000)

        return () => clearTimeout(typingTimer)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [selectedDeveloper, messages])

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        senderId: "me",
        text: messageText,
        timestamp: new Date(),
        read: true,
      }
      setMessages([...messages, newMessage])
      setMessageText("")

      // Simulate response after a delay
      if (selectedDeveloper && selectedDeveloper.id === 1) {
        setTimeout(() => {
          setIsTyping(true)

          setTimeout(() => {
            setIsTyping(false)
            const responseMessage = {
              id: messages.length + 2,
              senderId: selectedDeveloper.id,
              text: "Thanks for your message! I'll look into this right away.",
              timestamp: new Date(),
              read: false,
            }
            setMessages((prev) => [...prev, responseMessage])
          }, 3000)
        }, 1500)
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageDate = (date: Date) => {
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

  // Group messages by date
  const groupedMessages = messages.reduce((groups: any, message) => {
    const date = formatMessageDate(message.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="grid h-full md:grid-cols-[300px_1fr]">
          {/* Developers List */}
          <div className="border-r">
            <CardHeader className="px-4 py-3">
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="px-4 py-2">
                {filteredDevelopers.map((developer) => (
                  <div key={developer.id}>
                    <button
                      className={`w-full flex items-start gap-3 p-2 rounded-md hover:bg-muted transition-colors ${
                        selectedDeveloper?.id === developer.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedDeveloper(developer)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={developer.avatar || "/placeholder.svg"} alt={developer.name} />
                          <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {developer.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{developer.name}</span>
                          {developer.unread > 0 && (
                            <Badge variant="destructive" className="ml-2">
                              {developer.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{developer.role}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {developer.online ? "Online" : `Last seen ${formatTime(developer.lastSeen)}`}
                        </p>
                      </div>
                    </button>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex flex-col h-full overflow-hidden">
            {selectedDeveloper ? (
              <>
                <CardHeader className="px-6 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={selectedDeveloper.avatar || "/placeholder.svg"}
                          alt={selectedDeveloper.name}
                        />
                        <AvatarFallback>{selectedDeveloper.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{selectedDeveloper.name}</CardTitle>
                        <CardDescription className="text-xs flex items-center gap-1">
                          {selectedDeveloper.online ? (
                            <>
                              <span className="h-2 w-2 rounded-full bg-green-500"></span>
                              Online
                            </>
                          ) : (
                            <>Last seen {formatTime(selectedDeveloper.lastSeen)}</>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <div className="flex-1 overflow-hidden" ref={scrollAreaRef}>
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {/* Messages grouped by date */}
                      {Object.entries(groupedMessages).map(([date, msgs]: [string, any]) => (
                        <div key={date} className="space-y-4">
                          {/* Date separator */}
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t"></span>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="bg-background px-2 text-muted-foreground">{date}</span>
                            </div>
                          </div>

                          {/* Messages for this date */}
                          {msgs.map((message: any) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.senderId === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>

                                {/* Attachment handling */}
                                {message.attachment && (
                                  <div className="mt-2">
                                    {message.attachment.type === "image" && (
                                      <div className="rounded-md overflow-hidden border">
                                        <img
                                          src={message.attachment.url || "/placeholder.svg"}
                                          alt="Attachment"
                                          className="w-full h-auto"
                                        />
                                      </div>
                                    )}

                                    {message.attachment.type === "code" && (
                                      <div className="mt-2 rounded-md bg-zinc-950 p-3 text-zinc-50 text-xs font-mono overflow-x-auto">
                                        <pre>{message.attachment.content}</pre>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div
                                  className={`text-xs mt-1 ${
                                    message.senderId === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                                  }`}
                                >
                                  {formatTime(message.timestamp)}
                                  {message.senderId === "me" && (
                                    <span className="ml-1">{message.read ? "✓✓" : "✓"}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex space-x-1">
                              <div
                                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Invisible element to scroll to */}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                <CardFooter className="p-4 border-t mt-auto">
                  <div className="flex items-center w-full gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Image
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Document
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Code className="h-4 w-4 mr-2" />
                          Code Snippet
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} className="shrink-0">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </CardFooter>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No conversation selected</h3>
                  <p className="text-muted-foreground">Choose a developer to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
