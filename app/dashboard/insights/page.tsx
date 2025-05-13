"use client"

import { useState } from "react"
import { Brain, ChevronRight, Code2, Filter, Lightbulb, Search, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock insights data
const mockInsights = [
  {
    id: 1,
    type: "performance",
    title: "Project Performance Analysis",
    description: "Your project is progressing 20% faster than similar projects",
    time: "Generated today",
    read: false,
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    iconBg: "bg-primary/10",
  },
  {
    id: 2,
    type: "suggestion",
    title: "Task Optimization Suggestion",
    description: 'Consider breaking down "User Authentication" into smaller tasks',
    time: "Generated today",
    read: false,
    icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
    iconBg: "bg-amber-500/10",
  },
  {
    id: 3,
    type: "tech",
    title: "Tech Stack Recommendation",
    description: "Based on your requirements, consider using Next.js with Supabase",
    time: "Generated yesterday",
    read: false,
    icon: <Code2 className="h-4 w-4 text-blue-500" />,
    iconBg: "bg-blue-500/10",
  },
  {
    id: 4,
    type: "performance",
    title: "Developer Productivity Insight",
    description: "Your team's code quality has improved by 15% in the last week",
    time: "Generated 2 days ago",
    read: true,
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    iconBg: "bg-primary/10",
  },
  {
    id: 5,
    type: "suggestion",
    title: "Project Timeline Optimization",
    description: "Adjusting your sprint cadence could improve delivery times by 10%",
    time: "Generated 3 days ago",
    read: true,
    icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
    iconBg: "bg-amber-500/10",
  },
  {
    id: 6,
    type: "tech",
    title: "Security Enhancement Recommendation",
    description: "Adding rate limiting to your API endpoints would improve security",
    time: "Generated 4 days ago",
    read: true,
    icon: <Zap className="h-4 w-4 text-blue-500" />,
    iconBg: "bg-blue-500/10",
  },
]

export default function InsightsPage() {
  const [insights, setInsights] = useState(mockInsights)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["performance", "suggestion", "tech"])

  const unreadCount = insights.filter((n) => !n.read).length

  const filteredInsights = insights.filter(
    (insight) =>
      selectedTypes.includes(insight.type) &&
      (insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const markAllAsRead = () => {
    setInsights(
      insights.map((insight) => ({
        ...insight,
        read: true,
      })),
    )
  }

  const toggleInsightRead = (id: number) => {
    setInsights(
      insights.map((insight) =>
        insight.id === id
          ? {
              ...insight,
              read: !insight.read,
            }
          : insight,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7" />
            AI Insights
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">AI-powered recommendations to optimize your project</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
          <Button variant="default" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Generate New Insights
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search insights..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {selectedTypes.length < 3 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTypes.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("performance")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedTypes([...selectedTypes, "performance"])
                } else {
                  setSelectedTypes(selectedTypes.filter((type) => type !== "performance"))
                }
              }}
            >
              Performance Insights
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("suggestion")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedTypes([...selectedTypes, "suggestion"])
                } else {
                  setSelectedTypes(selectedTypes.filter((type) => type !== "suggestion"))
                }
              }}
            >
              Suggestions
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedTypes.includes("tech")}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedTypes([...selectedTypes, "tech"])
                } else {
                  setSelectedTypes(selectedTypes.filter((type) => type !== "tech"))
                }
              }}
            >
              Tech Recommendations
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="unread">New</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All AI Insights</CardTitle>
              <CardDescription>
                {filteredInsights.length} insight{filteredInsights.length !== 1 && "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredInsights.length > 0 ? (
                <div className="divide-y">
                  {filteredInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`flex items-start p-4 hover:bg-muted/50 cursor-pointer ${
                        !insight.read ? "bg-muted/20" : ""
                      }`}
                      onClick={() => toggleInsightRead(insight.id)}
                    >
                      <div className={`${insight.iconBg} p-2 rounded-full mr-4 mt-0.5`}>{insight.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{insight.title}</h4>
                          {!insight.read && <Badge className="ml-2">New</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{insight.time}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No insights found</h3>
                  <p className="text-muted-foreground mt-1">
                    {insights.length === 0
                      ? "No AI insights have been generated yet."
                      : "No insights match your current filters."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="unread">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>New Insights</CardTitle>
              <CardDescription>
                {filteredInsights.filter((n) => !n.read).length} new insight
                {filteredInsights.filter((n) => !n.read).length !== 1 && "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {filteredInsights.filter((n) => !n.read).length > 0 ? (
                <div className="divide-y">
                  {filteredInsights
                    .filter((n) => !n.read)
                    .map((insight) => (
                      <div
                        key={insight.id}
                        className="flex items-start p-4 hover:bg-muted/50 cursor-pointer bg-muted/20"
                        onClick={() => toggleInsightRead(insight.id)}
                      >
                        <div className={`${insight.iconBg} p-2 rounded-full mr-4 mt-0.5`}>{insight.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{insight.title}</h4>
                            <Badge className="ml-2">New</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{insight.time}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No new insights</h3>
                  <p className="text-muted-foreground mt-1">You're all caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
