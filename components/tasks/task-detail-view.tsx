import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, DollarSign, Calendar, ArrowLeft, Briefcase, LinkIcon, Users } from "lucide-react"
import Link from "next/link"
import { AITaskSteps } from "@/components/tasks/ai-task-steps"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

interface TaskDetailViewProps {
  task: any
  backHref: string
  userRole: string
  userId: string
}

export async function TaskDetailView({ task, backHref, userRole, userId }: TaskDetailViewProps) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Format the date
  const formattedDate = new Date(task.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get project details if available
  let project = null
  if (task.project_id) {
    const { data: projectData } = await supabase.from("projects").select("*").eq("id", task.project_id).single()

    project = projectData
  }

  // Get the vibe coder and developer info
  const vibeCoder = task.profiles
  const developer = task.developer_id ? task.profiles : null

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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <Badge className="bg-blue-500 text-white">Open</Badge>
      case "in progress":
        return <Badge className="bg-yellow-500 text-white">In Progress</Badge>
      case "review":
        return <Badge className="bg-purple-500 text-white">Review</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const isVibeCoder = userRole === "vibe_coder" && task.vibe_coder_id === userId
  const isDeveloper = userRole === "developer" && (task.developer_id === userId || task.status === "Open")
  const canCollaborate = (isVibeCoder || (isDeveloper && task.developer_id === userId)) && task.status !== "Open"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        {getStatusBadge(task.status)}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            {getPriorityBadge(task.priority)}
            <Badge variant="outline">{task.category}</Badge>
          </div>
          <CardTitle className="text-2xl">{task.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Posted on {formattedDate}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{task.description}</p>
          </div>

          {/* Project details if available */}
          {project && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Project Details
              </h3>
              <Card className="bg-muted/40">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Project Name:</span>
                      <span>{project.name}</span>
                    </div>
                    {project.description && (
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                    )}
                    {project.repository_url && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Repository:</span>
                        <a
                          href={project.repository_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary flex items-center hover:underline"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          View Repository
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI-generated steps */}
          <AITaskSteps
            taskTitle={task.title}
            taskDescription={task.description}
            taskId={task.id}
            existingSteps={task.suggested_steps}
            projectContext={project?.description}
          />

          <div>
            <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {task.stack &&
                task.stack.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="bg-secondary/50">
                    {tech}
                  </Badge>
                ))}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Task Details</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Time:</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {task.estimated_time_hours} {task.estimated_time_hours === 1 ? "hour" : "hours"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>${task.estimated_cost_usd}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Posted by:</h4>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={`https://avatar.vercel.sh/${vibeCoder.id}?size=32`} alt={vibeCoder.full_name} />
                      <AvatarFallback>{vibeCoder.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{vibeCoder.full_name}</p>
                      <p className="text-xs text-muted-foreground">{vibeCoder.email}</p>
                    </div>
                  </div>
                </div>

                {task.developer_id && developer && (
                  <div>
                    <h4 className="font-medium mb-2">Assigned to:</h4>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${developer.id}?size=32`}
                          alt={developer.full_name}
                        />
                        <AvatarFallback>{developer.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{developer.full_name}</p>
                        <p className="text-xs text-muted-foreground">{developer.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Key Points</h3>

              {task.key_points && task.key_points.length > 0 ? (
                <ul className="space-y-2 list-disc pl-5">
                  {task.key_points.map((point: string, index: number) => (
                    <li key={index} className="text-muted-foreground">
                      {point}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No key points provided for this task.</p>
              )}

              <h3 className="text-lg font-semibold mt-6 mb-4">Suggested Steps</h3>

              {task.suggested_steps && Array.isArray(task.suggested_steps) && task.suggested_steps.length > 0 ? (
                <ol className="space-y-4 list-decimal pl-5">
                  {task.suggested_steps.map((step: any, index: number) => (
                    <li key={index} className="text-muted-foreground">
                      <span className="font-medium">{step.step}</span>
                      {step.description && <p className="mt-1">{step.description}</p>}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground">No suggested steps provided for this task.</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          {userRole === "developer" && task.status === "Open" && (
            <Button asChild className="flex-1">
              <Link href={`/dashboard/developer/tasks`}>Browse More Tasks</Link>
            </Button>
          )}

          {userRole === "developer" && task.developer_id === userId && (
            <Button asChild className="flex-1">
              <Link href={`/collaboration/${task.id}`}>Start Working</Link>
            </Button>
          )}

          {userRole === "vibe_coder" && (
            <Button asChild variant="outline" className="flex-1">
              <Link href={`/dashboard/tasks`}>Manage Tasks</Link>
            </Button>
          )}

          {/* Add Task Space button */}
          {(isVibeCoder || (isDeveloper && task.developer_id === userId)) && task.status !== "Open" && (
            <Button asChild className="flex-1">
              <Link href={`/task/${task.id}/collaborate`}>
                <Users className="h-4 w-4 mr-2" />🤝 Task Space
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
