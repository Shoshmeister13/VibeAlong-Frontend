import type React from "react"
import {
  Heart,
  Code,
  Zap,
  Hash,
  MoreHorizontal,
  Terminal,
  Wind,
  MousePointer,
  Cpu,
  Sparkles,
  Bot,
  Braces,
  Layers,
  Compass,
  Brain,
  Lightbulb,
  GitBranch,
  Workflow,
} from "lucide-react"

export function Loveable(props: React.SVGProps<SVGSVGElement>) {
  return <Heart className={props.className || "w-6 h-6 sm:w-10 sm:h-10"} color="#ff4d4f" />
}

export function Replit(props: React.SVGProps<SVGSVGElement>) {
  return <Code className={props.className || "w-6 h-6 sm:w-10 sm:h-10"} color="#4285f4" />
}

export function Bolt(props: React.SVGProps<SVGSVGElement>) {
  return <Zap className={props.className || "w-6 h-6 sm:w-10 sm:h-10"} color="#faad14" />
}

export function Base44(props: React.SVGProps<SVGSVGElement>) {
  return <Hash className={props.className || "w-6 h-6 sm:w-10 sm:h-10"} color="#f59e0b" />
}

export function Other(props: React.SVGProps<SVGSVGElement>) {
  return <MoreHorizontal className={props.className || "w-6 h-6 sm:w-10 sm:h-10"} color="#8c8c8c" />
}

// Simplified V0 icon using Terminal icon
export function V0(props: React.SVGProps<SVGSVGElement>) {
  return <Terminal className={props.className || "w-6 h-6 text-black"} />
}

// Cursor icon
export function Cursor(props: React.SVGProps<SVGSVGElement>) {
  return <MousePointer className={props.className || "w-6 h-6 text-black"} />
}

// Windsurf icon
export function Windsurf(props: React.SVGProps<SVGSVGElement>) {
  return <Wind className={props.className || "w-6 h-6 text-black"} />
}

// Codeium icon
export function Codeium(props: React.SVGProps<SVGSVGElement>) {
  return <Cpu className={props.className || "w-6 h-6 text-black"} />
}

// Claude icon
export function Claude(props: React.SVGProps<SVGSVGElement>) {
  return <Sparkles className={props.className || "w-6 h-6 text-black"} />
}

// GitHub Copilot icon
export function Copilot(props: React.SVGProps<SVGSVGElement>) {
  return <Bot className={props.className || "w-6 h-6 text-black"} />
}

// CodeWhisperer icon
export function CodeWhisperer(props: React.SVGProps<SVGSVGElement>) {
  return <Braces className={props.className || "w-6 h-6 text-black"} />
}

// Tabnine icon
export function Tabnine(props: React.SVGProps<SVGSVGElement>) {
  return <Layers className={props.className || "w-6 h-6 text-black"} />
}

// CodeGPT icon
export function CodeGPT(props: React.SVGProps<SVGSVGElement>) {
  return <Brain className={props.className || "w-6 h-6 text-black"} />
}

// Warp icon
export function Warp(props: React.SVGProps<SVGSVGElement>) {
  return <Compass className={props.className || "w-6 h-6 text-black"} />
}

// Bard icon
export function Bard(props: React.SVGProps<SVGSVGElement>) {
  return <Lightbulb className={props.className || "w-6 h-6 text-black"} />
}

// GitLab AI icon
export function GitLabAI(props: React.SVGProps<SVGSVGElement>) {
  return <GitBranch className={props.className || "w-6 h-6 text-black"} />
}

// Sourcegraph Cody icon
export function Cody(props: React.SVGProps<SVGSVGElement>) {
  return <Workflow className={props.className || "w-6 h-6 text-black"} />
}
