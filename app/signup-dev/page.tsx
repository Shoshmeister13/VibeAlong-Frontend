import { DeveloperExpertSignupForm } from "@/components/auth/developer-expert-signup-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Rocket, Sparkles, Shield } from "lucide-react"
import { SafeImage } from "@/components/ui/safe-image"

export default async function SignupDevPage() {
  // Check if user is already logged in
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    // If user is already logged in, redirect to the appropriate dashboard
    const role = session.user?.user_metadata?.role || "vibe-coder"

    if (role === "developer" || role === "developer_expert") {
      redirect("/expert-dashboard")
    } else {
      redirect("/vibe-coder-dashboard")
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Section - White (Scrollable) */}
      <div className="w-full md:w-1/2 flex flex-col overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-8 md:p-8 lg:p-8 border-b">
          <Link href="/" className="flex items-center gap-2">
            <SafeImage src="/icon.png" alt="VibeAlong Icon" width={40} height={40} className="h-10 w-10" />
            <span className="text-xl font-bold">VibeAlong</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col p-8 md:p-8 lg:p-8">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold mb-2">Join as a Developer</h1>
            <p className="text-gray-600 mb-8">Create your developer account</p>

            <DeveloperExpertSignupForm />

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-black hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          {/* Add some bottom padding for better scrolling experience */}
          <div className="py-8"></div>
        </div>
      </div>

      {/* Right Section - Black (Fixed) */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white p-8 md:p-12 lg:p-16 flex-col h-screen overflow-hidden">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">Let's build amazing projects together!</h2>
          <p className="text-xl mb-16">Join our developer network and collaborate on exciting opportunities.</p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-md">
                <Rocket className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Work on exciting projects</h3>
                <p className="text-gray-400">
                  Access a diverse range of projects that match your skills and interests.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-md">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Showcase your expertise</h3>
                <p className="text-gray-400">Build your portfolio and demonstrate your technical excellence.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-gray-800 p-3 rounded-md">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Secure and reliable income</h3>
                <p className="text-gray-400">Get paid fairly for your work with our transparent payment system.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <p className="text-gray-500">© 2023 VibeAlong. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
