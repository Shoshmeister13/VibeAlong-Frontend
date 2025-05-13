"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Loader2, X, CheckCircle, Search } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { submitDeveloperApplication } from "@/app/actions/developer-actions"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

// Update the VALID_AVAILABILITY_OPTIONS array to match the exact values
const VALID_AVAILABILITY_OPTIONS = [
  { value: "Full-Time", label: "Full-Time (40+ hrs/week)" },
  { value: "Part-Time", label: "Part-Time (20-30 hrs/week)" },
  { value: "Occasional", label: "Occasional (5-15 hrs/week)" },
]

// Expanded list of vibe coding tools
const vibeCodingTools = [
  // AI Coding Assistants
  { id: "lovable", label: "Lovable AI" },
  { id: "replit", label: "Replit" },
  { id: "v0", label: "V0 by Vercel" },
  { id: "cursor", label: "Cursor" },
  { id: "windsurf", label: "Windsurf" },
  { id: "github-copilot", label: "GitHub Copilot" },
  { id: "codeium", label: "Codeium" },
  { id: "claude", label: "Claude AI" },
  { id: "tabnine", label: "Tabnine" },
  { id: "codegpt", label: "CodeGPT" },
  { id: "cody", label: "Sourcegraph Cody" },
  { id: "gitlab-ai", label: "GitLab AI" },
  { id: "bard", label: "Google Bard" },
  { id: "code-whisperer", label: "Amazon CodeWhisperer" },

  // Collaborative Coding Platforms
  { id: "vs-code-live-share", label: "VS Code Live Share" },
  { id: "codesandbox", label: "CodeSandbox" },
  { id: "stackblitz", label: "StackBlitz" },
  { id: "codepen", label: "CodePen" },
  { id: "glitch", label: "Glitch" },
  { id: "gitpod", label: "Gitpod" },

  // Collaboration Methods
  { id: "pair-programming", label: "Pair Programming" },
  { id: "mob-programming", label: "Mob Programming" },
  { id: "remote-collaboration", label: "Remote Collaboration" },
  { id: "discord-coding", label: "Discord Coding" },
  { id: "slack-huddles", label: "Slack Huddles" },
  { id: "zoom-screen-sharing", label: "Zoom Screen Sharing" },
  { id: "jetbrains-code-with-me", label: "JetBrains Code With Me" },
  { id: "tuple", label: "Tuple" },
  { id: "teletype-atom", label: "Teletype for Atom" },
  { id: "visual-studio-live-share", label: "Visual Studio Live Share" },
  { id: "codetogether", label: "CodeTogether" },
  { id: "floobits", label: "Floobits" },
]

// Expanded list of programming skills
const programmingSkills = [
  // Frontend
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "react", label: "React" },
  { id: "nextjs", label: "Next.js" },
  { id: "vue", label: "Vue.js" },
  { id: "angular", label: "Angular" },
  { id: "svelte", label: "Svelte" },
  { id: "html", label: "HTML5" },
  { id: "css", label: "CSS3" },
  { id: "tailwind", label: "Tailwind CSS" },
  { id: "sass", label: "SASS/SCSS" },
  { id: "css-in-js", label: "CSS-in-JS" },
  { id: "redux", label: "Redux" },
  { id: "zustand", label: "Zustand" },
  { id: "jotai", label: "Jotai" },
  { id: "react-query", label: "React Query" },
  { id: "swr", label: "SWR" },

  // Backend
  { id: "nodejs", label: "Node.js" },
  { id: "express", label: "Express.js" },
  { id: "python", label: "Python" },
  { id: "django", label: "Django" },
  { id: "flask", label: "Flask" },
  { id: "ruby", label: "Ruby" },
  { id: "rails", label: "Ruby on Rails" },
  { id: "php", label: "PHP" },
  { id: "laravel", label: "Laravel" },
  { id: "java", label: "Java" },
  { id: "spring", label: "Spring Boot" },
  { id: "csharp", label: "C#" },
  { id: "dotnet", label: ".NET" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },

  // Database
  { id: "mongodb", label: "MongoDB" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "mysql", label: "MySQL" },
  { id: "redis", label: "Redis" },
  { id: "sqlite", label: "SQLite" },
  { id: "firebase", label: "Firebase" },
  { id: "supabase", label: "Supabase" },
  { id: "prisma", label: "Prisma" },
  { id: "drizzle", label: "Drizzle ORM" },

  // API
  { id: "graphql", label: "GraphQL" },
  { id: "rest", label: "REST API" },
  { id: "trpc", label: "tRPC" },
  { id: "grpc", label: "gRPC" },

  // DevOps
  { id: "aws", label: "AWS" },
  { id: "azure", label: "Azure" },
  { id: "gcp", label: "Google Cloud" },
  { id: "vercel", label: "Vercel" },
  { id: "netlify", label: "Netlify" },
  { id: "docker", label: "Docker" },
  { id: "kubernetes", label: "Kubernetes" },
  { id: "ci-cd", label: "CI/CD" },
  { id: "git", label: "Git" },
  { id: "github-actions", label: "GitHub Actions" },

  // Testing
  { id: "jest", label: "Jest" },
  { id: "cypress", label: "Cypress" },
  { id: "testing-library", label: "Testing Library" },
  { id: "playwright", label: "Playwright" },
  { id: "vitest", label: "Vitest" },

  // Mobile
  { id: "react-native", label: "React Native" },
  { id: "flutter", label: "Flutter" },
  { id: "swift", label: "Swift" },
  { id: "kotlin", label: "Kotlin" },
]

