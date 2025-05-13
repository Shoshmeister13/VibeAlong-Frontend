import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { V0 } from "@/components/vibe-platform-icons"

interface Developer {
  name: string
  avatar: string
}

interface TaskCardProps {
  title: string
  description: string
  platform: string
  urgency: string
  price: number
  status: "waiting" | "in-progress" | "completed"
  developer?: Developer
}

export function TaskCard({ title, description, platform, urgency, price, status, developer }: TaskCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-500/10 text-blue-500">In Progress</Badge>
      case "waiting":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Waiting for Developer</Badge>
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge className="bg-red-500/10 text-red-500">High Priority</Badge>
      case "medium":
        return <Badge className="bg-orange-500/10 text-orange-500">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-green-500/10 text-green-500">Low Priority</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {getStatusBadge(status)}
          {getUrgencyBadge(urgency)}
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {developer ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={developer.avatar} alt={developer.name} />
                  <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{developer.name}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">No developer assigned yet</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <V0 className="h-4 w-4 mr-1" />
              <span className="text-xs">{platform}</span>
            </div>
            <div className="text-sm font-semibold ml-2">${price}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
