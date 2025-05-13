import { OnboardingContainer } from "@/components/onboarding/onboarding-container"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  // Check if user is already logged in and has completed profile
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    // Check if profile is already completed
    const { data: profile } = await supabase
      .from("profiles")
      .select("profile_completed")
      .eq("id", session.user.id)
      .single()

    if (profile?.profile_completed) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <OnboardingContainer />
    </div>
  )
}
