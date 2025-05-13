"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Search,
  Code,
  Layers,
  Cpu,
  Server,
  Globe,
  Clock,
  Star,
  BookMarked,
  Bookmark,
  Play,
  FileText,
  CheckCircle2,
  Filter,
} from "lucide-react"
import Image from "next/image"

// Mock data for tutorials and guides
const tutorials = [
  {
    id: "tut-1",
    title: "Getting Started with v0",
    description: "Learn the basics of v0 and how to create your first project",
    category: "Beginner",
    platform: "v0",
    duration: "15 min",
    image: "/platform-logos/v0-logo.png",
    author: "VibeAlong Team",
    date: "2023-10-15",
    rating: 4.8,
    tags: ["v0", "beginner", "setup"],
  },
  {
    id: "tut-2",
    title: "Building Responsive UIs with Lovable",
    description: "Master responsive design principles using Lovable's component system",
    category: "Intermediate",
    platform: "Lovable",
    duration: "25 min",
    image: "/platform-logos/lovable-logo.png",
    author: "VibeAlong Team",
    date: "2023-09-22",
    rating: 4.7,
    tags: ["lovable", "responsive", "ui"],
  },
  {
    id: "tut-3",
    title: "Advanced API Integration with Bolt",
    description: "Learn how to integrate complex APIs and handle authentication",
    category: "Advanced",
    platform: "Bolt",
    duration: "40 min",
    image: "/platform-logos/bolt-logo.png",
    author: "VibeAlong Team",
    date: "2023-11-05",
    rating: 4.9,
    tags: ["bolt", "api", "advanced"],
  },
  {
    id: "tut-4",
    title: "Database Design Best Practices",
    description: "Learn how to design efficient and scalable database schemas",
    category: "Intermediate",
    platform: "All",
    duration: "30 min",
    image: "/abstract-ai-network.png",
    author: "VibeAlong Team",
    date: "2023-08-18",
    rating: 4.6,
    tags: ["database", "design", "schema"],
  },
  {
    id: "tut-5",
    title: "Authentication and Authorization",
    description: "Implement secure authentication and authorization in your applications",
    category: "Intermediate",
    platform: "All",
    duration: "35 min",
    image: "/abstract-ai-network.png",
    author: "VibeAlong Team",
    date: "2023-07-29",
    rating: 4.8,
    tags: ["auth", "security", "jwt"],
  },
  {
    id: "tut-6",
    title: "Performance Optimization Techniques",
    description: "Learn how to optimize your application for better performance",
    category: "Advanced",
    platform: "All",
    duration: "45 min",
    image: "/abstract-ai-network.png",
    author: "VibeAlong Team",
    date: "2023-10-02",
    rating: 4.9,
    tags: ["performance", "optimization", "advanced"],
  },
]

const courses = [
  {
    id: "course-1",
    title: "Complete v0 Developer Course",
    description: "A comprehensive course covering all aspects of v0 development",
    category: "Comprehensive",
    platform: "v0",
    duration: "10 hours",
    image: "/platform-logos/v0-logo.png",
    author: "VibeAlong Academy",
    date: "2023-11-10",
    rating: 4.9,
    modules: 12,
    completed: false,
    progress: 0,
    tags: ["v0", "comprehensive", "full-stack"],
  },
  {
    id: "course-2",
    title: "Lovable UI Mastery",
    description: "Master the art of creating beautiful and functional UIs with Lovable",
    category: "Intermediate",
    platform: "Lovable",
    duration: "8 hours",
    image: "/platform-logos/lovable-logo.png",
    author: "VibeAlong Academy",
    date: "2023-10-05",
    rating: 4.8,
    modules: 10,
    completed: false,
    progress: 0,
    tags: ["lovable", "ui", "design"],
  },
  {
    id: "course-3",
    title: "Bolt Backend Development",
    description: "Learn how to build robust and scalable backends with Bolt",
    category: "Advanced",
    platform: "Bolt",
    duration: "12 hours",
    image: "/platform-logos/bolt-logo.png",
    author: "VibeAlong Academy",
    date: "2023-09-15",
    rating: 4.7,
    modules: 15,
    completed: false,
    progress: 0,
    tags: ["bolt", "backend", "api"],
  },
  {
    id: "course-4",
    title: "Full-Stack Development Bootcamp",
    description: "A comprehensive bootcamp covering frontend, backend, and deployment",
    category: "Comprehensive",
    platform: "All",
    duration: "20 hours",
    image: "/abstract-ai-network.png",
    author: "VibeAlong Academy",
    date: "2023-08-20",
    rating: 4.9,
    modules: 25,
    completed: false,
    progress: 0,
    tags: ["full-stack", "comprehensive", "bootcamp"],
  },
]

