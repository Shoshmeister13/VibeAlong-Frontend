"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/auth-provider"
import { getCollaborations } from "@/lib/data-service"

export default function CollaborationsPage() {
  const { user } = useAuth()
  const [collaborations, setCollaborations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call
      const userCollaborations = getCollaborations(user.id)
      setCollaborations(userCollaborations)
      setIsLoading(false)
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Collaborations</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <p>Loading collaborations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Collaborations</h1>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {collaborations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium">No collaborations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a collaboration or invite developers to your projects.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {collaborations.map((collab) => (
                <Card key={collab.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{collab.project.name}</CardTitle>
                      <Badge className={getStatusColor(collab.status)} variant="outline">
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>
                      {collab.status === "pending"
                        ? "Waiting for developer to join"
                        : `Last active ${collab.lastActive}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {collab.developer ? (
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={collab.developer.avatar} alt={collab.developer.name} />
                          <AvatarFallback>
                            {collab.developer.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{collab.developer.name}</div>
                          <div className="text-sm text-muted-foreground">Developer</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Magic Link Invite</div>
                        <div className="flex items-center rounded-md border px-3 py-2 text-xs">
                          <span className="truncate">{collab.magicLink}</span>
                          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3 w-3"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {collab.status === "active" ? (
                      <Link href={`/dashboard/collaborations/${collab.id}`} className="w-full">
                        <Button className="w-full">Join Session</Button>
                      </Link>
                    ) : collab.status === "pending" ? (
                      <Button variant="outline" className="w-full">
                        Revoke Invite
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collaborations
              .filter((collab) => collab.status === "active")
              .map((collab) => (
                <Card key={collab.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{collab.project.name}</CardTitle>
                      <Badge className={getStatusColor(collab.status)} variant="outline">
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>Last active {collab.lastActive}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={collab.developer?.avatar} alt={collab.developer?.name} />
                        <AvatarFallback>
                          {collab.developer?.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{collab.developer?.name}</div>
                        <div className="text-sm text-muted-foreground">Developer</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/dashboard/collaborations/${collab.id}`} className="w-full">
                      <Button className="w-full">Join Session</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collaborations
              .filter((collab) => collab.status === "pending")
              .map((collab) => (
                <Card key={collab.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{collab.project.name}</CardTitle>
                      <Badge className={getStatusColor(collab.status)} variant="outline">
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>Waiting for developer to join</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Magic Link Invite</div>
                      <div className="flex items-center rounded-md border px-3 py-2 text-xs">
                        <span className="truncate">{collab.magicLink}</span>
                        <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                          >
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="w-full">
                      Revoke Invite
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">No completed collaborations</h3>
            <p className="mt-2 text-sm text-muted-foreground">You don&apos;t have any completed collaborations yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
