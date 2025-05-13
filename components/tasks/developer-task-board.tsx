"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, Clock, DollarSign, ArrowRight, CheckCircle } from "lucide-react"
import { claimTask } from "@/app/actions/developer-task-actions"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  priority: string
  category: string
  stack: string[]
  estimated_time_hours: number
  estimated_cost_usd: number
  status: string
  vibe_coder_id: string
  created_at: string
  profiles: {
    full_name: string
  }
}

interface DeveloperTaskBoardProps {
  initialTasks: Task[]
}

export function DeveloperTaskBoard({ initialTasks }: DeveloperTaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [claimingTaskId, setClaimingTaskId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleClaimTask = async (taskId: string) => {
    setClaimingTaskId(taskId)

    try {
      const result = await claimTask(taskId)

      if (result.success) {
        toast({
          title: "Task Claimed",
          description: "You've successfully claimed this task. Head to your dashboard to get started.",
          variant: "default",
        })

        // Remove the task from the list
        setTasks(tasks.filter((task) => task.id !== taskId))

        // Redirect to the task detail page after a short delay
        setTimeout(() => {
          router.push(`/dashboard/tasks/${taskId}`)
        }, 1500)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to claim task. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      console.error("Error claiming task:", error)
    } finally {
      setClaimingTaskId(null)
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return <Badge className="bg-red-500 text-white">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-white">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>
      case "low":
        return <Badge className="bg-green-500 text-white">Low</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  if (tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px] text-center">
          <CheckCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Open Tasks</h3>
          <p className="text-muted-foreground max-w-md">
            There are currently no open tasks available. Check back later or explore other opportunities in the
            platform.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <Card key={task.id} className="flex flex-col h-full">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              {getPriorityBadge(task.priority)}
              <Badge variant="outline">{task.category}</Badge>
            </div>
            <CardTitle className="line-clamp-2">{task.title}</CardTitle>
            <CardDescription className="line-clamp-3">{task.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-4">
              {task.stack.map((tech) => (
                <Badge key={tech} variant="secondary" className="bg-secondary/50">
                  {tech}
                </Badge>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {task.estimated_time_hours} {task.estimated_time_hours === 1 ? "hour" : "hours"}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">${task.estimated_cost_usd}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">Posted by: {task.profiles.full_name}</div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleClaimTask(task.id)} disabled={claimingTaskId === task.id}>
              {claimingTaskId === task.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                <>
                  Jump on Task
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
