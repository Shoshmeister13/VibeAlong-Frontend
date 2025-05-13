"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { LoginForm } from "./login-form"

interface AuthModalProps {
  defaultTab?: "login" | "register"
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  className?: string
}

export function AuthModal({ defaultTab = "login", variant = "default", className }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab)
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Reset to default tab when closing
      setActiveTab(defaultTab)
    }
  }

  const handleSignupClick = () => {
    setIsOpen(false)
    router.push("/auth/signup")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>
          {defaultTab === "login" ? "Sign In" : "Sign Up"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{activeTab === "login" ? "Sign In" : "Create an Account"}</DialogTitle>
          <DialogDescription>
            {activeTab === "login" ? "Sign in to your account to continue." : "Create a new account to get started."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {activeTab === "login" ? (
            <LoginForm />
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Our signup process requires a few more steps. Click below to continue.
              </p>
              <Button onClick={handleSignupClick} className="w-full">
                Continue to Sign Up
              </Button>
            </div>
          )}

          <div className="mt-4 text-center text-sm">
            {activeTab === "login" ? (
              <p>
                Don't have an account?{" "}
                <button type="button" onClick={() => setActiveTab("register")} className="text-primary hover:underline">
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button type="button" onClick={() => setActiveTab("login")} className="text-primary hover:underline">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
