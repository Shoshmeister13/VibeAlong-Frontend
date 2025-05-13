import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react"
import Link from "next/link"

export default async function AdminDeveloperApplicationsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/developer-applications")
  }

  // Check if the user is an admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get all developer applications
  const { data: applications } = await supabase
    .from("developer_applications")
    .select(`
      id,
      full_name,
      email,
      experience_level,
      skills,
      availability,
      status,
      created_at,
      developer_quiz_results (
        score,
        status,
        completed_at,
        quiz_attempt
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Developer Applications</h1>
          <p className="text-muted-foreground">Review and manage developer applications</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Applications</h2>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex gap-1 items-center">
                <Clock className="h-3 w-3" />
                Pending: {applications?.filter((app) => app.status === "pending").length || 0}
              </Badge>
              <Badge variant="outline" className="flex gap-1 items-center">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Quiz Passed: {applications?.filter((app) => app.status === "quiz_passed").length || 0}
              </Badge>
              <Badge variant="outline" className="flex gap-1 items-center">
                <XCircle className="h-3 w-3 text-red-500" />
                Rejected: {applications?.filter((app) => app.status === "rejected").length || 0}
              </Badge>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Quiz Status</TableHead>
                  <TableHead>Application Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications && applications.length > 0 ? (
                  applications.map((application) => {
                    const quizResult = application.developer_quiz_results?.[0]
                    const applicationDate = new Date(application.created_at).toLocaleDateString()

                    return (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">{application.full_name}</TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>{application.experience_level}</TableCell>
                        <TableCell>
                          {quizResult ? (
                            <Badge
                              variant={quizResult.status === "passed" ? "success" : "destructive"}
                              className="capitalize"
                            >
                              {quizResult.status} ({quizResult.score}/10)
                            </Badge>
                          ) : (
                            <Badge variant="outline">Not Taken</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              application.status === "approved"
                                ? "success"
                                : application.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                            className="capitalize"
                          >
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{applicationDate}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/developer-applications/${application.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
