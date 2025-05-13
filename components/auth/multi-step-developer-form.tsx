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
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Github,
  Globe,
  Zap,
  FileCode,
  Database,
  Server,
  Layout,
  Smartphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
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

// Step 2 schema - Developer specific information
const step2Schema = z.object({
  yearsExperience: z.string(),
  primarySkills: z.array(z.string()).min(1, {
    message: "Please select at least one primary skill.",
  }),
  secondarySkills: z.array(z.string()).optional(),
  vibePlatformsExperience: z.array(z.string()).min(1, {
    message: "Please select at least one vibe platform you have experience with.",
  }),
  portfolioUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .or(z.literal("")),
  projectUrls: z.string(),
  contributionAreas: z.array(z.string()).min(1, {
    message: "Please select at least one area where you can contribute.",
  }),
  bio: z.string().min(50, {
    message: "Please provide a bio of at least 50 characters.",
  }),
})

// Combined schema
const formSchema = step1Schema.merge(step2Schema)

export function MultiStepDeveloperForm() {
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
      yearsExperience: "1-3",
      primarySkills: [],
      secondarySkills: [],
      vibePlatformsExperience: [],
      portfolioUrl: "",
      githubUrl: "",
      projectUrls: "",
      contributionAreas: [],
      bio: "",
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
      // Create developer info object
      const developerInfo = {
        yearsExperience: values.yearsExperience,
        primarySkills: values.primarySkills,
        secondarySkills: values.secondarySkills || [],
        vibePlatformsExperience: values.vibePlatformsExperience,
        portfolioUrl: values.portfolioUrl,
        githubUrl: values.githubUrl,
        projectUrls: values.projectUrls.split("\n").filter((url) => url.trim() !== ""),
        contributionAreas: values.contributionAreas,
        bio: values.bio,
      }

      await signUp(values.email, values.password, values.name, "developer", developerInfo)

      toast({
        title: "Account created",
        description: "Your developer account has been created successfully.",
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

  // Primary skills options
  const primarySkillOptions = [
    { id: "frontend", label: "Frontend Development", icon: Layout },
    { id: "backend", label: "Backend Development", icon: Server },
    { id: "fullstack", label: "Full-Stack Development", icon: Code },
    { id: "mobile", label: "Mobile Development", icon: Smartphone },
    { id: "database", label: "Database Design", icon: Database },
    { id: "devops", label: "DevOps", icon: FileCode },
    { id: "ai", label: "AI/ML Integration", icon: Zap },
    { id: "security", label: "Security", icon: Shield },
  ]

  // Secondary skills options
  const secondarySkillOptions = [
    { id: "react", label: "React" },
    { id: "nextjs", label: "Next.js" },
    { id: "vue", label: "Vue.js" },
    { id: "angular", label: "Angular" },
    { id: "node", label: "Node.js" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "csharp", label: "C#" },
    { id: "go", label: "Go" },
    { id: "rust", label: "Rust" },
    { id: "aws", label: "AWS" },
    { id: "azure", label: "Azure" },
    { id: "gcp", label: "Google Cloud" },
    { id: "docker", label: "Docker" },
    { id: "kubernetes", label: "Kubernetes" },
    { id: "mongodb", label: "MongoDB" },
    { id: "postgresql", label: "PostgreSQL" },
    { id: "mysql", label: "MySQL" },
    { id: "graphql", label: "GraphQL" },
    { id: "typescript", label: "TypeScript" },
  ]

  // Contribution areas options
  const contributionAreaOptions = [
    {
      id: "debugging",
      label: "Debugging & Problem Solving",
      description: "Help vibe-coders fix bugs and solve technical issues",
    },
    {
      id: "architecture",
      label: "Architecture & Design",
      description: "Improve system design and code organization",
    },
    {
      id: "performance",
      label: "Performance Optimization",
      description: "Make vibe-coded applications faster and more efficient",
    },
    {
      id: "security",
      label: "Security Hardening",
      description: "Identify and fix security vulnerabilities",
    },
    {
      id: "features",
      label: "Feature Implementation",
      description: "Build new features and functionality",
    },
    {
      id: "deployment",
      label: "Deployment & DevOps",
      description: "Help with CI/CD, cloud deployment, and infrastructure",
    },
    {
      id: "testing",
      label: "Testing & Quality Assurance",
      description: "Implement testing strategies and improve code quality",
    },
    {
      id: "mentoring",
      label: "Mentoring & Knowledge Transfer",
      description: "Teach vibe-coders best practices and improve their skills",
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
                <h2 className="text-xl font-bold">Create your Developer account</h2>
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
                <h2 className="text-xl font-bold">Tell us about your skills & experience</h2>
                <p className="text-muted-foreground">Help us match you with the right vibe-coders</p>
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select years of experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0-1">Less than 1 year</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primarySkills"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Primary Areas of Expertise</FormLabel>
                        <FormDescription>Select your main areas of expertise</FormDescription>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {primarySkillOptions.map((option) => {
                          const isSelected = form.watch("primarySkills").includes(option.id)
                          const Icon = option.icon

                          return (
                            <div
                              key={option.id}
                              className={cn(
                                "flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer transition-all text-center",
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                              )}
                              onClick={() => {
                                const currentSkills = form.getValues("primarySkills")
                                if (isSelected) {
                                  form.setValue(
                                    "primarySkills",
                                    currentSkills.filter((skill) => skill !== option.id),
                                    { shouldValidate: true },
                                  )
                                } else {
                                  form.setValue("primarySkills", [...currentSkills, option.id], {
                                    shouldValidate: true,
                                  })
                                }
                              }}
                            >
                              <div
                                className={cn(
                                  "p-2 rounded-full mb-2",
                                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted",
                                )}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <span className="text-xs font-medium">{option.label}</span>
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
                  name="secondarySkills"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Technical Skills</FormLabel>
                        <FormDescription>Select the technologies you're proficient with</FormDescription>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {secondarySkillOptions.map((option) => {
                          const isSelected = form.watch("secondarySkills")?.includes(option.id)

                          return (
                            <div
                              key={option.id}
                              className={cn(
                                "flex items-center space-x-2 border rounded-md p-2 cursor-pointer",
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                              )}
                              onClick={() => {
                                const currentSkills = form.getValues("secondarySkills") || []
                                if (isSelected) {
                                  form.setValue(
                                    "secondarySkills",
                                    currentSkills.filter((skill) => skill !== option.id),
                                  )
                                } else {
                                  form.setValue("secondarySkills", [...currentSkills, option.id])
                                }
                              }}
                            >
                              <div
                                className={cn(
                                  "h-4 w-4 rounded-sm border flex items-center justify-center",
                                  isSelected ? "bg-primary border-primary text-primary-foreground" : "border-primary",
                                )}
                              >
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                              <span className="text-xs">{option.label}</span>
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
                  name="vibePlatformsExperience"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Vibe Platforms Experience</FormLabel>
                        <FormDescription>Select the vibe coding platforms you have experience with</FormDescription>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {vibePlatforms.map((platform) => {
                          const isSelected = form.watch("vibePlatformsExperience").includes(platform.id)

                          return (
                            <div
                              key={platform.id}
                              className={cn(
                                "flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-all",
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                              )}
                              onClick={() => {
                                const currentPlatforms = form.getValues("vibePlatformsExperience")
                                if (isSelected) {
                                  form.setValue(
                                    "vibePlatformsExperience",
                                    currentPlatforms.filter((p) => p !== platform.id),
                                    { shouldValidate: true },
                                  )
                                } else {
                                  form.setValue("vibePlatformsExperience", [...currentPlatforms, platform.id], {
                                    shouldValidate: true,
                                  })
                                }
                              }}
                            >
                              {platform.logo}
                              <span className="text-xs font-medium mt-1">{platform.name}</span>
                            </div>
                          )
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="portfolioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                            <Globe className="ml-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="https://yourportfolio.com"
                              {...field}
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                            <Github className="ml-2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="https://github.com/yourusername"
                              {...field}
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="projectUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project URLs (Optional)</FormLabel>
                      <FormDescription>Enter one project URL per line</FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="https://project1.com&#10;https://project2.com&#10;https://project3.com"
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
                  name="contributionAreas"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>How You Can Help Vibe-Coders</FormLabel>
                        <FormDescription>Select the areas where you can contribute the most value</FormDescription>
                      </div>

                      <div className="space-y-3">
                        {contributionAreaOptions.map((option) => {
                          const isSelected = form.watch("contributionAreas").includes(option.id)

                          return (
                            <div
                              key={option.id}
                              className={cn(
                                "flex items-start space-x-3 border rounded-md p-3 cursor-pointer",
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                              )}
                              onClick={() => {
                                const currentAreas = form.getValues("contributionAreas")
                                if (isSelected) {
                                  form.setValue(
                                    "contributionAreas",
                                    currentAreas.filter((area) => area !== option.id),
                                    { shouldValidate: true },
                                  )
                                } else {
                                  form.setValue("contributionAreas", [...currentAreas, option.id], {
                                    shouldValidate: true,
                                  })
                                }
                              }}
                            >
                              <div
                                className={cn(
                                  "mt-0.5 h-5 w-5 rounded-sm border flex items-center justify-center",
                                  isSelected ? "bg-primary border-primary text-primary-foreground" : "border-primary",
                                )}
                              >
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{option.label}</div>
                                <div className="text-xs text-muted-foreground">{option.description}</div>
                              </div>
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
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormDescription>
                        Tell vibe-coders about your experience, expertise, and what makes you a great collaborator
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="I'm a full-stack developer with 5 years of experience specializing in React and Node.js. I've helped startups scale their applications and improve code quality..."
                          className="min-h-[120px]"
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

// Missing Shield icon component
function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}
