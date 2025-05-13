"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  Sparkles,
  FolderIcon,
  Loader2,
  Clock,
  DollarSign,
  AlertCircle,
  Plus,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { createTask } from "@/app/actions/project-actions"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import debounce from "lodash/debounce"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SimplifiedTaskFormProps {
  projectId: string
  projectName?: string
  useAI?: boolean
  onTechnologiesChange?: (technologies: string[]) => void
  onSubmitSuccess?: () => void
}

export function SimplifiedTaskForm({
  projectId,
  projectName,
  useAI = true,
  onTechnologiesChange,
  onSubmitSuccess,
}: SimplifiedTaskFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")
  const [timeEstimate, setTimeEstimate] = useState("")
  const [budget, setBudget] = useState("")

  // AI enhancement state
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<{
    priority: string
    timeEstimate: string
    budget: string
  }>({
    priority: "",
    timeEstimate: "",
    budget: "",
  })

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillsOpen, setSkillsOpen] = useState(false)

  const availableSkills = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML/CSS",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "GraphQL",
    "REST API",
    "AWS",
    "Firebase",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Testing",
    "UI/UX Design",
    "Mobile Development",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Python",
    "Django",
    "Flask",
    "Ruby on Rails",
    "PHP",
    "Laravel",
    "WordPress",
    "Shopify",
    "SEO",
    "Performance Optimization",
    "Accessibility",
    "Security",
  ]

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) => (current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill]))
  }

  const autoSelectSkills = async () => {
    // In a real app, this would call an AI service
    // For now, we'll simulate it
    setIsAnalyzing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Extract keywords from title and description
      const combinedText = `${title} ${description}`.toLowerCase()

      // Simple keyword matching (would be AI-powered in production)
      const aiSelectedSkills = availableSkills.filter((skill) => {
        const skillLower = skill.toLowerCase()
        return (
          combinedText.includes(skillLower) ||
          // Add some common associations
          (combinedText.includes("web") && ["react", "next.js", "html/css"].includes(skillLower)) ||
          (combinedText.includes("database") && ["mongodb", "postgresql"].includes(skillLower)) ||
          (combinedText.includes("api") && ["rest api", "graphql"].includes(skillLower)) ||
          (combinedText.includes("mobile") && ["react native", "flutter"].includes(skillLower))
        )
      })

      // Select 2-5 skills
      const finalSelection =
        aiSelectedSkills.length > 0
          ? aiSelectedSkills.slice(0, Math.min(5, aiSelectedSkills.length))
          : ["React", "Next.js", "TypeScript"].slice(0, 3) // Fallback

      setSelectedSkills(finalSelection)

      toast({
        title: "Skills auto-selected",
        description: `AI selected ${finalSelection.length} relevant skills based on your task description.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to auto-select skills. Please select manually.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Enhance description with AI
  const enhanceWithAI = async () => {
    if (!title || title.length < 3) return

    setIsEnhancing(true)
    try {
      // Simulate AI enhancement (replace with actual AI call)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate enhanced description based on title
      const enhancedDescription = generateEnhancedDescription(title)
      setDescription(enhancedDescription)

      // Analyze the task after enhancement
      analyzeTask(title, enhancedDescription)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enhance description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  // Generate enhanced description (mock function)
  const generateEnhancedDescription = (title: string) => {
    const templates = [
      `# Task Overview\nImplement ${title} functionality with proper error handling and user feedback.\n\n## Requirements\n- Create a responsive UI component\n- Implement backend validation\n- Add comprehensive error handling\n- Write unit tests for core functionality\n\n## Acceptance Criteria\n- All form inputs are properly validated\n- Error messages are clear and actionable\n- UI is responsive on all device sizes\n- Code follows project style guidelines`,

      `# ${title}\n\n## Description\nThis task involves creating a robust implementation of ${title} that integrates with our existing systems.\n\n## Technical Details\n- Use React hooks for state management\n- Implement proper form validation\n- Create reusable components where appropriate\n- Follow accessibility best practices\n\n## Additional Notes\nPlease document any assumptions made during implementation.`,

      `# ${title} Implementation\n\n## Objective\nDevelop a comprehensive solution for ${title} that meets all project requirements.\nn## Scope\n- Frontend UI components\n- Backend API integration\n- Data validation and error handling\n- Performance optimization\n\n## Expected Outcome\nA fully functional feature that integrates seamlessly with the existing application.`,
    ]

    return templates[Math.floor(Math.random() * templates.length)]
  }

  // Analyze task to determine priority, time, and budget
  const analyzeTask = async (taskTitle: string, taskDescription: string) => {
    if (!taskTitle || !taskDescription || taskTitle.length < 3 || taskDescription.length < 10) return

    setIsAnalyzing(true)
    try {
      // Simulate AI analysis (replace with actual AI call)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simple mock analysis based on text length and complexity
      const wordCount = taskDescription.split(/\s+/).length
      const complexity = calculateComplexity(taskTitle, taskDescription)

      // Set priority based on complexity
      const taskPriority = complexity > 7 ? "high" : complexity > 4 ? "medium" : "low"

      // Set time estimate based on word count and complexity
      const hours = Math.max(Math.round((wordCount * complexity) / 50), 1)

      // Set budget based on time estimate
      const taskBudget = `$${hours * 25}`

      setAiAnalysis({
        priority: taskPriority,
        timeEstimate: hours.toString(),
        budget: taskBudget,
      })

      // Update form values for submission
      setPriority(taskPriority)
      setTimeEstimate(hours.toString())
      setBudget(taskBudget)
    } catch (error) {
      console.error("Error analyzing task:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Calculate complexity score (mock function)
  const calculateComplexity = (title: string, description: string) => {
    let score = 0

    // Check for complex terms
    const complexTerms = [
      "authentication",
      "integration",
      "database",
      "optimization",
      "security",
      "deployment",
      "testing",
      "migration",
    ]
    complexTerms.forEach((term) => {
      if (title.toLowerCase().includes(term) || description.toLowerCase().includes(term)) {
        score += 1
      }
    })

    // Add score based on description length
    score += Math.min(Math.floor(description.length / 200), 5)

    return score
  }

  // Debounced analysis function
  const debouncedAnalyzeTask = useCallback(
    debounce((title: string, description: string) => {
      analyzeTask(title, description)
    }, 800),
    [],
  )

  // Form errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    priority: "",
    timeEstimate: "",
  })

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      priority: "",
      timeEstimate: "",
    }

    let isValid = true

    if (!title || title.length < 2) {
      newErrors.title = "Task title must be at least 2 characters."
      isValid = false
    }

    if (!description || description.length < 10) {
      newErrors.description = "Description must be at least 10 characters."
      isValid = false
    }

    // Priority and time estimate are now calculated by AI
    // No need to validate them as user input

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const result = await createTask({
        title,
        description,
        priority,
        timeEstimate,
        budget,
        projectId,
        skills: selectedSkills, // Add the selected skills
      })

      if (result.success) {
        toast({
          title: "Task submitted",
          description: "Your task has been submitted successfully.",
        })

        // Reset form
        setTitle("")
        setDescription("")
        setPriority("")
        setTimeEstimate("")
        setBudget("")
        setSelectedSkills([])

        // Call onSubmitSuccess if provided
        if (onSubmitSuccess) {
          onSubmitSuccess()
        } else {
          // Navigate to task details
          router.push(`/dashboard/tasks/${result.taskId}/summary`)
          router.refresh()
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2 border-muted">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Submit a New Task</CardTitle>
          <CardDescription>Describe what you need help with and our developers will assist you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {projectName && (
            <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Project: <span className="text-primary">{projectName}</span>
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="E.g., Implement user authentication"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                // Trigger AI analysis when both title and description have content
                if (e.target.value.length > 3 && description.length > 10) {
                  debouncedAnalyzeTask(e.target.value, description)
                }
              }}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <div className="flex items-center text-destructive text-xs mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.title}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>
                Task Description <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={enhanceWithAI}
                disabled={!title || title.length < 3 || isEnhancing}
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Enhancing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Improve with AI</span>
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Provide detailed information about what needs to be done..."
              className={`min-h-[120px] ${errors.description ? "border-destructive" : ""}`}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                // Trigger AI analysis when both title and description have content
                if (title.length > 3 && e.target.value.length > 10) {
                  debouncedAnalyzeTask(title, e.target.value)
                }
              }}
            />
            {errors.description && (
              <div className="flex items-center text-destructive text-xs mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.description}
              </div>
            )}
          </div>

          {/* AI-powered task analysis */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium">AI Task Analysis</h4>
              {isAnalyzing && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="text-xs text-muted-foreground">Priority</div>
                <div className="flex items-center gap-2">
                  {aiAnalysis.priority ? (
                    <Badge
                      variant={
                        aiAnalysis.priority === "high"
                          ? "destructive"
                          : aiAnalysis.priority === "medium"
                            ? "default"
                            : "outline"
                      }
                      className="capitalize"
                    >
                      {aiAnalysis.priority}
                    </Badge>
                  ) : (
                    <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="text-xs text-muted-foreground">Estimated Time</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {aiAnalysis.timeEstimate ? (
                    <span className="text-sm font-medium">{aiAnalysis.timeEstimate} hours</span>
                  ) : (
                    <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="text-xs text-muted-foreground">Vibe Credits</div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  {aiAnalysis.budget ? (
                    <span className="text-sm font-medium">{aiAnalysis.budget}</span>
                  ) : (
                    <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Skills Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="skills">Required Skills & Technologies</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={autoSelectSkills}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Auto-select with AI</span>
                  </>
                )}
              </Button>
            </div>

            <Popover open={skillsOpen} onOpenChange={setSkillsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={skillsOpen}
                  className="w-full justify-between h-auto min-h-10 py-2"
                >
                  <div className="flex flex-wrap gap-1 items-center">
                    {selectedSkills.length > 0 ? (
                      selectedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="mr-1 mb-1">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Select required skills...</span>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search skills..." />
                  <CommandList>
                    <CommandEmpty>No skills found.</CommandEmpty>
                    <CommandGroup>
                      {availableSkills.map((skill) => (
                        <CommandItem key={skill} value={skill} onSelect={() => toggleSkill(skill)}>
                          <Check
                            className={cn("mr-2 h-4 w-4", selectedSkills.includes(skill) ? "opacity-100" : "opacity-0")}
                          />
                          {skill}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <p className="text-xs text-muted-foreground">
              Select the skills and technologies required for this task. This helps match you with the right developers.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full sm:w-auto sm:flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Submit Task
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
