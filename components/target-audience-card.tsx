import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface TargetAudienceCardProps {
  icon: ReactNode
  title: string
  description: string
  features: string[]
}

export function TargetAudienceCard({ icon, title, description, features }: TargetAudienceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-xl group">
      <CardContent className="p-8">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <h3 className="mb-3 text-2xl font-bold">{title}</h3>
        <p className="mb-6 text-muted-foreground">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check className="h-4 w-4" />
              </div>
              <span className="font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
