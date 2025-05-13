import { Check } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  return (
    <section className="py-24 bg-muted/30" id="pricing">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Flexible Pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Purchase credits to access our network of vetted developers. Choose the plan that works best for your needs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {[
            {
              name: "Starter",
              price: "$50",
              description: "Perfect for small tasks and quick fixes",
              features: [
                "50 credits per month",
                "Access to on-demand developers",
                "AI-determined task pricing",
                "Rollover unused credits (up to 3 months)",
                "Cancel anytime",
              ],
              cta: "Get Started",
              popular: false,
            },
            {
              name: "Professional",
              price: "$100",
              description: "Ideal for regular development needs",
              features: [
                "100 credits per month",
                "Priority access to top developers",
                "AI-determined task pricing",
                "Rollover unused credits (up to 6 months)",
                "Dedicated account manager",
                "Cancel anytime",
              ],
              cta: "Get Started",
              popular: true,
            },
            {
              name: "Enterprise",
              price: "$500",
              description: "For teams with ongoing development needs",
              features: [
                "500 credits per month",
                "VIP access to elite developers",
                "AI-determined task pricing",
                "Rollover unused credits (up to 12 months)",
                "Dedicated account manager",
                "Priority support",
                "Custom invoicing",
                "Cancel anytime",
              ],
              cta: "Get Started",
              popular: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`gradient-border bg-background p-6 rounded-xl relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Pay As You Go Option */}
        <div className="mt-16 mx-auto max-w-3xl rounded-xl border p-8 bg-background">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Pay As You Go</h3>
            <p className="text-muted-foreground">No commitment, pay only for what you need</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "On-Demand Tasks",
                description: "Quick fixes and small features",
                pricing: "AI-determined pricing ($10-50/hr)",
              },
              {
                title: "Booked Sessions",
                description: "Schedule 1-9 hours with a developer",
                pricing: "From $15/hr (based on task complexity)",
              },
              {
                title: "Full-Time Developer",
                description: "Dedicated developer for your project",
                pricing: "Custom pricing (contact us)",
              },
            ].map((option, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{option.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                <p className="text-sm font-medium">{option.pricing}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Get Started</Button>
          </div>
        </div>

        {/* Payment Methods & Security */}
        <div className="mt-12 mx-auto max-w-3xl text-center">
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-4">Secure Payment Methods</h4>
            <div className="flex flex-wrap justify-center gap-6 items-center">
              {/* Credit Card Logos */}
              <div className="flex gap-3 items-center">
                <Image
                  src="/placeholder.svg?height=30&width=45&text=VISA"
                  alt="Visa"
                  width={45}
                  height={30}
                  className="h-8 w-auto"
                />
                <Image
                  src="/placeholder.svg?height=30&width=45&text=MC"
                  alt="Mastercard"
                  width={45}
                  height={30}
                  className="h-8 w-auto"
                />
                <Image
                  src="/placeholder.svg?height=30&width=45&text=AMEX"
                  alt="American Express"
                  width={45}
                  height={30}
                  className="h-8 w-auto"
                />
                <Image
                  src="/placeholder.svg?height=30&width=45&text=DISC"
                  alt="Discover"
                  width={45}
                  height={30}
                  className="h-8 w-auto"
                />
              </div>

              {/* Payment Processor Logos */}
              <div className="flex gap-4 items-center">
                <Image
                  src="/placeholder.svg?height=30&width=80&text=PayPal"
                  alt="PayPal"
                  width={80}
                  height={30}
                  className="h-8 w-auto"
                />
                <Image
                  src="/placeholder.svg?height=30&width=80&text=Stripe"
                  alt="Stripe"
                  width={80}
                  height={30}
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center gap-6 items-center mb-6">
            <div className="flex items-center gap-2 border rounded-full px-4 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span className="text-xs font-medium">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 border rounded-full px-4 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span className="text-xs font-medium">PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-2 border rounded-full px-4 py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
              <span className="text-xs font-medium">Secure Transactions</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Your payment information is securely processed and never stored on our servers. We use industry-standard
            encryption to protect your data.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16 mx-auto max-w-3xl">
          <h4 className="text-lg font-semibold mb-4 text-center">Frequently Asked Questions</h4>
          <div className="space-y-4">
            {[
              {
                question: "How do credits work?",
                answer:
                  "Credits are used to pay for developer time. The number of credits required for a task is determined by our AI based on complexity and estimated time. One credit is roughly equivalent to $1 USD.",
              },
              {
                question: "Can I cancel my subscription?",
                answer:
                  "Yes, you can cancel your subscription at any time. Your credits will remain available until they expire based on your plan's rollover policy.",
              },
              {
                question: "What happens if I run out of credits?",
                answer:
                  "If you run out of credits, you can purchase more or switch to a pay-as-you-go model for individual tasks.",
              },
              {
                question: "How are task prices determined?",
                answer:
                  "Our AI analyzes the complexity, required skills, and estimated time to determine fair rates between $10-50/hour. This ensures standardized pricing and transparent quotes.",
              },
            ].map((faq, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h5 className="font-medium mb-2">{faq.question}</h5>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
