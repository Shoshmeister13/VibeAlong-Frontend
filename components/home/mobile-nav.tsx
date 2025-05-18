"use client"

import type * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function HomeMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pr-0">
        <div className="flex flex-col space-y-4 mt-6">
          <Button asChild className="w-full bg-primary hover:bg-primary/90">
            <Link href="/#developer-application">Apply as a Vibe Expert</Link>
          </Button>
          <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
            <Link href="/vibe-coder-signup">Join as a Vibe Coder</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

function MobileLink({ href, children, className }: MobileLinkProps) {
  return (
    <Link href={href} className={`text-foreground/70 transition-colors hover:text-foreground ${className || ""}`}>
      {children}
    </Link>
  )
}
