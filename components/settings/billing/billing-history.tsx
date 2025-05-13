"use client"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

interface BillingHistoryProps {
  dateRange: DateRange | undefined
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "overdue"
  description: string
}

export function BillingHistory({ dateRange }: BillingHistoryProps) {
  // Mock data - in a real app, this would come from an API call
  const invoices: Invoice[] = [
    {
      id: "INV-2023-001",
      date: "2023-04-01",
      amount: 3250,
      status: "paid",
      description: "April 2023 Developer Services",
    },
    {
      id: "INV-2023-002",
      date: "2023-05-01",
      amount: 4120,
      status: "paid",
      description: "May 2023 Developer Services",
    },
    {
      id: "INV-2023-003",
      date: "2023-06-01",
      amount: 3875,
      status: "paid",
      description: "June 2023 Developer Services",
    },
    {
      id: "INV-2023-004",
      date: "2023-07-01",
      amount: 4500,
      status: "pending",
      description: "July 2023 Developer Services",
    },
    {
      id: "INV-2023-005",
      date: "2023-08-01",
      amount: 2950,
      status: "overdue",
      description: "August 2023 Developer Services",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-500">
            Paid
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View your past invoices and payment history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell className="hidden sm:table-cell">{new Date(invoice.date).toLocaleDateString()}</TableCell>
                  <TableCell className="hidden md:table-cell">{invoice.description}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
