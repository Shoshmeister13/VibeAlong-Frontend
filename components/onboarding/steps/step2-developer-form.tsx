"use client"

import type React from "react"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import type { OnboardingData } from "../onboarding-wizard"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const formSchema = z.object({
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

const skillOptions = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "Next.js", value: "nextjs" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Django", value: "django" },
  { label: "Ruby", value: "ruby" },
  { label: "Ruby on Rails", value: "rails" },
  { label: "PHP", value: "php" },
  { label: "Laravel", value: "laravel" },
  { label: "Vue.js", value: "vuejs" },
  { label: "Angular", value: "angular" },
  { label: "Java", value: "java" },
  { label: "Spring", value: "spring" },
  { label: "C#", value: "csharp" },
  { label: ".NET", value: "dotnet" },
  { label: "AWS", value: "aws" },
  { label: "Azure", value: "azure" },
  { label: "GCP", value: "gcp" },
  { label: "Docker", value: "docker" },
  { label: "Kubernetes", value: "kubernetes" },
  { label: "GraphQL", value: "graphql" },
  { label: "SQL", value: "sql" },
  { label: "MongoDB", value: "mongodb" },
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

interface Step2DeveloperFormProps {
  onboardingData: OnboardingData
  onNext: (data: Partial<OnboardingData>) => void
  onBack: () => void
  isSubmitting: boolean
}

export function Step2DeveloperForm({ onboardingData, onNext, onBack, isSubmitting }: Step2DeveloperFormProps) {
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Maximum size is 5MB.")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.")
        return
      }

      setProfilePicture(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveFile = () => {
    setProfilePicture(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!onboardingData.userId) {
      console.error("User ID is missing")
      return
    }

    try {
      // Upload profile picture if provided
      let profilePictureUrl = null
      if (profilePicture) {
        const fileExt = profilePicture.name.split(".").pop()
        const fileName = `${onboardingData.userId}-${Date.now()}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(fileName, profilePicture)

        if (uploadError) {
          console.error("Error uploading profile picture:", uploadError)
        } else {
          // Get the public URL
          const { data: urlData } = supabase.storage.from("profile-pictures").getPublicUrl(fileName)
          profilePictureUrl = urlData.publicUrl
        }
      }

      // Create developer profile
      const { error: developerError } = await supabase.from("developer_profiles").insert({
        user_id: onboardingData.userId,
        full_name: onboardingData.fullName,
        profile_picture: profilePictureUrl,
        tagline: values.tagline,
        experience_level: values.experienceLevel,
        skills: values.skills || [],
        vibe_coding_tools: values.vibeCodingTools || [],
        github_url: values.githubUrl || null,
        availability: values.availability,
        hourly_rate: Number(values.hourlyRate) || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (developerError) throw developerError

      // Move to next step
      onNext({
        profileData: {
          ...values,
          profilePictureUrl,
        },
        profilePicture: profilePicture || undefined,
      })
    } catch (error) {
      console.error("Error saving developer profile:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Developer Profile</h2>
        <p className="text-muted-foreground mt-1">Tell us about your skills and experience</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <FormLabel>Profile Picture</FormLabel>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border">
                  <Image src={previewUrl || "/placeholder.svg"} alt="Profile preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1">
                <input
                  type="file"
                  id="profilePicture"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  {previewUrl ? "Change Picture" : "Upload Picture"}
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
                  <Input placeholder="Full-stack developer specializing in React and Node.js" {...field} />
                </FormControl>
                <FormDescription>A brief description of yourself that will appear on your profile</FormDescription>
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
                    options={skillOptions}
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select skills..."
                  />
                </FormControl>
                <FormDescription>Select all the technologies you're proficient with</FormDescription>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
