"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Loader2, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { OnboardingData } from "../onboarding-wizard"
import Image from "next/image"

const formSchema = z.object({
  profilePicture: z.any().optional(),
  tagline: z
    .string()
    .min(5, {
      message: "Tagline must be at least 5 characters.",
    })
    .max(100, {
      message: "Tagline must not exceed 100 characters.",
    }),
  experienceLevel: z.string({
    required_error: "Please select your experience level.",
  }),
  skills: z.array(z.string()).min(1, {
    message: "Please select at least one skill.",
  }),
  vibeCodingTools: z.array(z.string()).min(1, {
    message: "Please select at least one vibe-coding tool.",
  }),
  githubUrl: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  availability: z.string({
    required_error: "Please select your availability.",
  }),
  hourlyRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid hourly rate greater than 0.",
  }),
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

const vibeCodingToolsOptions = [
  { label: "GitHub Copilot", value: "github_copilot" },
  { label: "ChatGPT", value: "chatgpt" },
  { label: "Claude", value: "claude" },
  { label: "Vercel v0", value: "vercel_v0" },
  { label: "Cursor", value: "cursor" },
  { label: "Cody", value: "cody" },
  { label: "Replit GhostWriter", value: "ghostwriter" },
  { label: "Amazon CodeWhisperer", value: "codewhisperer" },
  { label: "Tabnine", value: "tabnine" },
  { label: "Other AI Coding Tools", value: "other_ai_tools" },
]

interface DeveloperProfileFormProps {
  onboardingData: OnboardingData
  onUpdate: (data: Partial<OnboardingData>) => void
  onBack: () => void
  onComplete: () => void
}

export function DeveloperProfileForm({ onboardingData, onUpdate, onBack, onComplete }: DeveloperProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagline: "",
      experienceLevel: "",
      skills: [],
      vibeCodingTools: [],
      githubUrl: "",
      availability: "",
      hourlyRate: "",
    },
  })

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Profile picture must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    setProfileImageFile(file)
    const imageUrl = URL.createObjectURL(file)
    setProfileImageUrl(imageUrl)
  }

  async function uploadProfilePicture(userId: string): Promise<string | null> {
    if (!profileImageFile) return null

    const fileExt = profileImageFile.name.split(".").pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `profile-pictures/${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from("profile-pictures")
      .upload(filePath, profileImageFile, {
        upsert: true,
      })

    if (uploadError) {
      console.error("Error uploading profile picture:", uploadError)
      throw uploadError
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)

    return publicUrl
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!onboardingData.email || !onboardingData.password || !onboardingData.fullName) {
      toast({
        title: "Error",
        description: "Account information is missing. Please go back and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // IMPORTANT: This is where we create the Supabase auth user - at the end of step 3
      const { data, error } = await supabase.auth.signUp({
        email: onboardingData.email,
        password: onboardingData.password,
        options: {
          data: {
            full_name: onboardingData.fullName,
            role: "developer",
          },
          emailRedirectTo: "https://www.vibealong.dev/dashboard",
        },
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("User creation failed")
      }

      const userId = data.user.id

      // Upload profile picture if provided
      let profilePictureUrl = null
      if (profileImageFile) {
        profilePictureUrl = await uploadProfilePicture(userId)
      }

      // Create the profile record
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: onboardingData.fullName,
        email: onboardingData.email,
        role: "developer",
        profile_completed: true,
        avatar_url: profilePictureUrl,
      })

      if (profileError) {
        throw profileError
      }

      // Create the developer profile
      const { error: developerError } = await supabase.from("developer_profiles").insert({
        user_id: userId,
        full_name: onboardingData.fullName,
        tagline: values.tagline,
        experience_level: values.experienceLevel,
        skills: values.skills,
        vibe_coding_tools: values.vibeCodingTools,
        github_url: values.githubUrl || null,
        availability: values.availability,
        hourly_rate: Number(values.hourlyRate),
        profile_picture_url: profilePictureUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (developerError) {
        throw developerError
      }

      // Update onboarding data with profile information and user ID
      onUpdate({
        profileData: {
          ...values,
          profilePictureUrl,
        },
      })

      // Complete the onboarding process
      onComplete()
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to complete signup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Developer Profile</h2>
        <p className="text-muted-foreground mt-1">Tell us about your skills and experience</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <FormLabel>Profile Picture</FormLabel>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl || "/placeholder.svg"}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <Input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("profilePicture")?.click()}
                >
                  {profileImageUrl ? "Change Picture" : "Upload Picture"}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Full-stack developer with 5 years of experience in React and Node.js"
                    {...field}
                    className="resize-none"
                    rows={2}
                  />
                </FormControl>
                <FormDescription>A brief description of yourself (100 characters max)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid-Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior (5+ years)</SelectItem>
                    <SelectItem value="lead">Lead/Architect (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={skillsOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select skills..."
                  />
                </FormControl>
                <FormDescription>Select all the technologies you're proficient in</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vibeCodingTools"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vibe-Coding Tools Used</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={vibeCodingToolsOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select tools..."
                  />
                </FormControl>
                <FormDescription>Select all the AI coding tools you use</FormDescription>
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
                  <Input placeholder="https://github.com/yourusername" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full-Time (40+ hrs/week)</SelectItem>
                    <SelectItem value="part-time">Part-Time (20-30 hrs/week)</SelectItem>
                    <SelectItem value="freelance">Freelance (Flexible hours)</SelectItem>
                    <SelectItem value="occasional">Occasional (5-15 hrs/week)</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>How much time can you dedicate to VibeAlong projects?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate (USD)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="50" {...field} />
                </FormControl>
                <FormDescription>Your preferred hourly rate for development work</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-between">
            <Button variant="outline" onClick={onBack} type="button">
              Back
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Signup...
                </>
              ) : (
                "Complete Signup"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
