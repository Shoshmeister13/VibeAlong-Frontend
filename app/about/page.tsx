import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Former tech lead at a major AI company with a passion for connecting developers and vibe-coders.",
      avatar: "/placeholder.svg?height=100&width=100",
      initials: "AJ",
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Full-stack developer with 10+ years of experience building developer tools and platforms.",
      avatar: "/placeholder.svg?height=100&width=100",
      initials: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Developer Relations",
      bio: "Developer advocate with a background in community building and technical education.",
      avatar: "/placeholder.svg?height=100&width=100",
      initials: "MR",
    },
  ]

  return (
    <main className="flex-1">
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">About VibeAlong</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting developers with vibe-coders to turn AI-generated code into production-ready applications.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              At VibeAlong, we believe in the power of collaboration between human developers and AI. Our mission is to
              bridge the gap between AI-generated code and production-ready applications by connecting skilled
              developers with vibe-coders who need their expertise.
            </p>
            <p className="text-muted-foreground">
              We're building a platform that makes it easy for developers to find work opportunities and for vibe-coders
              to get the help they need to turn their ideas into reality.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground mb-4">
              We envision a future where AI and human developers work together seamlessly to create amazing software.
              VibeAlong is our contribution to this future, providing a platform that facilitates collaboration and
              helps both developers and vibe-coders succeed.
            </p>
            <p className="text-muted-foreground">
              Our goal is to become the go-to platform for developers looking for flexible work opportunities and for
              vibe-coders seeking expert help with their projects.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.name}>
                <CardHeader className="text-center pb-2">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-center text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Us on Our Journey</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you're a developer looking for flexible work opportunities or a vibe-coder seeking expert help, we'd
            love to have you join our community.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Sign Up as a Developer
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
