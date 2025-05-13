"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/settings/billing/date-range-picker"
import { BillingOverview } from "@/components/settings/billing/billing-overview"
import { BillingByTask } from "@/components/settings/billing/billing-by-task"
import { BillingByDeveloper } from "@/components/settings/billing/billing-by-developer"
import { BillingHistory } from "@/components/settings/billing/billing-history"
import { PaymentMethods } from "@/components/settings/billing/payment-methods"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"

export function BillingSettings() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Billing & Payments</h2>
        <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
      </div>

      <BillingOverview dateRange={dateRange} />

      <Tabs defaultValue="by-task" className="space-y-4">
        <div className="overflow-auto">
          <TabsList className="inline-flex h-auto p-1">
            <TabsTrigger value="by-task">By Task</TabsTrigger>
            <TabsTrigger value="by-developer">By Developer</TabsTrigger>
            <TabsTrigger value="history">Billing History</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="by-task" className="space-y-4">
          <BillingByTask dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="by-developer" className="space-y-4">
          <BillingByDeveloper dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <BillingHistory dateRange={dateRange} />
        </TabsContent>
        <TabsContent value="payment-methods" className="space-y-4">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </div>
  )
}
