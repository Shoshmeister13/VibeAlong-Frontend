import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Create an admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    // Find the user by email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers({
      filter: {
        email: email,
      },
    })

    if (userError) {
      console.error("Error finding user:", userError)
      return NextResponse.json({ error: "Error finding user" }, { status: 500 })
    }

    if (!userData || !userData.users || userData.users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userData.users[0].id

    // Update the user to confirm their email
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email_confirmed_at: new Date().toISOString(),
    })

    if (updateError) {
      console.error("Error confirming email:", updateError)
      return NextResponse.json({ error: "Error confirming email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Email confirmed successfully" })
  } catch (error: any) {
    console.error("Error in confirm-email route:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}
