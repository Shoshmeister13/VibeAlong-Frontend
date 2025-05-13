import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-lg font-medium">Loading...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we prepare the signup form</p>
      </div>
    </div>
  )
}
