"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown, Download, BarChart2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface BillingByDeveloperProps {
  dateRange: DateRange | undefined
}

interface DeveloperBilling {
  id: string
  name: string
  avatar: string
  tasks: number
  hours: number
  cost: number
  efficiency: number
}

export function BillingByDeveloper({ dateRange }: BillingByDeveloperProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<keyof DeveloperBilling>("cost")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Mock data - in a real app, this would come from an API call
  const developerBillings: DeveloperBilling[] = [
    {
      id: "DEV-001",
      name: "John Smith",
      avatar: "/placeholder.svg",
      tasks: 12,
      hours: 48,
      cost: 4800,
      efficiency: 92,
    },
    {
      id: "DEV-002",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      tasks: 8,
      hours: 32,
      cost: 3200,
      efficiency: 88,
    },
    {
      id: "DEV-003",
      name: "Mike Chen",
      avatar: "/placeholder.svg",
      tasks: 15,
      hours: 60,
      cost: 6000,
      efficiency: 95,
    },
    {
      id: "DEV-004",
      name: "Emma Davis",
      avatar: "/placeholder.svg",
      tasks: 10,
      hours: 40,
      cost: 4000,
      efficiency: 90,
    },
    {
      id: "DEV-005",
      name: "Alex Turner",
      avatar: "/placeholder.svg",
      tasks: 6,
      hours: 24,
      cost: 2400,
      efficiency: 85,
    },
  ]

  const handleSort = (column: keyof DeveloperBilling) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const filteredDevelopers = developerBillings.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
    if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") {
      return sortDirection === "asc"
        ? (a[sortBy] as number) - (b[sortBy] as number)
        : (b[sortBy] as number) - (a[sortBy] as number)
    }

    return sortDirection === "asc"
      ? String(a[sortBy]).localeCompare(String(b[sortBy]))
      : String(b[sortBy]).localeCompare(String(a[sortBy]))
  })

  const totalCost = sortedDevelopers.reduce((sum, dev) => sum + dev.cost, 0)
  const totalHours = sortedDevelopers.reduce((sum, dev) => sum + dev.hours, 0)
  const totalTasks = sortedDevelopers.reduce((sum, dev) => sum + dev.tasks, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing by Developer</CardTitle>
        <CardDescription>View and analyze costs by individual developers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search developers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">View Charts</span>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("tasks")} className="h-8 px-2">
                    Tasks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
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
                <TableHead className="hidden md:table-cell">
                  <Button variant="ghost" size="sm" onClick={() => handleSort("efficiency")} className="h-8 px-2">
                    Efficiency
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDevelopers.map((dev) => (
                <TableRow key={dev.id}>
                  <TableCell className="font-medium">{dev.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={dev.avatar || "/placeholder.svg"} alt={dev.name} />
                        <AvatarFallback>
                          {dev.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{dev.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{dev.tasks}</TableCell>
                  <TableCell className="text-right">{dev.hours}</TableCell>
                  <TableCell className="text-right">${dev.cost.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={dev.efficiency} className="h-2" />
                      <span className="text-sm">{dev.efficiency}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={2} className="font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-medium">{totalTasks}</TableCell>
                <TableCell className="text-right font-medium">{totalHours}</TableCell>
                <TableCell className="text-right font-medium">${totalCost.toLocaleString()}</TableCell>
                <TableCell className="hidden md:table-cell"></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
