"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MessageSquare, FileCode, Settings, Users2 } from "lucide-react"
import Link from "next/link"
import { TaskSummary } from "@/components/collaboration/task-summary"
import { AITaskSteps } from "@/components/collaboration/ai-task-steps"
import { PlatformSetupInstructions } from "@/components/collaboration/platform-setup-instructions"
import { CollaborationChat } from "@/components/collaboration/collaboration-chat"
import { createClient } from "@/lib/supabase/browser-client"

interface TaskCollaborationSpaceProps {
  task: any
  userId: string
  userRole: string
}

export function TaskCollaborationSpace({ task, userId, userRole }: TaskCollaborationSpaceProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("task_messages")
        .select(`
          *,
          sender:sender_id(id, full_name, email, avatar_url, role)
        `)
        .eq("task_id", task.id)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching messages:", error)
      } else {
        setMessages(data || [])
      }
      setIsLoading(false)
    }

    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel(`task_messages:${task.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "task_messages",
          filter: `task_id=eq.${task.id}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data, error } = await supabase
            .from("task_messages")
            .select(`
              *,
              sender:sender_id(id, full_name, email, avatar_url, role)
            `)
            .eq("id", payload.new.id)
            .single()

          if (!error && data) {
            setMessages((current) => [...current, data])
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [task.id, supabase])

  const handleSendMessage = async (content: string, attachments: any[] = []) => {
    try {
      const { data, error } = await supabase.from("task_messages").insert({
        task_id: task.id,
        sender_id: userId,
        content,
        attachments,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error sending message:", error)
      }

      return { success: !error }
    } catch (err) {
      console.error("Error in send message function:", err)
      return { success: false }
    }
  }

  const getBackLink = () => {
    if (userRole === "developer") {
      return "/dashboard/developer/tasks"
    } else {
      return "/dashboard/tasks"
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="overview">
            <Users2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="code">
            <FileCode className="h-4 w-4 mr-2" />
            Code
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskSummary task={task} />

            <Card>
              <CardHeader>
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

          <AITaskSteps
            taskTitle={task.title}
            taskDescription={task.description}
            taskId={task.id}
            existingSteps={task.suggested_steps}
            projectContext={task.project?.description}
          />

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No messages yet. Start the conversation!</div>
              ) : (
                <div className="space-y-4">
                  {messages.slice(-3).map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {message.sender?.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{message.sender?.full_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("chat")}>
                      View all messages
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="h-[calc(100vh-220px)]">
            <CollaborationChat
              messages={messages}
              onSendMessage={handleSendMessage}
              userId={userId}
              isLoading={isLoading}
              userRole={userRole}
            />
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card className="h-[calc(100vh-220px)]">
            <CardHeader>
              <CardTitle>Code Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Code collaboration features coming soon!</p>
                <p className="text-sm text-muted-foreground">
                  This space will allow you to share code snippets, review pull requests, and collaborate on technical
                  solutions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="h-[calc(100vh-220px)]">
            <CardHeader>
              <CardTitle>Task Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Task settings and preferences coming soon!</p>
                <p className="text-sm text-muted-foreground">
                  This space will allow you to manage task preferences, notifications, and collaboration settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
