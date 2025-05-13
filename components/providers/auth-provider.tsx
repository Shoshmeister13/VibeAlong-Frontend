"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Mock user data
const MOCK_USER = {
  id: "mock-user-id-123",
  email: "demo@vibealong.com",
  fullName: "Demo User",
  role: "vibe-coder", // Can be "vibe-coder", "developer", or "agency"
  profileCompleted: true,
  user_metadata: {
    full_name: "Demo User",
    role: "vibe-coder",
    avatar_url: "/abstract-geometric-sr.png",
  },
}

type User = {
  id: string
  email: string
  fullName: string
  role: string
  profileCompleted: boolean
  user_metadata?: any
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always return mock user data and set isLoading to false
  const [user] = useState<User | null>(MOCK_USER)
  const [isLoading] = useState(false)

  // Mock sign out function that does nothing
  const signOut = async () => {
    console.log("Mock sign out called - no actual sign out happens")
    // No actual sign out happens
  }

  return <AuthContext.Provider value={{ user, isLoading, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
