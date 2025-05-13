import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AllScreensPage() {
  // Vibe Coder screens
  const vibeCoderScreens = [
    { name: "Home", path: "/" },
    { name: "Vibe Coder Signup", path: "/vibe-coder-signup" },
    { name: "Vibe Coder Dashboard", path: "/vibe-coder-dashboard" },
    { name: "Create Project", path: "/create-project" },
    { name: "Submit Tasks", path: "/submit-tasks" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Dashboard Projects", path: "/dashboard/projects" },
    { name: "New Project", path: "/dashboard/projects/new" },
    { name: "Dashboard Tasks", path: "/dashboard/tasks" },
    { name: "New Task", path: "/dashboard/tasks/new" },
    { name: "Dashboard Messages", path: "/dashboard/messages" },
    { name: "Dashboard Collaborations", path: "/dashboard/collaborations" },
    { name: "Dashboard Settings", path: "/dashboard/settings" },
    { name: "Dashboard Notifications", path: "/dashboard/notifications" },
    { name: "Dashboard Insights", path: "/dashboard/insights" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
    { name: "Blog", path: "/blog" },
    { name: "Terms", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Cookies", path: "/cookies" },
    { name: "AI Expert Consultation", path: "/consultation" },
  ]

  // Developer/Expert screens
  const developerScreens = [
    { name: "Developer Signup", path: "/signup-dev" },
    { name: "Developer Onboarding", path: "/developer-onboarding" },
    { name: "Developer Onboarding Success", path: "/developer-onboarding/success" },
    { name: "Expert Dashboard", path: "/expert-dashboard" },
    { name: "Developer Dashboard", path: "/dashboard/developer" },
    { name: "Developer Tasks", path: "/dashboard/developer/tasks" },
    { name: "Demo", path: "/demo" },
    { name: "For Developers", path: "/for-developers" },
    { name: "Vibe Coders", path: "/vibe-coders" },
    { name: "Vibers", path: "/vibers" },
    { name: "Project Summary", path: "/project-summary" },
    { name: "Showcase", path: "/showcase" },
    { name: "Tasks", path: "/tasks" },
  ]

  // Auth screens
  const authScreens = [
    { name: "Login", path: "/auth/login" },
    { name: "Signup", path: "/auth/signup" },
    { name: "Reset Password", path: "/auth/reset-password" },
    { name: "Email Verification", path: "/email-verification" },
    { name: "Email Confirmation", path: "/email-confirmation" },
    { name: "Auth Callback", path: "/auth/callback" },
    { name: "Direct Login", path: "/auth/direct-login" },
  ]

  // Admin screens
  const adminScreens = [{ name: "Admin Developer Applications", path: "/admin/developer-applications" }]

  // Onboarding screens
  const onboardingScreens = [
    { name: "Onboarding", path: "/onboarding" },
    { name: "Onboarding Developer", path: "/onboarding/developer" },
    { name: "Onboarding Vibe Coder", path: "/onboarding/vibe-coder" },
    { name: "Onboarding Agency", path: "/onboarding/agency" },
    { name: "Onboarding Role Selection", path: "/onboarding/role-selection" },
  ]

  // Task Space screens
  const taskSpaceScreens = [
    { name: "Task Space (Developer View)", path: "/task-space/developer" },
    { name: "Task Space (Vibe-Coder View)", path: "/task-space/vibe-coder" },
  ]

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">🧪 All Screens (Dev Preview)</h1>
        <p className="text-muted-foreground">Quick access to all frontend screens in the VibeAlong platform</p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 font-medium">🔔 Frontend Development Mode</p>
          <p className="text-sm text-yellow-700">
            Backend logic and authentication are disabled. All pages are accessible without login.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-950">
            <CardTitle className="flex items-center">
              <span className="text-blue-600 mr-2">🔹</span> Vibe Coder Screens
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vibeCoderScreens.map((screen) => (
                <Button
                  key={screen.path}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3 text-left"
                  asChild
                >
                  <Link href={screen.path}>{screen.name}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-amber-50 dark:bg-amber-950">
            <CardTitle className="flex items-center">
              <span className="text-amber-600 mr-2">🔸</span> Developer/Expert Screens
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {developerScreens.map((screen) => (
                <Button
                  key={screen.path}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3 text-left"
                  asChild
                >
                  <Link href={screen.path}>{screen.name}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Space Card */}
        <Card>
          <CardHeader className="bg-emerald-50 dark:bg-emerald-950">
            <CardTitle className="flex items-center">
              <span className="text-emerald-600 mr-2">🤝</span> Task Space Screens
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {taskSpaceScreens.map((screen) => (
                <Button
                  key={screen.path}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3 text-left"
                  asChild
                >
                  <Link href={screen.path}>{screen.name}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-950">
            <CardTitle className="flex items-center">
              <span className="text-green-600 mr-2">🔒</span> Auth Screens
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {authScreens.map((screen) => (
                <Button
                  key={screen.path}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3 text-left"
                  asChild
                >
                  <Link href={screen.path}>{screen.name}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-purple-50 dark:bg-purple-950">
            <CardTitle className="flex items-center">
              <span className="text-purple-600 mr-2">🔄</span> Onboarding Screens
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {onboardingScreens.map((screen) => (
                <Button
                  key={screen.path}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3 text-left"
                  asChild
                >
                  <Link href={screen.path}>{screen.name}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader className="bg-purple-50 dark:bg-purple-950">
              <CardTitle className="flex items-center">
                <span className="text-purple-600 mr-2">👑</span> Admin Screens
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {adminScreens.map((screen) => (
                  <Button
                    key={screen.path}
                    variant="outline"
                    className="justify-start h-auto py-2 px-3 text-left"
                    asChild
                  >
                    <Link href={screen.path}>{screen.name}</Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
