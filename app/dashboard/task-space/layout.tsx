import type { ReactNode } from "react"

export default function TaskSpaceLayout({
  children,
}: {
  children: ReactNode
}) {
  // No additional structure - just pass through to parent dashboard layout
  return <>{children}</>
}
