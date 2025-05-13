"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"

interface TaskRatingDialogProps {
  isOpen: boolean
  onClose: () => void
  task: any
}

export function TaskRatingDialog({ isOpen, onClose, task }: TaskRatingDialogProps) {
  const [qualityRating, setQualityRating] = useState(0)
  const [timeRating, setTimeRating] = useState(0)
  const [availabilityRating, setAvailabilityRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (qualityRating === 0 || timeRating === 0 || availabilityRating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide ratings for all three categories",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Submit rating to database
      const { error } = await supabase.from("task_ratings").insert({
        task_id: task.id,
        developer_id: task.assigned_developer?.id || task.developer_id,
        quality_rating: qualityRating,
        time_rating: timeRating,
        availability_rating: availabilityRating,
        review: review.trim(),
        submitted_by: task.vibe_coder_id || task.created_by_id,
        submitted_at: new Date().toISOString(),
      })

      if (error) throw error

      // Update task status to indicate it's been rated
      await supabase.from("tasks").update({ rating_submitted: true }).eq("id", task.id)

      toast({
        title: "Rating submitted",
        description: "Thank you for rating this developer!",
      })

      onClose()
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const RatingStars = ({
    rating,
    setRating,
    label,
    description,
  }: {
    rating: number
    setRating: (value: number) => void
    label: string
    description: string
  }) => {
    const [hover, setHover] = useState(0)

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-medium">{label}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none p-1"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={`h-5 w-5 ${
                    star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Developer Performance</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <img
                src={
                  task.assigned_developer?.avatar ||
                  `https://avatar.vercel.sh/${task.assigned_developer?.name || "dev"}?size=80`
                }
                alt={task.assigned_developer?.name || "Developer"}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{task.assigned_developer?.name || "Developer"}</p>
              <p className="text-xs text-muted-foreground">Task: {task.title}</p>
            </div>
          </div>

          <div className="space-y-4">
            <RatingStars
              rating={qualityRating}
              setRating={setQualityRating}
              label="Quality of Work"
              description="How satisfied are you with the quality of the delivered work?"
            />

            <RatingStars
              rating={timeRating}
              setRating={setTimeRating}
              label="Time Management"
              description="How well did the developer manage time and meet deadlines?"
            />

            <RatingStars
              rating={availabilityRating}
              setRating={setAvailabilityRating}
              label="Availability & Communication"
              description="How responsive and available was the developer during the task?"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="review" className="text-sm font-medium">
              Review (Optional)
            </label>
            <Textarea
              id="review"
              placeholder="Share your experience working with this developer..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
