import type React from "react"
import { Heart, Code, Terminal } from "lucide-react"

export function ReplitIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Code className={props.className || "w-6 h-6 sm:w-10 sm:h-10"} color="#4285f4" />
}

export function V0Icon(props: React.SVGProps<SVGSVGElement>) {
  return <Terminal className={props.className || "w-6 h-6 sm:w-10 sm:h-10"} color="#000000" />
}

export function LoveableIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Heart className={props.className || "w-6 h-6 sm:w-10 sm:h-10"} color="#ff4d4f" />
}
