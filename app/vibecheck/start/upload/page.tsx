"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UploadRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the new flow
    router.replace("/vibecheck/start")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to the new VibeCheck experience...</p>
    </div>
  )
}