export function DeveloperSignupForm({ isDeveloperFocused = false }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [skillsSearchTerm, setSkillsSearchTerm] = useState("")
  const [toolsSearchTerm, setToolsSearchTerm] = useState("")

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [experience, setExperience] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [vibeCodingKnowledge, setVibeCodingKnowledge] = useState<string[]>([])
  const [portfolio, setPortfolio] = useState("")
  const [availability, setAvailability] = useState("")
  const [message, setMessage] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // Form validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    experience: "",
    skills: "",
    vibeCodingKnowledge: "",
    portfolio: "",
    availability: "",
    agreeToTerms: "",
  })

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      experience: "",
      skills: "",
      vibeCodingKnowledge: "",
      portfolio: "",
      availability: "",
      agreeToTerms: "",
    }

    let isValid = true

    if (!name || name.length < 2) {
      newErrors.name = "Name must be at least 2 characters."
      isValid = false
    }

    if (!email) {
      newErrors.email = "Email is required."
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address."
      isValid = false
    }

    if (!experience) {
      newErrors.experience = "Please select your experience level."
      isValid = false
    }

    if (skills.length === 0) {
      newErrors.skills = "Please select at least one skill."
      isValid = false
    }

    if (!availability) {
      newErrors.availability = "Please select your availability."
      isValid = false
    }

    if (portfolio && !/^https?:\/\/.*/.test(portfolio)) {
      newErrors.portfolio = "Please enter a valid URL."
      isValid = false
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      console.log("Submitting form with values:", {
        name,
        email,
        experience,
        skills,
        vibeCodingKnowledge,
        portfolio,
        availability,
        message,
        agreeToTerms,
      })

      // Ensure availability is exactly one of the allowed values
      console.log("Availability value being submitted:", availability)

      const result = await submitDeveloperApplication({
        full_name: name,
        email: email,
        experience_level: experience,
        skills: skills,
        vibe_coding_tools: vibeCodingKnowledge,
        github_url: portfolio || null,
        availability: availability,
        additional_info: message || null,
        terms_accepted: agreeToTerms,
      })

      console.log("Submission result:", result)

      if (result.success) {
        toast({
          title: "Application submitted!",
          description: "Your application has been successfully saved to our database.",
        })

        setIsSubmitted(true)
      } else {
        // If there's an existing application that's already been submitted
        if (result.applicationId && result.message.includes("already exists")) {
          toast({
            title: "Application already exists",
            description: "You've already submitted an application.",
          })
          return
        }

        setErrorMessage(result.message || "An unknown error occurred")

        toast({
          title: "Submission failed",
          description: result.message || "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")

      toast({
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter skills based on search term
  const filteredSkills = skillsSearchTerm
    ? programmingSkills.filter((skill) => skill.label.toLowerCase().includes(skillsSearchTerm.toLowerCase()))
    : programmingSkills

  // Filter tools based on search term
  const filteredTools = toolsSearchTerm
    ? vibeCodingTools.filter((tool) => tool.label.toLowerCase().includes(toolsSearchTerm.toLowerCase()))
    : vibeCodingTools

  if (isSubmitted) {
    return (
      <Card className="border-green-200 shadow-md">
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-green-100 p-4 mb-4">
              <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Application Received! 🎉</h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-md px-2">
              Thank you for applying to join VibeAlong! We'll review your information and contact you soon about next
              steps.
            </p>

            <div className="bg-muted p-3 md:p-4 rounded-lg mb-6 w-full max-w-md">
              <h4 className="font-medium mb-2 text-sm md:text-base">What happens next?</h4>
              <ol className="text-xs md:text-sm text-left space-y-2 list-decimal list-inside">
                <li>Our team will review your application (typically within 48 hours)</li>
                <li>You'll receive an email with instructions to take a short skills assessment</li>
                <li>After passing the assessment, you'll be invited to join our developer community</li>
              </ol>
            </div>

            <Button asChild variant="outline" className="text-sm">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">
          <p className="font-medium">Error submitting application:</p>
          <p className="text-xs md:text-sm">{errorMessage}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name or Agency Name
        </label>
        <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          placeholder="name@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="experience" className="text-sm font-medium">
          Years of Experience
        </label>
        <Select value={experience} onValueChange={setExperience}>
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">Less than 1 year</SelectItem>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="3-5">3-5 years</SelectItem>
            <SelectItem value="5-10">5-10 years</SelectItem>
            <SelectItem value="10+">10+ years</SelectItem>
          </SelectContent>
        </Select>
        {errors.experience && <p className="text-xs text-destructive">{errors.experience}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Skills & Frameworks</label>
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-full justify-between text-sm ${!skills.length ? "text-muted-foreground" : ""}`}
              >
                <span className="flex items-center">
                  <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  {skills.length > 0 ? `${skills.length} selected` : "Search skills..."}
                </span>
                <span className="text-xs text-muted-foreground">(Type to search)</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search skills..."
                  value={skillsSearchTerm}
                  onValueChange={setSkillsSearchTerm}
                />
                <CommandList className="max-h-[200px]">
                  <CommandEmpty>No results found. Try a different search term.</CommandEmpty>
                  <CommandGroup>
                    {filteredSkills.map((skill) => (
                      <CommandItem
                        key={skill.id}
                        onSelect={() => {
                          const newValue = skills.includes(skill.id)
                            ? skills.filter((s) => s !== skill.id)
                            : [...skills, skill.id]
                          setSkills(newValue)
                        }}
                        className="text-sm"
                      >
                        <Checkbox checked={skills.includes(skill.id)} className="mr-2 h-3.5 w-3.5" />
                        {skill.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skills.map((skillId) => {
                const skill = programmingSkills.find((s) => s.id === skillId)
                return (
                  <Badge key={skillId} variant="secondary" className="px-2 py-1 text-xs">
                    {skill?.label || skillId}
                    <button
                      type="button"
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => {
                        setSkills(skills.filter((s) => s !== skillId))
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {skill?.label || skillId}</span>
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}
          {errors.skills && <p className="text-xs text-destructive">{errors.skills}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Vibe-Coding Software Knowledge</label>
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={`w-full justify-between text-sm ${!vibeCodingKnowledge.length ? "text-muted-foreground" : ""}`}
              >
                <span className="flex items-center">
                  <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  {vibeCodingKnowledge.length > 0
                    ? `${vibeCodingKnowledge.length} selected`
                    : "Search vibe-coding tools..."}
                </span>
                <span className="text-xs text-muted-foreground">(Type to search)</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Search tools..."
                  value={toolsSearchTerm}
                  onValueChange={setToolsSearchTerm}
                />
                <CommandList className="max-h-[200px]">
                  <CommandEmpty>No results found. Try a different search term.</CommandEmpty>
                  <CommandGroup>
                    {filteredTools.map((tool) => (
                      <CommandItem
                        key={tool.id}
                        onSelect={() => {
                          const newValue = vibeCodingKnowledge.includes(tool.id)
                            ? vibeCodingKnowledge.filter((t) => t !== tool.id)
                            : [...vibeCodingKnowledge, tool.id]
                          setVibeCodingKnowledge(newValue)
                        }}
                        className="text-sm"
                      >
                        <Checkbox checked={vibeCodingKnowledge.includes(tool.id)} className="mr-2 h-3.5 w-3.5" />
                        {tool.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {vibeCodingKnowledge.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {vibeCodingKnowledge.map((toolId) => {
                const tool = vibeCodingTools.find((t) => t.id === toolId)
                return (
                  <Badge key={toolId} variant="secondary" className="px-2 py-1 text-xs">
                    {tool?.label || toolId}
                    <button
                      type="button"
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onClick={() => {
                        setVibeCodingKnowledge(vibeCodingKnowledge.filter((t) => t !== toolId))
                      }}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tool?.label || toolId}</span>
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="portfolio" className="text-sm font-medium">
          Portfolio/GitHub URL (Optional)
        </label>
        <Input
          id="portfolio"
          placeholder="https://github.com/yourusername"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
        />
        {errors.portfolio && <p className="text-xs text-destructive">{errors.portfolio}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="availability" className="text-sm font-medium">
          Availability
        </label>
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger>
            <SelectValue placeholder="Select your availability" />
          </SelectTrigger>
          <SelectContent>
            {VALID_AVAILABILITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.availability && <p className="text-xs text-destructive">{errors.availability}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Additional Information (Optional)
        </label>
        <Textarea
          id="message"
          placeholder="Tell us a bit more about yourself and why you'd be a good fit..."
          className="min-h-[80px] md:min-h-[100px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0">
        <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked === true)} />
        <div className="space-y-1 leading-none">
          <label htmlFor="terms" className="text-xs md:text-sm font-normal">
            I agree to the terms and privacy policy
          </label>
          {errors.agreeToTerms && <p className="text-xs text-destructive">{errors.agreeToTerms}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full text-sm" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Apply Now"
        )}
      </Button>
    </form>
  )
}
