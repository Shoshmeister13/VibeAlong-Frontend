import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DeveloperSuccessPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/developer-onboarding/success")
  }

  // Get the user's application
  const { data: application } = await supabase
    .from("developer_applications")
    .select(`
      id, 
      full_name,
      status,
      developer_quiz_results (
        score,
        status
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // If no application or quiz not passed, redirect to developer page
  if (!application || application.status !== "quiz_passed") {
    redirect("/developer-onboarding")
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="border-green-200">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to VibeAlong, {application.full_name}!</CardTitle>
            <CardDescription>You've successfully passed the developer screening quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-muted p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Complete your developer profile with additional details</li>
                <li>Browse available projects and tasks</li>
                <li>Join our developer community on Discord</li>
                <li>Start collaborating on your first project!</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild variant="outline">
                <Link href="/dashboard/developer">Go to Developer Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/developer/profile">Complete Your Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
