"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
import { submitTask } from "@/app/actions/task-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const taskFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  priority: z.enum(["Low", "Medium", "High", "Urgent"], {
    required_error: "Please select a priority level.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  stack: z.array(z.string()).min(1, {
    message: "Please select at least one technology.",
  }),
})

const categories = [
  { label: "Frontend Development", value: "frontend" },
  { label: "Backend Development", value: "backend" },
  { label: "Full Stack", value: "fullstack" },
  { label: "UI/UX Design", value: "design" },
  { label: "DevOps", value: "devops" },
  { label: "Mobile Development", value: "mobile" },
  { label: "Data Science", value: "data" },
  { label: "Machine Learning", value: "ml" },
  { label: "Blockchain", value: "blockchain" },
  { label: "Other", value: "other" },
]

const techOptions = [
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "Vue", value: "vue" },
  { label: "Angular", value: "angular" },
  { label: "Node.js", value: "nodejs" },
  { label: "Express", value: "express" },
  { label: "Django", value: "django" },
  { label: "Flask", value: "flask" },
  { label: "Ruby on Rails", value: "rails" },
  { label: "PHP", value: "php" },
  { label: "Laravel", value: "laravel" },
  { label: "Python", value: "python" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Java", value: "java" },
  { label: "C#", value: "csharp" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Flutter", value: "flutter" },
  { label: "React Native", value: "react-native" },
  { label: "AWS", value: "aws" },
  { label: "Azure", value: "azure" },
  { label: "Google Cloud", value: "gcp" },
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "GraphQL", value: "graphql" },
  { label: "MongoDB", value: "mongodb" },
  { label: "PostgreSQL", value: "postgresql" },
  { label: "MySQL", value: "mysql" },
  { label: "Redis", value: "redis" },
  { label: "Firebase", value: "firebase" },
  { label: "Supabase", value: "supabase" },
]

export function AITaskForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [analysisResult, setAnalysisResult] = React.useState<any>(null)
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      category: "",
      stack: [],
    },
  })

  async function onSubmit(values: z.infer<typeof taskFormSchema>) {
    setIsSubmitting(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const result = await submitTask(values)

      if (result.success) {
        toast({
          title: "Task submitted",
          description: "Your task has been submitted and analyzed by AI.",
        })
        setAnalysisResult(result.analysis)
      } else {
        setError(result.message)
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit a New Task</CardTitle>
        <CardDescription>
          Fill out the form below to submit a new task. Our AI will analyze your task and provide insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Implement user authentication" {...field} />
                  </FormControl>
                  <FormDescription>A clear, concise title for your task</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what you need in detail..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide as much detail as possible to help developers understand your requirements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>How urgent is this task?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>What type of task is this?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology Stack</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={techOptions}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select technologies"
                    />
                  </FormControl>
                  <FormDescription>Select all technologies relevant to this task</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                "Submit Task"
              )}
            </Button>
          </form>
        </Form>

        {analysisResult && (
          <div className="mt-8 space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Task Analysis Complete</AlertTitle>
              <AlertDescription>Our AI has analyzed your task and provided the following insights:</AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>AI Task Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Key Points</h4>
                  <ul className="mt-2 space-y-2">
                    {analysisResult.key_points.map((point: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Badge className="mr-2 mt-0.5">{index + 1}</Badge>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium">Suggested Steps</h4>
                  <Accordion type="single" collapsible className="mt-2">
                    {analysisResult.suggested_steps.map((step: any, index: number) => (
                      <AccordionItem key={index} value={`step-${index}`}>
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <Badge className="mr-2">{index + 1}</Badge>
                            <span>{step.step}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Estimated Time</h4>
                    <p className="mt-1 text-2xl font-bold">{analysisResult.estimated_time_hours} hours</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Estimated Cost</h4>
                    <p className="mt-1 text-2xl font-bold">${analysisResult.estimated_cost_usd}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setAnalysisResult(null)}>
                  Submit Another Task
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
