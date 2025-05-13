"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"

interface ProfilePictureStepProps {
  onUpload: (file: File) => void
}

export function ProfilePictureStep({ onUpload }: ProfilePictureStepProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleContinue = () => {
    if (file) {
      onUpload(file)
    } else {
      // Allow continuing without a profile picture
      onUpload(new File([""], "empty.png", { type: "image/png" }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Upload a profile picture</h2>
        <p className="text-muted-foreground">Add a profile picture to personalize your account</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar className="h-32 w-32">
          {preview ? (
            <AvatarImage src={preview} alt="Profile preview" />
          ) : (
            <AvatarFallback className="text-4xl">{/* Display initials or placeholder */}👤</AvatarFallback>
          )}
        </Avatar>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            {preview ? "Change picture" : "Upload picture"}
          </Button>

          {preview && (
            <Button type="button" variant="outline" onClick={handleRemove}>
              <X className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  )
}
