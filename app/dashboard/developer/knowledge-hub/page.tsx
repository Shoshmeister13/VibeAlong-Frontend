"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Award,
  Trophy,
  CheckCircle,
  Clock,
  Star,
  BookOpen,
  Code,
  Database,
  Layout,
  Shield,
  Zap,
} from "lucide-react"

export default function KnowledgeHubPage() {
  const router = useRouter()
  const [devLevel, setDevLevel] = useState("none") // none, vetted, pro, gold, platinum
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([])
  const [tasksCompleted, setTasksCompleted] = useState(0)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    // Check if developer has completed the screening quiz
    const quizPassed = localStorage.getItem("devQuizPassed") === "true"
    const completedQuizIds: string[] = []

    if (quizPassed) {
      completedQuizIds.push("screening")
      setDevLevel("vetted")
    }

    // Simulate other data for demo purposes
    const mockTasksCompleted = Math.floor(Math.random() * 20)
    const mockAverageRating = 4 + Math.random()

    setTasksCompleted(mockTasksCompleted)
    setAverageRating(Number.parseFloat(mockAverageRating.toFixed(1)))
    setCompletedQuizzes(completedQuizIds)

    // Determine developer level based on completed quizzes, tasks, and ratings
    if (quizPassed) {
      if (mockTasksCompleted >= 15 && mockAverageRating >= 4.8 && completedQuizIds.length >= 3) {
        setDevLevel("platinum")
      } else if (mockTasksCompleted >= 10 && mockAverageRating >= 4.5 && completedQuizIds.length >= 2) {
        setDevLevel("gold")
      } else if (mockTasksCompleted >= 5 && mockAverageRating >= 4.0) {
        setDevLevel("pro")
      } else {
        setDevLevel("vetted")
      }
    }
  }, [])

  const getLevelProgress = () => {
    switch (devLevel) {
      case "none":
        return 0
      case "vetted":
        return 25
      case "pro":
        return 50
      case "gold":
        return 75
      case "platinum":
        return 100
      default:
        return 0
    }
  }

  const getLevelColor = () => {
    switch (devLevel) {
      case "none":
        return "bg-gray-200"
      case "vetted":
        return "bg-blue-500"
      case "pro":
        return "bg-purple-500"
      case "gold":
        return "bg-amber-500"
      case "platinum":
        return "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      default:
        return "bg-gray-200"
    }
  }

  const getLevelBadge = () => {
    switch (devLevel) {
      case "none":
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-300">
            Not Vetted
          </Badge>
        )
      case "vetted":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Vetted Expert</Badge>
      case "pro":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Pro Expert</Badge>
      case "gold":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Gold Expert</Badge>
      case "platinum":
        return (
          <Badge className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600">
            Platinum Expert
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const quizzes = [
    {
      id: "screening",
      title: "Developer Screening Quiz",
      description: "Verify your development knowledge to become a Vetted VibeAlong Expert",
      icon: <Shield className="h-5 w-5" />,
      level: "vetted",
      duration: "10 min",
      questions: 10,
      href: "/developer-screening/quiz",
      completed: completedQuizzes.includes("screening"),
      required: true,
    },
    {
      id: "frontend",
      title: "Frontend Mastery",
      description: "Advanced React patterns, state management, and performance optimization",
      icon: <Layout className="h-5 w-5" />,
      level: "pro",
      duration: "15 min",
      questions: 15,
      href: "/dashboard/developer/knowledge-hub/quizzes/frontend",
      completed: completedQuizzes.includes("frontend"),
      required: false,
    },
    {
      id: "backend",
      title: "Backend Architecture",
      description: "API design, database optimization, and server-side performance",
      icon: <Database className="h-5 w-5" />,
      level: "gold",
      duration: "20 min",
      questions: 20,
      href: "/dashboard/developer/knowledge-hub/quizzes/backend",
      completed: completedQuizzes.includes("backend"),
      required: false,
    },
    {
      id: "algorithms",
      title: "Algorithms & Data Structures",
      description: "Problem-solving, optimization techniques, and computational complexity",
      icon: <Code className="h-5 w-5" />,
      level: "platinum",
      duration: "30 min",
      questions: 25,
      href: "/dashboard/developer/knowledge-hub/quizzes/algorithms",
      completed: completedQuizzes.includes("algorithms"),
      required: false,
    },
    {
      id: "system-design",
      title: "System Design",
      description: "Scalable architecture, microservices, and distributed systems",
      icon: <Zap className="h-5 w-5" />,
      level: "platinum",
      duration: "25 min",
      questions: 15,
      href: "/dashboard/developer/knowledge-hub/quizzes/system-design",
      completed: completedQuizzes.includes("system-design"),
      required: false,
    },
  ]

  const handleStartQuiz = (quizId: string) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (quiz) {
      router.push(quiz.href)
    }
  }

  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Knowledge Hub</h1>
          <p className="text-muted-foreground">
            Enhance your skills and increase your developer level through quizzes and assessments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Your Level:</span>
          {getLevelBadge()}
        </div>
      </div>

      {/* Developer Level Progress */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Developer Level Progress</CardTitle>
          <CardDescription>Complete quizzes and tasks to advance your developer level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Current Level:{" "}
                  <span className="font-medium">{devLevel.charAt(0).toUpperCase() + devLevel.slice(1)}</span>
                </span>
                <span>{getLevelProgress()}% Complete</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getLevelColor()}`}
                  style={{ width: `${getLevelProgress()}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <div className="bg-blue-100 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {completedQuizzes.length} / {quizzes.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Quizzes Completed</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">{tasksCompleted}</div>
                  <div className="text-xs text-muted-foreground">Tasks Completed</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">{averageRating}</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div
                className={`p-4 rounded-lg border ${devLevel === "vetted" || devLevel === "pro" || devLevel === "gold" || devLevel === "platinum" ? "border-blue-200 bg-blue-50" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`p-2 rounded-full ${devLevel === "vetted" || devLevel === "pro" || devLevel === "gold" || devLevel === "platinum" ? "bg-blue-100" : "bg-gray-100"}`}
                  >
                    <Shield
                      className={`h-5 w-5 ${devLevel === "vetted" || devLevel === "pro" || devLevel === "gold" || devLevel === "platinum" ? "text-blue-600" : "text-gray-400"}`}
                    />
                  </div>
                  {(devLevel === "vetted" || devLevel === "pro" || devLevel === "gold" || devLevel === "platinum") && (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <h3
                  className={`font-medium ${devLevel === "vetted" || devLevel === "pro" || devLevel === "gold" || devLevel === "platinum" ? "text-blue-700" : "text-gray-500"}`}
                >
                  Vetted
                </h3>
                <p className="text-xs mt-1">Pass screening quiz</p>
              </div>

              <div
                className={`p-4 rounded-lg border ${devLevel === "pro" || devLevel === "gold" || devLevel === "platinum" ? "border-purple-200 bg-purple-50" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`p-2 rounded-full ${devLevel === "pro" || devLevel === "gold" || devLevel === "platinum" ? "bg-purple-100" : "bg-gray-100"}`}
                  >
                    <Award
                      className={`h-5 w-5 ${devLevel === "pro" || devLevel === "gold" || devLevel === "platinum" ? "text-purple-600" : "text-gray-400"}`}
                    />
                  </div>
                  {(devLevel === "pro" || devLevel === "gold" || devLevel === "platinum") && (
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <h3
                  className={`font-medium ${devLevel === "pro" || devLevel === "gold" || devLevel === "platinum" ? "text-purple-700" : "text-gray-500"}`}
                >
                  Pro
                </h3>
                <p className="text-xs mt-1">5+ tasks, 4.0+ rating</p>
              </div>

              <div
                className={`p-4 rounded-lg border ${devLevel === "gold" || devLevel === "platinum" ? "border-amber-200 bg-amber-50" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`p-2 rounded-full ${devLevel === "gold" || devLevel === "platinum" ? "bg-amber-100" : "bg-gray-100"}`}
                  >
                    <Trophy
                      className={`h-5 w-5 ${devLevel === "gold" || devLevel === "platinum" ? "text-amber-600" : "text-gray-400"}`}
                    />
                  </div>
                  {(devLevel === "gold" || devLevel === "platinum") && (
                    <CheckCircle className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <h3
                  className={`font-medium ${devLevel === "gold" || devLevel === "platinum" ? "text-amber-700" : "text-gray-500"}`}
                >
                  Gold
                </h3>
                <p className="text-xs mt-1">10+ tasks, 4.5+ rating</p>
              </div>

              <div
                className={`p-4 rounded-lg border ${devLevel === "platinum" ? "border-pink-200 bg-pink-50" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-full ${devLevel === "platinum" ? "bg-pink-100" : "bg-gray-100"}`}>
                    <GraduationCap
                      className={`h-5 w-5 ${devLevel === "platinum" ? "text-pink-600" : "text-gray-400"}`}
                    />
                  </div>
                  {devLevel === "platinum" && <CheckCircle className="h-5 w-5 text-pink-600" />}
                </div>
                <h3 className={`font-medium ${devLevel === "platinum" ? "text-pink-700" : "text-gray-500"}`}>
                  Platinum
                </h3>
                <p className="text-xs mt-1">15+ tasks, 4.8+ rating</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Quizzes */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="available">Available Quizzes</TabsTrigger>
          <TabsTrigger value="completed">Completed Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {quizzes.filter((quiz) => !quiz.completed).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">All Quizzes Completed!</h3>
                <p className="text-muted-foreground">
                  You've completed all available quizzes. Check back later for new assessments.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes
                .filter((quiz) => !quiz.completed)
                .map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">{quiz.icon}</div>
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        </div>
                        {quiz.required && (
                          <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                            Required
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questions} questions</span>
                        </div>
                        <div>
                          {quiz.level === "vetted" && <Badge className="bg-blue-500">Vetted</Badge>}
                          {quiz.level === "pro" && <Badge className="bg-purple-500">Pro</Badge>}
                          {quiz.level === "gold" && <Badge className="bg-amber-500">Gold</Badge>}
                          {quiz.level === "platinum" && (
                            <Badge className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                              Platinum
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => handleStartQuiz(quiz.id)} className="w-full">
                        Start Quiz
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedQuizzes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Completed Quizzes</h3>
                <p className="text-muted-foreground">
                  You haven't completed any quizzes yet. Start with the Developer Screening Quiz.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizzes
                .filter((quiz) => quiz.completed)
                .map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        </div>
                        <Badge className="bg-green-500">Completed</Badge>
                      </div>
                      <CardDescription>{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{quiz.questions} questions</span>
                        </div>
                        <div>
                          {quiz.level === "vetted" && <Badge className="bg-blue-500">Vetted</Badge>}
                          {quiz.level === "pro" && <Badge className="bg-purple-500">Pro</Badge>}
                          {quiz.level === "gold" && <Badge className="bg-amber-500">Gold</Badge>}
                          {quiz.level === "platinum" && (
                            <Badge className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                              Platinum
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
