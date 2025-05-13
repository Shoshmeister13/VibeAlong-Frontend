import { OnboardingContainer } from "@/components/onboarding/onboarding-container"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { UserRole } from "@/components/onboarding/onboarding-container"

export default async function OnboardingPage({ params }: { params: { role: string } }) {
  // Validate role
  const validRoles = ["developer", "vibe-coder", "agency"]
  if (!validRoles.includes(params.role)) {
    redirect("/onboarding/developer") // Default to developer if invalid role
  }

  // Check if user is authenticated
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Check if email is confirmed
  if (!session.user.email_confirmed_at) {
    redirect("/auth/email-confirmation")
  }

  // Check if profile is already completed
  const { data: profile } = await supabase
    .from("profiles")
    .select("profile_completed")
    .eq("id", session.user.id)
    .single()

  if (profile?.profile_completed) {
    redirect("/dashboard")
  }

  return (
    <div className="container py-10">
      <OnboardingContainer role={params.role as UserRole} />
    </div>
  )
}
