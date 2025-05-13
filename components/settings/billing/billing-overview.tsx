"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { DollarSign, Users, CheckCircle, TrendingUp } from "lucide-react"

interface BillingOverviewProps {
  dateRange: DateRange | undefined
}

export function BillingOverview({ dateRange }: BillingOverviewProps) {
  // Mock data - in a real app, this would come from an API call
  const billingData = {
    currentSpend: 8750,
    budget: 10000,
    percentUsed: 87.5,
    tasksBilled: 42,
    activeDevelopers: 8,
    avgTaskCost: 208.33,
    topExpense: "Frontend Development",
    topExpenseAmount: 3200,
  }

  const formatDateRange = () => {
    if (!dateRange?.from) return "No date selected"
    if (!dateRange.to) return `From ${format(dateRange.from, "PPP")}`
    return `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Billing Overview</CardTitle>
          <CardDescription>{formatDateRange()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Spend</span>
                <span className="text-sm text-muted-foreground">${billingData.currentSpend.toLocaleString()}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Budget: ${billingData.budget.toLocaleString()}</span>
                  <span>{billingData.percentUsed}%</span>
                </div>
                <Progress value={billingData.percentUsed} className="h-2" />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{billingData.tasksBilled}</div>
                  <div className="text-xs text-muted-foreground">Tasks Billed</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{billingData.activeDevelopers}</div>
                  <div className="text-xs text-muted-foreground">Active Developers</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">${billingData.avgTaskCost.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Avg. Task Cost</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-medium">{billingData.topExpense}</div>
                    <div className="text-sm text-muted-foreground">
                      ${billingData.topExpenseAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Spending Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[80px] flex items-center justify-center">
                <div className="text-center text-sm text-muted-foreground">
                  Spending trend visualization would go here
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
