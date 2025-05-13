"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, FileCode, Settings, Users2, Clock, DollarSign, Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DeveloperTaskSpacePage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock task data
  const task = {
    id: "task-123",
    title: "Implement User Authentication Flow",
    description:
      "Create a complete authentication flow including login, registration, password reset, and email verification using Next.js and Supabase.",
    status: "In Progress",
    priority: "High",
    estimated_time_hours: 8,
    estimated_cost_usd: 400,
    created_at: "2023-09-15T10:30:00Z",
    stack: ["Next.js", "Supabase", "TypeScript", "Tailwind CSS"],
    vibe_coder: {
      id: "vc-123",
      full_name: "Alex Johnson",
      email: "alex@example.com",
    },
    developer: {
      id: "dev-456",
      full_name: "Sam Rivera",
      email: "sam@example.com",
    },
    project: {
      id: "proj-789",
      name: "VibeAlong Platform",
      description: "A collaborative platform for connecting developers with projects",
      platform: "Lovable",
    },
    suggested_steps: [
      { step: "Set up authentication providers in Supabase", completed: false },
      { step: "Create login and registration UI components", completed: false },
      { step: "Implement password reset and email verification flows", completed: false },
    ],
  }

  // Mock messages
  const messages = [
    {
      id: "msg-1",
      sender: { id: "vc-123", full_name: "Alex Johnson", role: "vibe_coder" },
      content: "Hi Sam, I've added some more details to the task. Let me know if you have any questions!",
      created_at: "2023-09-15T11:30:00Z",
    },
    {
      id: "msg-2",
      sender: { id: "dev-456", full_name: "Sam Rivera", role: "developer" },
      content: "Thanks Alex! I'll take a look and get started right away.",
      created_at: "2023-09-15T11:35:00Z",
    },
    {
      id: "msg-3",
      sender: { id: "vc-123", full_name: "Alex Johnson", role: "vibe_coder" },
      content: "Great! I've also added some reference links in the project description.",
      created_at: "2023-09-15T11:40:00Z",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Developer Task Space</h1>
          <Badge className="bg-yellow-500 text-white">In Progress</Badge>
        </div>
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
            {/* Task Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📄 Task Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-muted-foreground mt-2">{task.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{task.estimated_time_hours} hours</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>${task.estimated_cost_usd}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-2">
                    {task.stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-secondary/50">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Project:</h4>
                  <p className="text-sm">{task.project.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Vibe Coder:</h4>
                    <p className="text-sm">{task.vibe_coder.full_name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Developer:</h4>
                    <p className="text-sm">{task.developer.full_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🛠 Developer Setup for This Platform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="font-semibold text-blue-700 mb-2">Lovable Platform Setup</h3>
                  <ol className="space-y-3 list-decimal pl-5">
                    <li className="text-sm text-blue-800">
                      Install the Lovable CLI:{" "}
                      <code className="bg-blue-100 px-1 rounded">npm install -g lovable-cli</code>
                    </li>
                    <li className="text-sm text-blue-800">
                      Login to your Lovable account: <code className="bg-blue-100 px-1 rounded">lovable login</code>
                    </li>
                    <li className="text-sm text-blue-800">
                      Clone the project repository:{" "}
                      <code className="bg-blue-100 px-1 rounded">lovable clone vibealong-platform</code>
                    </li>
                    <li className="text-sm text-blue-800">
                      Start the development server: <code className="bg-blue-100 px-1 rounded">lovable dev</code>
                    </li>
                  </ol>
                  <p className="text-xs text-blue-600 mt-3">
                    For more information, visit the{" "}
                    <a href="#" className="underline">
                      Lovable documentation
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI-Generated Steps */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                Key Steps to Complete
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      AI Generated
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Generated by VibeAlong AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {task.suggested_steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1">•</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{step.step}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 h-[400px] overflow-y-auto">
                {messages.map((message) => (
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
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input type="text" placeholder="Type your message..." className="flex-1 px-3 py-2 border rounded-md" />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
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
          <Card>
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
