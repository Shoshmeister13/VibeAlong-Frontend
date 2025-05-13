"use client"

import { CreditBasedBilling } from "@/components/settings/credit-based-billing"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Credits</h1>
        <p className="text-muted-foreground">Manage your developer hours and billing preferences.</p>
      </div>

      <CreditBasedBilling />
    </div>
  )
}
