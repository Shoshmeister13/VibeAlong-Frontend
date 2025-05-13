"use client"

import { Button } from "@/components/ui/button"
import { CollaborationSpace } from "@/components/collaboration/collaboration-space"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AuthProvider } from "@/components/providers/auth-provider"

export default function CollaborationPage({ params }: { params: { id: string } }) {
  return (
    <AuthProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Collaboration Session</h1>
        </div>

        <CollaborationSpace taskId={params.id} />
      </div>
    </AuthProvider>
  )
}
