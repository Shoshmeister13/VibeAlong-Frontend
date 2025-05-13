import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // First, try to sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // If the error is about email confirmation, we'll try to bypass it
      if (signInError.message.includes("Email not confirmed")) {
        // Get the user by email
        const { data: userData, error: userError } = await supabase.auth.admin.listUsers()

        if (userError) {
          return NextResponse.json({ error: userError.message }, { status: 500 })
        }

        const user = userData.users.find((u) => u.email === email)

        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Update the user to mark email as confirmed
        // Note: This requires admin privileges which might not be available
        // This is a simplified example

        return NextResponse.json({
          success: false,
          message: "Email confirmation required. Please contact support for assistance.",
          redirectTo: "/auth/confirm-email",
        })
      }

      return NextResponse.json({ error: signInError.message }, { status: 400 })
    }

    // If sign-in succeeded, return success
    return NextResponse.json({
      success: true,
      user: signInData.user,
      redirectTo: "/onboarding/role-selection",
    })
  } catch (error: any) {
    console.error("Error in manual confirm:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
