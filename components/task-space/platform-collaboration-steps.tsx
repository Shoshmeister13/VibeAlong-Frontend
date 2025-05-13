"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Check, Copy, Edit, BotIcon as Robot } from "lucide-react"

interface PlatformCollaborationStepsProps {
  platform: string
  isVibeCoder: boolean
}

export function PlatformCollaborationSteps({ platform, isVibeCoder }: PlatformCollaborationStepsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [instructions, setInstructions] = useState(() => getDefaultInstructions(platform))
  const [copied, setCopied] = useState(false)

  function getDefaultInstructions(platform: string): string {
    switch (platform.toLowerCase()) {
      case "v0":
        return `🤖 V0 Collaboration Setup

1. Open your project in V0.
2. Click Invite Collaborators.
3. Enter your developer's email address.
4. Send the invite. They'll get an email invitation to join your project.`
      case "lovable":
        return `🤖 Lovable Collaboration Setup

1. Open your Lovable workspace.
2. Navigate to Project Settings > Team.
3. Click "Add Member" and enter the developer's email.
4. Set appropriate permissions and send the invitation.`
      case "replit":
        return `🤖 Replit Collaboration Setup

1. Open your Replit project.
2. Click the "Share" button in the top-right corner.
3. Enter the developer's email or username.
4. Set edit permissions and click "Invite".`
      case "bolt":
        return `🤖 Bolt Collaboration Setup

1. Open your Bolt project dashboard.
2. Go to Team Management section.
3. Click "Add Collaborator" and enter the developer's email.
4. Set role to "Developer" and send the invitation.`
      default:
        return `🤖 Collaboration Setup

1. Open your development environment.
2. Navigate to user/team management settings.
3. Add the developer using their email address.
4. Set appropriate access permissions and send the invitation.`
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(instructions)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    // Here you would typically save to database
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Robot className="h-5 w-5 mr-2" />
            Collaboration Setup by Vibe Coder
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {platform}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <pre className="bg-muted/50 rounded-md p-4 text-sm whitespace-pre-wrap font-mono">{instructions}</pre>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              {isVibeCoder && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
