import { Loader2 } from "lucide-react"

export default function ConsultationLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h3 className="text-xl font-medium">Loading Consultation...</h3>
      <p className="text-muted-foreground mt-2">Preparing your AI expert consultation</p>
    </div>
  )
}
