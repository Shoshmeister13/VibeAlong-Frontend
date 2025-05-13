"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HomeMobileNav } from "@/components/home/mobile-nav"
import Image from "next/image"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="VibeAlong Logo" width={53} height={53} priority className="h-8 w-auto" />
          </Link>
        </div>

        {/* Centered navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-foreground",
            )}
          >
            Home
          </Link>
          <Link
            href="/for-developers"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/for-developers" ? "text-primary" : "text-foreground",
            )}
          >
            For Developers
          </Link>
          <Link
            href="/vibe-coders"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/vibe-coders" ? "text-primary" : "text-foreground",
            )}
          >
            For Vibe-Coders
          </Link>
          <Link
            href="/demo"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/demo" ? "text-primary" : "text-foreground",
            )}
          >
            Demo
          </Link>
        </nav>

        {/* CTA buttons on the right */}
        <div className="flex items-center gap-3">
          <Link href="/vibe-coder-signup">
            <Button variant="outline" className="hidden sm:flex">
              Sign-up as a Vibe Coder
            </Button>
          </Link>
          <Link href="/#developer-application">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Apply as a Vibe Expert</Button>
          </Link>

          <HomeMobileNav />
        </div>
      </div>
    </header>
  )
}
