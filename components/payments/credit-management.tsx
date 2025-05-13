"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { CreditCard, DollarSign, Clock, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    type: "purchase",
    amount: 100,
    credits: 100,
    date: "2023-11-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "tx2",
    type: "task",
    amount: -50,
    credits: -50,
    date: "2023-11-14T15:45:00Z",
    status: "completed",
    taskId: "task1",
    taskTitle: "Fix authentication bug in login form",
  },
  {
    id: "tx3",
    type: "booking",
    amount: -150,
    credits: -150,
    date: "2023-11-10T09:15:00Z",
    status: "completed",
    bookingId: "booking1",
    bookingTitle: "3-hour session on payment integration",
  },
]

export function CreditManagement() {
  const [credits, setCredits] = React.useState(250)
  const [purchaseAmount, setPurchaseAmount] = React.useState(100)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handlePurchaseCredits = async () => {
    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update credits
      setCredits((prev) => prev + purchaseAmount)

      toast({
        title: "Credits purchased",
        description: `You've successfully purchased ${purchaseAmount} credits.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase credits. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{credits}</div>
            <p className="text-xs text-muted-foreground">1 credit = $1 USD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent This Month</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">200</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Estimated completion: 2 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Next: Nov 20, 10:00 AM</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="purchase">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchase">Purchase Credits</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Credits</CardTitle>
              <CardDescription>Add credits to your account to request developer help</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={purchaseAmount === 50 ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPurchaseAmount(50)}
                >
                  50
                </Button>
                <Button
                  variant={purchaseAmount === 100 ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPurchaseAmount(100)}
                >
                  100
                </Button>
                <Button
                  variant={purchaseAmount === 200 ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPurchaseAmount(200)}
                >
                  200
                </Button>
                <Button
                  variant={purchaseAmount === 500 ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPurchaseAmount(500)}
                >
                  500
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  min="10"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount:</span>
                  <span className="text-sm">${purchaseAmount}.00</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium">Credits:</span>
                  <span className="text-sm">{purchaseAmount}</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex items-center justify-between font-medium">
                  <span>Total:</span>
                  <span>${purchaseAmount}.00</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="4242 4242 4242 4242" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handlePurchaseCredits} disabled={isProcessing || purchaseAmount <= 0}>
                {isProcessing ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Purchase Credits
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your credit purchases and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${
                          transaction.type === "purchase" ? "bg-green-500/10" : "bg-blue-500/10"
                        }`}
                      >
                        {transaction.type === "purchase" ? (
                          <Plus
                            className={`h-4 w-4 ${
                              transaction.type === "purchase" ? "text-green-500" : "text-blue-500"
                            }`}
                          />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.type === "purchase"
                            ? "Credit Purchase"
                            : transaction.type === "task"
                              ? `Task: ${transaction.taskTitle}`
                              : `Booking: ${transaction.bookingTitle}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()} at{" "}
                          {new Date(transaction.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${transaction.credits > 0 ? "text-green-500" : "text-blue-500"}`}>
                        {transaction.credits > 0 ? "+" : ""}
                        {transaction.credits} credits
                      </div>
                      <div className="text-xs text-muted-foreground">${Math.abs(transaction.amount).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Load More Transactions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Calendar icon component
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
