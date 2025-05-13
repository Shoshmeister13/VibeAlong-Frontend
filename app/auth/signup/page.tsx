import { SignupForm } from "@/components/auth/signup-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Code, Zap, Users } from "lucide-react"

export default async function SignupPage() {
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
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 text-center md:hidden mb-8">
            <Link href="/">
              <Image src="/icon.png" alt="VibeAlong Logo" width={120} height={120} className="h-24 w-auto" />
            </Link>
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">Join our community of developers and clients</p>
          </div>

          <div className="hidden md:flex items-center gap-2 mb-8">
            <Link href="/">
              <Image src="/icon.png" alt="VibeAlong Logo" width={40} height={40} className="h-10 w-auto" />
            </Link>
            <span className="text-xl font-bold">VibeAlong</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground">Join our community of developers and clients</p>
          </div>

          <div className="bg-card rounded-lg border shadow-sm p-6 md:p-8">
            <SignupForm />
          </div>
        </div>
      </div>

      {/* Side Section - Now on the right */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white p-8 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-6">Join the coolest dev community on the planet</h1>
          <p className="text-xl mb-8">Where awesome projects meet talented developers. No fluff, just results.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Lightning-fast collaboration</h3>
              <p className="text-white/70">No more back-and-forth emails. Just pure coding magic.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Code that slaps</h3>
              <p className="text-white/70">Work with devs who get your vibe and deliver quality.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Your dream team awaits</h3>
              <p className="text-white/70">Connect with the perfect developers for your project.</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-white/50 text-sm">© 2023 VibeAlong. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
