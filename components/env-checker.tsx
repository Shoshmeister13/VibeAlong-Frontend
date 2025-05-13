"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function EnvChecker() {
  const [missingVars, setMissingVars] = useState<string[]>([])

  useEffect(() => {
    // Only check for the public URL, not the sensitive anon key
    const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL"]

    const missing = requiredVars.filter((varName) => !process.env[varName])
    setMissingVars(missing)
  }, [])

  if (missingVars.length === 0) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Environment Variables</AlertTitle>
      <AlertDescription>
        <p>The following environment variables are required but missing:</p>
        <ul className="mt-2 list-disc pl-5">
          {missingVars.map((varName) => (
            <li key={varName}>{varName}</li>
          ))}
        </ul>
        <p className="mt-2">
          Please add these to your <code>.env.local</code> file or your Vercel project settings.
        </p>
      </AlertDescription>
    </Alert>
  )
}
