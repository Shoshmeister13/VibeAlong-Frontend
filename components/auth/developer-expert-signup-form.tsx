"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, ArrowRight, Loader2, Upload, Github, Code2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"

const aiPlatforms = [
  { label: "Cursor", value: "cursor" },
  { label: "V0", value: "v0" },
  { label: "Replit", value: "replit" },
  { label: "Lovable", value: "lovable" },
  { label: "Base44", value: "base44" },
  { label: "Bubble", value: "bubble" },
  { label: "Bolt", value: "bolt" },
  { label: "Tempo", value: "tempo" },
  { label: "Other", value: "other" },
]

const frameworks = [
  { label: "React", value: "react", icon: "react" },
  { label: "Next.js", value: "nextjs", icon: "nextjs" },
  { label: "Angular", value: "angular", icon: "angular" },
  { label: "Vue", value: "vue", icon: "vue" },
  { label: "Node.js", value: "nodejs", icon: "nodejs" },
  { label: "Express", value: "express", icon: "express" },
  { label: "Django", value: "django", icon: "django" },
  { label: "Flask", value: "flask", icon: "flask" },
  { label: "Ruby on Rails", value: "rails", icon: "rails" },
  { label: "Laravel", value: "laravel", icon: "laravel" },
  { label: "Spring Boot", value: "springboot", icon: "springboot" },
  { label: "ASP.NET", value: "aspnet", icon: "aspnet" },
  { label: "TensorFlow", value: "tensorflow", icon: "tensorflow" },
  { label: "PyTorch", value: "pytorch", icon: "pytorch" },
]

// Define the form schema
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  githubUrl: z
    .string()
    .url({
      message: "Please enter a valid GitHub URL.",
    })
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .min(30, {
      message: "Bio must be at least 30 characters.",
    })
    .max(500, {
      message: "Bio must not exceed 500 characters.",
    }),
  yearsOfExperience: z.string().min(1, {
    message: "Please select your years of experience.",
  }),
  aiPlatforms: z.array(z.string()).min(1, {
    message: "Please select at least one AI platform.",
  }),
  frameworks: z.array(z.string()).min(1, {
    message: "Please select at least one framework.",
  }),
})

// Create separate type for the form data
type FormData = z.infer<typeof formSchema>

