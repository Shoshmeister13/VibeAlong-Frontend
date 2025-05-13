import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ArrowRight, Check, Github, Brain, ClipboardList } from "lucide-react"

export default function VibeCheckPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="container max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              🔍 <span className="text-primary">Vibe-Check</span> Your Project
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Get expert-grade insights on your code — repo scan, score, and improvement plan in seconds.
            </p>
            <Button size="lg" className="gap-2 text-lg px-8 py-6 h-auto">
              Run Vibe-Check <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Github className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Connect your GitHub repo</h3>
                <p className="text-muted-foreground">Securely connect your repository with just a few clicks.</p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. We analyze your structure, setup, and gaps</h3>
                <p className="text-muted-foreground">
                  Our AI + expert system reviews your code quality, architecture, and best practices.
                </p>
              </div>
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. You get a score + next steps to improve it</h3>
                <p className="text-muted-foreground">
                  Receive a detailed report with actionable recommendations to level up your project.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-16 px-4">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Build-readiness score</h3>
                  <p className="text-muted-foreground">
                    Know exactly where your project stands with our comprehensive scoring system that evaluates code
                    quality, architecture, and deployment readiness.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Expert + AI-powered feedback</h3>
                  <p className="text-muted-foreground">
                    Get insights that combine the precision of AI with the wisdom of experienced developers who know
                    what makes production-ready code.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Actionable fixes you can implement or hand to a dev</h3>
                  <p className="text-muted-foreground">
                    Each recommendation comes with clear steps to implement, whether you're doing it yourself or passing
                    it to your development team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 bg-muted/30 text-center">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to check your build?</h2>
            <Button size="lg" className="gap-2 text-lg px-8 py-6 h-auto mb-4">
              🚀 Start Free Vibe-Check <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-muted-foreground">No credit card. No commitment.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
