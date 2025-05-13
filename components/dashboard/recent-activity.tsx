import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "project_created",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JD",
      },
      project: "E-commerce Platform",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      type: "collaboration_started",
      user: {
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JS",
      },
      project: "Mobile App Redesign",
      timestamp: "5 hours ago",
    },
    {
      id: 3,
      type: "invite_sent",
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      project: "API Integration",
      timestamp: "1 day ago",
    },
    {
      id: 4,
      type: "collaboration_completed",
      user: {
        name: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SW",
      },
      project: "Landing Page Design",
      timestamp: "2 days ago",
    },
  ]

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "project_created":
        return `created a new project "${activity.project}"`
      case "collaboration_started":
        return `started a collaboration on "${activity.project}"`
      case "invite_sent":
        return `sent an invite for "${activity.project}"`
      case "collaboration_completed":
        return `completed a collaboration on "${activity.project}"`
      default:
        return "performed an action"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Recent Activity</CardTitle>
        <CardDescription>Your recent activity across all projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user.name}{" "}
                  <span className="text-sm text-muted-foreground">{getActivityText(activity)}</span>
                </p>
                <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
