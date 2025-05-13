import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface BenefitCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-5px] border-t-4 border-t-primary">
      <CardContent className="p-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
