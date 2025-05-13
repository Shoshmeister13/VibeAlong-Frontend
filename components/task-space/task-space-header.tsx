import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TaskSpaceHeaderProps {
  task: any
  backLink?: string
}

export function TaskSpaceHeader({ task, backLink = "/dashboard/tasks" }: TaskSpaceHeaderProps) {
  // Format date to readable string
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not updated"

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return "Invalid date"
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in progress":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            In Progress
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            Completed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 pb-4 pt-4 px-4 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild className="border-gray-300 hover:bg-gray-100 hover:text-gray-900">
          <Link href={backLink}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
        {getStatusBadge(task.status)}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{task.title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>Project: {task.projects?.name || "Unknown Project"}</span>
          <span>•</span>
          <span>Last updated: {formatDate(task.last_updated || task.updated_at)}</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{task.progress || 0}%</span>
        </div>
        <Progress value={task.progress || 0} className="h-2 bg-gray-200 dark:bg-gray-700">
          <div className="h-full bg-gray-800 dark:bg-gray-300" style={{ width: `${task.progress || 0}%` }} />
        </Progress>
      </div>
    </div>
  )
}
