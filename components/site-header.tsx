"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HomeMobileNav } from "@/components/home/mobile-nav"
import Image from "next/image"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo section */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="VibeAlong Logo" width={53} height={53} priority className="h-8 w-auto" />
            <span className="font-bold text-xl hidden sm:inline-block">VibeAlong</span>
          </Link>

          {/* X/Twitter Follow Link */}
          <a
            href="https://x.com/VibeAlongHQ/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="flex items-center justify-center">
              <Image src="/images/x-logo.png" alt="X Logo" width={20} height={20} className="w-5 h-5" />
            </div>
            <span>
              Follow us <span className="text-primary font-semibold">#AdoptaVibeCoder</span>
            </span>
          </a>
        </div>

        {/* Navigation and CTA buttons on the right */}
        <div className="flex items-center gap-6">
          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link href="/vibe-coder-signup">
              <Button variant="outline" className="hidden sm:flex">
                Sign-up as a Vibe Coder
              </Button>
            </Link>
            <Link href="/#developer-application" className="hidden md:block">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Apply as a Vibe Expert</Button>
            </Link>

            <HomeMobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
