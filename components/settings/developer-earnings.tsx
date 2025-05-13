"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from "@/components/settings/billing/date-range-picker"
import { addDays, format, parseISO, startOfWeek, addWeeks, eachDayOfInterval } from "date-fns"
import {
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Calendar,
  Download,
  Star,
  BarChart3,
  Users,
  ArrowUpRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DateRange } from "react-day-picker"

// Mock data for developer earnings
const mockEarnings = {
  totalEarned: 4250,
  pendingPayouts: 850,
  tasksCompleted: 12,
  hoursWorked: 85,
  successRate: 98,
  averageRating: 4.8,
  weeklyAvailability: 30,
  weeklyScheduled: 22,
}

// Mock data for completed tasks
const mockCompletedTasks = [
  {
    id: "task-1",
    title: "Implement authentication flow",
    client: "E-commerce Platform",
    completedDate: "2023-11-15",
    hours: 12,
    amount: 540,
    status: "paid",
    rating: 5,
  },
  {
    id: "task-2",
    title: "Fix responsive layout issues",
    client: "Travel Booking App",
    completedDate: "2023-11-10",
    hours: 6,
    amount: 270,
    status: "paid",
    rating: 4.5,
  },
  {
    id: "task-3",
    title: "Integrate payment gateway",
    client: "E-commerce Platform",
    completedDate: "2023-11-05",
    hours: 15,
    amount: 675,
    status: "paid",
    rating: 5,
  },
  {
    id: "task-4",
    title: "Build dashboard analytics",
    client: "SaaS Dashboard",
    completedDate: "2023-10-28",
    hours: 18,
    amount: 810,
    status: "paid",
    rating: 4.8,
  },
  {
    id: "task-5",
    title: "Implement search functionality",
    client: "Content Platform",
    completedDate: "2023-10-20",
    hours: 10,
    amount: 450,
    status: "paid",
    rating: 4.7,
  },
  {
    id: "task-6",
    title: "API integration for user profiles",
    client: "Social Network App",
    completedDate: "2023-11-18",
    hours: 8,
    amount: 360,
    status: "pending",
    rating: 5,
  },
  {
    id: "task-7",
    title: "Fix checkout process bugs",
    client: "E-commerce Platform",
    completedDate: "2023-11-16",
    hours: 11,
    amount: 495,
    status: "pending",
    rating: 0, // Not yet rated
  },
]

// Mock data for payouts
const mockPayouts = [
  {
    id: "payout-1",
    date: "2023-11-15",
    amount: 1485,
    tasks: 3,
    status: "completed",
    reference: "PAY-2023-1115",
  },
  {
    id: "payout-2",
    date: "2023-10-30",
    amount: 1260,
    tasks: 2,
    status: "completed",
    reference: "PAY-2023-1030",
  },
  {
    id: "payout-3",
    date: "2023-10-15",
    amount: 1505,
    tasks: 4,
    status: "completed",
    reference: "PAY-2023-1015",
  },
  {
    id: "payout-4",
    date: "2023-11-30",
    amount: 855,
    tasks: 2,
    status: "scheduled",
    reference: "PAY-2023-1130",
  },
]

// Mock weekly schedule data
const generateWeeklySchedule = () => {
  const today = new Date()
  const startDay = startOfWeek(today, { weekStartsOn: 1 }) // Start from Monday

  // Generate days for the current week
  const days = eachDayOfInterval({
    start: startDay,
    end: addDays(startDay, 6),
  })

  // Mock schedule data
  const schedule = [
    { day: "Monday", hours: 6, tasks: ["API Integration", "Bug Fixes"] },
    { day: "Tuesday", hours: 4, tasks: ["Frontend Development"] },
    { day: "Wednesday", hours: 5, tasks: ["Database Optimization", "Code Review"] },
    { day: "Thursday", hours: 7, tasks: ["Feature Implementation", "Testing"] },
    { day: "Friday", hours: 0, tasks: [] }, // Day off
    { day: "Saturday", hours: 0, tasks: [] }, // Weekend
    { day: "Sunday", hours: 0, tasks: [] }, // Weekend
  ]

  // Combine dates with schedule data
  return days.map((date, index) => ({
    date,
    ...schedule[index],
  }))
}

