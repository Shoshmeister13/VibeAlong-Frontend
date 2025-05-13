import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; next?: string }
}) {
  const supabase = createClient()

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code)
    if (!error) {
      // Get the user session to determine role
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const role = session.user?.user_metadata?.role || "vibe-coder"

        // Redirect based on role
        if (role === "developer" || role === "developer_expert") {
          redirect("/expert-dashboard")
        } else {
          redirect("/vibe-coder-dashboard")
        }
      }
    }
  }

  // Default redirect if no code or session
  return redirect("/auth/login")
}
