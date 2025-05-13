import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ProjectSettingsProps {
  project: any
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Update your project information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" defaultValue={project.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" defaultValue={project.description} className="min-h-[120px]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-type">Project Type</Label>
              <Select defaultValue="web">
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Application</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="desktop">Desktop App</SelectItem>
                  <SelectItem value="api">API / Backend</SelectItem>
                  <SelectItem value="design">UI/UX Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={project.status}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="repository">Repository URL</Label>
            <Input id="repository" placeholder="https://github.com/username/repo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tech-stack">Tech Stack</Label>
            <Input
              id="tech-stack"
              defaultValue={project.techStack.join(", ")}
              placeholder="React, Node.js, MongoDB, etc."
            />
            <p className="text-xs text-muted-foreground">Comma-separated list of technologies used in your project</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Collaboration Settings</CardTitle>
            <CardDescription>Manage how developers can collaborate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-project">Public Project</Label>
                <p className="text-xs text-muted-foreground">Allow developers to discover your project</p>
              </div>
              <Switch id="public-project" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-approve">Auto-approve Collaborators</Label>
                <p className="text-xs text-muted-foreground">Automatically approve collaboration requests</p>
              </div>
              <Switch id="auto-approve" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="real-time-editing">Real-time Editing</Label>
                <p className="text-xs text-muted-foreground">Allow multiple developers to edit simultaneously</p>
              </div>
              <Switch id="real-time-editing" defaultChecked />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-destructive/20 p-4">
              <h4 className="font-medium text-destructive">Archive Project</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Archive this project and make it read-only for all collaborators.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Archive Project
              </Button>
            </div>
            <div className="rounded-lg border border-destructive/20 p-4">
              <h4 className="font-medium text-destructive">Delete Project</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Permanently delete this project and all associated data.
              </p>
              <Button variant="destructive" className="mt-4 w-full">
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
