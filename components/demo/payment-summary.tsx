import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, DollarSign } from "lucide-react"

interface Developer {
  name: string
  avatar: string
}

interface PaymentSummaryProps {
  taskTitle: string
  developer: Developer
  amount: number
}

export function PaymentSummary({ taskTitle, developer, amount }: PaymentSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
          Payment Complete
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={developer.avatar} alt={developer.name} />
                <AvatarFallback>{developer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{developer.name}</div>
                <div className="text-sm text-muted-foreground">Developer</div>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-1" />
              <span className="text-xl font-bold">${amount}</span>
            </div>
          </div>

          <div className="border-t border-b py-3 my-3">
            <h3 className="font-medium mb-2">Task Details</h3>
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Task:</span>
                <span>{taskTitle}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Completed:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-mono text-xs">
                  TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg text-center">
            <p className="text-sm text-green-600 dark:text-green-400">
              Payment has been successfully processed and the developer has been notified.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
