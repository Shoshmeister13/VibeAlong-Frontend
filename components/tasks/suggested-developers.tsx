"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Developer {
  id: string
  name: string
  avatar: string
  rating: number
  skills: string[]
  matchPercentage: number
}

interface SuggestedDevelopersProps {
  taskId: string
}

export function SuggestedDevelopers({ taskId }: SuggestedDevelopersProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Mock data for suggested developers
  const suggestedDevelopers: Developer[] = [
    {
      id: "dev1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      skills: ["React", "Next.js", "TypeScript"],
      matchPercentage: 95,
    },
    {
      id: "dev2",
      name: "Sarah Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      skills: ["UI/UX", "Frontend", "React"],
      matchPercentage: 92,
    },
    {
      id: "dev3",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
      skills: ["Node.js", "API", "Database"],
      matchPercentage: 88,
    },
  ]

  return (
    <Card className="mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-md flex items-center">
              <span className="mr-2">👨‍💻</span>
              <span>3 Suggested Developers</span>
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="space-y-3">
              {suggestedDevelopers.map((developer) => (
                <div key={developer.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={developer.avatar || "/placeholder.svg"} alt={developer.name} />
                      <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{developer.name}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                        <span>{developer.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex gap-1">
                      {developer.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
                      {developer.matchPercentage}% match
                    </Badge>
                    <Button size="sm">Invite</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
