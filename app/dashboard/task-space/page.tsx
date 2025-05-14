export default function TaskSpacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Task Spaces</h1>
        <p className="text-muted-foreground">Collaborate on tasks with developers and vibe coders in real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-lg font-medium">Developer Task Space</h3>
            <p className="text-sm text-muted-foreground">
              Collaborate with developers on technical tasks and code reviews.
            </p>
            <div className="mt-4">
              <a
                href="/dashboard/task-space/developer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Enter Space
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-lg font-medium">Vibe Coder Task Space</h3>
            <p className="text-sm text-muted-foreground">Work with vibe coders on design and user experience tasks.</p>
            <div className="mt-4">
              <a
                href="/dashboard/task-space/vibe-coder"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Enter Space
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-col space-y-2">
            <h3 className="text-lg font-medium">Recent Task Spaces</h3>
            <p className="text-sm text-muted-foreground">Quickly access your most recently used task spaces.</p>
            <div className="mt-4 space-y-2">
              <div className="text-sm">No recent task spaces</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
