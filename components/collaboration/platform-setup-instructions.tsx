"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Check, Copy } from "lucide-react"
import { createClient } from "@/lib/supabase/browser-client"

interface PlatformSetupInstructionsProps {
  platform: string
  isVibeCoder: boolean
  taskId: string
}

export function PlatformSetupInstructions({ platform, isVibeCoder, taskId }: PlatformSetupInstructionsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [instructions, setInstructions] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchInstructions = async () => {
      // Try to fetch custom instructions first
      const { data: customInstructions } = await supabase
        .from("task_platform_instructions")
        .select("instructions")
        .eq("task_id", taskId)
        .single()

      if (customInstructions) {
        setInstructions(customInstructions.instructions)
      } else {
        // Use default instructions if no custom ones exist
        setInstructions(getDefaultInstructions(platform))
      }
    }

    fetchInstructions()
  }, [platform, taskId])

  function getDefaultInstructions(platform: string): string {
    switch (platform.toLowerCase()) {
      case "lovable":
        return `To collaborate on this task:
- Share your project's public URL
- Invite your dev to the workspace using their email
- Assign them to the relevant page/component`
      case "bolt":
        return `To start:
- Add developer as a contributor in your Bolt dashboard
- Share access to the environment ID + read-only token
- Attach design reference if available`
      case "cursor":
        return `- Share the Cursor file link with edit permissions
- Leave inline comments on target sections
- Developer can push commits via GitHub from Cursor`
      case "replit":
        return `- Create a new Repl for this task
- Use the Multiplayer feature to invite the developer
- Share any relevant documentation links`
      case "v0":
        return `- Share your v0 workspace link with the developer
- Grant appropriate permissions in the v0 dashboard
- Provide context on which components need attention`
      default:
        return `- Share relevant project access with the developer
- Provide any necessary credentials or tokens
- Include links to documentation or design files
- Specify any environment setup requirements`
    }
  }

  const handleSave = async () => {
    if (!taskId) return

    setIsSaving(true)
    try {
      // Check if instructions already exist
      const { data: existingInstructions } = await supabase
        .from("task_platform_instructions")
        .select("id")
        .eq("task_id", taskId)
        .single()

      if (existingInstructions) {
        // Update existing instructions
        await supabase.from("task_platform_instructions").update({ instructions }).eq("task_id", taskId)
      } else {
        // Insert new instructions
        await supabase.from("task_platform_instructions").insert({
          task_id: taskId,
          instructions,
          platform,
        })
      }
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving instructions:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(instructions)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">🛠 Developer Setup for {platform}</h3>
        {isVibeCoder && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Save
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </>
            )}
          </Button>
        )}
      </div>

      {isEditing ? (
        <Textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="min-h-[150px]"
          placeholder="Enter platform-specific setup instructions..."
        />
      ) : (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="whitespace-pre-line text-sm">{instructions}</div>
              <Button variant="ghost" size="icon" onClick={handleCopy} className="h-6 w-6">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Instructions"}
          </Button>
        </div>
      )}
    </div>
  )
}
