"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  CheckSquare,
  FileText,
  ClipboardList,
  ChevronDown,
  PlusCircle,
  DollarSign,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Project selector component for developers
function DeveloperProjectSelector() {
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [hasProjects, setHasProjects] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // For demo purposes - check localStorage to simulate project status
    const projectStatus = localStorage.getItem("devHasProjects")
    setHasProjects(projectStatus === "true")

    // If they have projects, set a default selected project
    if (projectStatus === "true") {
      setSelectedProject({
        id: "project-1",
        project_name: "E-commerce Platform",
      })
    }
  }, [])

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

  const handleJoinByInvite = () => {
    // This would open a modal or navigate to a page to enter an invite code
    router.push("/dashboard/join-project")
  }

  // If developer has no projects
  if (!hasProjects) {
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          className="w-full justify-between bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
          disabled
        >
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="font-medium">No Active Projects</span>
          </div>
        </Button>
        <p className="text-xs text-muted-foreground mt-1 px-1">Apply to tasks to get added to projects.</p>
      </div>
    )
  }

  // If developer has projects
  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between mb-4 truncate bg-white hover:bg-gray-50 border-primary/20 hover:border-primary"
              >
                <div className="flex items-center gap-2 truncate">
                  <FolderKanban className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="truncate font-medium">{selectedProject?.project_name || "Select Project"}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0 ml-2" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          {selectedProject?.project_name?.length > 20 && (
            <TooltipContent>
              <p>{selectedProject.project_name}</p>
            </TooltipContent>
          )}
        </Tooltip>
        <DropdownMenuContent align="start" className="w-56 bg-white">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Your Projects</div>
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => handleProjectChange(project)}
              className={`cursor-pointer truncate ${selectedProject?.id === project.id ? "bg-muted/50" : ""}`}
            >
              {project.project_name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleJoinByInvite} className="cursor-pointer font-medium text-primary">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Join by Invite</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

export function DeveloperDashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    const availabilityStatus = localStorage.getItem("developerAvailability")
    setIsAvailable(availabilityStatus !== "false")
  }, [])

  // Define navigation items for developer dashboard
  const navItems = [
    {
      title: "Overview",
      href: "/dashboard/developer",
      icon: LayoutDashboard,
    },
    {
      title: "My Tasks",
      href: "/dashboard/developer/tasks",
      icon: CheckSquare,
    },
    {
      title: "Available Tasks",
      href: "/dashboard/developer/available-tasks",
      icon: ClipboardList,
    },
    {
      title: "My Applications",
      href: "/dashboard/developer/applications",
      icon: FileText,
    },
    {
      title: "Knowledge Hub",
      href: "/dashboard/developer/knowledge-hub",
      icon: GraduationCap,
    },
    {
      title: "Earnings",
      href: "/dashboard/developer/settings",
      icon: DollarSign,
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
  ]

  return (
    <div className="w-64 border-r bg-white flex-shrink-0 p-4">
      <DeveloperProjectSelector />

      {/* Availability Status Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between rounded-md border p-2 bg-white">
          <div className="flex items-center gap-2">
            {isAvailable ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium">Available for tasks</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-xs font-medium text-muted-foreground">Not available</span>
              </div>
            )}
          </div>
          <Switch
            checked={isAvailable}
            onCheckedChange={(checked) => {
              setIsAvailable(checked)
              localStorage.setItem("developerAvailability", checked.toString())
            }}
            size="sm"
            aria-label="Toggle availability status"
          />
        </div>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.title}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
