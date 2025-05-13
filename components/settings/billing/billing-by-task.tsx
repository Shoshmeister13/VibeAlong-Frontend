"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown, Download } from "lucide-react"

interface BillingByTaskProps {
  dateRange: DateRange | undefined
}

interface TaskBilling {
  id: string
  name: string
  category: string
  developer: string
  hours: number
  cost: number
  date: string
  status: "completed" | "in-progress" | "pending"
}

export function BillingByTask({ dateRange }: BillingByTaskProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<keyof TaskBilling>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Mock data - in a real app, this would come from an API call
  const taskBillings: TaskBilling[] = [
    {
      id: "TASK-1234",
      name: "Implement user authentication",
      category: "Backend Development",
      developer: "John Smith",
      hours: 8.5,
      cost: 850,
      date: "2023-04-05",
      status: "completed",
    },
    {
      id: "TASK-1235",
      name: "Design landing page",
      category: "UI/UX Design",
      developer: "Sarah Johnson",
      hours: 12,
      cost: 1200,
      date: "2023-04-07",
      status: "completed",
    },
    {
      id: "TASK-1236",
      name: "Fix payment gateway bugs",
      category: "Backend Development",
      developer: "Mike Chen",
      hours: 4.5,
      cost: 450,
      date: "2023-04-08",
      status: "completed",
    },
    {
      id: "TASK-1237",
      name: "Implement responsive design",
      category: "Frontend Development",
      developer: "Emma Davis",
      hours: 6,
      cost: 600,
      date: "2023-04-10",
      status: "in-progress",
    },
    {
      id: "TASK-1238",
      name: "Set up CI/CD pipeline",
      category: "DevOps",
      developer: "Alex Turner",
      hours: 5,
      cost: 500,
      date: "2023-04-12",
      status: "pending",
    },
  ]

  const handleSort = (column: keyof TaskBilling) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const filteredTasks = taskBillings.filter(
    (task) =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "cost" || sortBy === "hours") {
      return sortDirection === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    }

    return sortDirection === "asc" ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy])
  })

  const totalCost = sortedTasks.reduce((sum, task) => sum + task.cost, 0)
  const totalHours = sortedTasks.reduce((sum, task) => sum + task.hours, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing by Task</CardTitle>
        <CardDescription>View and analyze costs by individual tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Task Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Developer</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("hours")} className="h-8 px-2">
                    Hours
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("cost")} className="h-8 px-2">
                    Cost
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("date")} className="h-8 px-2">
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>{task.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{task.category}</TableCell>
                  <TableCell className="hidden sm:table-cell">{task.developer}</TableCell>
                  <TableCell className="text-right">{task.hours}</TableCell>
                  <TableCell className="text-right">${task.cost}</TableCell>
                  <TableCell className="hidden sm:table-cell">{new Date(task.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === "completed"
                          ? "default"
                          : task.status === "in-progress"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={4} className="font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-medium">{totalHours.toFixed(1)}</TableCell>
                <TableCell className="text-right font-medium">${totalCost}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
