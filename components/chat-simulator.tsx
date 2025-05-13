"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Check, Code } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Database, Smartphone, Lock, Zap } from "lucide-react"

// Update the ChatSimulator component to include profile pictures, emojis, and a task selection interface

// First, let's update the Message interface to include profile pictures and emojis
interface Message {
  id: number
  sender: "vibe-coder" | "ai" | "dev" | "system"
  content: string
  delay: number
  duration?: number
  showButton?: boolean
  buttonText?: string
  onButtonClick?: () => void
  showProgress?: boolean
  showRating?: boolean
  avatar?: string
  emoji?: string
  showDevProfile?: boolean
  developer?: {
    name: string
    avatar: string
    gigsCompleted: number
    rating: number
    joinedDate: string
  }
}

// Add a TaskOption interface for the task selection
interface TaskOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  urgency: "low" | "medium" | "high"
}

// Update the ChatSimulator component
export function ChatSimulator() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showTimer, setShowTimer] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(842) // 14:02 in seconds
  const [rating, setRating] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [restartKey, setRestartKey] = useState(0)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [showTaskSelection, setShowTaskSelection] = useState(true)

  // Define available tasks
  const tasks: TaskOption[] = [
    {
      id: "api",
      title: "API Response Fix",
      description: "Stripe API isn't returning the correct data format",
      icon: <Database className="h-5 w-5" />,
      urgency: "high",
    },
    {
      id: "responsive",
      title: "Responsive Design",
      description: "Landing page doesn't display correctly on mobile",
      icon: <Smartphone className="h-5 w-5" />,
      urgency: "medium",
    },
    {
      id: "auth",
      title: "Authentication Bug",
      description: "Users can't log in with correct credentials",
      icon: <Lock className="h-5 w-5" />,
      urgency: "high",
    },
    {
      id: "performance",
      title: "Performance Issue",
      description: "Dashboard is loading slowly with large datasets",
      icon: <Zap className="h-5 w-5" />,
      urgency: "medium",
    },
  ]

  // Define the conversation flows for each task
  const conversationFlows: Record<string, Message[]> = {
    api: [
      {
        id: 1,
        sender: "vibe-coder",
        content: "Need help fixing my API response. Stripe isn't returning the correct data. 😕",
        delay: 1000,
        avatar: "/placeholder.svg?height=40&width=40&text=VC",
        emoji: "🔧",
      },
      {
        id: 2,
        sender: "ai",
        content: "Looks like an API formatting issue. Estimated fix: 20 min. Cost: $15. 📊",
        delay: 2000,
        showButton: true,
        buttonText: "Hire a VibeAlong Dev",
        onButtonClick: () => {
          // Prevent duplicate clicks by checking if we're already past this index
          if (currentIndex <= 2) {
            setCurrentIndex(3)
          }
        },
        emoji: "🤖",
      },
      {
        id: 3,
        sender: "system",
        content: "Finding the right developer...",
        delay: 2000,
        duration: 3000,
        emoji: "⏳",
        showDevProfile: true,
        developer: {
          name: "John Davis",
          avatar: "/placeholder.svg?height=40&width=40&text=JD",
          gigsCompleted: 127,
          rating: 4.9,
          joinedDate: "March 2023",
        },
      },
      {
        id: 4,
        sender: "dev",
        content: "Hey! I see the issue. Working on a fix now. 👨‍💻",
        delay: 1000,
        showProgress: true,
        avatar: "/placeholder.svg?height=40&width=40&text=JD",
        emoji: "👋",
      },
      {
        id: 5,
        sender: "dev",
        content: "Bug fixed! The issue was incorrect headers. API now returns correct response. ✅",
        delay: 8000,
        showButton: true,
        buttonText: "Approve & Pay",
        onButtonClick: () => {
          setCurrentIndex(6)
        },
        avatar: "/placeholder.svg?height=40&width=40&text=JD",
        emoji: "🎉",
      },
      {
        id: 6,
        sender: "system",
        content: "Task completed! $15 paid to John.",
        delay: 2000,
        emoji: "💰",
      },
      {
        id: 7,
        sender: "vibe-coder",
        content: "Thanks, that was fast! 🙌",
        delay: 1500,
        showRating: true,
        avatar: "/placeholder.svg?height=40&width=40&text=VC",
        emoji: "😃",
      },
      {
        id: 8,
        sender: "system",
        content: "Session complete",
        delay: 2000,
        showButton: true,
        buttonText: "Back to Dashboard",
        onButtonClick: () => {
          // Restart the animation
          setIsComplete(true)
          setTimeout(() => {
            setVisibleMessages([])
            setCurrentIndex(0)
            setProgress(0)
            setShowTimer(false)
            setTimeRemaining(842)
            setRating(0)
            setIsComplete(false)
            setShowTaskSelection(true)
            setSelectedTask(null)
            setRestartKey((prev) => prev + 1)
          }, 2000)
        },
        emoji: "✨",
      },
    ],
    responsive: [
      {
        id: 1,
        sender: "vibe-coder",
        content: "My landing page doesn't look right on mobile. Can someone help fix the responsive design? 📱",
        delay: 1000,
        avatar: "/placeholder.svg?height=40&width=40&text=VC",
        emoji: "🔧",
      },
      {
        id: 2,
        sender: "ai",
        content: "This looks like a CSS media query issue. Estimated fix: 30 min. Cost: $22. 📏",
        delay: 2000,
        showButton: true,
        buttonText: "Hire a VibeAlong Dev",
        onButtonClick: () => {
          // Prevent duplicate clicks by checking if we're already past this index
          if (currentIndex <= 2) {
            setCurrentIndex(3)
          }
        },
        emoji: "🤖",
      },
      {
        id: 3,
        sender: "system",
        content: "Finding the right developer...",
        delay: 2000,
        duration: 3000,
        emoji: "⏳",
        showDevProfile: true,
        developer: {
          name: "Sarah Miller",
          avatar: "/placeholder.svg?height=40&width=40&text=SM",
          gigsCompleted: 84,
          rating: 4.8,
          joinedDate: "June 2023",
        },
      },
      {
        id: 4,
        sender: "dev",
        content: "Hi there! I'm a CSS specialist. Let me check your breakpoints and fix those layout issues. 👩‍💻",
        delay: 1000,
        showProgress: true,
        avatar: "/placeholder.svg?height=40&width=40&text=SM",
        emoji: "👋",
      },
      {
        id: 5,
        sender: "dev",
        content:
          "All fixed! I've updated your media queries and added some flexbox layouts. Your site now looks great on all devices. ✅",
        delay: 8000,
        showButton: true,
        buttonText: "Approve & Pay",
        onButtonClick: () => {
          setCurrentIndex(6)
        },
        avatar: "/placeholder.svg?height=40&width=40&text=SM",
        emoji: "🎉",
      },
      {
        id: 6,
        sender: "system",
        content: "Task completed! $22 paid to Sarah.",
        delay: 2000,
        emoji: "💰",
      },
      {
        id: 7,
        sender: "vibe-coder",
        content: "Wow, looks perfect now! Thank you so much! 🙌",
        delay: 1500,
        showRating: true,
        avatar: "/placeholder.svg?height=40&width=40&text=VC",
        emoji: "😃",
      },
      {
        id: 8,
        sender: "system",
        content: "Session complete",
        delay: 2000,
        showButton: true,
        buttonText: "Back to Dashboard",
        onButtonClick: () => {
          // Restart the animation
          setIsComplete(true)
          setTimeout(() => {
            setVisibleMessages([])
            setCurrentIndex(0)
            setProgress(0)
            setShowTimer(false)
            setTimeRemaining(842)
            setRating(0)
            setIsComplete(false)
            setShowTaskSelection(true)
            setSelectedTask(null)
            setRestartKey((prev) => prev + 1)
          }, 2000)
        },
        emoji: "✨",
      },
    ],
    auth: [
      {
        id: 1,
        sender: "vibe-coder",
        content: "Users can't log in even with correct credentials. Authentication system is broken! 🔒",
        delay: 1000,
        avatar: "/placeholder.svg?height=40&width=40&text=VC",
        emoji: "🔧",
      },
      {
        id: 2,
        sender: "ai",
        content: "This is a critical auth issue. Estimated fix: 45 min. Cost: $35. 🔐",
        delay: 2000,
        showButton: true,
        buttonText: "Hire a VibeAlong Dev",
        onButtonClick: () => {
          // Prevent duplicate clicks by checking if we're already past this index
          if (currentIndex <= 2) {
            setCurrentIndex(3)
          }
        },
        emoji: "🤖",
      },
      {
        id: 3,
        sender: "system",
        content: "Finding the right developer...",
        delay: 2000,
        duration: 3000,
        emoji: "⏳",
        showDevProfile: true,
        developer: {
          name: "Michael Johnson",
          avatar: "/placeholder.svg?height=40&width=40&text=MJ",
          gigsCompleted: 156,
          rating: 5.0,
          joinedDate: "January 2023",
        },
      },
      {
        id: 4,
        sender: "dev",
        content: "Hello! I'm a security specialist. I'll debug your auth flow and fix the issue ASAP. 🔐",
        delay: 1000,
        showProgress: true,
        avatar: "/placeholder.svg?height=40&width=40&text=MJ",
        emoji: "👋",
      },
      {
        id: 5,
        sender: "dev",
        content:
          "Fixed! The problem was in the JWT token validation. I've updated the auth middleware and tested all login flows. ✅",
        delay: 8000,
        showButton: true,
        buttonText: "Approve & Pay",
        onButtonClick: () => {
          setCurrentIndex(6)
        },
        avatar: "/placeholder.svg?height=40&width=40&text=MJ",
        emoji: "🎉",
      },
      {
        id: 6,
        sender: "system",
        content: "Task completed! $35 paid to Michael.",
        delay: 2000,
        emoji: "💰",
      },
      {
        id: 7,
        sender: "vibe-coder",
        content: "Excellent work! Users can log in now. Thank you! 🙌",
        delay: 1500,
        showRating: true,
        avatar: "/placeholder.svg?height=40&width=40&text=VC",
        emoji: "😃",
      },
      {
        id: 8,
        sender: "system",
        content: "Session complete",
        delay: 2000,
        showButton: true,
        buttonText: "Back to Dashboard",
        onButtonClick: () => {
          // Restart the animation
          setIsComplete(true)
          setTimeout(() => {
            setVisibleMessages([])
            setCurrentIndex(0)
            setProgress(0)
            setShowTimer(false)
            setTimeRemaining(842)
            setRating(0)
            setIsComplete(false)
            setShowTaskSelection(true)
            setSelectedTask(null)
            setRestartKey((prev) => prev + 1)
          }, 2000)
        },
        emoji: "✨",
      },
    ],
    performance: [
      {
        id: 1,
        sender: "vibe-coder",
        content: "Our dashboard is super slow with large datasets. Need help optimizing performance! ⚡",
        delay: 1000,
        avatar: "/placeholder.svg?height=40&width=40&text=VC",
        emoji: "🔧",
      },
      {
        id: 2,
        sender: "ai",
        content: "This looks like a data rendering optimization issue. Estimated fix: 1 hour. Cost: $45. 📊",
        delay: 2000,
        showButton: true,
        buttonText: "Hire a VibeAlong Dev",
        onButtonClick: () => {
          // Prevent duplicate clicks by checking if we're already past this index
          if (currentIndex <= 2) {
            setCurrentIndex(3)
          }
        },
        emoji: "🤖",
      },
      {
        id: 3,
        sender: "system",
        content: "Finding the right developer...",
        delay: 2000,
        duration: 3000,
        emoji: "⏳",
        showDevProfile: true,
        developer: {
          name: "Alex Kim",
          avatar: "/placeholder.svg?height=40&width=40&text=AK",
          gigsCompleted: 112,
          rating: 4.7,
          joinedDate: "April 2023",
        },
      },
      {
        id: 4,
        sender: "dev",
        content:
          "Hi! I specialize in performance optimization. I'll analyze your code and implement some improvements. 🚀",
        delay: 1000,
        showProgress: true,
        avatar: "/placeholder.svg?height=40&width=40&text=AK",
        emoji: "👋",
      },
      {
        id: 5,
        sender: "dev",
        content:
          "Optimization complete! I've implemented virtualized lists, memoization, and optimized your database queries. Dashboard is now 10x faster. ✅",
        delay: 8000,
        showButton: true,
        buttonText: "Approve & Pay",
        onButtonClick: () => {
          setCurrentIndex(6)
        },
        avatar: "/placeholder.svg?height=40&width=40&text=AK",
        emoji: "🎉",
      },
      {
        id: 6,
        sender: "system",
        content: "Task completed! $45 paid to Alex.",
        delay: 2000,
        emoji: "💰",
      },
      {
        id: 7,
        sender: "vibe-coder",
        content: "Amazing improvement! The dashboard is lightning fast now. Thank you! 🙌",
        delay: 1500,
        showRating: true,
        avatar: "/placeholder.svg?height=40&width=40&text=VC",
        emoji: "😃",
      },
      {
        id: 8,
        sender: "system",
        content: "Session complete",
        delay: 2000,
        showButton: true,
        buttonText: "Back to Dashboard",
        onButtonClick: () => {
          // Restart the animation
          setIsComplete(true)
          setTimeout(() => {
            setVisibleMessages([])
            setCurrentIndex(0)
            setProgress(0)
            setShowTimer(false)
            setTimeRemaining(842)
            setRating(0)
            setIsComplete(false)
            setShowTaskSelection(true)
            setSelectedTask(null)
            setRestartKey((prev) => prev + 1)
          }, 2000)
        },
        emoji: "✨",
      },
    ],
  }

  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    // Ensure all tasks are activated
    if (!conversationFlows[taskId]) {
      console.error(`Task ${taskId} not found in conversation flows`)
      return
    }

    setSelectedTask(taskId)
    setShowTaskSelection(false)
    // Reset the chat state
    setVisibleMessages([])
    setCurrentIndex(0)
    setProgress(0)
    setShowTimer(false)
    setTimeRemaining(842)
    setRating(0)

    // Force a re-render with a new key to ensure clean state
    setRestartKey((prev) => prev + 1)
  }

  // Get the current messages based on selected task
  const messages = selectedTask ? conversationFlows[selectedTask] : []

  // Handle the animation of messages appearing
  useEffect(() => {
    if (isComplete || !selectedTask) return

    const currentMessage = messages[currentIndex]
    if (!currentMessage) return

    // Check if this message is already in the visible messages to prevent duplicates
    const isDuplicate = visibleMessages.some((msg) => msg.id === currentMessage.id)
    if (isDuplicate) {
      // Skip to next message if this is a duplicate
      setCurrentIndex((prev) => prev + 1)
      return
    }

    const timer = setTimeout(() => {
      setVisibleMessages((prev) => [...prev, currentMessage])

      // If this message has a duration, set up another timer to move to the next message
      if (currentMessage.duration) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1)
        }, currentMessage.duration)
      } else if (!currentMessage.showButton) {
        // If there's no button, automatically move to the next message
        setCurrentIndex((prev) => prev + 1)
      }

      // If this message shows progress, start the timer
      if (currentMessage.showProgress) {
        setShowTimer(true)
        const interval = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
          setProgress((prev) => {
            const newProgress = prev + 0.2
            return newProgress > 100 ? 100 : newProgress
          })
        }, 100)

        return () => clearInterval(interval)
      }
    }, currentMessage.delay)

    return () => clearTimeout(timer)
  }, [currentIndex, messages, isComplete, selectedTask, visibleMessages])

  // Format the time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Get urgency badge
  const getUrgencyBadge = (urgency: "low" | "medium" | "high") => {
    switch (urgency) {
      case "high":
        return <Badge className="bg-red-500/10 text-red-500">High Priority</Badge>
      case "medium":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Medium Priority</Badge>
      case "low":
        return <Badge className="bg-green-500/10 text-green-500">Low Priority</Badge>
    }
  }

  return (
    <div
      key={restartKey}
      className="w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border"
    >
      <div>
        <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <h3 className="font-semibold">VibeAlong</h3>
          </div>

          <div className="text-center flex-1">
            <h2 className="text-sm font-semibold">
              Hire on-demand vetted devs for all-code tasks in your favorite IDE
            </h2>
            {!selectedTask && (
              <p className="text-xs text-primary-foreground/80">Select a task below to see how VibeAlong works</p>
            )}
          </div>

          {selectedTask && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowTaskSelection(true)
                setSelectedTask(null)
                setVisibleMessages([])
                setCurrentIndex(0)
              }}
              className="text-xs text-primary-foreground bg-primary/80 hover:bg-primary"
            >
              Choose Different Task
            </Button>
          )}
        </div>
      </div>

      {showTaskSelection ? (
        <div className="p-6 h-[500px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:shadow-md transition-all"
                onClick={() => handleTaskSelect(task.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">{task.icon}</div>
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    {getUrgencyBadge(task.urgency)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <Button
                  className="w-full mt-3"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTaskSelect(task.id)
                  }}
                >
                  Start Demo
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 h-[500px] overflow-y-auto flex flex-col space-y-4">
          {visibleMessages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={cn(
                "animate-in fade-in duration-300 flex flex-col",
                message.sender === "vibe-coder" ? "items-end" : "items-start",
              )}
            >
              {message.sender !== "system" && (
                <div className="flex items-center gap-2 mb-1">
                  {message.avatar && message.sender !== "vibe-coder" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar} alt={message.sender === "dev" ? "Developer" : "AI"} />
                      <AvatarFallback>{message.sender === "dev" ? "DEV" : "AI"}</AvatarFallback>
                    </Avatar>
                  )}
                  <Badge
                    variant={
                      message.sender === "vibe-coder" ? "default" : message.sender === "ai" ? "secondary" : "outline"
                    }
                  >
                    {message.sender === "vibe-coder"
                      ? "You (Vibe-Coder)"
                      : message.sender === "ai"
                        ? "VibeAlong AI"
                        : "Developer"}
                  </Badge>
                  {message.avatar && message.sender === "vibe-coder" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.avatar} alt="Vibe-Coder" />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}

              <div
                className={cn(
                  "rounded-lg p-3 max-w-[80%]",
                  message.sender === "vibe-coder"
                    ? "bg-primary text-primary-foreground"
                    : message.sender === "system"
                      ? "bg-muted text-muted-foreground text-center w-full"
                      : "bg-secondary text-secondary-foreground",
                )}
              >
                {message.emoji && <span className="mr-2">{message.emoji}</span>}
                {message.content}
              </div>

              {message.showDevProfile && message.developer && (
                <div className="w-full my-4 rounded-lg border p-4 bg-background animate-in fade-in duration-300">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={message.developer.avatar} alt={message.developer.name} />
                      <AvatarFallback>
                        {message.developer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{message.developer.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {message.developer.rating}
                        </span>
                        <span>•</span>
                        <span>{message.developer.gigsCompleted} gigs completed</span>
                        <span>•</span>
                        <span>Joined {message.developer.joinedDate}</span>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Available Now
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {message.showButton && (
                <Button onClick={message.onButtonClick} className="mt-2" size="sm">
                  {message.buttonText}
                </Button>
              )}

              {message.showProgress && showTimer && (
                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Task in progress</span>
                    <span>{formatTime(timeRemaining)} remaining</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {message.showRating && (
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Add some space at the bottom */}
          <div className="h-4"></div>
        </div>
      )}

      {isComplete && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center p-6 rounded-lg bg-background shadow-lg">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Animation Complete</h3>
            <p className="text-muted-foreground mb-4">The demo will restart shortly...</p>
          </div>
        </div>
      )}
    </div>
  )
}
