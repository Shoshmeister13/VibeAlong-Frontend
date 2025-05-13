import type React from "react"

interface OnboardingData {
  fullName: string
  email: string
  password: string
  role: UserRole
  profilePictureUrl?: string
  profileData?: Record<string, any>
}

type UserRole = "developer" | "vibe-coder" | "agency"

interface OnboardingContainerProps {
  children: React.ReactNode
  role?: UserRole
}

export function OnboardingContainer({ children, role }: OnboardingContainerProps) {
  return <div>{children}</div>
}

export type { OnboardingData, UserRole }