export function DeveloperExpertSignupForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 2
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [signupStatus, setSignupStatus] = useState("")

  // Initialize the form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      githubUrl: "https://",
      bio: "",
      yearsOfExperience: "",
      aiPlatforms: [],
      frameworks: [],
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Simple validation function for step 1
  const validateStep1 = () => {
    const values = form.getValues()
    const errors: Record<string, string> = {}

    if (!values.fullName || values.fullName.length < 2) {
      errors.fullName = "Full name must be at least 2 characters."
    }

    if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = "Please enter a valid email address."
    }

    if (!values.password || values.password.length < 8) {
      errors.password = "Password must be at least 8 characters."
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle next step button click
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2)
      }
    }
  }

  // Handle previous step button click
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Helper function to wait for a specified time
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Helper function to retry an operation with exponential backoff
  const retryOperation = async (operation: () => Promise<any>, maxRetries = 3, initialDelay = 1000): Promise<any> => {
    let retries = 0
    let delay = initialDelay

    while (retries < maxRetries) {
      try {
        return await operation()
      } catch (error) {
        retries++
        if (retries >= maxRetries) throw error
        console.log(`Retry ${retries}/${maxRetries} after ${delay}ms`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Exponential backoff
      }
    }
  }

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true)
      setSignupStatus("Creating your account...")
      console.log("Form submitted with values:", values)

      // 1. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            role: "developer_expert", // Ensure role is set correctly
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw authError
      }

      if (!authData?.user) {
        console.error("No user returned from auth signup")
        throw new Error("Failed to create user account")
      }

      const userId = authData.user.id
      console.log("Auth signup successful, user created:", userId)

      // Check if email confirmation is required
      if (authData.session === null) {
        // Email confirmation is required
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account before logging in.",
        })

        // Store profile data in localStorage to complete setup after email verification
        const profileData = {
          userId,
          fullName: values.fullName,
          email: values.email,
          bio: values.bio,
          githubUrl: values.githubUrl,
          yearsOfExperience: values.yearsOfExperience,
          aiPlatforms: values.aiPlatforms,
          frameworks: values.frameworks,
        }

        localStorage.setItem("pendingDevProfile", JSON.stringify(profileData))

        // Redirect to a confirmation page
        router.push("/email-confirmation")
        return
      }

      // If we get here, email confirmation is not required and we can proceed with profile creation
      setSignupStatus("Setting up your developer profile...")

      // 2. Upload profile picture if provided
      let profilePictureUrl = null
      if (profileImage) {
        const fileExt = profileImage.name.split(".").pop()
        const filePath = `profile-pictures/developers/${userId}.${fileExt}`

        console.log("Uploading profile picture to:", filePath)
        setSignupStatus("Uploading profile picture...")

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("profile-pictures")
          .upload(filePath, profileImage, {
            upsert: true,
            contentType: profileImage.type,
          })

        if (uploadError) {
          console.error("Upload error:", uploadError)
          throw uploadError
        }

        // Get the public URL
        const { data: urlData } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)
        profilePictureUrl = urlData.publicUrl
        console.log("Profile picture uploaded, URL:", profilePictureUrl)
      }

      // 3. Insert developer data into the devs table with retry logic
      console.log("Inserting developer data with user_id:", userId)
      setSignupStatus("Creating developer profile...")

      const { error: devsError } = await supabase.rpc("create_dev_profile", {
        p_user_id: userId,
        p_full_name: values.fullName,
        p_email: values.email,
        p_bio: values.bio,
        p_github_url: values.githubUrl || null,
        p_years_of_experience: Number.parseInt(values.yearsOfExperience),
        p_ai_platforms: values.aiPlatforms,
        p_frameworks: values.frameworks,
        p_profile_picture: profilePictureUrl,
      })

      if (devsError) {
        console.error("Devs table insert error:", devsError)
        throw devsError
      }

      console.log("Developer data inserted successfully")

      // 4. Insert into profiles table for consistency
      try {
        console.log("Inserting profile data with id:", userId)
        setSignupStatus("Finalizing your account...")

        const { error: profileError } = await supabase.rpc("create_user_profile", {
          p_id: userId,
          p_full_name: values.fullName,
          p_email: values.email,
          p_role: "developer_expert",
          p_profile_completed: true,
        })

        if (profileError) {
          console.warn("Profile insert error (continuing anyway):", profileError)
        } else {
          console.log("Profile data inserted successfully")
        }
      } catch (profileError) {
        console.warn("Error creating profile (continuing anyway):", profileError)
      }

      toast({
        title: "Account created!",
        description: "Your Developer Expert account has been created successfully.",
      })

      // 5. Redirect to the expert dashboard
      console.log("Redirecting to expert dashboard")
      router.push("/expert-dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setSignupStatus("")
    }
  }

  // Handle GitHub URL prefix
  const handleGithubUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Only add https:// if the field is not empty and doesn't already have it
    if (value && !value.startsWith("https://") && value !== "https://") {
      value = "https://" + value
    }

    form.setValue("githubUrl", value)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            {/* Step indicator */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  1
                </div>
                <div className="h-1 w-8 bg-muted">
                  <div className={`h-full bg-primary transition-all ${currentStep >= 2 ? "w-full" : "w-0"}`}></div>
                </div>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  2
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Account Information</h2>
                  <p className="text-sm text-muted-foreground">Let's start with your basic details</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" {...form.register("fullName")} className="w-full" />
                  {formErrors.fullName && <p className="text-sm text-destructive">{formErrors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...form.register("email")}
                    className="w-full"
                  />
                  {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="w-full"
                  />
                  {formErrors.password && <p className="text-sm text-destructive">{formErrors.password}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Developer Profile */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Developer Profile</h2>
                  <p className="text-sm text-muted-foreground">Tell us about your experience and skills</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-picture">
                    Profile Picture <span className="text-sm text-muted-foreground">(Optional)</span>
                  </Label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-full">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <Label
                        htmlFor="profile-picture"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground"
                      >
                        <Upload className="h-4 w-4" />
                        <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
                      </Label>
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Bio <span className="text-sm text-muted-foreground">(Minimum 30 characters)</span>
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your experience and skills..."
                    className={`min-h-[100px] w-full ${
                      form.formState.errors.bio ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                    {...form.register("bio", {
                      required: "Bio is required",
                      minLength: {
                        value: 30,
                        message: "Bio must be at least 30 characters",
                      },
                    })}
                  />
                  {form.formState.errors.bio && (
                    <p className="text-sm text-red-500">{form.formState.errors.bio.message as string}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Briefly describe your background and expertise.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-primary" />
                    <Label htmlFor="githubUrl" className="text-base font-medium">
                      GitHub Profile <span className="text-sm text-muted-foreground">(Optional)</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="githubUrl"
                      placeholder="github.com/yourusername"
                      {...form.register("githubUrl")}
                      className="w-full pl-8"
                      onChange={handleGithubUrlChange}
                    />
                    <Github className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share your GitHub profile to showcase your projects and contributions.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Controller
                    name="yearsOfExperience"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Less than 1 year</SelectItem>
                          <SelectItem value="1">1 year</SelectItem>
                          <SelectItem value="2">2 years</SelectItem>
                          <SelectItem value="3">3 years</SelectItem>
                          <SelectItem value="4">4 years</SelectItem>
                          <SelectItem value="5">5 years</SelectItem>
                          <SelectItem value="6">6 years</SelectItem>
                          <SelectItem value="7">7 years</SelectItem>
                          <SelectItem value="8">8 years</SelectItem>
                          <SelectItem value="9">9 years</SelectItem>
                          <SelectItem value="10">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.yearsOfExperience && (
                    <p className="text-sm text-red-500">{form.formState.errors.yearsOfExperience.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-primary" />
                    <Label htmlFor="aiPlatforms" className="text-base font-medium">
                      AI Platforms
                    </Label>
                  </div>
                  <Controller
                    name="aiPlatforms"
                    control={form.control}
                    render={({ field }) => (
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <MultiSelect
                          options={aiPlatforms}
                          placeholder="Search and select AI platforms..."
                          selected={field.value}
                          onChange={field.onChange}
                          className="w-full pl-8"
                          searchable
                        />
                      </div>
                    )}
                  />
                  {form.formState.errors.aiPlatforms && (
                    <p className="text-sm text-red-500">{form.formState.errors.aiPlatforms.message as string}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {aiPlatforms
                      .filter((p) => form.watch("aiPlatforms")?.includes(p.value))
                      .map((platform) => (
                        <div
                          key={platform.value}
                          className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          <span>{platform.label}</span>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Select all AI platforms you have experience with.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-primary" />
                    <Label htmlFor="frameworks" className="text-base font-medium">
                      Frameworks & Technologies
                    </Label>
                  </div>
                  <Controller
                    name="frameworks"
                    control={form.control}
                    render={({ field }) => (
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <MultiSelect
                          options={frameworks}
                          placeholder="Search and select frameworks..."
                          selected={field.value}
                          onChange={field.onChange}
                          className="w-full pl-8"
                          searchable
                        />
                      </div>
                    )}
                  />
                  {form.formState.errors.frameworks && (
                    <p className="text-sm text-red-500">{form.formState.errors.frameworks.message as string}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {frameworks
                      .filter((f) => form.watch("frameworks")?.includes(f.value))
                      .map((framework) => (
                        <div
                          key={framework.value}
                          className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          <span>{framework.label}</span>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select all frameworks and technologies you're proficient with.
                  </p>
                </div>
              </div>
            )}

            {/* Status message */}
            {signupStatus && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-md bg-primary/10 p-2 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{signupStatus}</span>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-6 flex justify-between">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={handlePrevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div></div> // Empty div to maintain flex spacing
              )}

              {currentStep < totalSteps ? (
                <Button type="button" onClick={handleNextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading} className="w-full bg-black text-white hover:bg-gray-800">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
