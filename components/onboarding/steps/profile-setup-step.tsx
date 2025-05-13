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
import { Loader2, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { OnboardingData } from "../onboarding-container"

const formSchema = z.object({
  tagline: z
    .string()
    .min(5, {
      message: "Tagline must be at least 5 characters.",
    })
    .max(100, {
      message: "Tagline must not exceed 100 characters.",
    }),
})

interface ProfileSetupStepProps {
  onboardingData: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  onNext: () => void
}

export function ProfileSetupStep({ onboardingData, updateData, onNext }: ProfileSetupStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagline: onboardingData.tagline || "",
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Upload profile picture if provided
      let profilePictureUrl = null
      if (profileImageFile) {
        const fileExt = profileImageFile.name.split(".").pop()
        const fileName = `${onboardingData.userId}-${Date.now()}.${fileExt}`
        const filePath = `profile-pictures/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("profile-pictures")
          .upload(filePath, profileImageFile, {
            upsert: true,
          })

        if (uploadError) {
          console.error("Error uploading profile picture:", uploadError)
          throw uploadError
        }

        // Get the public URL
        const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)
        profilePictureUrl = data.publicUrl
      }

      // Update onboarding data
      updateData({
        tagline: values.tagline,
        profilePicture: profileImageFile || undefined,
        profilePictureUrl: profilePictureUrl || undefined,
      })

      // Move to next step
      onNext()
    } catch (error: any) {
      console.error("Profile setup error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save profile information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Basic Profile Information</h2>
        <p className="text-muted-foreground mt-1">Let's set up your profile picture and tagline</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="space-y-4">
            <FormLabel>Profile Picture</FormLabel>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative h-24 w-24 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl || "/placeholder.svg"}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
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
                    placeholder={
                      onboardingData.role === "developer"
                        ? "Full-stack developer with 5 years of experience in React and Node.js"
                        : onboardingData.role === "vibe-coder"
                          ? "Product Manager building the next big thing"
                          : "Leading development agency specializing in web applications"
                    }
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

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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
