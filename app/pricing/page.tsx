import type { Metadata } from "next"
import { PricingSection } from "@/components/pricing-section"

export const metadata: Metadata = {
  title: "Pricing - VibeAlong",
  description:
    "Simple, flexible pricing options for VibeAlong. Purchase credits to access our network of vetted developers.",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-8">Pricing Plans</h1>
        <PricingSection />
      </div>
    </div>
  )
}
