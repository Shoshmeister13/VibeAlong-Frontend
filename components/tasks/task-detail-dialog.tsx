"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar, Users2, Info, Sparkles, CheckCircle2, ListChecks, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface TaskDetailDialogProps {
  task: any
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailDialog({ task, isOpen, onClose }: TaskDetailDialogProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  if (!task) return null

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Invalid date"
    }
  }

  const getStatusBadge = (status: string) => {
    if (!status) return null

    const statusConfig: Record<string, { bg: string; text: string }> = {
      open: { bg: "bg-blue-500", text: "text-white" },
      "in progress": { bg: "bg-yellow-500", text: "text-white" },
      review: { bg: "bg-purple-500", text: "text-white" },
      completed: { bg: "bg-green-500", text: "text-white" },
      cancelled: { bg: "bg-red-500", text: "text-white" },
    }

    const config = statusConfig[status.toLowerCase()] || { bg: "bg-gray-500", text: "text-white" }

    return <Badge className={`${config.bg} ${config.text}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  // Format last updated time
  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return "Not updated yet"

    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)

      if (diffMins < 1) {
        return "Just now"
      } else if (diffMins === 1) {
        return "1 minute ago"
      } else if (diffMins < 60) {
        return `${diffMins} minutes ago`
      } else {
        const hours = Math.floor(diffMins / 60)
        if (hours === 1) {
          return "1 hour ago"
        } else if (hours < 24) {
          return `${hours} hours ago`
        } else {
          const days = Math.floor(hours / 24)
          if (days === 1) {
            return "1 day ago"
          } else {
            return `${days} days ago`
          }
        }
      }
    } catch (e) {
      return "Unknown"
    }
  }

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (num: number | undefined | null): string => {
    if (num === undefined || num === null) {
      return "0"
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const renderDeveloperAssignment = () => {
    if (task.status?.toLowerCase() === "open") {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Waiting for developer assignment</p>
              <p className="text-sm">This task is open for applications</p>
            </div>
          </div>

          {task.applied_developers && task.applied_developers.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                Applied Developers ({task.applied_developers.length})
              </h4>
              <div className="grid gap-3">
                {task.applied_developers.map((developer: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3 border shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            developer.avatar_url || `https://avatar.vercel.sh/${developer.id || developer.name}?size=64`
                          }
                          alt={developer.name}
                        />
                        <AvatarFallback>{developer.name?.charAt(0) || "D"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{developer.name}</h4>
                        <p className="text-xs text-muted-foreground">{developer.role || "Developer"}</p>
                      </div>
                      {developer.rating && (
                        <div className="ml-auto flex items-center">
                          <span className="text-amber-500 mr-1">★</span>
                          <span className="text-sm font-medium">{developer.rating}</span>
                        </div>
                      )}
                    </div>
                    {developer.skills && developer.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {developer.skills.slice(0, 3).map((skill: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                            {skill}
                          </Badge>
                        ))}
                        {developer.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-slate-50">
                            +{developer.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-md text-center text-muted-foreground">
              No developers have applied to this task yet
            </div>
          )}
        </div>
      )
    } else if (
      task.status?.toLowerCase() === "in progress" ||
      task.status?.toLowerCase() === "review" ||
      task.status?.toLowerCase() === "completed"
    ) {
      return (
        <div className="space-y-4">
          {task.assigned_developer && (
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={
                    task.assigned_developer.avatar_url ||
                    `https://avatar.vercel.sh/${task.assigned_developer.id || task.assigned_developer.name}?size=64`
                  }
                  alt={task.assigned_developer.name}
                />
                <AvatarFallback>{task.assigned_developer.name?.charAt(0) || "D"}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{task.assigned_developer.name}</h4>
                <p className="text-sm text-muted-foreground">{task.assigned_developer.role || "Developer"}</p>
              </div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  // Generate default steps if none are provided
  const getTaskSteps = () => {
    if (task.ai_suggested_steps && task.ai_suggested_steps.length > 0) {
      return task.ai_suggested_steps.slice(0, 3).map((step: any, index: number) => ({
        number: index + 1,
        title: step.title || `Step ${index + 1}`,
        description: step.description || "",
      }))
    }

    // Default steps if none are provided
    return [
      {
        number: 1,
        title: "Submit Task Requirements",
        description: "Provide detailed requirements and expectations for the task",
      },
      {
        number: 2,
        title: "Developer Implementation",
        description: "Developer works on implementing the solution based on requirements",
      },
      {
        number: 3,
        title: "Review and Approve",
        description: "Review the completed work and provide feedback or approval",
      },
    ]
  }

  // Desktop version of the modal content
  const renderDesktopContent = () => (
    <>
      <div className="flex flex-col h-full max-h-[calc(85vh-8rem)]">
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Status Badge */}
            <div className="mb-4">{task.status && getStatusBadge(task.status)}</div>

            {/* Task Title */}
            <h1 className="text-2xl font-bold mb-2 break-words">{task.title}</h1>

            {/* Posted Date */}
            <div className="flex items-center text-muted-foreground mb-6">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Posted on {formatDate(task.created_at || new Date().toISOString())}</span>
            </div>

            {/* Description Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{task.description}</p>
            </div>

            {/* AI Suggested Steps Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ListChecks className="h-5 w-5 mr-2 flex-shrink-0" />
                AI Suggested Steps
              </h2>
              <div className="space-y-3">
                {getTaskSteps().map((step) => (
                  <div key={step.number} className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-200 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-700 font-medium">{step.number}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-base">{step.title}</h3>
                        <p className="text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What You'll Get Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
                What You'll Get
              </h2>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-muted-foreground">
                  Upon completion of this task, you will receive a fully implemented{" "}
                  <span className="font-medium text-slate-900">{task.title.toLowerCase()}</span> solution that meets all
                  requirements. This includes:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                    <span>Complete, tested code implementation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                    <span>Documentation of the implementation process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                    <span>Integration support with your existing systems</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Developer Assignment Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users2 className="h-5 w-5 mr-2 flex-shrink-0" />
                Developer Assignment
              </h2>
              {renderDeveloperAssignment()}
            </div>

            <Separator className="my-6" />

            {/* Task Details and Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Task Details</h2>

                <div className="bg-slate-50 rounded-lg p-4 border">
                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Task Estimation</h3>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold">
                        $
                        {formatNumberWithCommas(task.estimated_cost_usd || task.ai_estimated_price || task.budget || 0)}
                      </div>
                      <Info className="h-4 w-4 ml-2 text-muted-foreground flex-shrink-0" />
                    </div>
                    <div className="flex items-center text-muted-foreground mt-1">
                      <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{task.estimated_hours || task.ai_estimated_hours || 0} hours</span>
                    </div>
                  </div>

                  {task.complexity && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Complexity:</span>
                        <Badge
                          variant="outline"
                          className={
                            task.complexity.toLowerCase() === "complex"
                              ? "bg-purple-100 text-purple-800"
                              : task.complexity.toLowerCase() === "moderate"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {task.complexity}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {task.framework && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-secondary/50">
                          {task.framework}
                        </Badge>
                        {task.stack &&
                          task.stack.map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="bg-secondary/50">
                              {tech}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Progress</h2>

                <div className="bg-slate-50 rounded-lg p-4 border">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Completion</span>
                      <span className="text-sm font-medium">{task.progress || 0}%</span>
                    </div>
                    <Progress value={task.progress || 0} className="h-2" />
                    {task.last_updated && (
                      <div className="flex justify-end items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          Last updated: {formatLastUpdated(task.last_updated)}
                        </span>
                      </div>
                    )}
                  </div>

                  {task.key_points && task.key_points.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Key Points</h3>
                      <ul className="space-y-2 list-disc pl-5">
                        {task.key_points.map((point: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )

  // Mobile version with tabs for better organization
  const renderMobileContent = () => (
    <Tabs defaultValue="overview" className="w-full">
      <div className="px-4 pt-4">
        {/* Status Badge */}
        <div className="mb-2">{task.status && getStatusBadge(task.status)}</div>

        {/* Task Title */}
        <h1 className="text-xl font-bold mb-2 break-words">{task.title}</h1>

        {/* Posted Date */}
        <div className="flex items-center text-muted-foreground mb-4 text-sm">
          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>Posted on {formatDate(task.created_at || new Date().toISOString())}</span>
        </div>

        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="devs">Developers</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-0 px-4 pb-4">
        {/* Description Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground whitespace-pre-line text-sm">{task.description}</p>
        </div>

        {/* What You'll Get Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
            What You'll Get
          </h2>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-muted-foreground text-sm">
              Upon completion of this task, you will receive a fully implemented{" "}
              <span className="font-medium text-slate-900">{task.title.toLowerCase()}</span> solution that meets all
              requirements. This includes:
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm">Complete, tested code implementation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm">Documentation of the implementation process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span className="text-sm">Integration support with your existing systems</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Progress</h2>
          <div className="bg-slate-50 rounded-lg p-3 border">
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-sm font-medium">{task.progress || 0}%</span>
              </div>
              <Progress value={task.progress || 0} className="h-2" />
              {task.last_updated && (
                <div className="flex justify-end items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    Last updated: {formatLastUpdated(task.last_updated)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="steps" className="mt-0 px-4 pb-4">
        {/* AI Suggested Steps Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <ListChecks className="h-4 w-4 mr-2 flex-shrink-0" />
            AI Suggested Steps
          </h2>
          <div className="space-y-3">
            {getTaskSteps().map((step) => (
              <div key={step.number} className="bg-slate-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="bg-slate-200 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-700 font-medium text-sm">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{step.title}</h3>
                    <p className="text-muted-foreground mt-1 text-xs">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="details" className="mt-0 px-4 pb-4">
        {/* Task Details Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Task Details</h2>

          <div className="bg-slate-50 rounded-lg p-3 border mb-4">
            <div className="mb-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Task Estimation</h3>
              <div className="flex items-center">
                <div className="text-xl font-bold">
                  ${formatNumberWithCommas(task.estimated_cost_usd || task.ai_estimated_price || task.budget || 0)}
                </div>
                <Info className="h-4 w-4 ml-1 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex items-center text-muted-foreground mt-1">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm">{task.estimated_hours || task.ai_estimated_hours || 0} hours</span>
              </div>
            </div>

            {task.complexity && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Complexity:</span>
                  <Badge
                    variant="outline"
                    className={
                      task.complexity.toLowerCase() === "complex"
                        ? "bg-purple-100 text-purple-800"
                        : task.complexity.toLowerCase() === "moderate"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {task.complexity}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {task.framework && (
            <div className="bg-slate-50 rounded-lg p-3 border">
              <h3 className="text-sm font-medium mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-secondary/50 text-xs">
                  {task.framework}
                </Badge>
                {task.stack &&
                  task.stack.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="bg-secondary/50 text-xs">
                      {tech}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {task.key_points && task.key_points.length > 0 && (
            <div className="mt-4 bg-slate-50 rounded-lg p-3 border">
              <h3 className="text-sm font-medium mb-2">Key Points</h3>
              <ul className="space-y-2 list-disc pl-5">
                {task.key_points.map((point: string, index: number) => (
                  <li key={index} className="text-xs text-muted-foreground">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="devs" className="mt-0 px-4 pb-4">
        {/* Developer Assignment Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Users2 className="h-4 w-4 mr-2 flex-shrink-0" />
            Developer Assignment
          </h2>
          {renderDeveloperAssignment()}
        </div>
      </TabsContent>
    </Tabs>
  )

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent
        className={`p-0 overflow-hidden flex flex-col ${
          isMobile ? "w-[95vw] max-h-[85vh] rounded-lg" : "sm:max-w-3xl h-[85vh]"
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => onClose()}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <ScrollArea className="max-h-full">{isMobile ? renderMobileContent() : renderDesktopContent()}</ScrollArea>

        {/* Footer */}
        <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 border-t mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-purple-100 rounded-full p-1">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs sm:text-sm">Task ID: {task.id}</span>
          </div>

          <div className="flex gap-2">
            {!isMobile && (
              <Button variant="outline" size="sm" onClick={() => onClose()}>
                Close
              </Button>
            )}
            {task.status !== "Completed" && (
              <Button className="bg-slate-700 hover:bg-slate-800" size="sm" asChild>
                <Link href={`/task/${task.id}/task-space`}>
                  <span className="flex items-center gap-1 sm:gap-2">
                    <Users2 className="h-4 w-4" />
                    Task Space
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
