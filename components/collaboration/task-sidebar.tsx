"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface TaskSidebarProps {
  task: any
  className?: string
}

export function TaskSidebar({ task, className = "" }: TaskSidebarProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return "Unknown date"
    }
  }

  const formatLastUpdated = (dateString: string) => {
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

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Task Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-2">Team</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={task.vibe_coder?.avatar_url || `https://avatar.vercel.sh/${task.vibe_coder?.id}?size=32`}
                  alt={task.vibe_coder?.full_name}
                />
                <AvatarFallback>{task.vibe_coder?.full_name?.charAt(0) || "V"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{task.vibe_coder?.full_name}</div>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs mr-2">
                    Vibe-Coder
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={task.developer?.avatar_url || `https://avatar.vercel.sh/${task.developer?.id}?size=32`}
                  alt={task.developer?.full_name}
                />
                <AvatarFallback>{task.developer?.full_name?.charAt(0) || "D"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{task.developer?.full_name}</div>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs mr-2">
                    Developer
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-2">Timeline</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">{formatDate(task.created_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Due Date</span>
              <span className="text-sm">{formatDate(task.due_date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Update</span>
              <span className="text-sm">{formatLastUpdated(task.updates?.[0]?.created_at || task.last_updated)}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium mb-2">Activity Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Messages</span>
              <span className="text-sm">{task.messages?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Files</span>
              <span className="text-sm">{task.files?.length || task.attachments?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Updates</span>
              <span className="text-sm">{task.updates?.length || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
