import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer Screening | VibeAlong",
  description: "Complete the developer screening quiz to unlock task applications",
}

export default function DeveloperScreeningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Developer Screening</h1>
        {children}
      </div>
    </div>
  )
}
