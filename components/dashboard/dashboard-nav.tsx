"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  CheckSquare,
  CreditCard,
  Code,
  Sparkles,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, PlusCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock tasks data for demonstration purposes
const mockTasks = [
  {
    id: "task-1",
    title: "Design User Dashboard",
    description: "Create wireframes and high-fidelity designs for the main user dashboard",
    status: "Open",
    priority: "High",
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_developer: { name: "Alex Johnson" },
    budget: 500,
    estimated_hours: 20,
    progress: 0,
  },
  {
    id: "task-2",
    title: "Implement Authentication Flow",
    description: "Set up user authentication with email verification and social login options",
    status: "In Progress",
    priority: "High",
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_developer: { name: "Maria Garcia" },
    budget: 800,
    estimated_hours: 30,
    progress: 65,
  },
  {
    id: "task-3",
    title: "API Integration for Products",
    description: "Connect to the product database API and implement data fetching",
    status: "In Progress",
    priority: "Medium",
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_developer: { name: "David Kim" },
    budget: 600,
    estimated_hours: 25,
    progress: 40,
  },
  {
    id: "task-4",
    title: "Mobile Responsive Layout",
    description: "Ensure all pages work correctly on mobile devices",
    status: "Open",
    priority: "Medium",
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_developer: null,
    budget: 400,
    estimated_hours: 15,
    progress: 0,
  },
  {
    id: "task-5",
    title: "Payment Gateway Integration",
    description: "Implement Stripe payment processing for checkout flow",
    status: "Completed",
    priority: "High",
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_developer: { name: "Sarah Wilson" },
    budget: 1000,
    estimated_hours: 40,
    progress: 100,
  },
]

function ProjectSelector() {
  const [selectedProject, setSelectedProject] = useState({
    id: "project-1",
    project_name: "E-commerce Platform",
  })
  const router = useRouter()

  // Hardcoded dummy projects
  const projects = [
    {
      id: "project-1",
      project_name: "E-commerce Platform",
    },
    {
      id: "project-2",
      project_name: "Mobile Banking App",
    },
  ]

  const handleProjectChange = (project) => {
    setSelectedProject(project)
    router.push(`/dashboard/projects/${project.id}`)
  }

  const handleAddNewProject = () => {
    router.push("/create-project")
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mb-4 truncate bg-white hover:bg-gray-50 border-primary/20 hover:border-primary"
              >
                <div className="flex items-center gap-2 truncate">
                  <FolderKanban className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="truncate font-medium">{selectedProject.project_name}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          {selectedProject.project_name.length > 20 && (
            <TooltipContent>
              <p>{selectedProject.project_name}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="start" className="w-56 bg-white">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Your Projects</div>
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleProjectChange(project)}
            className={`cursor-pointer truncate ${selectedProject.id === project.id ? "bg-muted/50" : ""}`}
          >
            {project.project_name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleAddNewProject} className="cursor-pointer font-medium text-primary">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Create New Project</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const role = user?.role
  const router = useRouter()

  // Initialize mock data on component mount
  useEffect(() => {
    // Store mock tasks in localStorage for the My Tasks page to use
    localStorage.setItem("mockTasks", JSON.stringify(mockTasks))
  }, [])

  const navItems = [
    {
      title: "Overview",
      href: "/vibe-coder-dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Tasks",
      href: "/dashboard/my-tasks",
      icon: CheckSquare,
    },
    {
      title: "Vibe Analysis",
      href: "/dashboard/vibecheck",
      icon: Sparkles,
    },
    {
      title: "Vibe Plan",
      href: "/dashboard/vibeplan",
      icon: FolderKanban,
    },
    {
      title: "All Developers",
      href: "/dashboard/my-developers",
      icon: Code,
      role: "vibe-coder",
    },
    {
      title: "Knowledge Hub",
      href: "/dashboard/knowledge-hub",
      icon: BookOpen,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
  ]

  const filteredNavItems = navItems.filter((item) => !item.role || item.role === role)

  return (
    <nav className="flex flex-col items-start px-2 py-4 h-full">
      <ProjectSelector />
      <div className="flex-1 w-full">
        {filteredNavItems.map((item, index) => {
          // Special handling for Overview button
          if (item.title === "Overview") {
            return (
              <Button
                key={index}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="justify-start gap-2 mb-1 w-full"
                onClick={() => router.push("/dashboard")}
              >
                <div className="flex items-center">
                  {typeof item.icon === "string" ? null : <item.icon className="h-4 w-4 mr-2" />}
                  {item.title}
                </div>
              </Button>
            )
          }

          // For all other navigation items
          return (
            <Button
              key={index}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="justify-start gap-2 mb-1 w-full"
              asChild
            >
              <Link href={item.href} className="flex items-center w-full">
                {typeof item.icon === "string" ? null : <item.icon className="h-4 w-4 mr-2" />}
                {item.title}
              </Link>
            </Button>
          )
        })}
      </div>

      {/* Expert Consultation Button */}
      <div className="w-full pt-4 mt-4 border-t">
        <Button
          variant="default"
          className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white"
          onClick={() => router.push("/consultation")}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="font-medium">Expert Consultation</span>
          </div>
        </Button>
      </div>
    </nav>
  )
}
