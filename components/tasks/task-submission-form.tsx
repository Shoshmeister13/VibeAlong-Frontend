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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Clock, Zap, AlertCircle } from "lucide-react"
import { vibePlatforms } from "@/components/vibe-platform-logos"
import { MultiSelect } from "@/components/ui/multi-select"

const taskFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  platform: z.string({
    required_error: "Please select a vibe-coding platform.",
  }),
  projectUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  urgency: z.enum(["low", "medium", "high"], {
    required_error: "Please select an urgency level.",
  }),
  taskType: z.enum(["bug", "feature", "optimization", "security", "other"], {
    required_error: "Please select a task type.",
  }),
  requiredSkills: z.array(z.string()).min(1, {
    message: "Please select at least one required skill.",
  }),
  frameworks: z.array(z.string()).optional(),
  additionalInfo: z.string().optional(),
})

const bookingFormSchema = z.object({
  sessionLength: z.enum(["1", "3", "6", "9"], {
    required_error: "Please select a session length.",
  }),
  preferredDate: z.string().min(1, {
    message: "Please select a preferred date.",
  }),
  preferredTime: z.string().min(1, {
    message: "Please select a preferred time.",
  }),
  taskDescription: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  platform: z.string({
    required_error: "Please select a vibe-coding platform.",
  }),
  projectUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
  requiredSkills: z.array(z.string()).min(1, {
    message: "Please select at least one required skill.",
  }),
  frameworks: z.array(z.string()).optional(),
})

const skillsOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Django", value: "django" },
  { label: "Ruby on Rails", value: "rails" },
  { label: "Vue.js", value: "vuejs" },
  { label: "Angular", value: "angular" },
  { label: "PHP", value: "php" },
  { label: "Laravel", value: "laravel" },
  { label: "Java", value: "java" },
  { label: "Spring", value: "spring" },
  { label: "C#", value: "csharp" },
  { label: ".NET", value: "dotnet" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "AWS", value: "aws" },
  { label: "Azure", value: "azure" },
  { label: "GCP", value: "gcp" },
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "GraphQL", value: "graphql" },
  { label: "SQL", value: "sql" },
  { label: "MongoDB", value: "mongodb" },
  { label: "Redis", value: "redis" },
  { label: "Firebase", value: "firebase" },
  { label: "Supabase", value: "supabase" },
]

const frameworkOptions = [
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "Vue.js", value: "vuejs" },
  { label: "Angular", value: "angular" },
  { label: "Svelte", value: "svelte" },
  { label: "Express", value: "express" },
  { label: "NestJS", value: "nestjs" },
  { label: "Django", value: "django" },
  { label: "Flask", value: "flask" },
  { label: "Ruby on Rails", value: "rails" },
  { label: "Laravel", value: "laravel" },
  { label: "Spring Boot", value: "spring-boot" },
  { label: "ASP.NET Core", value: "aspnet-core" },
  { label: "Flutter", value: "flutter" },
  { label: "React Native", value: "react-native" },
]

