"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import {
  CreditCard,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  Download,
  Eye,
  RefreshCcw,
  Hourglass,
} from "lucide-react"

// Credit package options
const creditPackages = [
  {
    id: "pay-as-you-go",
    name: "Pay-as-you-go",
    price: 20,
    hours: 1,
    pricePerHour: 20,
    savings: 0,
    description: "Perfect for small tasks or one-time projects",
  },
  {
    id: "starter",
    name: "Starter Pack",
    price: 380,
    hours: 20,
    pricePerHour: 19,
    savings: 20,
    description: "Great for getting started with your first project",
  },
  {
    id: "growth",
    name: "Growth Pack",
    price: 850,
    hours: 50,
    pricePerHour: 17,
    savings: 150,
    description: "Our most popular option for growing businesses",
  },
  {
    id: "pro",
    name: "Pro Builder",
    price: 1500,
    hours: 100,
    pricePerHour: 15,
    savings: 500,
    description: "For businesses with multiple ongoing projects",
  },
  {
    id: "master",
    name: "Master Tier",
    price: 1950,
    hours: 150,
    pricePerHour: 13,
    savings: 1050,
    description: "Best value for enterprise-level development needs",
  },
]

// Mock transaction data
const mockTransactions = [
  {
    id: "tx1",
    type: "purchase",
    amount: 700,
    hours: 50,
    date: "2023-11-15T10:30:00Z",
    status: "completed",
    package: "Growth Pack",
  },
  {
    id: "tx2",
    type: "usage",
    amount: -45,
    hours: -3,
    date: "2023-11-14T15:45:00Z",
    status: "completed",
    taskId: "task1",
    taskTitle: "Fix authentication bug in login form",
  },
  {
    id: "tx3",
    type: "usage",
    amount: -195,
    hours: -15,
    date: "2023-11-10T09:15:00Z",
    status: "completed",
    taskId: "task2",
    taskTitle: "Implement payment gateway integration",
  },
  {
    id: "tx4",
    type: "refund",
    amount: 130,
    hours: 10,
    date: "2023-10-28T14:20:00Z",
    status: "completed",
    reference: "REF-2023-001",
  },
]

