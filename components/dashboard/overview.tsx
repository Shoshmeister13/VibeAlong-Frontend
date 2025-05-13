"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

// Mock data for top developers
const topDevelopers = [
  {
    id: "dev1",
    name: "Alex Johnson",
    avatar: "/abstract-aj.png",
    rating: 4.8,
    hourlyRate: 45,
    skills: ["React", "TypeScript", "Node.js"],
    availability: "Available now",
    completedTasks: 32,
    bio: "Full-stack developer with 5 years of experience specializing in React and Node.js applications.",
  },
  {
    id: "dev2",
    name: "Sarah Rodriguez",
    avatar: "/abstract-geometric-sr.png",
    rating: 4.9,
    hourlyRate: 50,
    skills: ["React", "Next.js", "UI/UX"],
    availability: "Away",
    completedTasks: 47,
    bio: "UI/UX specialist with strong frontend development skills. I create beautiful and functional user interfaces.",
  },
  {
    id: "dev3",
    name: "Michael Chen",
    avatar: "/stylized-initials.png",
    rating: 4.7,
    hourlyRate: 40,
    skills: ["React", "TypeScript", "GraphQL"],
    availability: "Available next week",
    completedTasks: 28,
    bio: "Backend developer with expertise in GraphQL and database optimization. I build scalable and efficient APIs.",
  },
]

export function Overview() {
  const [selectedDeveloper, setSelectedDeveloper] = useState<any>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)

  const handleViewProfile = (developer: any) => {
    setSelectedDeveloper(developer)
    setIsProfileDialogOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <div className="text-2xl font-bold">24</div>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <div className="text-2xl font-bold">12</div>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
              <div className="text-2xl font-bold">8</div>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <div className="text-2xl font-bold">$4,320</div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <h3 className="text-lg font-medium">Task Activity</h3>
              <p className="text-sm text-muted-foreground">Monthly task completion and spending</p>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6 flex flex-col space-y-2">
              <h3 className="text-lg font-medium">Top Developers</h3>
              <p className="text-sm text-muted-foreground">Developers you've worked with</p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {topDevelopers.map((developer) => (
                <div
                  key={developer.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-slate-50 p-3 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={developer.avatar || "/placeholder.svg"}
                        alt={developer.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{developer.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-sm">{developer.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">${developer.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => handleViewProfile(developer)}
                    >
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      Send Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Developer Profile Dialog */}
      {selectedDeveloper && (
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Developer Profile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={selectedDeveloper.avatar || "/placeholder.svg"}
                  alt={selectedDeveloper.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">{selectedDeveloper.name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{selectedDeveloper.rating}</span>
                <span className="mx-2">•</span>
                <span>${selectedDeveloper.hourlyRate}/hr</span>
              </div>
              <Badge
                className={`mt-2 ${selectedDeveloper.availability?.includes("Available") ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
              >
                {selectedDeveloper.availability}
              </Badge>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{selectedDeveloper.bio}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedDeveloper.skills?.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Stats</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded-md text-center">
                    <p className="text-2xl font-bold">{selectedDeveloper.completedTasks}</p>
                    <p className="text-xs text-muted-foreground">Tasks Completed</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-md text-center">
                    <p className="text-2xl font-bold">{selectedDeveloper.rating}</p>
                    <p className="text-xs text-muted-foreground">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="w-full" onClick={() => setIsProfileDialogOpen(false)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button className="w-full" variant="default">
                Hire for this Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
