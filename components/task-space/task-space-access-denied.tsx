import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface TaskSpaceAccessDeniedProps {
  task: any
}

export function TaskSpaceAccessDenied({ task }: TaskSpaceAccessDeniedProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center text-amber-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Task Space Not Available
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">{task.title}</h2>
            <p className="text-muted-foreground mb-6">
              This task is currently in "{task.status}" status. The Task Space is only available for tasks that are in
              progress, under review, or completed.
            </p>
            <Button asChild>
              <Link href="/dashboard/tasks">View All Tasks</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
