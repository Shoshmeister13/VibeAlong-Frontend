import type React from "react"

export default function TaskSpaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // No sidebar here - it should be in the parent layout
  return <div className="min-h-screen bg-background">{children}</div>
}