const platformFilters = [
  { id: "all", name: "All Platforms", icon: <Globe className="h-4 w-4" /> },
  { id: "v0", name: "v0", icon: <Code className="h-4 w-4" /> },
  { id: "lovable", name: "Lovable", icon: <Layers className="h-4 w-4" /> },
  { id: "bolt", name: "Bolt", icon: <Cpu className="h-4 w-4" /> },
  { id: "replit", name: "Replit", icon: <Server className="h-4 w-4" /> },
]

const categoryFilters = [
  { id: "all", name: "All Levels" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
  { id: "comprehensive", name: "Comprehensive" },
]

export default function KnowledgeHubPage() {
  const [activeTab, setActiveTab] = useState("tutorials")
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter tutorials based on search query and filters
  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPlatform =
      platformFilter === "all" ||
      tutorial.platform.toLowerCase() === platformFilter.toLowerCase() ||
      tutorial.platform === "All"

    const matchesCategory = categoryFilter === "all" || tutorial.category.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesPlatform && matchesCategory
  })

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPlatform =
      platformFilter === "all" ||
      course.platform.toLowerCase() === platformFilter.toLowerCase() ||
      course.platform === "All"

    const matchesCategory = categoryFilter === "all" || course.category.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesPlatform && matchesCategory
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            Knowledge Hub
          </h1>
          <p className="text-muted-foreground">Tutorials, guides, and courses to help you master development</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search resources..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Platform</h3>
                <div className="flex flex-wrap gap-2">
                  {platformFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={platformFilter === filter.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPlatformFilter(filter.id)}
                      className="h-8"
                    >
                      {filter.icon}
                      <span className="ml-1">{filter.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Level</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={categoryFilter === filter.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCategoryFilter(filter.id)}
                      className="h-8"
                    >
                      {filter.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tutorials" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Tutorials & Guides
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-1">
            <BookMarked className="h-4 w-4" />
            Courses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.length > 0 ? (
              filteredTutorials.map((tutorial) => (
                <Card key={tutorial.id} className="overflow-hidden flex flex-col h-full">
                  <div className="relative h-40 w-full">
                    <Image
                      src={tutorial.image || "/placeholder.svg"}
                      alt={tutorial.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/70 hover:bg-black/70 text-white border-0">{tutorial.platform}</Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="outline" className="bg-white/90 border-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {tutorial.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant={
                          tutorial.category === "Beginner"
                            ? "secondary"
                            : tutorial.category === "Intermediate"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {tutorial.category}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg mt-1">{tutorial.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="flex flex-wrap gap-1">
                      {tutorial.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                      {tutorial.rating}
                    </div>
                    <Button>
                      <Play className="h-4 w-4 mr-1" />
                      Start Tutorial
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No tutorials found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  We couldn't find any tutorials matching your search criteria. Try adjusting your filters or search
                  query.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden flex flex-col h-full">
                  <div className="relative h-48 w-full">
                    <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-black/70 hover:bg-black/70 text-white border-0">{course.platform}</Badge>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="outline" className="bg-white/90 border-0">
                        <Clock className="h-3 w-3 mr-1" />
                        {course.duration}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant={
                          course.category === "Beginner"
                            ? "secondary"
                            : course.category === "Intermediate"
                              ? "default"
                              : course.category === "Advanced"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {course.category}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                        {course.rating}
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                      <span>{course.modules} modules</span>
                      <span>{course.author}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button>
                      {course.completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <BookMarked className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No courses found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  We couldn't find any courses matching your search criteria. Try adjusting your filters or search
                  query.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
