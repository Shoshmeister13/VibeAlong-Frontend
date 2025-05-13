"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, PaperclipIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Message {
  id: string
  content: string
  sender_id: string
  sender_name: string
  sender_avatar?: string
  sender_role: string
  created_at: string
}

interface CollaborationChatProps {
  taskId: string
  userId: string
  userRole: string
  className?: string
}

export function CollaborationChat({ taskId, userId, userRole, className = "" }: CollaborationChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("task_messages")
          .select(`
            id,
            content,
            sender_id,
            created_at,
            profiles (
              full_name,
              avatar_url,
              role
            )
          `)
          .eq("task_id", taskId)
          .order("created_at", { ascending: true })

        if (error) throw error

        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender_id: msg.sender_id,
          sender_name: msg.profiles?.full_name || "Unknown User",
          sender_avatar: msg.profiles?.avatar_url,
          sender_role: msg.profiles?.role || "unknown",
          created_at: msg.created_at,
        }))

        setMessages(formattedMessages)
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel(`task_messages:${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "task_messages",
          filter: `task_id=eq.${taskId}`,
        },
        async (payload) => {
          // Fetch the sender details
          const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, role")
            .eq("id", payload.new.sender_id)
            .single()

          const newMsg: Message = {
            id: payload.new.id,
            content: payload.new.content,
            sender_id: payload.new.sender_id,
            sender_name: profileData?.full_name || "Unknown User",
            sender_avatar: profileData?.avatar_url,
            sender_role: profileData?.role || "unknown",
            created_at: payload.new.created_at,
          }

          setMessages((current) => [...current, newMsg])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [taskId, supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const { error } = await supabase.from("task_messages").insert({
        task_id: taskId,
        sender_id: userId,
        content: newMessage.trim(),
      })

      if (error) throw error

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "developer":
        return "Developer"
      case "vibe_coder":
        return "Vibe Coder"
      default:
        return role.charAt(0).toUpperCase() + role.slice(1)
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-6">
            <p className="mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message below.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender_id === userId ? "justify-end" : "justify-start"}`}
            >
              {message.sender_id !== userId && (
                <Avatar className="h-8 w-8">
                  {message.sender_avatar ? (
                    <AvatarImage src={message.sender_avatar || "/placeholder.svg"} alt={message.sender_name} />
                  ) : (
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {message.sender_name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              <div
                className={`max-w-[80%] ${
                  message.sender_id === userId
                    ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
                } rounded-lg p-3`}
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {message.sender_id === userId ? "You" : message.sender_name}
                    <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                      {getRoleLabel(message.sender_role)}
                    </span>
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(message.created_at)}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.sender_id === userId && (
                <Avatar className="h-8 w-8">
                  {message.sender_avatar ? (
                    <AvatarImage src={message.sender_avatar || "/placeholder.svg"} alt={message.sender_name} />
                  ) : (
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {message.sender_name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 border-gray-300 hover:bg-gray-100 hover:text-gray-900"
          >
            <PaperclipIcon className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[40px] resize-none border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
