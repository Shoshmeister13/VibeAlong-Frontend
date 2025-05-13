"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Github,
  ArrowLeft,
  ArrowRight,
  Check,
  Bug,
  Rocket,
  Zap,
  Code,
  PlusCircle,
  LayoutTemplate,
  TestTube,
  Database,
  Cloud,
  Server,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Import the vibe platform logos
import { vibePlatforms } from "@/components/vibe-platform-logos"

// Step 1 schema - Basic information
const step1Schema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

// Step 2 schema - Vibe-coder specific information
const step2Schema = z.object({
  softwareName: z.string().min(2, {
    message: "Software name must be at least 2 characters.",
  }),
  softwareDescription: z.string().min(10, {
    message: "Please provide a brief description of your software.",
  }),
  vibePlatform: z.string(),
  database: z.string().optional(),
  hosting: z.string().optional(),
  developerNeeds: z.array(z.string()).min(1, {
    message: "Please select at least one developer need.",
  }),
  projectScope: z.enum(["small", "medium", "large"]),
  additionalInfo: z.string().optional(),
})

// Combined schema
const formSchema = step1Schema.merge(step2Schema)

interface MultiStepRegisterFormProps {
  defaultRole: "vibe-coder" | "developer" | null
}

export function MultiStepRegisterForm({ defaultRole }: MultiStepRegisterFormProps) {
  const router = useRouter()
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [currentStep, setCurrentStep] = React.useState<number>(1)

  // Define the form with the combined schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(currentStep === 1 ? step1Schema : formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      softwareName: "",
      softwareDescription: "",
      vibePlatform: "loveable",
      database: "supabase",
      hosting: "vercel",
      developerNeeds: [],
      projectScope: "medium",
      additionalInfo: "",
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // If we're on step 1, go to step 2
    if (currentStep === 1) {
      setCurrentStep(2)
      return
    }

    setIsLoading(true)

    try {
      // Create vibe coder info object
      const vibeCoderInfo = {
        softwareName: values.softwareName,
        softwareDescription: values.softwareDescription,
        vibePlatform: values.vibePlatform,
        database: values.database,
        hosting: values.hosting,
        developerNeeds: values.developerNeeds,
        projectScope: values.projectScope,
        additionalInfo: values.additionalInfo,
      }

      await signUp(values.email, values.password, values.name, "vibe-coder", vibeCoderInfo)

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignUp = async () => {
    toast({
      title: "Demo Mode",
      description: "Social signup is not available in demo mode. Please use email/password.",
    })
  }

  const handleGoogleSignUp = async () => {
    toast({
      title: "Demo Mode",
      description: "Social signup is not available in demo mode. Please use email/password.",
    })
  }

  // Go back to step 1
  const handleBack = () => {
    setCurrentStep(1)
  }

  // Developer needs options with icons
  const developerNeedOptions = [
    {
      id: "debugging",
      label: "Debugging",
      description: "Fix bugs & solve problems",
      icon: Bug,
    },
    {
      id: "production-readiness",
      label: "Production Readiness",
      description: "Prepare for deployment",
      icon: Rocket,
    },
    {
      id: "scalability",
      label: "Scalability",
      description: "Handle increased load",
      icon: Zap,
    },
    {
      id: "code-quality",
      label: "Code Quality",
      description: "Improve organization & patterns",
      icon: Code,
    },
    {
      id: "feature-implementation",
      label: "New Features",
      description: "Build additional functionality",
      icon: PlusCircle,
    },
    {
      id: "architecture",
      label: "Architecture",
      description: "Improve system design",
      icon: LayoutTemplate,
    },
    {
      id: "testing",
      label: "Testing",
      description: "Ensure reliability",
      icon: TestTube,
    },
  ]

  return (
    <div className="grid gap-4 max-h-[80vh] overflow-y-auto px-1">
      {/* Step indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground"}`}
        >
          {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
        </div>
        <div className="h-1 w-10 bg-border">
          <div className={`h-full ${currentStep > 1 ? "bg-primary" : "bg-border"}`} />
        </div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          2
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {currentStep === 1 && (
            <>
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">Create your Vibe-Coder account</h2>
                <p className="text-muted-foreground">Let's start with your basic information</p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">Tell us about your project</h2>
                <p className="text-muted-foreground">Help us match you with the right developers</p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="softwareName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome App" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="softwareDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project in a few sentences"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vibePlatform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vibe Coding Platform</FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {vibePlatforms.map((platform) => (
                          <div
                            key={platform.id}
                            className={cn(
                              "flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-all",
                              field.value === platform.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50",
                            )}
                            onClick={() => field.onChange(platform.id)}
                          >
                            {platform.logo}
                            <span className="text-xs font-medium mt-1">{platform.name}</span>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="database"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Database (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select database" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="supabase">
                              <div className="flex items-center">
                                <Database className="mr-2 h-4 w-4" />
                                <span>Supabase</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="firebase">
                              <div className="flex items-center">
                                <Database className="mr-2 h-4 w-4" />
                                <span>Firebase</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="mongodb">
                              <div className="flex items-center">
                                <Database className="mr-2 h-4 w-4" />
                                <span>MongoDB</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="mysql">
                              <div className="flex items-center">
                                <Database className="mr-2 h-4 w-4" />
                                <span>MySQL</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="none">
                              <div className="flex items-center">
                                <span>None/Not applicable</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hosting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hosting (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select hosting" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vercel">
                              <div className="flex items-center">
                                <Cloud className="mr-2 h-4 w-4" />
                                <span>Vercel</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="netlify">
                              <div className="flex items-center">
                                <Cloud className="mr-2 h-4 w-4" />
                                <span>Netlify</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="aws">
                              <div className="flex items-center">
                                <Server className="mr-2 h-4 w-4" />
                                <span>AWS</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="gcp">
                              <div className="flex items-center">
                                <Server className="mr-2 h-4 w-4" />
                                <span>Google Cloud</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="none">
                              <div className="flex items-center">
                                <span>None/Not applicable</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="projectScope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Scope</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        <div
                          className={cn(
                            "flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-all",
                            field.value === "small"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                          )}
                          onClick={() => field.onChange("small")}
                        >
                          <span className="text-xs sm:text-sm font-medium">Small</span>
                          <span className="text-xs text-muted-foreground">Hours to days</span>
                        </div>
                        <div
                          className={cn(
                            "flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-all",
                            field.value === "medium"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                          )}
                          onClick={() => field.onChange("medium")}
                        >
                          <span className="text-xs sm:text-sm font-medium">Medium</span>
                          <span className="text-xs text-muted-foreground">Days to weeks</span>
                        </div>
                        <div
                          className={cn(
                            "flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-all",
                            field.value === "large"
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                          )}
                          onClick={() => field.onChange("large")}
                        >
                          <span className="text-xs sm:text-sm font-medium">Large</span>
                          <span className="text-xs text-muted-foreground">Weeks to months</span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="developerNeeds"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>What are you looking for in a developer?</FormLabel>
                        <FormDescription>Select all that apply</FormDescription>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {developerNeedOptions.map((option) => {
                          const isSelected = form.watch("developerNeeds").includes(option.id)
                          const Icon = option.icon

                          return (
                            <div
                              key={option.id}
                              className={cn(
                                "flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-all text-center",
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                              )}
                              onClick={() => {
                                const currentNeeds = form.getValues("developerNeeds")
                                if (isSelected) {
                                  form.setValue(
                                    "developerNeeds",
                                    currentNeeds.filter((need) => need !== option.id),
                                    { shouldValidate: true },
                                  )
                                } else {
                                  form.setValue("developerNeeds", [...currentNeeds, option.id], {
                                    shouldValidate: true,
                                  })
                                }
                              }}
                            >
                              <div
                                className={cn(
                                  "p-1 rounded-full mb-1",
                                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-medium">{option.label}</span>
                              <span className="text-xs text-muted-foreground hidden sm:block">
                                {option.description}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any other details that would help developers understand your needs"
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>

      {currentStep === 1 && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleGithubSignUp} disabled={isLoading}>
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" onClick={handleGoogleSignUp} disabled={isLoading}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
