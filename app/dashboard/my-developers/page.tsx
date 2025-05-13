"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Filter,
  MessageSquare,
  ExternalLink,
  Star,
  StarHalf,
  Calendar,
  Clock,
  Code,
  Briefcase,
  X,
  CheckCircle2,
  AlertCircle,
  Clock8,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MultiSelect } from "@/components/ui/multi-select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Types
interface Project {
  id: string
  name: string
  status: "active" | "completed" | "paused"
  deadline: string
}

interface Developer {
  id: string
  name: string
  avatar_url?: string
  skills: string[]
  frameworks: string[]
  platforms: string[]
  assigned_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  total_tasks: number
  last_active: string
  rating: number
  hourly_rate: number
  availability: "Full-time" | "Part-time" | "Contract" | "Unavailable"
  availability_hours: number
  experience: string
  timezone: string
  languages: string[]
  bio: string
  portfolio: {
    title: string
    description: string
    link: string
  }[]
  projects: Project[]
  status: "active" | "busy" | "away" | "offline"
}

// Mock data for developers
const mockDevelopers: Developer[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar_url: "/abstract-aj.png",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "MongoDB"],
    frameworks: ["Next.js", "Express", "Jest"],
    platforms: ["Web", "AWS"],
    assigned_tasks: 5,
    completed_tasks: 3,
    in_progress_tasks: 2,
    total_tasks: 5,
    last_active: "2 hours ago",
    rating: 4.8,
    hourly_rate: 65,
    availability: "Full-time",
    availability_hours: 40,
    experience: "5 years",
    timezone: "UTC-5 (Eastern Time)",
    languages: ["English", "Spanish"],
    bio: "Full-stack developer with expertise in React and Node.js. Passionate about building scalable web applications and solving complex problems.",
    portfolio: [
      {
        title: "E-commerce Platform",
        description: "Built a full-featured e-commerce platform with React, Node.js, and MongoDB",
        link: "#",
      },
      {
        title: "Task Management App",
        description: "Developed a collaborative task management application with real-time updates",
        link: "#",
      },
    ],
    projects: [
      {
        id: "p1",
        name: "Customer Portal Redesign",
        status: "active",
        deadline: "2023-12-15",
      },
      {
        id: "p2",
        name: "API Integration Service",
        status: "active",
        deadline: "2023-11-30",
      },
    ],
    status: "active",
  },
  {
    id: "2",
    name: "Sam Rivera",
    avatar_url: "/abstract-geometric-sr.png",
    skills: ["UI/UX", "Frontend", "CSS", "Tailwind", "Responsive Design"],
    frameworks: ["React", "Vue.js", "Svelte"],
    platforms: ["Web", "Mobile Web"],
    assigned_tasks: 4,
    completed_tasks: 2,
    in_progress_tasks: 1,
    total_tasks: 4,
    last_active: "1 day ago",
    rating: 4.5,
    hourly_rate: 55,
    availability: "Part-time",
    availability_hours: 20,
    experience: "3 years",
    timezone: "UTC-8 (Pacific Time)",
    languages: ["English", "Portuguese"],
    bio: "UI/UX designer and frontend developer specializing in creating beautiful, intuitive user interfaces. Experienced with design systems and component libraries.",
    portfolio: [
      {
        title: "Banking App Redesign",
        description: "Redesigned a banking application to improve user experience and accessibility",
        link: "#",
      },
      {
        title: "E-learning Platform UI",
        description: "Created the UI design and frontend implementation for an e-learning platform",
        link: "#",
      },
    ],
    projects: [
      {
        id: "p3",
        name: "Marketing Website Refresh",
        status: "active",
        deadline: "2023-11-20",
      },
    ],
    status: "busy",
  },
  {
    id: "3",
    name: "Taylor Kim",
    avatar_url: "/stylized-initials.png",
    skills: ["Backend", "Database", "API", "Python", "Django", "SQL", "NoSQL"],
    frameworks: ["Django", "Flask", "FastAPI"],
    platforms: ["AWS", "GCP", "Azure"],
    assigned_tasks: 3,
    completed_tasks: 3,
    in_progress_tasks: 0,
    total_tasks: 3,
    last_active: "Just now",
    rating: 4.9,
    hourly_rate: 70,
    availability: "Full-time",
    availability_hours: 40,
    experience: "7 years",
    timezone: "UTC+1 (Central European Time)",
    languages: ["English", "Korean", "German"],
    bio: "Backend developer with extensive experience in building robust APIs and database architectures. Specialized in high-performance and scalable systems.",
    portfolio: [
      {
        title: "Payment Processing System",
        description: "Developed a secure payment processing system with multiple gateway integrations",
        link: "#",
      },
      {
        title: "Data Analytics Platform",
        description: "Built a real-time data analytics platform processing millions of events daily",
        link: "#",
      },
    ],
    projects: [
      {
        id: "p4",
        name: "Database Migration Project",
        status: "completed",
        deadline: "2023-10-15",
      },
      {
        id: "p5",
        name: "Authentication Service",
        status: "active",
        deadline: "2023-12-01",
      },
    ],
    status: "active",
  },
  {
    id: "4",
    name: "Jordan Casey",
    avatar_url: "/placeholder.svg",
    skills: ["Mobile", "React Native", "Flutter", "iOS", "Android", "Kotlin", "Swift"],
    frameworks: ["React Native", "Flutter", "SwiftUI"],
    platforms: ["iOS", "Android"],
    assigned_tasks: 2,
    completed_tasks: 1,
    in_progress_tasks: 1,
    total_tasks: 2,
    last_active: "3 hours ago",
    rating: 4.6,
    hourly_rate: 60,
    availability: "Contract",
    availability_hours: 30,
    experience: "4 years",
    timezone: "UTC+0 (Greenwich Mean Time)",
    languages: ["English", "French"],
    bio: "Mobile app developer specializing in cross-platform development. Experienced in building high-quality apps for both iOS and Android platforms.",
    portfolio: [
      {
        title: "Fitness Tracking App",
        description: "Developed a cross-platform fitness tracking app with social features",
        link: "#",
      },
      {
        title: "Food Delivery Application",
        description: "Built a food delivery app with real-time order tracking and payment processing",
        link: "#",
      },
    ],
    projects: [
      {
        id: "p6",
        name: "Mobile Client App",
        status: "active",
        deadline: "2023-12-20",
      },
    ],
    status: "away",
  },
  {
    id: "5",
    name: "Morgan Chen",
    avatar_url: "/placeholder.svg",
    skills: ["DevOps", "CI/CD", "Docker", "Kubernetes", "AWS", "Terraform", "Linux"],
    frameworks: ["Jenkins", "GitHub Actions", "GitLab CI"],
    platforms: ["AWS", "GCP", "Azure", "On-premise"],
    assigned_tasks: 3,
    completed_tasks: 2,
    in_progress_tasks: 1,
    total_tasks: 3,
    last_active: "5 hours ago",
    rating: 4.7,
    hourly_rate: 75,
    availability: "Full-time",
    availability_hours: 40,
    experience: "6 years",
    timezone: "UTC-5 (Eastern Time)",
    languages: ["English", "Mandarin"],
    bio: "DevOps engineer focused on automating infrastructure and deployment processes. Experienced in cloud architecture and containerization technologies.",
    portfolio: [
      {
        title: "CI/CD Pipeline Overhaul",
        description: "Redesigned and implemented a modern CI/CD pipeline reducing deployment time by 70%",
        link: "#",
      },
      {
        title: "Kubernetes Migration",
        description: "Led the migration of legacy applications to a Kubernetes-based infrastructure",
        link: "#",
      },
    ],
    projects: [
      {
        id: "p7",
        name: "Infrastructure Automation",
        status: "active",
        deadline: "2023-11-25",
      },
      {
        id: "p8",
        name: "Monitoring System Implementation",
        status: "paused",
        deadline: "2024-01-15",
      },
    ],
    status: "active",
  },
  {
    id: "6",
    name: "Jamie Wilson",
    avatar_url: "/placeholder.svg",
    skills: ["Data Science", "Machine Learning", "Python", "R", "TensorFlow", "PyTorch"],
    frameworks: ["TensorFlow", "PyTorch", "scikit-learn", "Pandas"],
    platforms: ["AWS", "GCP", "Databricks"],
    assigned_tasks: 2,
    completed_tasks: 0,
    in_progress_tasks: 2,
    total_tasks: 2,
    last_active: "1 day ago",
    rating: 4.5,
    hourly_rate: 80,
    availability: "Part-time",
    availability_hours: 20,
    experience: "4 years",
    timezone: "UTC-6 (Central Time)",
    languages: ["English"],
    bio: "Data scientist with expertise in machine learning and predictive analytics. Passionate about turning data into actionable insights and building intelligent systems.",
    portfolio: [
      {
        title: "Predictive Maintenance System",
        description: "Developed a machine learning model to predict equipment failures before they occur",
        link: "#",
      },
      {
        title: "Customer Segmentation Analysis",
        description: "Created a customer segmentation model that improved marketing campaign ROI by 35%",
        link: "#",
      },
    ],
    projects: [
      {
        id: "p9",
        name: "Recommendation Engine",
        status: "active",
        deadline: "2023-12-10",
      },
    ],
    status: "offline",
  },
]

