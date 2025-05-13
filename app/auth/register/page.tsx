import { RegisterForm } from "@/components/auth/register-form"
import { SessionChecker } from "@/components/auth/session-checker"

export default function RegisterPage() {
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <SessionChecker />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-muted-foreground mt-2">Join VibeAlong to start collaborating</p>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <RegisterForm />
      </div>
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/auth/login" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
