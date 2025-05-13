"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Paperclip, Send, FileIcon, ImageIcon, Pin } from "lucide-react"

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

interface CollaborationChatProps {
  taskId: string
  userId: string
  userRole: string
}

export function CollaborationChat({ taskId, userId, userRole }: CollaborationChatProps) {
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll to bottom of messages when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: {
        id: userId,
        name: userRole === "vibe_coder" ? "Alex Johnson" : "Sarah Rodriguez",
        role: userRole,
        avatar: userRole === "vibe_coder" ? "/abstract-aj.png" : "/abstract-geometric-sr.png",
      },
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputValue("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
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

  const togglePinMessage = (id: string) => {
    setMessages(messages.map((message) => (message.id === id ? { ...message, isPinned: !message.isPinned } : message)))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        sender: {
          id: userId,
          name: userRole === "vibe_coder" ? "Alex Johnson" : "Sarah Rodriguez",
          role: userRole,
          avatar: userRole === "vibe_coder" ? "/abstract-aj.png" : "/abstract-geometric-sr.png",
        },
        content: `Shared a file: ${file.name}`,
        timestamp: new Date(),
        attachments: [{ name: file.name, type: file.type }],
      }

      setMessages([...messages, newMessage])
    }
  }

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message, index) => {
            // Check if we need to show a date separator
            const showDateHeader =
              index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

            return (
              <div key={message.id}>
                {showDateHeader && (
                  <div className="flex justify-center my-4">
                    <Badge variant="outline" className="bg-background">
                      {formatDate(message.timestamp)}
                    </Badge>
                  </div>
                )}

                <div
                  className={`flex gap-3 ${message.isPinned ? "bg-yellow-50 p-3 rounded-md border border-yellow-200" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{message.sender.name}</span>
                      <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                        {message.sender.role === "vibe_coder" ? "Vibe-Coder" : "Developer"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto opacity-0 group-hover:opacity-100"
                        onClick={() => togglePinMessage(message.id)}
                      >
                        <Pin className={`h-3 w-3 ${message.isPinned ? "fill-yellow-500 text-yellow-500" : ""}`} />
                      </Button>
                    </div>
                    <div className="text-sm mt-1 whitespace-pre-wrap">{message.content}</div>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
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
          <div ref={messagesEndRef} />

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-75" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-150" />
              </div>
              <span>Someone is typing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
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
            className="flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={inputValue.trim() === ""}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