export function CreditBasedBilling() {
  const [selectedPackage, setSelectedPackage] = useState(creditPackages[1].id)
  const [isProcessing, setIsProcessing] = useState(false)
  const [customHours, setCustomHours] = useState(1)
  const [creditBalance, setCreditBalance] = useState({
    hours: 32,
    hoursUsed: 18,
    totalPurchased: 50,
  })

  // Calculate percentage of credits used
  const percentUsed = Math.round((creditBalance.hoursUsed / creditBalance.totalPurchased) * 100)

  const handlePurchaseCredits = async () => {
    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const selectedPkg = creditPackages.find((pkg) => pkg.id === selectedPackage)

      if (selectedPkg) {
        // Update credit balance
        setCreditBalance((prev) => ({
          ...prev,
          hours: prev.hours + selectedPkg.hours,
          totalPurchased: prev.totalPurchased + selectedPkg.hours,
        }))

        toast({
          title: "Credits purchased successfully",
          description: `You've added ${selectedPkg.hours} hours to your account.`,
        })
      }
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

  const handleCustomHoursChange = (value: string) => {
    const hours = Number.parseInt(value)
    if (!isNaN(hours) && hours > 0) {
      setCustomHours(hours)
    } else {
      setCustomHours(1)
    }
  }

  const getSelectedPackageDetails = () => {
    if (selectedPackage === "custom") {
      return {
        price: customHours * 20,
        hours: customHours,
        pricePerHour: 20,
        savings: 0,
      }
    }
    return creditPackages.find((pkg) => pkg.id === selectedPackage) || creditPackages[0]
  }

  const packageDetails = getSelectedPackageDetails()

  return (
    <div className="space-y-6">
      {/* Credit Balance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditBalance.hours}</div>
            <p className="text-xs text-muted-foreground">Developer hours remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Used</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditBalance.hoursUsed}</div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Total: {creditBalance.totalPurchased} hours</span>
                <span>{percentUsed}% used</span>
              </div>
              <Progress value={percentUsed} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Est. completion: 2 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Hourly Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14.00</div>
            <p className="text-xs text-muted-foreground">Based on your purchases</p>
          </CardContent>
        </Card>
      </div>

      {/* Billing Rules Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Billing Rules</CardTitle>
          <CardDescription>Transparent pricing with no hidden fees</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Only pay for hours actually used by developers</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Unused hours are refundable anytime</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>No hidden fees</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Tabs for Purchase and History */}
      <Tabs defaultValue="purchase" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchase">Purchase Hours</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="purchase" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Developer Hours</CardTitle>
              <CardDescription>Select a package or customize your hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={selectedPackage}
                onValueChange={setSelectedPackage}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
                {creditPackages.map((pkg) => (
                  <div key={pkg.id} className="relative">
                    <RadioGroupItem value={pkg.id} id={pkg.id} className="peer sr-only" />
                    <Label
                      htmlFor={pkg.id}
                      className="flex flex-col h-full p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{pkg.name}</span>
                          <p className="text-xs text-muted-foreground mt-1">{pkg.description}</p>
                        </div>
                        {pkg.savings > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Save ${pkg.savings}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-auto pt-2">
                        <div className="text-xl font-bold">${pkg.price}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground">{pkg.hours} hours</span>
                          <span className="text-sm font-medium">${pkg.pricePerHour}/hr</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
                <div className="relative">
                  <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
                  <Label
                    htmlFor="custom"
                    className="flex flex-col h-full p-4 border rounded-md cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50"
                  >
                    <div className="mb-2">
                      <span className="font-medium">Custom Hours</span>
                      <p className="text-xs text-muted-foreground mt-1">Pay only for what you need</p>
                    </div>
                    <div className="mt-2">
                      <Label htmlFor="custom-hours">Number of Hours</Label>
                      <Input
                        id="custom-hours"
                        type="number"
                        min="1"
                        value={customHours}
                        onChange={(e) => handleCustomHoursChange(e.target.value)}
                        className="mt-1"
                        disabled={selectedPackage !== "custom"}
                      />
                    </div>
                    <div className="mt-auto pt-2">
                      <div className="text-xl font-bold">${customHours * 20}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground">{customHours} hours</span>
                        <span className="text-sm font-medium">$20/hr</span>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="rounded-lg border p-4 bg-muted/30">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Package:</span>
                    <span className="text-sm font-medium">
                      {selectedPackage === "custom" ? "Custom Hours" : packageDetails.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hours:</span>
                    <span className="text-sm font-medium">{packageDetails.hours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate:</span>
                    <span className="text-sm font-medium">${packageDetails.pricePerHour}/hour</span>
                  </div>
                  {packageDetails.savings > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="text-sm">Savings:</span>
                      <span className="text-sm font-medium">-${packageDetails.savings}</span>
                    </div>
                  )}
                  <div className="border-t my-2"></div>
                  <div className="flex items-center justify-between font-medium">
                    <span>Total:</span>
                    <span>${packageDetails.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Payment Method</h3>
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
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handlePurchaseCredits} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Purchase Hours
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View your hour purchases, usage, and refunds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {transaction.type === "purchase"
                            ? `Purchased ${transaction.package}`
                            : transaction.type === "usage"
                              ? `Task: ${transaction.taskTitle}`
                              : `Refund (Ref: ${transaction.reference})`}
                        </TableCell>
                        <TableCell>
                          {transaction.type === "purchase" && (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            >
                              Purchase
                            </Badge>
                          )}
                          {transaction.type === "usage" && (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                            >
                              Usage
                            </Badge>
                          )}
                          {transaction.type === "refund" && (
                            <Badge
                              variant="outline"
                              className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200"
                            >
                              Refund
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.hours > 0 ? "text-green-600" : "text-blue-600"}>
                            {transaction.hours > 0 ? "+" : ""}
                            {transaction.hours}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.amount > 0 ? "text-green-600" : "text-blue-600"}>
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            {transaction.type === "purchase" && (
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline">Load More Transactions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
