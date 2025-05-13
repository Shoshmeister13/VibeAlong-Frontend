import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background py-4">
        <div className="container flex justify-center">
          <Link href="/">
            <Image src="/logo-black.png" alt="VibeAlong Logo" width={180} height={48} className="h-10 w-auto" />
          </Link>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container max-w-3xl mx-auto px-4">{children}</div>
      </main>
    </div>
  )
}
