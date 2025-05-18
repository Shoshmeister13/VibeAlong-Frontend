import type React from "react"
import Image from "next/image"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown"
import { AiSuggestionsDropdown } from "@/components/dashboard/ai-suggestions-dropdown"
import { HelpCircle, Sparkles, CheckCircle, Github, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

export default function VibeCoderDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background shadow-sm">
        <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px:8">
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

              {/* Vibe Plan and Vibe Check Results Links */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground px-2">Vibe Analysis</h3>
                <div className="space-y-1">
                  <Link
                    href="/dashboard/vibeplan"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Vibe Plan</span>
                  </Link>
                  <Link
                    href="/dashboard/vibecheck"
                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Vibe Check Results</span>
                  </Link>
                </div>
              </div>

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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">E-commerce Platform</h1>
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 flex-shrink-0 bg-gray-100 rounded-sm flex items-center justify-center">
                      {/* Try to load the image, fall back to a Terminal icon */}
                      <Image
                        src="/platform-logos/v0-logo.png"
                        alt="v0"
                        width={24}
                        height={24}
                        className="object-contain rounded-sm"
                        onError={(e) => {
                          // If image fails to load, hide it and the fallback icon will show
                          e.currentTarget.style.display = "none"
                        }}
                      />
                      {/* Fallback icon that shows if image fails to load */}
                      <Terminal className="h-4 w-4 absolute opacity-50" />
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs">
                      <Github className="h-3.5 w-3.5" />
                      <span className="font-medium">username/ecommerce-platform</span>
                    </div>
                  </div>
                </div>
                <Link href="/create-project">
                  <Button variant="outline" size="sm" className="gap-1">
                    <span>Edit Project</span>
                  </Button>
                </Link>
              </div>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