export function TaskSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [taskEstimation, setTaskEstimation] = React.useState<any>(null)
  const [submissionType, setSubmissionType] = React.useState<"instant" | "booking">("instant")

  // Instant task form
  const taskForm = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      platform: "",
      projectUrl: "",
      urgency: "medium",
      taskType: "bug",
      requiredSkills: [],
      frameworks: [],
      additionalInfo: "",
    },
  })

  // Booking form
  const bookingForm = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      sessionLength: "3",
      preferredDate: "",
      preferredTime: "",
      taskDescription: "",
      platform: "",
      projectUrl: "",
      requiredSkills: [],
      frameworks: [],
    },
  })

  // Skills options for booking form
  const skillOptions = [
    { id: "react", label: "React" },
    { id: "nextjs", label: "Next.js" },
    { id: "typescript", label: "TypeScript" },
    { id: "node", label: "Node.js" },
    { id: "database", label: "Database" },
    { id: "api", label: "API Integration" },
    { id: "ui", label: "UI/UX" },
    { id: "performance", label: "Performance Optimization" },
    { id: "security", label: "Security" },
  ]

  // Handle instant task submission
  async function onTaskSubmit(values: z.infer<typeof taskFormSchema>) {
    setIsSubmitting(true)

    try {
      // Simulate AI task analysis
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock AI estimation response
      const mockEstimation = {
        estimatedTime: Math.floor(Math.random() * 5) + 1,
        estimatedCost: (Math.floor(Math.random() * 5) + 1) * 25,
        complexity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
        suggestedSkills: ["React", "Next.js", "API Integration"].slice(0, Math.floor(Math.random() * 3) + 1),
        availableDevelopers: Math.floor(Math.random() * 5) + 1,
      }

      setTaskEstimation(mockEstimation)

      toast({
        title: "Task analyzed",
        description: "We've analyzed your task and provided an estimation.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle booking submission
  async function onBookingSubmit(values: z.infer<typeof bookingFormSchema>) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Booking request submitted",
        description: `Your ${values.sessionLength}-hour session has been requested.`,
      })

      // Reset form
      bookingForm.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle final task submission after estimation
  const handleFinalSubmission = async () => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Task submitted successfully",
        description: "Your task has been added to the queue and will be picked up by a developer soon.",
      })

      // Reset form and estimation
      taskForm.reset()
      setTaskEstimation(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Tabs defaultValue="instant" onValueChange={(value) => setSubmissionType(value as "instant" | "booking")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="instant">Instant Help</TabsTrigger>
        <TabsTrigger value="booking">Book a Session</TabsTrigger>
      </TabsList>

      <TabsContent value="instant">
        {!taskEstimation ? (
          <Card>
            <CardHeader>
              <CardTitle>Request Instant Developer Help</CardTitle>
              <CardDescription>
                Submit your task and get matched with an available developer immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...taskForm}>
                <form onSubmit={taskForm.handleSubmit(onTaskSubmit)} className="space-y-6">
                  <FormField
                    control={taskForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Title</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Fix login authentication bug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={taskForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what you need help with in detail..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={taskForm.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vibe-Coding Platform</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vibePlatforms.map((platform) => (
                                <SelectItem key={platform.id} value={platform.id}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5">{platform.logo}</div>
                                    <span>{platform.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={taskForm.control}
                      name="projectUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://your-project-url.com" {...field} />
                          </FormControl>
                          <FormDescription>Link to your project in the vibe-coding platform</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={taskForm.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Urgency Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low - Within 24 hours</SelectItem>
                              <SelectItem value="medium">Medium - Within 12 hours</SelectItem>
                              <SelectItem value="high">High - ASAP (Priority Queue)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={taskForm.control}
                      name="taskType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Task Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select task type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bug">Bug Fix</SelectItem>
                              <SelectItem value="feature">Feature Implementation</SelectItem>
                              <SelectItem value="optimization">Performance Optimization</SelectItem>
                              <SelectItem value="security">Security Enhancement</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={taskForm.control}
                      name="requiredSkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Skills</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={skillsOptions}
                              selected={field.value}
                              onChange={field.onChange}
                              placeholder="Select required skills..."
                            />
                          </FormControl>
                          <FormDescription>Select all skills that are required for this task</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={taskForm.control}
                      name="frameworks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frameworks</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={frameworkOptions}
                              selected={field.value || []}
                              onChange={field.onChange}
                              placeholder="Select frameworks..."
                            />
                          </FormControl>
                          <FormDescription>Select any specific frameworks needed for this task</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={taskForm.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any other details that would help the developer understand your task..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Task...
                      </>
                    ) : (
                      <>Analyze & Estimate Task</>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Task Analysis & Estimation</CardTitle>
              <CardDescription>Our AI has analyzed your task and provided the following estimation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Estimated Time</h3>
                    </div>
                    <p className="mt-2 text-2xl font-bold">{taskEstimation.estimatedTime} hours</p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Complexity</h3>
                    </div>
                    <p className="mt-2 text-2xl font-bold capitalize">{taskEstimation.complexity}</p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Available Devs</h3>
                    </div>
                    <p className="mt-2 text-2xl font-bold">{taskEstimation.availableDevelopers}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Estimated Cost</h3>
                  <p className="mt-2 text-3xl font-bold text-primary">${taskEstimation.estimatedCost}</p>
                  <p className="text-sm text-muted-foreground">
                    This will be deducted from your credits once the task is completed
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Suggested Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {taskEstimation.suggestedSkills.map((skill: string) => (
                      <div key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => setTaskEstimation(null)}>
                    Edit Task
                  </Button>
                  <Button className="flex-1" onClick={handleFinalSubmission} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Task"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="booking">
        <Card>
          <CardHeader>
            <CardTitle>Book a Developer Session</CardTitle>
            <CardDescription>Schedule a dedicated session with a developer for more complex tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...bookingForm}>
              <form onSubmit={bookingForm.handleSubmit(onBookingSubmit)} className="space-y-6">
                <FormField
                  control={bookingForm.control}
                  name="sessionLength"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Session Length</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="r1" />
                            <Label htmlFor="r1">1 Hour</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="r2" />
                            <Label htmlFor="r2">3 Hours</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6" id="r3" />
                            <Label htmlFor="r3">6 Hours</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="9" id="r4" />
                            <Label htmlFor="r4">9 Hours</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={bookingForm.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={bookingForm.control}
                  name="taskDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you need help with in detail..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={bookingForm.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vibe-Coding Platform</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vibePlatforms.map((platform) => (
                              <SelectItem key={platform.id} value={platform.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5">{platform.logo}</div>
                                  <span>{platform.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="projectUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-project-url.com" {...field} />
                        </FormControl>
                        <FormDescription>Link to your project in the vibe-coding platform</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={bookingForm.control}
                  name="requiredSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Skills</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={skillsOptions}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select required skills..."
                        />
                      </FormControl>
                      <FormDescription>Select all skills that are required for this task</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bookingForm.control}
                  name="frameworks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frameworks</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={frameworkOptions}
                          selected={field.value || []}
                          onChange={field.onChange}
                          placeholder="Select frameworks..."
                        />
                      </FormControl>
                      <FormDescription>Select any specific frameworks needed for this task</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Estimated Cost</h3>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    ${Number.parseInt(bookingForm.watch("sessionLength") || "0") * 50}
                  </p>
                  <p className="text-sm text-muted-foreground">Based on your selected session length at $50/hour</p>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Booking...
                    </>
                  ) : (
                    "Book Developer Session"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
