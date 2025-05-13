import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Step 1: Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role,
        },
      },
    })

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    if (!signUpData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 400 })
    }

    // Step 2: Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: signUpData.user.id,
      email,
      full_name: name,
      role,
      profile_completed: false,
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
      // Continue anyway as user was created
    }

    // Step 3: Sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: signInData.user,
      redirectTo: "/onboarding/role-selection",
    })
  } catch (error) {
    console.error("Error in direct auth:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