const weeklySchedule = generateWeeklySchedule()

export function DeveloperEarnings() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [payoutFilter, setPayoutFilter] = useState("all")
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)

  // Calculate current week dates for the schedule
  const startOfCurrentWeek = startOfWeek(addWeeks(new Date(), currentWeekOffset), { weekStartsOn: 1 })
  const endOfCurrentWeek = addDays(startOfCurrentWeek, 6)
  const currentWeekFormatted = `${format(startOfCurrentWeek, "MMM d")} - ${format(endOfCurrentWeek, "MMM d, yyyy")}`

  // Filter tasks based on date range
  const filteredTasks = mockCompletedTasks.filter((task) => {
    const taskDate = parseISO(task.completedDate)
    if (!dateRange?.from || !dateRange?.to) return true
    return taskDate >= dateRange.from && taskDate <= dateRange.to
  })

  // Filter payouts based on selected filter
  const filteredPayouts = mockPayouts.filter((payout) => {
    if (payoutFilter === "all") return true
    if (payoutFilter === "completed") return payout.status === "completed"
    if (payoutFilter === "scheduled") return payout.status === "scheduled"
    return true
  })

  // Navigate to previous/next week
  const navigateWeek = (direction: number) => {
    setCurrentWeekOffset(currentWeekOffset + direction)
  }

  // Calculate availability percentage
  const availabilityPercentage = (mockEarnings.weeklyScheduled / mockEarnings.weeklyAvailability) * 100

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockEarnings.totalEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+$850</span> pending payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEarnings.hoursWorked}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">
                ${(mockEarnings.totalEarned / mockEarnings.hoursWorked).toFixed(2)}
              </span>{" "}
              avg. hourly rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEarnings.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">{mockEarnings.successRate}%</span> success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEarnings.averageRating}</div>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(mockEarnings.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">
                from {mockCompletedTasks.filter((t) => t.rating > 0).length} reviews
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">
                {mockEarnings.weeklyScheduled}/{mockEarnings.weeklyAvailability}h
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {availabilityPercentage.toFixed(0)}% Booked
              </Badge>
            </div>
            <Progress value={availabilityPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {mockEarnings.weeklyAvailability - mockEarnings.weeklyScheduled} hours available this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">{mockEarnings.successRate}%</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Excellent
              </Badge>
            </div>
            <Progress value={mockEarnings.successRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{mockCompletedTasks.length} tasks completed on time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Earnings Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">+12%</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                Growing
              </Badge>
            </div>
            <div className="h-[60px] flex items-end justify-between gap-1">
              {[35, 45, 30, 65, 85, 55, 75].map((height, i) => (
                <div key={i} className="bg-primary/80 rounded-sm w-full" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Last 7 days</span>
              <span className="text-green-600 font-medium">+$320 vs previous</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Schedule, Tasks, and Payouts */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">
            <Calendar className="h-4 w-4 mr-2" />
            Weekly Schedule
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed Tasks
          </TabsTrigger>
          <TabsTrigger value="payouts">
            <DollarSign className="h-4 w-4 mr-2" />
            Payout History
          </TabsTrigger>
        </TabsList>

        {/* Weekly Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Schedule</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigateWeek(-1)}>
                    Previous
                  </Button>
                  <span className="text-sm font-medium">{currentWeekFormatted}</span>
                  <Button variant="outline" size="sm" onClick={() => navigateWeek(1)}>
                    Next
                  </Button>
                </div>
              </div>
              <CardDescription>Your scheduled tasks and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weeklySchedule.map((day, index) => (
                  <div
                    key={index}
                    className={`border rounded-md p-3 ${day.hours > 0 ? "bg-primary/5 border-primary/20" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="text-center mb-2">
                      <div className="text-xs text-muted-foreground">{format(day.date, "EEE")}</div>
                      <div className="text-lg font-medium">{format(day.date, "d")}</div>
                    </div>

                    {day.hours > 0 ? (
                      <>
                        <div className="text-center text-sm font-medium text-primary mb-2">{day.hours}h scheduled</div>
                        <div className="space-y-1">
                          {day.tasks.map((task, i) => (
                            <div
                              key={i}
                              className="text-xs bg-white border border-primary/10 rounded px-2 py-1 truncate"
                            >
                              {task}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-xs text-muted-foreground mt-4">
                        {format(day.date, "EEEE") === "Saturday" || format(day.date, "EEEE") === "Sunday"
                          ? "Weekend"
                          : "No tasks"}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm font-medium">Weekly Summary</div>
                <div className="text-sm">
                  <span className="font-medium">{mockEarnings.weeklyScheduled} hours</span> scheduled of{" "}
                  <span className="font-medium">{mockEarnings.weeklyAvailability} hours</span> available
                </div>
              </div>

              <Progress
                value={(mockEarnings.weeklyScheduled / mockEarnings.weeklyAvailability) * 100}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completed Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Completed Tasks</CardTitle>
                <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
              </div>
              <CardDescription>
                {filteredTasks.length} tasks completed, $
                {filteredTasks.reduce((sum, task) => sum + task.amount, 0).toLocaleString()} earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead className="hidden md:table-cell">Client</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Rating</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{task.client}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {format(parseISO(task.completedDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">{task.hours}</TableCell>
                        <TableCell className="text-right font-medium">${task.amount}</TableCell>
                        <TableCell className="text-center">
                          {task.rating > 0 ? (
                            <div className="flex items-center justify-center">
                              <span className="mr-1">{task.rating}</span>
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Pending</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {task.status === "paid" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payout History Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Payout History</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={payoutFilter} onValueChange={setPayoutFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter payouts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payouts</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>View your payment history and upcoming payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="hidden sm:table-cell">Tasks</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>{format(parseISO(payout.date), "MMM d, yyyy")}</TableCell>
                        <TableCell className="font-medium">{payout.reference}</TableCell>
                        <TableCell className="hidden sm:table-cell">{payout.tasks} tasks</TableCell>
                        <TableCell className="text-right font-medium">${payout.amount}</TableCell>
                        <TableCell>
                          {payout.status === "completed" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Scheduled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">React.js</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Node.js</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">TypeScript</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Next.js</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Top Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                  EP
                </div>
                <div>
                  <div className="font-medium">E-commerce Platform</div>
                  <div className="text-xs text-muted-foreground">3 tasks · $1,575 earned</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3">
                  SD
                </div>
                <div>
                  <div className="font-medium">SaaS Dashboard</div>
                  <div className="text-xs text-muted-foreground">1 task · $810 earned</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium mr-3">
                  TB
                </div>
                <div>
                  <div className="font-medium">Travel Booking App</div>
                  <div className="text-xs text-muted-foreground">1 task · $270 earned</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-3">
                <div className="font-medium">Database Optimization</div>
                <div className="text-xs text-muted-foreground">Tomorrow · 5 hours estimated</div>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    E-commerce Platform
                  </Badge>
                </div>
              </div>
              <div className="border-l-2 border-blue-400 pl-3">
                <div className="font-medium">User Authentication Flow</div>
                <div className="text-xs text-muted-foreground">In 2 days · 8 hours estimated</div>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    SaaS Dashboard
                  </Badge>
                </div>
              </div>
              <div className="border-l-2 border-green-400 pl-3">
                <div className="font-medium">Mobile Responsive Design</div>
                <div className="text-xs text-muted-foreground">In 4 days · 6 hours estimated</div>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Travel Booking App
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
