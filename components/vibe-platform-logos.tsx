import {
  Other,
  Codeium,
  Claude,
  Copilot,
  CodeWhisperer,
  Tabnine,
  CodeGPT,
  Warp,
  Bard,
  GitLabAI,
  Cody,
} from "./vibe-platform-icons"

// Prioritize the specifically requested platforms
export const vibePlatforms = [
  // Primary platforms (requested specifically)
  {
    id: "loveable",
    name: "Loveable",
    logo: (
      <div className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/lovable-logo.jpeg"
          alt="Loveable"
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
    description: "AI-powered design to code platform",
    primary: true,
  },
  {
    id: "base44",
    name: "Base44",
    logo: (
      <div className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/base44-logo.png"
          alt="Base44"
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
    description: "AI-powered code transformation platform",
    primary: true,
  },
  {
    id: "v0",
    name: "v0",
    logo: (
      <div className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/v0-logo.png"
          alt="v0"
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
    description: "Vercel's AI-powered coding assistant",
    primary: true,
  },
  {
    id: "replit",
    name: "Replit",
    logo: (
      <div className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/replit-logo.png"
          alt="Replit"
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
    description: "Collaborative browser-based IDE",
    primary: true,
  },
  {
    id: "bolt",
    name: "Bolt",
    logo: (
      <div className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/bolt-logo.png"
          alt="Bolt"
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
    description: "Lightning-fast AI code generation",
    primary: true,
  },
  {
    id: "windsurf",
    name: "Windsurf",
    logo: (
      <div className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/windsurf-logo.png"
          alt="Windsurf"
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
    description: "AI-powered web development platform",
    primary: true,
  },
  {
    id: "cursor",
    name: "Cursor",
    logo: (
      <div className="flex items-center justify-center w-6 h-6 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/cursor-logo.png"
          alt="Cursor"
          className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
    description: "AI-native code editor",
    primary: true,
  },

  // Secondary platforms
  {
    id: "codeium",
    name: "Codeium",
    logo: <Codeium className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "AI coding assistant with deep context",
  },
  {
    id: "claude",
    name: "Claude",
    logo: <Claude className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "Anthropic's AI assistant for coding",
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    logo: <Copilot className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "GitHub's AI pair programmer",
  },
  {
    id: "codewhisperer",
    name: "CodeWhisperer",
    logo: <CodeWhisperer className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "Amazon's AI code companion",
  },
  {
    id: "tabnine",
    name: "Tabnine",
    logo: <Tabnine className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "AI code completion assistant",
  },
  {
    id: "codegpt",
    name: "CodeGPT",
    logo: <CodeGPT className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "GPT-powered coding extension",
  },
  {
    id: "warp",
    name: "Warp",
    logo: <Warp className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "AI-powered terminal",
  },
  {
    id: "bard",
    name: "Bard",
    logo: <Bard className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "Google's AI coding assistant",
  },
  {
    id: "gitlabai",
    name: "GitLab AI",
    logo: <GitLabAI className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "GitLab's AI code suggestions",
  },
  {
    id: "cody",
    name: "Sourcegraph Cody",
    logo: <Cody className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "AI coding assistant for repositories",
  },
  {
    id: "other",
    name: "Other Platforms",
    logo: <Other className="w-6 h-6 sm:w-10 sm:h-10" />,
    description: "Support for additional AI coding tools",
  },
]

// Export primary platforms separately for easy access with consistent styling
export const primaryVibePlatforms = [
  {
    id: "v0",
    name: "v0",
    logo: (
      <div className="flex items-center justify-center aspect-square w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/v0-logo.png"
          alt="v0"
          width={32}
          height={32}
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
  },
  {
    id: "lovable",
    name: "Lovable",
    logo: (
      <div className="flex items-center justify-center aspect-square w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/lovable-logo.jpeg"
          alt="Lovable"
          width={32}
          height={32}
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
  },
  {
    id: "bolt",
    name: "Bolt",
    logo: (
      <div className="flex items-center justify-center aspect-square w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/bolt-logo.png"
          alt="Bolt"
          width={32}
          height={32}
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
  },
  {
    id: "base44",
    name: "Base44",
    logo: (
      <div className="flex items-center justify-center aspect-square w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/base44-logo.png"
          alt="Base44"
          width={32}
          height={32}
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
  },
  {
    id: "replit",
    name: "Replit",
    logo: (
      <div className="flex items-center justify-center aspect-square w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <img
          src="/platform-logos/replit-logo.png"
          alt="Replit"
          width={32}
          height={32}
          className="object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-4m6jx.png"
            target.onerror = null
          }}
        />
      </div>
    ),
  },
]
