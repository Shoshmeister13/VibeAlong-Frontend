"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Code, Eye, Download, Save } from "lucide-react"
import { AIChatAssistant } from "@/components/ai/ai-chat-assistant"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar: string
    role: "vibe-coder" | "developer"
  }
  content: string
  timestamp: string
}

export function CollaborationSpace({ taskId }: { taskId: string }) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      sender: {
        id: "dev1",
        name: "John Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "developer",
      },
      content: "Hi there! I'm looking at your code now. I think I see the issue with the authentication flow.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "2",
      sender: {
        id: "client1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "vibe-coder",
      },
      content:
        "Great! I've been stuck on this for hours. The login form seems to submit correctly but the authentication token isn't being stored properly.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
    {
      id: "3",
      sender: {
        id: "dev1",
        name: "John Developer",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "developer",
      },
      content:
        "I see the problem. You're not handling the response correctly in the login function. Let me fix that for you.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    },
  ])

  const [newMessage, setNewMessage] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: {
        id: "client1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "vibe-coder",
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
      <div className="bg-muted p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Fix authentication bug in login form</h2>
          <p className="text-sm text-muted-foreground">Collaboration session with John Developer</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Code
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="code" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-2 justify-start">
              <TabsTrigger value="code">
                <Code className="h-4 w-4 mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 p-4 overflow-auto">
              <div className="rounded-md border bg-muted">
                <div className="flex items-center justify-between border-b bg-background p-2">
                  <span className="text-sm font-medium">login.js</span>
                </div>
                <pre className="p-4 text-sm overflow-auto">
                  <code>{`// Authentication logic
async function login(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    // Here's the issue - not properly handling the response
    // const data = await response.json();
    // localStorage.setItem('token', data.token);
    
    // Fixed version:
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      return { success: true };
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
}`}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input type="email" className="w-full p-2 border rounded-md" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input type="password" className="w-full p-2 border rounded-md" placeholder="••••••••" />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Sign In</button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai-assistant" className="h-full">
              <AIChatAssistant />
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-80 border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium">Chat</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{message.sender.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[80px] resize-none"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
