import { LoginForm } from "@/components/auth/login-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      {/* Form Section - Now on the left */}
      <div className="w-full flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 text-center md:hidden mb-8">
            <Link href="/">
              <Image src="/icon.png" alt="VibeAlong Logo" width={120} height={120} className="h-24 w-auto" />
            </Link>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <div className="hidden md:flex items-center gap-2 mb-8">
            <Link href="/">
              <Image src="/icon.png" alt="VibeAlong Logo" width={40} height={40} className="h-10 w-auto" />
            </Link>
            <span className="text-xl font-bold">VibeAlong</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
