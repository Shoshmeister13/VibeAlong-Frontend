"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTutorial } from "./tutorial-provider"
import { useAuth } from "@/hooks/use-auth"

export function TutorialButton() {
  const { showTutorial } = useTutorial()
  const { user } = useAuth()

  // Determine if user is developer or vibe-coder
  const userRole = user?.role || "developer"
  const isDeveloper = userRole === "developer"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-tutorial="help">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => showTutorial(isDeveloper ? "developer" : "vibe-coder")}>
          Start Platform Tour
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open("/help", "_blank")}>Help Center</DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open("/faq", "_blank")}>FAQ</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
