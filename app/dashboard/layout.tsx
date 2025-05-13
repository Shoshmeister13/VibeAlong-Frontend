"use client"

import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown"
import { AISuggestionsDropdown } from "@/components/dashboard/ai-suggestions-dropdown"
import { DeveloperDashboardNav } from "@/components/dashboard/developer-dashboard-nav"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

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
              <Link href="/dashboard" className="flex items-center">
                <div className="relative h-8 w-8 mr-3">
                  <Image src="/icon.png" alt="VibeAlong Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-xl hidden sm:inline-block">VibeAlong</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* AI Suggestions Dropdown */}
              <AISuggestionsDropdown />

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
              {pathname.startsWith("/dashboard/developer") ? <DeveloperDashboardNav /> : <DashboardNav />}
            </aside>
            <main className="flex-1 py-6 md:pl-6">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading tasks...</span>
                  </div>
                }
              >
                {children}
              </Suspense>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
