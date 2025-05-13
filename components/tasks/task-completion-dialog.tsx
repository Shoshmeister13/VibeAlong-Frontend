"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskCompletionRating } from "./task-completion-rating"
import { supabase } from "@/lib/supabase/client"

interface TaskCompletionDialogProps {
  isOpen: boolean
  onClose: () => void
  task: any
}

export function TaskCompletionDialog({ isOpen, onClose, task }: TaskCompletionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitRating = async (ratingData: any) => {
    setIsSubmitting(true)
    try {
      // Here you would submit the rating data to your database
      // Example with Supabase:
      const { error } = await supabase.from("task_ratings").insert({
        task_id: task.id,
        developer_id: task.developer_id,
        quality_rating: ratingData.quality,
        time_rating: ratingData.timeManagement,
        availability_rating: ratingData.availability,
        review: ratingData.review,
        submitted_by: task.vibe_coder_id,
        submitted_at: new Date().toISOString(),
      })

      if (error) throw error

      // You might want to update the task status here as well
      await supabase.from("tasks").update({ status: "Rated", updated_at: new Date().toISOString() }).eq("id", task.id)
    } catch (error) {
      console.error("Error submitting rating:", error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Completed Task</DialogTitle>
        </DialogHeader>
        <TaskCompletionRating
          taskId={task?.id || ""}
          taskTitle={task?.title || ""}
          developerName={task?.assigned_developer?.name || "the developer"}
          developerAvatar={task?.assigned_developer?.avatar}
          onSubmit={handleSubmitRating}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
