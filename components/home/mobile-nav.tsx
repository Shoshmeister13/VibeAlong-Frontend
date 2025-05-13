"use client"

import * as React from "react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function HomeMobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <div className="flex flex-col space-y-3 py-4">
            <Link
              href="/"
              className="px-3 py-2 text-base font-medium rounded-md bg-muted"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            {/* For Developers link removed */}
            <Link
              href="/pricing"
              className="px-3 py-2 text-base font-medium rounded-md hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/auth/login"
              className="px-3 py-2 text-base font-medium rounded-md hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-3 py-2 text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
