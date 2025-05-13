"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload, User } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

interface ProfilePictureUploadProps {
  userId: string
  onComplete: (url: string) => void
  onSkip: () => void
}

export function ProfilePictureUpload({ userId, onComplete, onSkip }: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a profile picture to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create the bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("profile-pictures")

      if (bucketError && bucketError.message.includes("does not exist")) {
        // Create the bucket if it doesn't exist
        await supabase.storage.createBucket("profile-pictures", {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024, // 5MB
          allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
        })
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
      })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)

      // Update user profile with avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", userId)

      if (updateError) throw updateError

      // Update user metadata with avatar URL
      await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl },
      })

      // Complete this step
      onComplete(data.publicUrl)
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Upload Profile Picture</h2>
        <p className="text-muted-foreground">
          Add a profile picture to make your profile more personal. You can skip this step if you prefer.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6 py-8">
        <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted">
          {previewUrl ? (
            <Image src={previewUrl || "/placeholder.svg"} alt="Profile preview" fill className="object-cover" />
          ) : (
            <User className="h-16 w-16 text-muted-foreground/50" />
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
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
              disabled={isUploading}
            />
          </label>
          <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 5MB.</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onSkip} disabled={isUploading}>
          Skip for now
        </Button>
        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  )
}
