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
        <MobileLink href="/" className="flex items-center">
          <span className="font-bold">VibeAlong</span>
        </MobileLink>
        <div className="flex flex-col space-y-3 mt-4">
          <MobileLink href="/for-developers">For Developers</MobileLink>
          <MobileLink href="/vibe-coders">For Vibe-Coders</MobileLink>
          <MobileLink href="/vibecheck/start">Start VibeCheck</MobileLink>
          <MobileLink href="/vibe-coder-signup">Sign-up as a Vibe Coder</MobileLink>
          <MobileLink href="/#developer-application" className="font-bold text-primary">
            Apply as a Vibe Expert
          </MobileLink>
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
