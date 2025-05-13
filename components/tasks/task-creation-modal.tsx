"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SimplifiedTaskForm } from "@/components/tasks/simplified-task-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface TaskCreationModalProps {
  projectId: string
  projectName?: string
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  buttonText?: string
  fullWidth?: boolean
  className?: string
}

export function TaskCreationModal({
  projectId,
  projectName,
  buttonVariant = "default",
  buttonSize = "default",
  buttonText = "New Task",
  fullWidth = false,
  className = "",
}: TaskCreationModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => setIsOpen(true)}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
      >
        <Plus className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <SimplifiedTaskForm
            projectId={projectId}
            projectName={projectName}
            useAI={true}
            onSubmitSuccess={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
