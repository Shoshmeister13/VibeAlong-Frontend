"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Star, Loader2 } from "lucide-react"

interface TaskRatingCategoryProps {
  title: string
  description: string
  value: number
  onChange: (value: number) => void
}

function TaskRatingCategory({ title, description, value, onChange }: TaskRatingCategoryProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={`h-5 w-5 ${
                  star <= (hoveredRating || value) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface TaskCompletionRatingProps {
  taskId: string
  taskTitle: string
  developerName: string
  developerAvatar?: string
  onSubmit?: (ratings: TaskRatingData) => Promise<void>
  onClose: () => void
}

interface TaskRatingData {
  taskId: string
  quality: number
  timeManagement: number
  availability: number
  review: string
}

export function TaskCompletionRating({
  taskId,
  taskTitle,
  developerName,
  developerAvatar,
  onSubmit,
  onClose,
}: TaskCompletionRatingProps) {
  const [qualityRating, setQualityRating] = useState(0)
  const [timeRating, setTimeRating] = useState(0)
  const [availabilityRating, setAvailabilityRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitRating = async () => {
    if (qualityRating === 0 || timeRating === 0 || availabilityRating === 0) {
      toast({
        title: "Ratings required",
        description: "Please provide ratings for all categories before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const ratingData: TaskRatingData = {
        taskId,
        quality: qualityRating,
        timeManagement: timeRating,
        availability: availabilityRating,
        review,
      }

      if (onSubmit) {
        await onSubmit(ratingData)
      } else {
        // Fallback if no onSubmit handler is provided
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Rate Your Experience</CardTitle>
        <CardDescription>
          How was your experience with {developerName} on "{taskTitle}"?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <TaskRatingCategory
            title="Quality of Work"
            description="How satisfied are you with the quality of the delivered work?"
            value={qualityRating}
            onChange={setQualityRating}
          />

          <TaskRatingCategory
            title="Time Management"
            description="How well did the developer manage time and meet deadlines?"
            value={timeRating}
            onChange={setTimeRating}
          />

          <TaskRatingCategory
            title="Availability & Communication"
            description="How responsive and available was the developer during the task?"
            value={availabilityRating}
            onChange={setAvailabilityRating}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="review" className="text-sm font-medium">
            Write a Review (Optional)
          </label>
          <Textarea
            id="review"
            placeholder="Share your experience working with this developer..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmitRating} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Rating"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
