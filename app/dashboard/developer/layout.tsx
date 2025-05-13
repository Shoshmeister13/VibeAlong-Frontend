import type { ReactNode } from "react"

export default function DeveloperDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // No additional structure - just pass through to parent layout
  return <>{children}</>
}
