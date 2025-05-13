"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { CheckCircle, ArrowRight, Clock, DollarSign, FileText, Tag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSupabase } from "@/components/providers/supabase-provider"
import { format } from "date-fns"

export default function TaskSummaryPage() {
  const router = useRouter()
  const params = useParams()
  const { supabase } = useSupabase()
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTask() {
      if (!params.id) return

      try {
        // First try to get from localStorage for immediate display
        const cachedTask = localStorage.getItem("lastSubmittedTask")
        if (cachedTask) {
          setTask(JSON.parse(cachedTask))
          setLoading(false)
        }

        // Then fetch from Supabase to get the most up-to-date data
        const { data, error } = await supabase.from("tasks").select("*").eq("id", params.id).single()

        if (error) throw error

        if (data) {
          setTask({
            ...data,
            estimated_time: `${data.estimated_time_hours} hours`,
            estimated_price: `$${data.estimated_cost_usd}`,
          })
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching task:", error)
        setLoading(false)
      }
    }

    fetchTask()
  }, [params.id, supabase])

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Task Not Found</h2>
              <p className="text-muted-foreground mb-6">We couldn't find the task you're looking for.</p>
              <Button onClick={() => router.push("/dashboard/tasks")}>Return to Tasks</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Task Submitted Successfully!</h1>
        <p className="text-muted-foreground">Your task has been submitted and will be picked up by a developer soon.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Task Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={
                    task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "outline"
                  }
                  className={task.priority === "Medium" ? "bg-orange-500" : ""}
                >
                  {task.priority} Priority
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created {task.created_at ? format(new Date(task.created_at), "MMM d, yyyy") : "today"}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </div>
              <p className="text-sm">{task.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Tag className="h-4 w-4" />
                  <span>Category</span>
                </div>
                <p className="text-sm">{task.category || "General"}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {task.status || "Open"}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Estimated Time</h4>
                </div>
                <p className="text-2xl font-bold">{task.estimated_time}</p>
                <p className="text-xs text-muted-foreground mt-1">Based on task complexity and requirements</p>
              </div>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Estimated Price</h4>
                </div>
                <p className="text-2xl font-bold">${task.estimated_price}</p>
                <p className="text-xs text-muted-foreground mt-1">Generated by our AI pricing engine</p>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={() => router.push("/dashboard/tasks")} className="w-full">
                View All Tasks <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
