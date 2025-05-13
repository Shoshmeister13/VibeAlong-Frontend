import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI-Enhanced Expert Consultation | VibeAlong",
  description: "Get free expert consultation for your project with our AI-enhanced experts",
}

export default function ConsultationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
