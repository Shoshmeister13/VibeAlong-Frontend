"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MicOff, PhoneCall } from "lucide-react"
import { CollaborationEditor } from "@/components/collaboration/collaboration-editor"
import { CollaborationChat } from "@/components/collaboration/collaboration-chat"
import { useAuth } from "@/components/providers/auth-provider"
import { getCollaboration } from "@/lib/data-service"

export default function CollaborationSessionPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [collaboration, setCollaboration] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedCollaboration = getCollaboration(params.id)

    // Add some additional data for the UI
    if (fetchedCollaboration) {
      setCollaboration({
        ...fetchedCollaboration,
        startedAt: "2 hours ago",
        duration: "02:15:32",
      })
    }

    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Loading session...</h1>
        </div>
      </div>
    )
  }

  if (!collaboration) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Session not found</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">The collaboration session you are looking for does not exist.</p>
          <Link href="/dashboard/collaborations" className="mt-4">
            <Button>Back to Collaborations</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-0 md:p-0">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/collaborations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-bold">{collaboration.project.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Session started {collaboration.startedAt}</span>
              <span>•</span>
              <span>Duration: {collaboration.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span>Live Session</span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={collaboration.developer?.avatar} alt={collaboration.developer?.name} />
            <AvatarFallback>
              {collaboration.developer?.name
                ? collaboration.developer.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                : "D"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <CollaborationEditor />
        </div>
        <div className="w-80 border-l">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-medium">Communication</h2>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MicOff className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                  <PhoneCall className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CollaborationChat />
          </div>
        </div>
      </div>
    </div>
  )
}
