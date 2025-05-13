import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePageContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to VibeAlong</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Connect developers with vibe-coders and turn AI-generated code into production-ready applications
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth/login">Log In</Link>
        </Button>
      </div>
    </div>
  )
}
