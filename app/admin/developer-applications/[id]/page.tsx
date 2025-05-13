import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { AdminApproveRejectForm } from "@/components/admin/approve-reject-form"

export default async function AdminDeveloperApplicationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const applicationId = params.id
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/developer-applications/" + applicationId)
  }

  // Check if the user is an admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get the application details
  const { data: application, error } = await supabase
    .from("developer_applications")
    .select(`
      *,
      developer_quiz_results (
        *
      )
    `)
    .eq("id", applicationId)
    .single()

  if (error || !application) {
    redirect("/admin/developer-applications")
  }

  const quizResults = application.developer_quiz_results || []
  const latestQuizResult =
    quizResults.length > 0
      ? quizResults.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]
      : null

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/developer-applications">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Developer Application</h1>
            <p className="text-muted-foreground">Review and manage application details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>Submitted on {new Date(application.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="personal">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz Results</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                      <p className="text-base">{application.full_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                      <p className="text-base">{application.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Availability</h3>
                      <p className="text-base capitalize">{application.availability}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">GitHub URL</h3>
                      <p className="text-base">
                        {application.github_url ? (
                          <a
                            href={application.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {application.github_url}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>

                  {application.additional_info && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Additional Information</h3>
                      <p className="text-base whitespace-pre-line">{application.additional_info}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Experience Level</h3>
                    <p className="text-base">{application.experience_level}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Skills</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.isArray(application.skills) &&
                        application.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Vibe-Coding Tools</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.isArray(application.vibe_coding_tools) && application.vibe_coding_tools.length > 0 ? (
                        application.vibe_coding_tools.map((tool) => (
                          <Badge key={tool} variant="outline">
                            {tool}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">None selected</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quiz" className="space-y-4">
                  {latestQuizResult ? (
                    <>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">Quiz Result:</h3>
                        <Badge
                          variant={latestQuizResult.status === "passed" ? "success" : "destructive"}
                          className="capitalize"
                        >
                          {latestQuizResult.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Score</h3>
                          <p className="text-base">{latestQuizResult.score}/10</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Attempt</h3>
                          <p className="text-base">{latestQuizResult.quiz_attempt}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Completed On</h3>
                          <p className="text-base">{new Date(latestQuizResult.completed_at).toLocaleString()}</p>
                        </div>
                      </div>

                      {quizResults.length > 1 && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Previous Attempts</h3>
                          <div className="space-y-2">
                            {quizResults
                              .filter((_, index) => index > 0)
                              .map((result, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                                  <div>
                                    <span className="text-sm">Attempt {result.quiz_attempt}: </span>
                                    <span className="text-sm font-medium">{result.score}/10</span>
                                  </div>
                                  <Badge
                                    variant={result.status === "passed" ? "success" : "destructive"}
                                    className="capitalize"
                                  >
                                    {result.status}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      This developer has not taken the quiz yet.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  {application.status === "approved" ? (
                    <div className="flex flex-col items-center text-green-600">
                      <CheckCircle className="h-12 w-12 mb-2" />
                      <span className="font-medium">Approved</span>
                    </div>
                  ) : application.status === "rejected" ? (
                    <div className="flex flex-col items-center text-red-600">
                      <XCircle className="h-12 w-12 mb-2" />
                      <span className="font-medium">Rejected</span>
                    </div>
                  ) : (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <h3 className="font-medium mb-1">Current Status</h3>
                      <Badge className="capitalize">{application.status}</Badge>

                      <div className="mt-4">
                        <AdminApproveRejectForm applicationId={application.id} currentStatus={application.status} />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
