"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Determine which navigation to show based on the path
  const isDeveloperDashboard = pathname.startsWith("/dashboard/developer")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] pr-0 z-50">
        <div className="px-2 py-6">
          <div className="flex flex-col space-y-2 mb-6">
            <Link
              href="/dashboard"
              className="flex items-center px-3 py-2 text-lg font-semibold"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <div className="h-px bg-border my-2" />
          </div>

          <div className="flex flex-col space-y-1">
            {isDeveloperDashboard ? (
              // Developer navigation items
              <>
                <MobileNavItem href="/dashboard/developer" label="Overview" onClick={() => setOpen(false)} />
                <MobileNavItem href="/dashboard/developer/tasks" label="My Tasks" onClick={() => setOpen(false)} />
                <MobileNavItem
                  href="/dashboard/developer/available-tasks"
                  label="Available Tasks"
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/dashboard/developer/applications"
                  label="My Applications"
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem
                  href="/dashboard/developer/knowledge-hub"
                  label="Knowledge Hub"
                  onClick={() => setOpen(false)}
                />
                <MobileNavItem href="/dashboard/developer/settings" label="Earnings" onClick={() => setOpen(false)} />
              </>
            ) : (
              // Vibe-coder navigation items
              <>
                <MobileNavItem href="/vibe-coder-dashboard" label="Overview" onClick={() => setOpen(false)} />
                <MobileNavItem href="/dashboard/my-tasks" label="My Tasks" onClick={() => setOpen(false)} />
                <MobileNavItem href="/dashboard/vibecheck" label="Vibe Analysis" onClick={() => setOpen(false)} />
                <MobileNavItem href="/dashboard/vibeplan" label="Vibe Plan" onClick={() => setOpen(false)} />
                <MobileNavItem href="/dashboard/my-developers" label="All Developers" onClick={() => setOpen(false)} />
                <MobileNavItem href="/dashboard/knowledge-hub" label="Knowledge Hub" onClick={() => setOpen(false)} />
              </>
            )}

            {/* Common items for both roles */}
            <MobileNavItem href="/dashboard/messages" label="Messages" onClick={() => setOpen(false)} />
            <MobileNavItem href="/dashboard/consultation" label="Consultation" onClick={() => setOpen(false)} />
            <MobileNavItem href="/dashboard/settings" label="Settings" onClick={() => setOpen(false)} />
            <MobileNavItem href="/dashboard/billing" label="Billing" onClick={() => setOpen(false)} />
          </div>

          {/* Expert consultation button */}
          <div className="mt-6 px-2">
            <Button
              variant="default"
              className="w-full justify-center"
              onClick={() => {
                setOpen(false)
                window.location.href = "/dashboard/consultation"
              }}
            >
              Expert Consultation
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Helper component for mobile navigation items
function MobileNavItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 text-sm rounded-md ${
        isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  )
}
