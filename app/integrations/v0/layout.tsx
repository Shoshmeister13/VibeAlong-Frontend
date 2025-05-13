import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VibeAlong + v0.dev | Expert Help for Your v0 Projects",
  description:
    "Get expert help to turn your v0.dev designs into fully functional applications with VibeAlong's vetted developers.",
}

export default function V0IntegrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
