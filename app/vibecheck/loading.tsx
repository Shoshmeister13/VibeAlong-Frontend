import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="py-20 px-4 text-center">
          <div className="container max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-10" />
            <Skeleton className="h-12 w-48 mx-auto" />
          </div>
        </section>

        {/* How It Works Section Skeleton */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container max-w-5xl mx-auto">
            <Skeleton className="h-10 w-64 mx-auto mb-12" />
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-background rounded-lg p-6 shadow-sm">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get Section Skeleton */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <Skeleton className="h-10 w-64 mx-auto mb-12" />
            <div className="space-y-6 max-w-2xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section Skeleton */}
        <section className="py-20 px-4 bg-muted/30 text-center">
          <div className="container max-w-4xl mx-auto">
            <Skeleton className="h-10 w-72 mx-auto mb-6" />
            <Skeleton className="h-12 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
