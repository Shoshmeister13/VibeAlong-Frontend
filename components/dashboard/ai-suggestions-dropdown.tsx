"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"

interface Suggestion {
  id: string
  title: string
  description: string
}

export function AISuggestionsDropdown() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "s1",
      title: "Add user authentication",
      description: "Implement secure login and registration functionality",
    },
    {
      id: "s2",
      title: "Create responsive dashboard",
      description: "Optimize your dashboard for mobile devices",
    },
    {
      id: "s3",
      title: "Add payment integration",
      description: "Connect with Stripe for seamless payments",
    },
  ])

  const [open, setOpen] = useState(false)

  const unreadCount = suggestions.length

  const dismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter((s) => s.id !== id))
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Lightbulb className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h3 className="font-medium">AI Suggestions</h3>
          <Badge variant="outline" className="text-xs">
            {suggestions.length} new
          </Badge>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <DropdownMenuItem
                key={suggestion.id}
                className="flex items-start p-4"
                onSelect={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dismissSuggestion(suggestion.id)
                }}
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{suggestion.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{suggestion.description}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No new suggestions</div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button variant="outline" size="sm" className="w-full">
            View All Suggestions
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { AISuggestionsDropdown as AiSuggestionsDropdown }
