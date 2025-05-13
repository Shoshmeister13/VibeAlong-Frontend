"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Send, Play, Terminal } from "lucide-react"

interface LiveCodingEnvironmentProps {
  role: "editor" | "viewer"
}

export function LiveCodingEnvironment({ role }: LiveCodingEnvironmentProps) {
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    {
      sender: "Alex",
      text: "I'm looking at the authentication issue now. Let me check the token validation logic.",
      time: "10:32 AM",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [code, setCode] = useState(`// auth.js
function validateToken(token) {
  if (!token) {
    return false;
  }
  
  // Bug: Not checking token expiration
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}`)

  const [fixedCode, setFixedCode] = useState(`// auth.js
function validateToken(token) {
  if (!token) {
    return false;
  }
  
  // Fixed: Added proper token expiration check
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      return false;
    }
    
    return decoded;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}`)

  const [showFixed, setShowFixed] = useState(false)

  // Simulate typing for editor role
  useEffect(() => {
    if (role === "editor") {
      const timer = setTimeout(() => {
        setShowFixed(true)

        // Add a message about the fix
        setMessages((prev) => [
          ...prev,
          {
            sender: "Alex",
            text: "I found the issue! The token validation wasn't checking for token expiration. I've added that check now.",
            time: "10:35 AM",
          },
        ])
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [role])

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          sender: role === "editor" ? "Alex" : "Vibe Coder",
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="bg-muted p-2 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm font-medium ml-2">auth.js</span>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Play className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Run</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Terminal className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Console</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-2/3 border-r">
          <Tabs defaultValue="code">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="code" className="text-xs">
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="p-0 m-0">
              <pre className="p-4 text-sm font-mono overflow-auto h-[300px]">{showFixed ? fixedCode : code}</pre>
            </TabsContent>
            <TabsContent value="preview" className="p-0 m-0">
              <div className="p-4 h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Preview not available for this file type</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/3 flex flex-col">
          <div className="p-2 border-b bg-muted">
            <h3 className="text-sm font-medium">Chat</h3>
          </div>
          <div className="flex-1 p-2 overflow-auto">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium">{message.sender}</span>
                    <span className="text-xs text-muted-foreground ml-2">{message.time}</span>
                  </div>
                  <div className="bg-muted p-2 rounded-md text-sm">{message.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-2 border-t">
            <div className="flex items-center">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="text-sm"
              />
              <Button variant="ghost" size="icon" className="ml-1" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