// Skill categories for filtering
const skillCategories = {
  frontend: [
    "React",
    "Vue.js",
    "Angular",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind",
    "UI/UX",
    "Responsive Design",
  ],
  backend: ["Node.js", "Python", "Java", "C#", ".NET", "PHP", "Ruby", "Go", "Rust", "API", "GraphQL", "REST"],
  database: ["SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "DynamoDB"],
  mobile: ["React Native", "Flutter", "iOS", "Android", "Swift", "Kotlin", "Mobile"],
  devops: ["DevOps", "CI/CD", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "Linux"],
  ai: ["Machine Learning", "Data Science", "TensorFlow", "PyTorch", "NLP", "Computer Vision", "AI"],
}

// Framework categories for filtering
const frameworkCategories = {
  react: ["React", "Next.js", "Gatsby", "React Native"],
  vue: ["Vue.js", "Nuxt.js"],
  angular: ["Angular", "AngularJS"],
  backend: ["Express", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel", "Ruby on Rails"],
  testing: ["Jest", "Cypress", "Mocha", "Selenium", "Playwright"],
  mobile: ["React Native", "Flutter", "SwiftUI", "Jetpack Compose"],
  other: ["Svelte", "Ember", "Meteor", "jQuery"],
}

// Platform categories for filtering
const platformCategories = {
  web: ["Web", "Mobile Web", "Progressive Web Apps"],
  mobile: ["iOS", "Android"],
  cloud: ["AWS", "GCP", "Azure", "Heroku", "Vercel", "Netlify"],
  desktop: ["Electron", "Windows", "macOS", "Linux"],
  other: ["IoT", "Embedded Systems", "Blockchain"],
}

export default function MyDevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [filteredDevelopers, setFilteredDevelopers] = useState<Developer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeveloper, setSelectedDeveloper] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [availabilityFilters, setAvailabilityFilters] = useState<string[]>([])
  const [rateRange, setRateRange] = useState<{ min: number; max: number }>({ min: 0, max: 200 })
  const [statusFilters, setStatusFilters] = useState<string[]>([])

  // For skill selection dropdown
  const [skillOptions, setSkillOptions] = useState<{ label: string; value: string }[]>([])
  const [frameworkOptions, setFrameworkOptions] = useState<{ label: string; value: string }[]>([])
  const [platformOptions, setPlatformOptions] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setDevelopers(mockDevelopers)
      setIsLoading(false)

      // Extract all unique skills, frameworks, and platforms for filter options
      const allSkills = new Set<string>()
      const allFrameworks = new Set<string>()
      const allPlatforms = new Set<string>()

      mockDevelopers.forEach((dev) => {
        dev.skills.forEach((skill) => allSkills.add(skill))
        dev.frameworks.forEach((framework) => allFrameworks.add(framework))
        dev.platforms.forEach((platform) => allPlatforms.add(platform))
      })

      setSkillOptions(Array.from(allSkills).map((skill) => ({ label: skill, value: skill })))
      setFrameworkOptions(Array.from(allFrameworks).map((framework) => ({ label: framework, value: framework })))
      setPlatformOptions(Array.from(allPlatforms).map((platform) => ({ label: platform, value: platform })))
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (developers.length === 0) return

    let filtered = [...developers]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (dev) =>
          dev.name.toLowerCase().includes(query) ||
          dev.skills.some((skill) => skill.toLowerCase().includes(query)) ||
          dev.frameworks.some((framework) => framework.toLowerCase().includes(query)) ||
          dev.platforms.some((platform) => platform.toLowerCase().includes(query)) ||
          dev.bio.toLowerCase().includes(query),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "hired") {
        filtered = filtered.filter((dev) => dev.projects.length > 0)
      } else if (activeTab === "available") {
        filtered = filtered.filter((dev) => dev.availability !== "Unavailable" && dev.status !== "offline")
      }
    }

    // Apply skill filters
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((dev) => selectedSkills.every((skill) => dev.skills.includes(skill)))
    }

    // Apply framework filters
    if (selectedFrameworks.length > 0) {
      filtered = filtered.filter((dev) => selectedFrameworks.some((framework) => dev.frameworks.includes(framework)))
    }

    // Apply platform filters
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter((dev) => selectedPlatforms.some((platform) => dev.platforms.includes(platform)))
    }

    // Apply availability filters
    if (availabilityFilters.length > 0) {
      filtered = filtered.filter((dev) => availabilityFilters.includes(dev.availability))
    }

    // Apply rate range filter
    filtered = filtered.filter((dev) => dev.hourly_rate >= rateRange.min && dev.hourly_rate <= rateRange.max)

    // Apply status filters
    if (statusFilters.length > 0) {
      filtered = filtered.filter((dev) => statusFilters.includes(dev.status))
    }

    setFilteredDevelopers(filtered)
  }, [
    searchQuery,
    activeTab,
    developers,
    selectedSkills,
    selectedFrameworks,
    selectedPlatforms,
    availabilityFilters,
    rateRange,
    statusFilters,
  ])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setSelectedFrameworks([])
    setSelectedPlatforms([])
    setAvailabilityFilters([])
    setRateRange({ min: 0, max: 200 })
    setStatusFilters([])
    setSearchQuery("")
  }

  const getProgressColor = (completedPercentage: number) => {
    if (completedPercentage >= 80) return "bg-green-500"
    if (completedPercentage >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>Active
          </span>
        )
      case "busy":
        return (
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5"></span>Busy
          </span>
        )
      case "away":
        return (
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-orange-500 mr-1.5"></span>Away
          </span>
        )
      case "offline":
        return (
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-gray-400 mr-1.5"></span>Offline
          </span>
        )
      default:
        return (
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-gray-400 mr-1.5"></span>Unknown
          </span>
        )
    }
  }

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Completed
          </Badge>
        )
      case "paused":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            Paused
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Count active projects for a developer
  const countActiveProjects = (developer: Developer) => {
    return developer.projects.filter((p) => p.status === "active").length
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">All VibeAlong's Developers</h1>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Skeleton className="h-10 w-full md:w-80" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <Skeleton className="h-10 w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  // If a developer is selected, show their detailed profile
  if (selectedDeveloper) {
    const developer = developers.find((dev) => dev.id === selectedDeveloper)

    if (!developer) {
      return <div>Developer not found</div>
    }

    const completedPercentage =
      developer.total_tasks > 0 ? Math.round((developer.completed_tasks / developer.total_tasks) * 100) : 0

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setSelectedDeveloper(null)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <h1 className="text-3xl font-bold">Developer Profile</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button>Assign to Project</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={developer.avatar_url || "/placeholder.svg"} alt={developer.name} />
                    <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold">{developer.name}</h2>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    {getStatusIndicator(developer.status)}
                    <span className="mx-2">•</span>
                    <span>Active {developer.last_active}</span>
                  </div>
                  <div className="mt-2">{renderRatingStars(developer.rating)}</div>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {developer.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                    {developer.skills.length > 4 && (
                      <Badge variant="outline">+{developer.skills.length - 4} more</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Experience</span>
                  </div>
                  <span>{developer.experience}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Availability</span>
                  </div>
                  <span>
                    {developer.availability} ({developer.availability_hours}h/week)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Timezone</span>
                  </div>
                  <span>{developer.timezone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Hourly Rate</span>
                  </div>
                  <span>${developer.hourly_rate}/hr</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {developer.languages.map((language) => (
                    <Badge key={language} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frameworks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {developer.frameworks.map((framework) => (
                    <Badge key={framework} variant="secondary">
                      {framework}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {developer.platforms.map((platform) => (
                    <Badge key={platform} variant="outline">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Bio, portfolio, tasks */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{developer.bio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {developer.projects.length > 0 ? (
                  <div className="space-y-4">
                    {developer.projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{project.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {getProjectStatusBadge(project.status)}
                              <span className="text-sm text-muted-foreground">
                                Due: {new Date(project.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/projects/${project.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No active projects</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Assign to Project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {developer.portfolio.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={item.link}>
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span>{completedPercentage}%</span>
                    </div>
                    <Progress
                      value={completedPercentage}
                      className="h-2"
                      indicatorClassName={getProgressColor(completedPercentage)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="border rounded-md p-2">
                      <p className="text-lg font-bold">{developer.completed_tasks}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-lg font-bold">{developer.in_progress_tasks}</p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-lg font-bold">{developer.total_tasks}</p>
                      <p className="text-xs text-muted-foreground">Total Tasks</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All VibeAlong's Developers</h1>
        <Button>Find New Developers</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skills, or technologies..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={
                  Object.values(selectedSkills).length > 0 ||
                  Object.values(selectedFrameworks).length > 0 ||
                  Object.values(selectedPlatforms).length > 0 ||
                  availabilityFilters.length > 0 ||
                  statusFilters.length > 0
                    ? "default"
                    : "outline"
                }
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {(selectedSkills.length > 0 ||
                  selectedFrameworks.length > 0 ||
                  selectedPlatforms.length > 0 ||
                  availabilityFilters.length > 0 ||
                  statusFilters.length > 0) && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedSkills.length +
                      selectedFrameworks.length +
                      selectedPlatforms.length +
                      availabilityFilters.length +
                      statusFilters.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filter Developers</DialogTitle>
                <DialogDescription>
                  Narrow down developers based on skills, frameworks, platforms, and availability.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Skills</h3>
                    <MultiSelect
                      options={skillOptions}
                      selected={selectedSkills}
                      onChange={setSelectedSkills}
                      placeholder="Select skills..."
                      searchable
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Frameworks</h3>
                    <MultiSelect
                      options={frameworkOptions}
                      selected={selectedFrameworks}
                      onChange={setSelectedFrameworks}
                      placeholder="Select frameworks..."
                      searchable
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Platforms</h3>
                    <MultiSelect
                      options={platformOptions}
                      selected={selectedPlatforms}
                      onChange={setSelectedPlatforms}
                      placeholder="Select platforms..."
                      searchable
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Availability</h3>
                    <div className="space-y-2">
                      {["Full-time", "Part-time", "Contract", "Unavailable"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`availability-${type}`}
                            checked={availabilityFilters.includes(type)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setAvailabilityFilters([...availabilityFilters, type])
                              } else {
                                setAvailabilityFilters(availabilityFilters.filter((t) => t !== type))
                              }
                            }}
                          />
                          <Label htmlFor={`availability-${type}`}>{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Status</h3>
                    <div className="space-y-2">
                      {[
                        { id: "active", label: "Active", icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
                        { id: "busy", label: "Busy", icon: <AlertCircle className="h-4 w-4 text-amber-500" /> },
                        { id: "away", label: "Away", icon: <Clock8 className="h-4 w-4 text-orange-500" /> },
                        {
                          id: "offline",
                          label: "Offline",
                          icon: <span className="h-4 w-4 rounded-full bg-gray-400 inline-block" />,
                        },
                      ].map((status) => (
                        <div key={status.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status.id}`}
                            checked={statusFilters.includes(status.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setStatusFilters([...statusFilters, status.id])
                              } else {
                                setStatusFilters(statusFilters.filter((s) => s !== status.id))
                              }
                            }}
                          />
                          <Label htmlFor={`status-${status.id}`} className="flex items-center gap-2">
                            {status.icon}
                            {status.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Hourly Rate</h3>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="w-24"
                        value={rateRange.min || ""}
                        onChange={(e) => setRateRange({ ...rateRange, min: Number.parseInt(e.target.value) || 0 })}
                      />
                      <span>to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        className="w-24"
                        value={rateRange.max || ""}
                        onChange={(e) => setRateRange({ ...rateRange, max: Number.parseInt(e.target.value) || 200 })}
                      />
                      <span>$/hr</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button onClick={() => {}}>Apply Filters</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">👥 All Developers</TabsTrigger>
          <TabsTrigger value="hired">🤝 Currently Hired</TabsTrigger>
          <TabsTrigger value="available">✅ Available Now</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Applied filters display */}
      {(selectedSkills.length > 0 ||
        selectedFrameworks.length > 0 ||
        selectedPlatforms.length > 0 ||
        availabilityFilters.length > 0 ||
        statusFilters.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>

          {selectedSkills.map((skill) => (
            <Badge key={`skill-${skill}`} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
              />
            </Badge>
          ))}

          {selectedFrameworks.map((framework) => (
            <Badge key={`framework-${framework}`} variant="secondary" className="flex items-center gap-1">
              {framework}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedFrameworks(selectedFrameworks.filter((f) => f !== framework))}
              />
            </Badge>
          ))}

          {selectedPlatforms.map((platform) => (
            <Badge key={`platform-${platform}`} variant="secondary" className="flex items-center gap-1">
              {platform}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))}
              />
            </Badge>
          ))}

          {availabilityFilters.map((availability) => (
            <Badge key={`availability-${availability}`} variant="secondary" className="flex items-center gap-1">
              {availability}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setAvailabilityFilters(availabilityFilters.filter((a) => a !== availability))}
              />
            </Badge>
          ))}

          {statusFilters.map((status) => (
            <Badge key={`status-${status}`} variant="secondary" className="flex items-center gap-1">
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setStatusFilters(statusFilters.filter((s) => s !== status))}
              />
            </Badge>
          ))}

          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2">
            Clear all
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevelopers.length > 0 ? (
          filteredDevelopers.map((developer) => {
            const completedPercentage =
              developer.total_tasks > 0 ? Math.round((developer.completed_tasks / developer.total_tasks) * 100) : 0
            const activeProjectsCount = countActiveProjects(developer)

            return (
              <Card key={developer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={developer.avatar_url || "/placeholder.svg"} alt={developer.name} />
                        <AvatarFallback>
                          {developer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {developer.name}
                          <span
                            className="h-2 w-2 rounded-full inline-block"
                            style={{
                              backgroundColor:
                                developer.status === "active"
                                  ? "rgb(34, 197, 94)"
                                  : developer.status === "busy"
                                    ? "rgb(245, 158, 11)"
                                    : developer.status === "away"
                                      ? "rgb(249, 115, 22)"
                                      : "rgb(156, 163, 175)",
                            }}
                          />
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">Active {developer.last_active}</div>
                      </div>
                    </div>
                    <Badge variant={activeProjectsCount > 0 ? "default" : "outline"} className="w-fit">
                      {activeProjectsCount > 0 ? `${activeProjectsCount} active projects` : "Available"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {developer.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {developer.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{developer.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">{renderRatingStars(developer.rating)}</div>
                    <div className="text-sm font-medium">${developer.hourly_rate}/hr</div>
                  </div>
                </CardContent>
                <div className="px-6 py-4 bg-muted/50 border-t">
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">Message</span>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDeveloper(developer.id)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">View Profile</span>
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground mb-2">No developers found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
