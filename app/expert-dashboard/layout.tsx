import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { NotificationsDropdown } from "@/components/dashboard/notifications-dropdown"

export default function ExpertDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4 md:gap-8">
            <MobileNav />
            <span className="hidden font-bold md:inline-block">VibeAlong</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsDropdown />
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] md:gap-6 lg:gap-10 overflow-hidden">
          <aside className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r dashboard-scrollbar">
            <DashboardNav className="p-4" isExpertDashboard={true} />
          </aside>
          <main className="flex w-full flex-col overflow-y-auto h-[calc(100vh-4rem)] p-4 md:py-8 dashboard-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
