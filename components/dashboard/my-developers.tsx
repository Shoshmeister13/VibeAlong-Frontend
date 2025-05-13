"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MessageSquare, ExternalLink } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"

interface Developer {
  id: string
  name: string
  avatar_url?: string
  skills: string[]
  assigned_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  total_tasks: number
  last_active: string
}

export function MyDevelopers() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchDevelopers() {
      setIsLoading(true)
      try {
        // In a real implementation, you would fetch this data from your database
        // For now, we'll use mock data
        const mockDevelopers: Developer[] = [
          {
            id: "1",
            name: "Alex Johnson",
            avatar_url: "/abstract-aj.png",
            skills: ["React", "TypeScript", "Node.js"],
            assigned_tasks: 5,
            completed_tasks: 3,
            in_progress_tasks: 2,
            total_tasks: 5,
            last_active: "2 hours ago",
          },
          {
            id: "2",
            name: "Sam Rivera",
            avatar_url: "/abstract-geometric-sr.png",
            skills: ["UI/UX", "Frontend", "Figma"],
            assigned_tasks: 4,
            completed_tasks: 2,
            in_progress_tasks: 1,
            total_tasks: 4,
            last_active: "1 day ago",
          },
          {
            id: "3",
            name: "Taylor Kim",
            avatar_url: "/stylized-initials.png",
            skills: ["Backend", "Database", "API"],
            assigned_tasks: 3,
            completed_tasks: 3,
            in_progress_tasks: 0,
            total_tasks: 3,
            last_active: "Just now",
          },
        ]

        setDevelopers(mockDevelopers)
      } catch (error) {
        console.error("Error fetching developers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevelopers()
  }, [supabase])

  const getProgressColor = (completedPercentage: number) => {
    if (completedPercentage >= 80) return "bg-green-500"
    if (completedPercentage >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">My Developers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24 mt-1" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {" "}
      {/* Added mt-8 for spacing when placed below My Tasks */}
      <h2 className="text-xl font-semibold mb-4">👩‍💻 My Developers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {developers.map((developer) => {
          const completedPercentage =
            developer.total_tasks > 0 ? Math.round((developer.completed_tasks / developer.total_tasks) * 100) : 0

          return (
            <Card key={developer.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={developer.avatar_url || "/placeholder.svg"} alt={developer.name} />
                      <AvatarFallback>
                        {developer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{developer.name}</CardTitle>
                      <CardDescription>Active {developer.last_active}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {developer.in_progress_tasks} in progress
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-1 mb-3">
                  {developer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Task Progress</span>
                    <span>{completedPercentage}%</span>
                  </div>
                  <Progress
                    value={completedPercentage}
                    className="h-2"
                    indicatorClassName={getProgressColor(completedPercentage)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{developer.completed_tasks} completed</span>
                    <span>{developer.total_tasks} total</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">Message</span>
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span className="whitespace-nowrap">View Profile</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
