"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/projects/file-uploader"
import { useSupabase } from "@/components/providers/supabase-provider"
import Image from "next/image"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  project_type: z.string(),
  repository_url: z.string().url().optional().or(z.literal("")),
  tech_stack: z.string(),
})

export function NewProjectForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [uploadMethod, setUploadMethod] = React.useState<string>("manual")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      project_type: "web",
      repository_url: "",
      tech_stack: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // First, get the vibe_coder ID from the vibe_coders table
      const { data: vibeCoder, error: vibeCoderError } = await supabase
        .from("vibe_coders")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (vibeCoderError || !vibeCoder) {
        throw new Error(`Error fetching vibe_coder: ${vibeCoderError?.message || "No vibe_coder found"}`)
      }

      const techStackArray = values.tech_stack
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")

      // Insert the project into Supabase
      const { data, error } = await supabase
        .from("vibe_projects")
        .insert({
          project_name: values.name,
          description: values.description,
          project_type: values.project_type,
          repository_url: values.repository_url || null,
          stack: techStackArray,
          status: "draft",
          vibe_coder_id: vibeCoder.id, // Use the vibe_coder ID from the vibe_coders table
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      toast({
        title: "Project created",
        description: "Your project has been created successfully.",
      })

      router.push(`/dashboard/projects/${data.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Platform integration options with updated logos
  const platformIntegrations = [
    {
      id: "github",
      name: "GitHub",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
    {
      id: "lovable",
      name: "Lovable",
      icon: (
        <div className="relative h-8 w-8 overflow-hidden rounded-lg">
          <Image src="/platform-logos/lovable-logo.jpeg" alt="Lovable" fill className="object-cover" />
        </div>
      ),
    },
    {
      id: "bolt",
      name: "Bolt",
      icon: (
        <div className="relative h-8 w-8 overflow-hidden">
          <Image src="/platform-logos/bolt-logo.png" alt="Bolt" fill className="object-contain" />
        </div>
      ),
    },
    {
      id: "replit",
      name: "Replit",
      icon: (
        <div className="relative h-8 w-8 overflow-hidden rounded-2xl">
          <Image src="/platform-logos/replit-logo.png" alt="Replit" fill className="object-cover" />
        </div>
      ),
    },
  ]

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="manual" onValueChange={setUploadMethod}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>
          <TabsContent value="manual" className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Awesome Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project and what you need help with..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="project_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="web">Web Application</SelectItem>
                            <SelectItem value="mobile">Mobile App</SelectItem>
                            <SelectItem value="desktop">Desktop App</SelectItem>
                            <SelectItem value="api">API / Backend</SelectItem>
                            <SelectItem value="design">UI/UX Design</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repository_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Repository URL (Optional)</FormLabel>
                        <div className="space-y-3">
                          <FormControl>
                            <Input placeholder="https://github.com/username/repo" {...field} />
                          </FormControl>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex items-center gap-2 flex-1"
                              onClick={() => {
                                toast({
                                  title: "GitHub Integration",
                                  description: "Connecting to GitHub repositories...",
                                })
                                // GitHub integration logic would go here
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                              </svg>
                              Connect GitHub
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex items-center gap-2 flex-1"
                              onClick={() => {
                                toast({
                                  title: "GitLab Integration",
                                  description: "Connecting to GitLab repositories...",
                                })
                                // GitLab integration logic would go here
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z" />
                              </svg>
                              Connect GitLab
                            </Button>
                          </div>
                          <FormDescription>Link to your GitHub, GitLab, or Bitbucket repository</FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tech_stack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tech Stack</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node.js, MongoDB, etc." {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of technologies used in your project</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Project..." : "Create Project"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="upload" className="pt-4">
            <FileUploader />
          </TabsContent>
          <TabsContent value="integration" className="pt-4">
            <div className="flex flex-col gap-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Connect with External Services</h3>
                <p className="text-sm text-muted-foreground mt-2">Import your project directly from these platforms</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {platformIntegrations.map((platform) => (
                  <Button key={platform.id} variant="outline" className="h-24 flex flex-col gap-2">
                    <div className="flex items-center justify-center h-10">{platform.icon}</div>
                    <span>{platform.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
