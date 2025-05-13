"use client"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Join VibeAlong</h1>
              <p className="text-xl text-muted-foreground">Choose how you want to participate in our platform</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col p-8 rounded-lg border bg-card text-card-foreground shadow-sm">
                <h2 className="text-2xl font-bold mb-4">I'm a Developer</h2>
                <p className="text-muted-foreground mb-6">
                  Join our network of skilled developers to help transform AI-generated code into production-ready
                  applications.
                </p>
                <div className="mt-auto">
                  <Link href="/signup-dev" className="w-full">
                    <Button size="lg" className="w-full">
                      Join as a Developer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex flex-col p-8 rounded-lg border bg-card text-card-foreground shadow-sm">
                <h2 className="text-2xl font-bold mb-4">I'm a Vibe-Coder</h2>
                <p className="text-muted-foreground mb-6">
                  Get expert help to turn your AI-generated code into production-ready applications.
                </p>
                <div className="mt-auto">
                  <Link href="/vibe-coder-signup" className="w-full">
                    <Button size="lg" className="w-full">
                      Join as a Vibe-Coder
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
