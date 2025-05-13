"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { UserCheck, UserX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UserNav({ profile }: { profile: any }) {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isAvailable, setIsAvailable] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch additional user profile data if needed
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        // You can fetch additional profile data here if needed
        setUserProfile({
          ...user,
          displayName:
            user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User",
        })
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [user, supabase])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "U"

    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || ""
    if (!name) return "U"

    // Get initials from name parts
    const nameParts = name.split(/\s+/)
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }

    // If only one name part or email
    return name[0].toUpperCase()
  }

  // Get role emoji
  const getRoleEmoji = () => {
    if (!user?.role) return "👤"

    switch (user.role.toLowerCase()) {
      case "vibe-coder":
        return "🎨"
      case "developer":
        return "💻"
      case "agency":
        return "🏢"
      default:
        return "👤"
    }
  }

  // Format role name
  const formatRoleName = () => {
    if (!user?.role) return "User"

    // Convert snake_case or kebab-case to Title Case
    return user.role
      .replace(/[-_]/g, " ")
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }

  // Toggle availability status
  const toggleAvailability = (checked: boolean) => {
    setIsAvailable(checked)

    // Here you would update the user's availability status in the database
    // For example:
    // updateDeveloperAvailability(profile.id, checked)

    // Show feedback to the user
    toast({
      title: checked ? "You are now available for new tasks" : "You are now marked as unavailable",
      description: checked
        ? "You will be visible to vibe-coders for new task assignments"
        : "You won't receive new task invitations until you toggle back",
      duration: 3000,
    })
  }

  // Load initial availability status from profile or database
  useEffect(() => {
    if (profile?.role === "developer") {
      // In a real app, you would fetch this from your database
      // For now, we'll use a default value or check localStorage
      const savedStatus = localStorage.getItem("developerAvailability")
      if (savedStatus !== null) {
        setIsAvailable(savedStatus === "true")
      }
    }
  }, [profile])

  // Save availability status when it changes
  useEffect(() => {
    if (profile?.role === "developer") {
      localStorage.setItem("developerAvailability", String(isAvailable))
    }
  }, [isAvailable, profile])

  // Ensure component is always visible
  return (
    <div className="!block !visible">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {user?.user_metadata?.avatar_url ? (
                <AvatarImage
                  src={user.user_metadata.avatar_url || "/placeholder.svg"}
                  alt={user?.user_metadata?.name || user?.email || "User"}
                />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.user_metadata?.name || user?.email || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              {user?.role && (
                <div className="mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {user?.role === "vibe-coder"
                    ? "🎨 Vibe Coder"
                    : user?.role === "developer"
                      ? "💻 Developer"
                      : user?.role}
                </div>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* Add availability toggle for developers */}
          {profile?.role === "developer" && (
            <>
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Availability Status</div>
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <UserCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <UserX className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm">{isAvailable ? "Available for tasks" : "Not available"}</span>
                </div>
                <Switch
                  checked={isAvailable}
                  onCheckedChange={toggleAvailability}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem disabled={isLoggingOut} onClick={handleLogout}>
            {isLoggingOut ? "Logging out..." : "Log out"}
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
