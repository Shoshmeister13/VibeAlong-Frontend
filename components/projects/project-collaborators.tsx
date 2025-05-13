import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ProjectCollaboratorsProps {
  project: any
}

export function ProjectCollaborators({ project }: ProjectCollaboratorsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Current Collaborators</CardTitle>
          <CardDescription>Developers currently working on this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.collaborators.map((collaborator: any) => (
              <div key={collaborator.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                    <AvatarFallback>
                      {collaborator.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{collaborator.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">{collaborator.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      collaborator.status === "active"
                        ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                    }
                  >
                    {collaborator.status === "active" ? "Active" : "Pending"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invite Developer</CardTitle>
          <CardDescription>Generate a magic link for instant access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Magic Link</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Generate a secure link that allows developers to instantly join your project without registration.
              </p>
              <Button className="mt-4 w-full">Generate Magic Link</Button>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Email Invite</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Send an email invitation to a developer to join your project.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Send Email Invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>AI Developer Matching</CardTitle>
          <CardDescription>Find the perfect developer for your project based on expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm font-medium">Project Requirements</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on your project details, we recommend developers with the following skills:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {project.techStack.map((tech: string) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={`Developer ${i}`} />
                      <AvatarFallback>D{i}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Developer {i}</div>
                      <div className="text-sm text-muted-foreground">
                        {i === 1 ? "React Expert" : i === 2 ? "Node.js Developer" : "MongoDB Specialist"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(i === 1
                      ? ["React", "TypeScript", "Tailwind"]
                      : i === 2
                        ? ["Node.js", "Express", "API"]
                        : ["MongoDB", "Database", "Backend"]
                    ).map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Match:</span>{" "}
                      <span className="text-green-500">{i === 1 ? "95%" : i === 2 ? "87%" : "82%"}</span>
                    </div>
                    <Button size="sm">Invite</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
