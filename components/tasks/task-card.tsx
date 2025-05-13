"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Calendar, ArrowRight, Users2, Star } from "lucide-react"
import Link from "next/link"
import { TaskDetailDialog } from "./task-detail-dialog"
import { TaskRatingDialog } from "./task-rating-dialog"

interface TaskCardProps {
  task: any
  showActions?: boolean
  showAssignee?: boolean
}

export function TaskCard({ task, showActions = true, showAssignee = true }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return "No date"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
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
      return "0" // Return a default value when num is undefined or null
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Check if task is completed and not yet rated
  const isCompleted = task.status?.toLowerCase() === "completed"
  const isRated = task.rating_submitted

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-3">
            <div className="flex-1">
              {/* Title and primary badges row */}
              <div className="flex flex-wrap gap-2 items-center mb-1.5">
                <h3 className="text-base font-semibold">{task.title}</h3>
                {getStatusBadge(task.status)}
                {isRated && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    Rated
                  </Badge>
                )}
              </div>

              {/* Project and framework badges */}
              <div className="flex flex-wrap gap-1.5 text-xs mb-2">
                {task.project && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-slate-50 text-xs py-0.5 h-5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span>
                    {task.project.name}
                  </Badge>
                )}
                {task.framework && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-slate-50 text-xs py-0.5 h-5">
                    {task.framework}
                  </Badge>
                )}
                {task.complexity && (
                  <Badge
                    className={`text-xs py-0.5 h-5 ${
                      task.complexity === "Complex"
                        ? "bg-purple-100 text-purple-800"
                        : task.complexity === "Moderate"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.complexity}
                  </Badge>
                )}
                {task.type && <Badge className="bg-amber-100 text-amber-800 text-xs py-0.5 h-5">{task.type}</Badge>}
              </div>

              {/* Creator info */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                <span>
                  Created by <span className="font-medium text-foreground">{task.created_by || "Unknown"}</span>
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{task.description}</p>

              {/* Progress bar */}
              {task.progress !== undefined && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-medium">Progress</span>
                    <span className="text-xs font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-1.5" />
                  {task.last_updated && (
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-[10px] text-muted-foreground">
                        Last updated: {formatLastUpdated(task.last_updated)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Due date and assignee row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                {task.due_date && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-slate-50 text-xs py-0.5 h-5">
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.due_date)}
                  </Badge>
                )}

                {showAssignee && task.assigned_developer && (
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-1">Assigned to:</span>
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${task.assigned_developer.id || task.assigned_developer.name}?size=32`}
                        alt={task.assigned_developer.name}
                      />
                      <AvatarFallback>{task.assigned_developer.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{task.assigned_developer.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - cost and time estimation */}
            <div className="flex flex-col items-end gap-1 min-w-[100px]">
              <div className="text-right flex items-center gap-1">
                <div className="relative group">
                  <div className="text-xs font-medium flex items-center">
                    Estimation
                    <span className="ml-1 cursor-help">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                    </span>
                  </div>
                  <div className="text-base font-bold">
                    ${formatNumberWithCommas(task.estimated_cost_usd || task.ai_estimated_price || task.budget || 0)}
                  </div>

                  {/* Tooltip */}
                  <div
                    className="fixed opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                              p-2 bg-black text-white text-xs rounded-md shadow-lg z-[9999]"
                    style={{
                      bottom: "calc(100% + 10px)",
                      right: "0",
                      width: "200px",
                      pointerEvents: "none",
                      transform: "translateY(0)",
                    }}
                  >
                    Estimated by VibeAlong AI. Actual work may vary.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{task.estimated_time_hours || task.ai_estimated_hours || 0} hours</span>
              </div>
            </div>
          </div>
        </CardContent>
        {showActions && (
          <CardFooter className="px-4 py-3 bg-muted/30 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
              View Details
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
            {task.id && (
              <Button asChild size="sm">
                <Link href={`/task/${task.id}/task-space`}>
                  <Users2 className="mr-1 h-3 w-3" />
                  Task Space
                </Link>
              </Button>
            )}
            {isCompleted && !isRated && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsRatingDialogOpen(true)}
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
              >
                <Star className="mr-1 h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                Rate Developer
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      <TaskDetailDialog task={task} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />

      {/* Rating Dialog */}
      <TaskRatingDialog isOpen={isRatingDialogOpen} onClose={() => setIsRatingDialogOpen(false)} task={task} />
    </>
  )
}
