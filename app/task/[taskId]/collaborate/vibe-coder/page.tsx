"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import VibeCoderTaskSpace from "@/components/collaboration/vibe-coder-task-space"
import { RoleSelector } from "@/components/task-space/role-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, GitCommit, ExternalLink, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Add a GitHubIntegration component
function GitHubIntegration({ repository }: { repository: string }) {
  const [isOpen, setIsOpen] = useState(true)
  const [hasCommits, setHasCommits] = useState(true)

  // Mock commit data
  const commits = [
    {
      id: "abc123",
      message: "Add responsive design to dashboard components",
      author: "Sam Rivera",
      timestamp: "2 hours ago",
      url: `https://github.com/${repository}/commit/abc123`,
    },
    {
      id: "def456",
      message: "Fix user authentication edge cases",
      author: "Alex Johnson",
      timestamp: "Yesterday",
      url: `https://github.com/${repository}/commit/def456`,
    },
    {
      id: "ghi789",
      message: "Update README with installation instructions",
      author: "Sam Rivera",
      timestamp: "3 days ago",
      url: `https://github.com/${repository}/commit/ghi789`,
    },
  ]

  // Mock milestone data
  const milestones = [
    {
      id: "ms1",
      title: "MVP Features",
      description: "Core functionality for minimum viable product",
      progress: 75,
      due_date: "Next week",
    },
    {
      id: "ms2",
      title: "UI Polish",
      description: "Refine user interface and improve UX",
      progress: 30,
      due_date: "In 2 weeks",
    },
  ]

  return (
    <Card className="mt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="text-md flex items-center">
              <span>
                <Github className="h-4 w-4 mr-2" /> GitHub Integration
              </span>
            </CardTitle>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="px-4 py-2 space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Repository</p>
              <a
                href={`https://github.com/${repository}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center"
              >
                {repository} <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Recent Activity</p>

              {hasCommits ? (
                <div className="space-y-3">
                  {commits.map((commit) => (
                    <div key={commit.id} className="text-xs border-l-2 border-gray-200 pl-2 py-1">
                      <div className="flex items-start">
                        <GitCommit className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                        <div>
                          <a
                            href={commit.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-blue-600"
                          >
                            {commit.message.length > 80 ? `${commit.message.substring(0, 80)}...` : commit.message}
                          </a>
                          <div className="text-gray-500 mt-1">
                            <span>👤 {commit.author}</span> • <span>🕒 {commit.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No commits pushed yet. Once you push to GitHub, we'll track your build progress here.
                </p>
              )}
            </div>

            {/* Milestones Section */}
            <div>
              <p className="text-sm font-medium mb-2">Milestones</p>
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-medium">{milestone.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {milestone.due_date}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription className="text-xs">
                New commits to this repo will be tracked and summarized as milestones automatically.
              </AlertDescription>
            </Alert>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

// Mock task data specifically for task-1
const MOCK_TASK = {
  id: "task-1",
  title: "Implement User Dashboard",
  description: "Create a responsive dashboard with user statistics, recent activity, and task progress indicators.",
  status: "In Progress",
  priority: "High",
  project: {
    id: "proj-1",
    name: "Developer Collaboration Platform",
    description: "A platform for connecting developers with projects",
    platform: "V0",
    github_repository: "vibecoder/dashflow-ui",
  },
  vibe_coder_id: "vibe-coder-1",
  developer_id: "developer-1",
  vibe_coder: {
    id: "vibe-coder-1",
    full_name: "Alex Johnson",
    email: "alex@example.com",
    avatar_url: "/abstract-aj.png",
  },
  developer: {
    id: "developer-1",
    full_name: "Sam Rivera",
    email: "sam@example.com",
    avatar_url: "/abstract-geometric-sr.png",
    github_username: "samrivera92",
  },
  suggested_steps: [
    {
      step: "Analyze requirements",
      description: "Review the dashboard requirements and create a component plan",
      completed: true,
    },
    {
      step: "Create UI components",
      description: "Develop the UI components following the design system",
      completed: false,
    },
    { step: "Implement data fetching", description: "Connect the dashboard to the API endpoints", completed: false },
    {
      step: "Add responsive design",
      description: "Ensure the dashboard works well on all device sizes",
      completed: false,
    },
    { step: "Write tests", description: "Create unit and integration tests for the dashboard", completed: false },
  ],
  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  estimated_hours: 16,
  progress: 20,
  last_updated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  platform: "V0",
  created_by: "user-1",
  attachments: [
    { name: "dashboard-wireframe.png", url: "#", type: "image/png", size: "1.2 MB" },
    { name: "requirements.pdf", url: "#", type: "application/pdf", size: "450 KB" },
  ],
  comments: [
    {
      id: "comment-1",
      user: { id: "vibe-coder-1", name: "Alex Johnson", avatar: "/abstract-aj.png" },
      content: "I've added some additional wireframes to the attachments. Let me know what you think!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "comment-2",
      user: { id: "developer-1", name: "Sam Rivera", avatar: "/abstract-geometric-sr.png" },
      content: "Thanks for the wireframes. I'll start implementing the basic structure today.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

export default function VibeCoderTaskCollaborationPage() {
  const params = useParams()
  const taskId = params.taskId as string
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState<any>(null)

  useEffect(() => {
    // Simulate loading for a more realistic experience
    const timer = setTimeout(() => {
      // Use the specific mock task for task-1, or generate a mock for other IDs
      if (taskId === "task-1") {
        setTask(MOCK_TASK)
      } else {
        // Create a generic mock task for any other task ID
        setTask({
          ...MOCK_TASK,
          id: taskId,
          title: `Task ${taskId}`,
          description: `This is a mock task for ${taskId} created for UI/UX development.`,
        })
      }
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [taskId])

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <RoleSelector />
      <VibeCoderTaskSpace
        task={task}
        userId="vibe-coder-1"
        githubIntegration={
          task?.project?.github_repository ? <GitHubIntegration repository={task.project.github_repository} /> : null
        }
      />
    </div>
  )
}
