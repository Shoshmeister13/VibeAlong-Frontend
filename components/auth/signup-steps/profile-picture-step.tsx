"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload, User } from "lucide-react"
import Image from "next/image"
import type { SignupData } from "../unified-signup-wizard"
import { createClient } from "@/lib/supabase/client"

interface ProfilePictureStepProps {
  initialData: SignupData
  onUpdate: (data: Partial<SignupData>) => void
  onNext: () => void
  onBack: () => void
}

export function ProfilePictureStep({ initialData, onUpdate, onNext, onBack }: ProfilePictureStepProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.profilePictureUrl || null)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setProfilePicture(file)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }

  const handleUpload = async () => {
    if (!profilePicture) {
      // Allow skipping profile picture
      onNext()
      return
    }

    setIsLoading(true)

    try {
      // Generate a unique filename
      const fileExt = profilePicture.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `profile-pictures/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, profilePicture)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)

      // Update signup data with profile picture URL
      onUpdate({ profilePictureUrl: urlData.publicUrl })

      // Move to next step
      onNext()
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Upload Profile Picture</h2>
        <p className="text-muted-foreground mt-1">Add a profile picture or skip this step</p>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted mb-6">
          {previewUrl ? (
            <Image src={previewUrl || "/placeholder.svg"} alt="Profile preview" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <label htmlFor="profile-picture" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="h-4 w-4" />
              {previewUrl ? "Change Picture" : "Upload Picture"}
            </div>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
          <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : previewUrl ? (
            "Continue"
          ) : (
            "Skip for now"
          )}
        </Button>
      </div>
    </div>
  )
}
