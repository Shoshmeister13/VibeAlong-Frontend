"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, AlertTriangle, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuizScreeningCard() {
  const router = useRouter()
  const [quizStatus, setQuizStatus] = useState<{
    completed: boolean
    passed: boolean
    score?: number
    completedAt?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if quiz has been completed from localStorage
    const quizPassed = localStorage.getItem("devQuizPassed")
    const quizScore = localStorage.getItem("devQuizScore")
    const quizCompletedAt = localStorage.getItem("devQuizCompletedAt")

    if (quizPassed !== null) {
      setQuizStatus({
        completed: true,
        passed: quizPassed === "true",
        score: quizScore ? Number.parseInt(quizScore) : undefined,
        completedAt: quizCompletedAt || undefined,
      })
    } else {
      setQuizStatus({
        completed: false,
        passed: false,
      })
    }

    setLoading(false)
  }, [])

  const handleStartQuiz = () => {
    router.push("/developer-screening/quiz")
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <Card className="w-full mb-6 border-2 border-dashed border-gray-200">
        <CardContent className="p-6">
          <div className="h-24 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4 w-full">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              <div className="rounded-md bg-gray-200 h-12 w-24"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If quiz is passed
  if (quizStatus?.completed && quizStatus.passed) {
    return (
      <Card className="w-full mb-6 border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Developer Screening Completed
                  <Badge className="bg-green-500 hover:bg-green-600">Passed</Badge>
                </h3>
                <p className="text-muted-foreground">
                  You've successfully passed the screening quiz with a score of {quizStatus.score}/10.
                </p>
                <p className="text-sm text-muted-foreground mt-1">Completed on {formatDate(quizStatus.completedAt)}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleStartQuiz}>
              Review Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If quiz is failed
  if (quizStatus?.completed && !quizStatus.passed) {
    return (
      <Card className="w-full mb-6 border-l-4 border-l-amber-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-amber-100 p-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Developer Screening Incomplete
                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                    Not Passed
                  </Badge>
                </h3>
                <p className="text-muted-foreground">
                  You scored {quizStatus.score}/10 on the screening quiz. A perfect score is required to receive tasks.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Last attempt on {formatDate(quizStatus.completedAt)}
                </p>
              </div>
            </div>
            <Button onClick={handleStartQuiz}>Retake Quiz</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If quiz is not taken yet
  return (
    <Card className="w-full mb-6 border-2 border-dashed border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Developer Screening Required
        </CardTitle>
        <CardDescription>Complete the screening quiz to unlock task applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Estimated time: 5 minutes</span>
        </div>
        <Progress value={0} className="h-2" />
        <p className="mt-3 text-sm">
          Before you can apply for tasks, you need to complete a short screening quiz to verify your development
          knowledge. The quiz consists of 10 multiple-choice questions.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartQuiz} className="w-full">
          Start Screening Quiz
        </Button>
      </CardFooter>
    </Card>
  )
}
