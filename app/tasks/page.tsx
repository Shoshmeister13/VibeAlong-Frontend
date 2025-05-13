"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Code, DollarSign, Star, Tag, Users } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { AuthModal } from "@/components/auth/auth-modal"
import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function TasksPage() {
  const { user, isLoading } = useAuth()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sample task data
  const tasks = [
    {
      id: "task-1",
      title: "Fix React component rendering issue",
      description:
        "The profile component is not rendering correctly on mobile devices. Need help debugging and fixing the responsive layout.",
      budget: "$50-100",
      timeEstimate: "2-4 hours",
      skills: ["React", "CSS", "Responsive Design"],
      difficulty: "Medium",
      postedBy: "TechStartup",
      postedAt: "2 hours ago",
    },
    {
      id: "task-2",
      title: "Implement authentication with NextAuth",
      description: "Need help setting up NextAuth.js with Google and GitHub providers in a Next.js application.",
      budget: "$100-200",
      timeEstimate: "4-8 hours",
      skills: ["Next.js", "Authentication", "OAuth"],
      difficulty: "Hard",
      postedBy: "WebAgency",
      postedAt: "5 hours ago",
    },
    {
      id: "task-3",
      title: "Optimize database queries",
      description: "Our PostgreSQL queries are running slow. Need help optimizing them for better performance.",
      budget: "$150-300",
      timeEstimate: "6-10 hours",
      skills: ["SQL", "PostgreSQL", "Database Optimization"],
      difficulty: "Hard",
      postedBy: "DataCompany",
      postedAt: "1 day ago",
    },
    {
      id: "task-4",
      title: "Create a responsive landing page",
      description: "Need a responsive landing page built with Tailwind CSS based on a Figma design.",
      budget: "$80-150",
      timeEstimate: "3-6 hours",
      skills: ["HTML", "Tailwind CSS", "Responsive Design"],
      difficulty: "Easy",
      postedBy: "MarketingAgency",
      postedAt: "2 days ago",
    },
    {
      id: "task-5",
      title: "Debug API integration issues",
      description:
        "Our app is having trouble connecting to a third-party API. Need help debugging and fixing the integration.",
      budget: "$70-120",
      timeEstimate: "2-5 hours",
      skills: ["API Integration", "Debugging", "JavaScript"],
      difficulty: "Medium",
      postedBy: "SoftwareCompany",
      postedAt: "3 days ago",
    },
  ]

  // Function to handle task application
  const handleApplyForTask = (taskId: string) => {
    if (user) {
      // User is logged in, handle direct application
      console.log(`User ${user.id} is applying for task ${taskId}`)
      // Here you would implement the actual application logic
      alert(`Application submitted for task: ${taskId}`)
    } else {
      // User is not logged in, set the selected task ID to show the auth modal
      setSelectedTaskId(taskId)
    }
  }

  // Function to handle successful authentication
  const handleAuthSuccess = () => {
    if (selectedTaskId) {
      // After successful login/signup, handle the task application
      console.log(`Now applying for task ${selectedTaskId} after authentication`)
      alert(`Application submitted for task: ${selectedTaskId}`)
      setSelectedTaskId(null)
    }
  }

  // If not mounted yet, return null to avoid hydration mismatch
  if (!mounted) return null

  // Render different layouts based on authentication status
  if (user && !isLoading) {
    // Logged-in user - Dashboard-style layout
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Link href="/" className="hidden items-center gap-2 md:flex">
            <img
              src="/logo-black.svg"
              alt="VibeAlong Logo"
              className="h-8 w-8"
              onError={(e) => {
                console.log("Error loading logo image")
                e.currentTarget.src = "/placeholder.svg?height=32&width=32"
              }}
            />
            <span className="text-lg font-bold">VibeAlong</span>
          </Link>
          <MobileNav />
          <div className="flex flex-1 items-center justify-end gap-4 md:justify-between">
            <div className="w-full flex-1 md:grow-0">
              <form>
                <div className="relative">
                  <input
                    className="h-9 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px] lg:w-[300px]"
                    placeholder="Search..."
                    type="search"
                  />
                </div>
              </form>
            </div>
            <UserNav />
          </div>
        </header>

        <main className="flex-1">
          <div className="container max-w-5xl mx-auto py-12 px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Developer Tasks Board</h1>
              <p className="text-lg text-muted-foreground">
                Browse available tasks and find work that matches your skills and interests
              </p>
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                  <TabsTrigger value="backend">Backend</TabsTrigger>
                  <TabsTrigger value="fullstack">Full Stack</TabsTrigger>
                </TabsList>
                <Button>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>

              <TabsContent value="all" className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{task.title}</CardTitle>
                          <CardDescription className="mt-1">{task.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2 whitespace-nowrap">
                          {task.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{task.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{task.timeEstimate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{task.postedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{task.postedAt}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {task.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={() => handleApplyForTask(task.id)}>Apply for Task</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="frontend" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Frontend Tasks Coming Soon</CardTitle>
                    <CardDescription>We're preparing more specialized frontend tasks. Check back soon!</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="backend" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Backend Tasks Coming Soon</CardTitle>
                    <CardDescription>We're preparing more specialized backend tasks. Check back soon!</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="fullstack" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Full Stack Tasks Coming Soon</CardTitle>
                    <CardDescription>
                      We're preparing more specialized full stack tasks. Check back soon!
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Your Developer Profile
                </CardTitle>
                <CardDescription>Complete your profile to get matched with more relevant tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
                    <div>
                      <h3 className="font-medium">Update your skills</h3>
                      <p className="text-sm text-muted-foreground">Add your expertise to get better task matches</p>
                    </div>
                  </div>
                  <Button>
                    <Link href="/dashboard/settings">Edit Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  } else {
    // Public mode - Homepage-style layout
    return (
      <>
        <SiteHeader />

        <main className="flex-1">
          <div className="container max-w-5xl mx-auto py-12 px-4">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Developer Tasks Board</h1>
              <p className="text-lg text-muted-foreground">
                Browse available tasks and find work that matches your skills and interests
              </p>
            </div>

            <Tabs defaultValue="all" className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                  <TabsTrigger value="backend">Backend</TabsTrigger>
                  <TabsTrigger value="fullstack">Full Stack</TabsTrigger>
                </TabsList>
                <AuthModal
                  defaultTab="register"
                  buttonVariant="default"
                  showLabel={true}
                  triggerClassName="bg-primary hover:bg-primary/90"
                />
              </div>

              <TabsContent value="all" className="space-y-4">
                {tasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{task.title}</CardTitle>
                          <CardDescription className="mt-1">{task.description}</CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2 whitespace-nowrap">
                          {task.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{task.budget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{task.timeEstimate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{task.postedBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{task.postedAt}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {task.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <AuthModal
                          defaultTab="login"
                          buttonVariant="default"
                          buttonLabel="Apply for Task"
                          triggerClassName="bg-primary hover:bg-primary/90"
                          onSuccess={() => handleAuthSuccess()}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="frontend" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Frontend Tasks Coming Soon</CardTitle>
                    <CardDescription>We're preparing more specialized frontend tasks. Check back soon!</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="backend" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Backend Tasks Coming Soon</CardTitle>
                    <CardDescription>We're preparing more specialized backend tasks. Check back soon!</CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>

              <TabsContent value="fullstack" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Full Stack Tasks Coming Soon</CardTitle>
                    <CardDescription>
                      We're preparing more specialized full stack tasks. Check back soon!
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Become a Verified Developer
                </CardTitle>
                <CardDescription>Get priority access to high-paying tasks and exclusive opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code className="h-10 w-10 text-primary p-2 bg-primary/10 rounded-full" />
                    <div>
                      <h3 className="font-medium">Complete verification</h3>
                      <p className="text-sm text-muted-foreground">Showcase your skills and experience</p>
                    </div>
                  </div>
                  <AuthModal
                    defaultTab="register"
                    buttonVariant="default"
                    showLabel={true}
                    triggerClassName="bg-primary hover:bg-primary/90"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <SiteFooter />
      </>
    )
  }
}
