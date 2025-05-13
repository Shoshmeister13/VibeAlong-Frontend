"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizTimer } from "@/components/quiz/quiz-timer"
import { QuizQuestionCard } from "@/components/quiz/quiz-question"
import { developerQuizQuestions } from "@/data/quiz-questions"
import { Progress } from "@/components/ui/progress"
import { XCircle, ArrowLeft, Clock, Trophy, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Shuffle the array of questions
const shuffleArray = (array: any[]) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function DeveloperScreeningQuizPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [questions, setQuestions] = useState(shuffleArray(developerQuizQuestions).slice(0, 10))

  const QUIZ_TIME_SECONDS = 120 // 2 minutes
  const PASS_THRESHOLD = 10 // Perfect score required

  const handleStartQuiz = () => {
    setQuizStarted(true)
    toast({
      title: "Quiz Started",
      description: "You have 2 minutes to complete the quiz. Good luck!",
    })
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        handleQuizCompletion()
      }
    }, 1000)
  }

  const handleQuizCompletion = () => {
    setQuizCompleted(true)
    const passed = correctAnswers + (currentQuestionIndex === questions.length - 1 ? 1 : 0) >= PASS_THRESHOLD

    // Store the result in localStorage for the app to use
    localStorage.setItem("devQuizPassed", passed.toString())
    localStorage.setItem("devQuizScore", correctAnswers.toString())
    localStorage.setItem("devQuizCompletedAt", new Date().toISOString())

    // In a real app, you would save this to your database
    // saveQuizResult(userId, passed, correctAnswers);

    toast({
      title: passed ? "Quiz Passed! 🎉" : "Quiz Failed",
      description: passed
        ? "Congratulations! You can now apply for tasks."
        : "You need a perfect score to pass. Try again when you're ready.",
      variant: passed ? "default" : "destructive",
    })
  }

  const handleTimeUp = () => {
    setQuizCompleted(true)
    toast({
      title: "Time's Up!",
      description: "You ran out of time. Your current score has been recorded.",
      variant: "destructive",
    })

    // Store the result
    const passed = correctAnswers >= PASS_THRESHOLD
    localStorage.setItem("devQuizPassed", passed.toString())
    localStorage.setItem("devQuizScore", correctAnswers.toString())
    localStorage.setItem("devQuizCompletedAt", new Date().toISOString())
  }

  const handleReturnToDashboard = () => {
    router.push("/dashboard/developer")
  }

  const handleRetryQuiz = () => {
    // Shuffle questions again
    setQuestions(shuffleArray(developerQuizQuestions).slice(0, 10))
    setCurrentQuestionIndex(0)
    setCorrectAnswers(0)
    setQuizCompleted(false)
    setQuizStarted(true)
  }

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100

  // Determine if the user passed
  const passed = correctAnswers >= PASS_THRESHOLD

  if (!quizStarted) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Developer Screening Quiz</CardTitle>
            <CardDescription>Test your development knowledge to unlock task applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md space-y-2">
              <h3 className="font-medium">Quiz Instructions:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>This quiz contains 10 multiple-choice questions</li>
                <li>You have 2 minutes to complete all questions</li>
                <li>You need a perfect score (10/10) to pass</li>
                <li>Each question has only one correct answer</li>
                <li>You cannot go back to previous questions</li>
              </ul>
            </div>

            <div className="flex items-center justify-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-md border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Make sure you're ready before starting. The timer will begin immediately.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReturnToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
            <Button onClick={handleStartQuiz}>
              Start Quiz
              <Clock className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{passed ? "Quiz Passed! 🎉" : "Quiz Results"}</CardTitle>
            <CardDescription>
              {passed
                ? "Congratulations! You've successfully completed the screening quiz."
                : "You need a perfect score to pass the screening quiz."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`p-6 rounded-lg border ${passed ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"}`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                {passed ? (
                  <Trophy className="h-16 w-16 text-green-500 mb-4" />
                ) : (
                  <XCircle className="h-16 w-16 text-amber-500 mb-4" />
                )}
                <h3 className="text-xl font-bold mb-2">{passed ? "Perfect Score!" : "Almost There!"}</h3>
                <div className="text-5xl font-bold mb-4">
                  {correctAnswers}/{questions.length}
                </div>
                <p className="text-muted-foreground">
                  {passed
                    ? "You can now apply for tasks on the platform."
                    : "You need 10/10 to pass. Review the topics and try again."}
                </p>
              </div>
            </div>

            {!passed && (
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Suggested Review Topics:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>JavaScript fundamentals and ES6+ features</li>
                  <li>React hooks and component patterns</li>
                  <li>CSS layout techniques including Flexbox</li>
                  <li>HTTP protocols and REST APIs</li>
                  <li>Git version control workflows</li>
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReturnToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
            {!passed && (
              <Button onClick={handleRetryQuiz}>
                Try Again
                <Clock className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <QuizTimer totalSeconds={QUIZ_TIME_SECONDS} onTimeUp={handleTimeUp} />
        <div className="flex justify-between items-center text-sm">
          <span>
            Progress: {currentQuestionIndex + 1}/{questions.length}
          </span>
          <span>
            Score: {correctAnswers}/{currentQuestionIndex}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <QuizQuestionCard
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    </div>
  )
}
