import type React from "react"
import Image from "next/image"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown"
import { AiSuggestionsDropdown } from "@/components/dashboard/ai-suggestions-dropdown"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"
import { Sparkles } from "lucide-react"

export default function VibeCoderDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background shadow-sm">
        <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              {/* Hamburger menu - only visible on mobile */}
              <div className="md:hidden mr-2">
                <MobileNav />
              </div>

              {/* Logo with icon and text */}
              <Link href="/vibe-coder-dashboard" className="flex items-center">
                <div className="relative h-8 w-8 mr-3">
                  <Image src="/icon.png" alt="VibeAlong Logo" fill className="object-contain" priority />
                </div>
                <span className="font-bold text-xl hidden sm:inline-block">VibeAlong</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Vibe Credits Counter */}
              <Link
                href="/dashboard/settings"
                className="hidden sm:flex items-center gap-1 px-2 py-1 bg-primary/10 hover:bg-primary/15 text-primary rounded-full text-xs transition-colors"
              >
                <span>✨</span>
                <span className="font-medium">10/120</span>
              </Link>

              {/* AI Suggestions Dropdown */}
              <AiSuggestionsDropdown />

              {/* Notifications Dropdown */}
              <NotificationsDropdown />

              {/* Help/Tutorial Button */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <HelpCircle className="h-5 w-5" />
              </Button>

              {/* User Navigation */}
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex">
          <div className="flex flex-col md:flex-row w-full">
            <aside className="hidden md:block w-64 shrink-0 border-r pr-4 py-6 sticky top-16 self-start">
              <DashboardNav />

              {/* Vibe Check Button */}
              <div className="mt-6 pt-6 border-t">
                <Link href="/dashboard/vibe-check">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium">Run a Vibe Check</span>
                  </Button>
                </Link>
              </div>
            </aside>
            <main className="flex-1 py-6 md:pl-6">
              <h1 className="text-3xl font-bold tracking-tight mb-4">E-commerce Platform</h1>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
