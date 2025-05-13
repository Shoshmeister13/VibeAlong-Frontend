"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AgencyStep1Props {
  onComplete: (logoUrl: string) => void
}

export function AgencyStep1({ onComplete }: AgencyStep1Props) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
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
        description: "Please select a logo to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not found. Please sign in again.")
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `profile-pictures/${fileName}`

      const { error: uploadError } = await supabase.storage.from("profile-pictures").upload(filePath, file, {
        upsert: true,
      })

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from("profile-pictures").getPublicUrl(filePath)

      // Move to next step
      onComplete(data.publicUrl)
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload logo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSkip = () => {
    // Move to next step without a logo
    onComplete("")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Upload Agency Logo</h2>
        <p className="text-sm text-muted-foreground">
          Add your agency logo to make your profile more professional. You can skip this step if you prefer.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-40 w-40 overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted">
          {previewUrl ? (
            <img src={previewUrl || "/placeholder.svg"} alt="Logo preview" className="h-full w-full object-contain" />
          ) : (
            <Upload className="h-10 w-10 text-muted-foreground/50" />
          )}
        </div>

        <div className="space-y-2 w-full max-w-xs">
          <Label htmlFor="agency-logo" className="text-sm font-medium">
            Select Logo
          </Label>
          <Input id="agency-logo" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
          <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handleSkip}>
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
