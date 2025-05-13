"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { generateAIResponse } from "@/app/actions/ai-actions"

export function AIChatAssistant() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsLoading(true)

    try {
      // Add user message to the chat
      setMessages((prev) => [...prev, { role: "user", content: newMessage }])

      // Generate AI response
      const result = await generateAIResponse(newMessage)

      if (result.success) {
        // Add AI response to the chat
        setMessages((prev) => [...prev, { role: "assistant", content: result.data }])
      } else {
        console.error("Failed to generate AI response:", result.error)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
        ])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
      setNewMessage("")
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Chat Assistant</CardTitle>
        <CardDescription>Get help with your code from our AI assistant</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                message.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="p-3 rounded-md bg-gray-100 text-gray-800">
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
              Thinking...
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <Button variant="ghost" size="icon" className="ml-2" onClick={handleSendMessage} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
