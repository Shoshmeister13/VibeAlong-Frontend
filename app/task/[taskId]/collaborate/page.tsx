"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function TaskCollaborationRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.taskId as string
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the user's role from your auth system
    // For demo purposes, we'll use localStorage to simulate role selection
    const userRole = localStorage.getItem("userRole") || "developer"

    // Redirect to the appropriate role-specific page
    router.push(`/task/${taskId}/collaborate/${userRole}`)
  }, [taskId, router])

  // Show loading state while redirecting
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-20" />
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}
