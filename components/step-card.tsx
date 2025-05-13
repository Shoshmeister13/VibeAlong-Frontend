import { Card, CardContent } from "@/components/ui/card"

interface StepCardProps {
  number: number
  title: string
  description: string
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-5px] relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
      <CardContent className="p-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <span className="text-xl font-bold">{number}</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
