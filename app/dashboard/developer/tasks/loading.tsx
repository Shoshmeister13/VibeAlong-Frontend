import { Loader2 } from "lucide-react"

export default function TasksLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h3 className="text-xl font-medium">Loading your tasks...</h3>
      <p className="text-muted-foreground">Please wait while we fetch your data</p>
    </div>
  )
}
