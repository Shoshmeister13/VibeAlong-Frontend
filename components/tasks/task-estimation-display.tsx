import { InfoIcon, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TaskEstimationDisplayProps {
  price: number | string
  hours: number | string
  className?: string
  size?: "sm" | "md" | "lg"
  position?: "default" | "above-date"
}

export function TaskEstimationDisplay({
  price,
  hours,
  className = "",
  size = "md",
  position = "default",
}: TaskEstimationDisplayProps) {
  // Format price if it's a number
  const formattedPrice = typeof price === "number" ? price.toLocaleString() : price

  // Size variants
  const sizeClasses = {
    sm: {
      container: "p-2",
      title: "text-xs",
      price: "text-lg font-bold",
      hours: "text-xs",
    },
    md: {
      container: "p-3",
      title: "text-sm",
      price: "text-2xl font-bold",
      hours: "text-sm",
    },
    lg: {
      container: "p-4",
      title: "text-base",
      price: "text-3xl font-bold",
      hours: "text-base",
    },
  }

  const classes = sizeClasses[size]

  // Apply position-specific classes
  const positionClasses = position === "above-date" ? "mb-2 mt-0" : ""

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${classes.container} ${positionClasses} ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-muted-foreground ${classes.title}`}>Task Estimation</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Estimated by our AI. The final price may be adjusted by up to 10% if additional work is required. If
                completed under the estimate, you'll only be charged for actual work done.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className={classes.price}>${formattedPrice}</div>
      <div className="flex items-center mt-1 text-muted-foreground">
        <Clock className="h-4 w-4 mr-1" />
        <span className={classes.hours}>
          {hours} {Number(hours) === 1 ? "hour" : "hours"}
        </span>
      </div>
    </div>
  )
}
