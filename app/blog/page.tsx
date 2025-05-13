import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, User } from "lucide-react"

export default function BlogPage() {
  const blogPosts = [
    {
      id: "post-1",
      title: "The Future of Developer Collaboration in the AI Era",
      excerpt:
        "How AI is changing the way developers collaborate and what it means for the future of software development.",
      date: "March 15, 2023",
      author: "Alex Johnson",
      readTime: "5 min read",
      category: "AI & Development",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "post-2",
      title: "From Vibe-Code to Production: Best Practices",
      excerpt: "Learn the best practices for turning AI-generated code into production-ready applications.",
      date: "April 2, 2023",
      author: "Sarah Chen",
      readTime: "8 min read",
      category: "Best Practices",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "post-3",
      title: "The Rise of Vibe-Coding: What Developers Need to Know",
      excerpt: "An overview of vibe-coding platforms and how they're changing the development landscape.",
      date: "April 18, 2023",
      author: "Michael Rodriguez",
      readTime: "6 min read",
      category: "Industry Trends",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "post-4",
      title: "How to Optimize Your Developer Profile for More Opportunities",
      excerpt: "Tips and tricks for optimizing your developer profile to attract more clients and projects.",
      date: "May 5, 2023",
      author: "Emily Wong",
      readTime: "4 min read",
      category: "Career Advice",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "post-5",
      title: "The Economics of Developer Collaboration",
      excerpt:
        "An analysis of the economic benefits of developer collaboration and how it can lead to better outcomes for all parties.",
      date: "May 20, 2023",
      author: "David Kim",
      readTime: "7 min read",
      category: "Business",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <main className="flex-1">
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">VibeAlong Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and news about developer collaboration and vibe-coding
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img src={post.image || "/placeholder.svg"} alt={post.title} className="object-cover w-full h-full" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                  <span className="mx-2">•</span>
                  <CalendarDays className="h-4 w-4 mr-1" />
                  {post.date}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline">Load More Articles</Button>
        </div>
      </div>
    </main>
  )
}
