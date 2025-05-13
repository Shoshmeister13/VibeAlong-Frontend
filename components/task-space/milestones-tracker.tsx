"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckSquare, Edit, Plus, Save, Trash2 } from "lucide-react"

interface Milestone {
  id: string
  text: string
  completed: boolean
}

interface MilestonesTrackerProps {
  taskId: string
  isVibeCoder: boolean
  onMilestonesUpdate: (allCompleted: boolean) => void
}

export function MilestonesTracker({ taskId, isVibeCoder, onMilestonesUpdate }: MilestonesTrackerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "1", text: "Set up project environment and dependencies", completed: false },
    { id: "2", text: "Implement core functionality based on requirements", completed: false },
    { id: "3", text: "Create responsive UI components", completed: false },
    { id: "4", text: "Write tests and fix any bugs", completed: false },
    { id: "5", text: "Submit final code with documentation", completed: false },
  ])
  const [isEditing, setIsEditing] = useState(false)
  const [newMilestone, setNewMilestone] = useState("")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress
    const completedCount = milestones.filter((m) => m.completed).length
    const newProgress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0
    setProgress(newProgress)

    // Check if all milestones are completed
    const allCompleted = milestones.length > 0 && milestones.every((m) => m.completed)
    onMilestonesUpdate(allCompleted)
  }, [milestones, onMilestonesUpdate])

  const toggleMilestone = (id: string) => {
    setMilestones(
      milestones.map((milestone) =>
        milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone,
      ),
    )
  }

  const addMilestone = () => {
    if (newMilestone.trim() === "") return

    const newId = (milestones.length + 1).toString()
    setMilestones([...milestones, { id: newId, text: newMilestone, completed: false }])
    setNewMilestone("")
  }

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((milestone) => milestone.id !== id))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <CheckSquare className="h-5 w-5 mr-2" />
            Milestones Tracker
          </CardTitle>
          {isVibeCoder && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-start gap-2">
                <Checkbox
                  id={`milestone-${milestone.id}`}
                  checked={milestone.completed}
                  onCheckedChange={() => toggleMilestone(milestone.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`milestone-${milestone.id}`}
                    className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {milestone.text}
                  </label>
                </div>
                {isEditing && (
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeMilestone(milestone.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add new milestone..."
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                className="text-sm"
              />
              <Button size="sm" onClick={addMilestone}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
