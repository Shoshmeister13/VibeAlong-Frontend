"use client"

import { useState } from "react"
import { TaskSpaceHeader } from "./task-space-header"
import { AITaskSteps } from "./ai-task-steps"
import { CollaborationChat } from "./collaboration-chat"
import { PlatformCollaborationSteps } from "./platform-collaboration-steps"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, Clock, Code2, MessageSquare } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  due_date?: string
  estimated_hours?: number
  progress?: number
  platform?: string
  suggested_steps?: any[] | null
  [key: string]: any
}

interface EnhancedTaskSpaceProps {
  task: Task
  userRole: "developer" | "vibe_coder"
}

export function EnhancedTaskSpace({ task, userRole }: EnhancedTaskSpaceProps) {
  const [activeTab, setActiveTab] = useState("chat")
  const [progress, setProgress] = useState(task.progress || 0)

  // Format the task steps data for the AITaskSteps component
  const taskSteps = Array.isArray(task.suggested_steps)
    ? task.suggested_steps.map((step: any, index: number) => ({
        id: step.id || `step-${index}`,
        step: step.step || step.title || `Step ${index + 1}`,
        description: step.description || "",
        completed: step.completed || false,
      }))
    : []

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <TaskSpaceHeader
          taskTitle={task.title}
          taskStatus={task.status}
          taskPriority={task.priority}
          userRole={userRole}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        {/* Main Task Area - 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          {/* Task Details Card */}
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{task.title}</CardTitle>
                <Badge
                  variant="outline"
                  className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
                >
                  {task.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  Priority: {task.priority}
                </Badge>
                {task.platform && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    <Code2 className="mr-1 h-3 w-3" />
                    {task.platform}
                  </Badge>
                )}
                {task.due_date && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    <CalendarIcon className="mr-1 h-3 w-3" />
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </Badge>
                )}
                {task.estimated_hours && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    <Clock className="mr-1 h-3 w-3" />
                    {task.estimated_hours} hours
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
              </div>

              {typeof progress === "number" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-100 dark:bg-gray-800" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs for Chat and Code */}
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="chat" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                <Code2 className="h-4 w-4 mr-2" />
                Code
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-2">
              <CollaborationChat
                taskId={task.id}
                userRole={userRole}
                recipientRole={userRole === "developer" ? "vibe_coder" : "developer"}
              />
            </TabsContent>
            <TabsContent value="code" className="mt-2">
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    Code collaboration features will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="space-y-4">
          {/* Platform Collaboration Steps */}
          <PlatformCollaborationSteps platform={task.platform || "Unknown Platform"} userRole={userRole} />

          {/* Task Steps */}
          <AITaskSteps
            taskTitle="Task Steps"
            taskDescription="Track your progress through these steps"
            taskId={task.id}
            existingSteps={task.suggested_steps}
            userRole={userRole}
          />
        </div>
      </div>
    </div>
  )
}
