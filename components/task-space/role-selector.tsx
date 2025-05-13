"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserCircle, Users } from "lucide-react"

export function RoleSelector() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.task_id as string
  const [currentRole, setCurrentRole] = useState<string>("developer")

  useEffect(() => {
    // Get the current role from the URL
    const path = window.location.pathname
    if (path.includes("/vibe-coder")) {
      setCurrentRole("vibe-coder")
      localStorage.setItem("userRole", "vibe-coder")
    } else if (path.includes("/developer")) {
      setCurrentRole("developer")
      localStorage.setItem("userRole", "developer")
    }
  }, [])

  const switchRole = (role: string) => {
    localStorage.setItem("userRole", role)
    router.push(`/task/${taskId}/collaborate/${role}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Task Collaboration</h1>
          <p className="text-muted-foreground">Work together on task #{taskId} in your preferred view</p>
        </div>
        <div className="bg-muted p-1 rounded-lg flex">
          <Button
            variant={currentRole === "developer" ? "default" : "ghost"}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => switchRole("developer")}
          >
            <UserCircle className="h-4 w-4" />
            Developer View
          </Button>
          <Button
            variant={currentRole === "vibe-coder" ? "default" : "ghost"}
            size="sm"
            className="flex items-center gap-1"
            onClick={() => switchRole("vibe-coder")}
          >
            <Users className="h-4 w-4" />
            Vibe-Coder View
          </Button>
        </div>
      </div>
      <div className="h-px bg-border" />
    </div>
  )
}
