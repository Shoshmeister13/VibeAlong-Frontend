import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock } from "lucide-react"

interface TaskSummaryProps {
  task: any
}

export function TaskSummary({ task }: TaskSummaryProps) {
  // Format the date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (e) {
      return "No date"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Task Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
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

          <div className="flex justify-between">
            <span className="text-muted-foreground">Priority:</span>
            <Badge
              variant={task.priority === "Low" ? "outline" : "default"}
              className={
                task.priority === "High"
                  ? "bg-red-500 text-white"
                  : task.priority === "Medium"
                    ? "bg-orange-500 text-white"
                    : undefined
              }
            >
              {task.priority}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Due Date:</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{formatDate(task.due_date)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Estimated Time:</span>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{task.estimated_hours} hours</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Team</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={task.assigned_to?.avatar_url || "/user-profile.png"} alt="Assigned developer" />
              </Avatar>
              <div>
                <p className="text-sm font-medium">{task.assigned_to?.full_name || "Unassigned"}</p>
                <p className="text-xs text-muted-foreground">Developer</p>
              </div>
            </div>

            {task.vibe_coder && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.vibe_coder?.avatar_url || "/vibealong-expert.png"} alt="Vibe Coder" />
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{task.vibe_coder?.full_name || "Unassigned"}</p>
                  <p className="text-xs text-muted-foreground">Vibe Coder</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
