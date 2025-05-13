import type { Metadata } from "next"
import { NewProjectForm } from "@/components/projects/new-project-form"

export const metadata: Metadata = {
  title: "New Project",
  description: "Create a new project",
}

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
      </div>
      <div className="grid gap-4">
        <NewProjectForm />
      </div>
    </div>
  )
}
