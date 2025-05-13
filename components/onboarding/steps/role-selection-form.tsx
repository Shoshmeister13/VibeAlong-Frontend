"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { OnboardingData, UserRole } from "../onboarding-wizard"
import { Code, Users, Building2 } from "lucide-react"

interface RoleSelectionFormProps {
  initialData: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onNext: () => void
  onBack: () => void
}

export function RoleSelectionForm({ initialData, onUpdate, onNext, onBack }: RoleSelectionFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>(initialData.role)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = () => {
    if (selectedRole) {
      onUpdate({ role: selectedRole })
      onNext()
    }
  }

  const roles: { id: UserRole; title: string; description: string; icon: React.ReactNode }[] = [
    {
      id: "developer",
      title: "Developer",
      description: "I want to work on projects and get paid for my development skills",
      icon: <Code className="h-8 w-8" />,
    },
    {
      id: "vibe-coder",
      title: "Vibe Coder",
      description: "I need help building my product or project with AI-assisted developers",
      icon: <Users className="h-8 w-8" />,
    },
    {
      id: "agency",
      title: "Agency",
      description: "I represent a development agency looking to find projects for our team",
      icon: <Building2 className="h-8 w-8" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Choose Your Role</h2>
        <p className="text-muted-foreground mt-1">Select how you'll use VibeAlong</p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedRole === role.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleRoleSelect(role.id)}
          >
            <div
              className={`rounded-full p-2 mr-4 ${
                selectedRole === role.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {role.icon}
            </div>
            <div>
              <h3 className="font-medium">{role.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!selectedRole}>
          Continue
        </Button>
      </div>
    </div>
  )
}
