"use client"

import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useEffect, useState } from "react"

export function UserWelcome() {
  const { user, isLoading } = useAuth()
  const { supabase } = useSupabase()
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!user) return

      try {
        // Fetch profile picture based on role
        let profileData = null

        if (user.role === "developer") {
          const { data } = await supabase
            .from("developer_profiles")
            .select("profile_picture")
            .eq("user_id", user.id)
            .single()
          profileData = data
        } else if (user.role === "vibe_coder") {
          const { data } = await supabase
            .from("vibe_coder_profiles")
            .select("profile_picture")
            .eq("user_id", user.id)
            .single()
          profileData = data
        } else if (user.role === "agency") {
          const { data } = await supabase
            .from("agency_profiles")
            .select("profile_picture")
            .eq("user_id", user.id)
            .single()
          profileData = data
        }

        if (profileData?.profile_picture) {
          setProfilePicture(profileData.profile_picture)
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error)
      }
    }

    fetchProfilePicture()
  }, [user, supabase])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            <Skeleton className="h-8 w-[250px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[350px]" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="ml-4 space-y-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Welcome, {user.fullName}!</CardTitle>
        <CardDescription>
          Here's what's happening with your{" "}
          {user.role === "developer" ? "projects" : user.role === "vibe_coder" ? "tasks" : "agency"} today.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center">
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted">
          {profilePicture ? (
            <Image src={profilePicture || "/placeholder.svg"} alt={user.fullName} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-medium">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">{user.email}</p>
          <p className="text-sm text-muted-foreground">
            {user.role === "developer" ? "Developer" : user.role === "vibe_coder" ? "Vibe Coder" : "Agency"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
