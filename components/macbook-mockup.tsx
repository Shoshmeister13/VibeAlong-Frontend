"use client"

import { useEffect, useState, useRef } from "react"
import { CheckCircle, Send, Smile } from "lucide-react"
import Image from "next/image"

export function MacbookMockup() {
  const [text, setText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)

  // Sample code that will be "typed" in the animation - more relevant to VibeAlong
  const sampleCode = `// VibeAlong Task: Implement a function to calculate developer earnings
function calculateDeveloperEarnings(tasks, hourlyRate) {
  return tasks.reduce((total, task) => {
    const taskHours = task.timeSpent / 60; // Convert minutes to hours
    const taskEarnings = taskHours * hourlyRate;
    return total + taskEarnings;
  }, 0);
}

// Test with sample developer data
const completedTasks = [
  { id: 'task-1', title: 'Fix navigation bug', timeSpent: 45, completed: true },
  { id: 'task-2', title: 'Implement dark mode', timeSpent: 120, completed: true },
  { id: 'task-3', title: 'Optimize API calls', timeSpent: 90, completed: true }
];

const devHourlyRate = 65;
const earnings = calculateDeveloperEarnings(completedTasks, devHourlyRate);
console.log(\`Developer earnings: $\${earnings.toFixed(2)}\`);
// Success! Task completed ✓`

  // Simulate typing effect
  useEffect(() => {
    let currentIndex = 0
    let typingInterval: NodeJS.Timeout

    // Start typing animation
    typingInterval = setInterval(() => {
      if (currentIndex < sampleCode.length) {
        setText(sampleCode.substring(0, currentIndex + 1))
        currentIndex++

        // Auto-scroll to bottom as text is added
        if (codeRef.current) {
          codeRef.current.scrollTop = codeRef.current.scrollHeight
        }
      } else {
        clearInterval(typingInterval)
        // Show completion after typing is done
        setTimeout(() => setIsComplete(true), 1000)
      }
    }, 50)

    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    // Simulate "typing" indicator
    const typingSimulation = setInterval(() => {
      setIsTyping((prev) => !prev)
    }, 3000)

    return () => {
      clearInterval(typingInterval)
      clearInterval(cursorInterval)
      clearInterval(typingSimulation)
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto my-12">
      {/* MacBook frame */}
      <div className="relative">
        {/* Screen bezel */}
        <div className="bg-black rounded-t-xl p-2 pt-4">
          <div className="flex justify-center mb-1">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>

          {/* Screen */}
          <div className="bg-[#1e1e1e] rounded-md overflow-hidden">
            {/* IDE interface */}
            <div className="flex h-[500px] font-sans">
              {/* Sidebar */}
              <div className="w-14 bg-[#252525] flex flex-col items-center py-3 border-r border-[#333]">
                <div className="w-8 h-8 rounded-full mb-4 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="VibeAlong Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded mb-4 bg-[#333]"></div>
                <div className="w-8 h-8 rounded mb-4 bg-blue-600"></div>
                <div className="w-8 h-8 rounded mb-4 bg-[#333]"></div>
                <div className="w-8 h-8 rounded bg-[#333]"></div>
              </div>

              {/* File explorer */}
              <div className="w-48 bg-[#252525] border-r border-[#333] p-2 text-xs text-gray-300">
                <div className="mb-2 font-semibold">VIBEALONG PROJECT</div>
                <div className="pl-2">
                  <div className="mb-1 flex items-center">
                    <span className="mr-1">▼</span> src
                  </div>
                  <div className="pl-4 mb-1 text-blue-400">earnings.js</div>
                  <div className="pl-4 mb-1">components/</div>
                  <div className="pl-4 mb-1">pages/</div>
                  <div className="mb-1 flex items-center">
                    <span className="mr-1">▼</span> tests
                  </div>
                  <div className="pl-4 mb-1 text-white font-medium">earnings.test.js</div>
                </div>
              </div>

              {/* Code editor */}
              <div className="flex-1 bg-[#1e1e1e] flex flex-col">
                {/* Tabs */}
                <div className="flex bg-[#252525] text-xs text-gray-400 border-b border-[#333]">
                  <div className="px-4 py-1 bg-[#1e1e1e] text-white border-r border-[#333]">earnings.js</div>
                  <div className="px-4 py-1 border-r border-[#333]">earnings.test.js</div>
                </div>

                {/* Code content */}
                <div ref={codeRef} className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-auto">
                  <div className="relative">
                    {text}
                    {showCursor && <span className="absolute inline-block w-2 h-5 bg-blue-500 ml-0.5"></span>}
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex justify-between items-center px-4 py-1 bg-blue-600 text-white text-xs">
                  <div className="flex items-center">
                    <span className="mr-4">JavaScript</span>
                    <span>Line 18, Col 42</span>
                  </div>
                  <div className="flex items-center">
                    {isComplete && (
                      <div className="flex items-center text-green-300 animate-fadeIn">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span>Task completed successfully!</span>
                      </div>
                    )}
                    <span className="ml-4">Collaborating with Sarah K.</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Chat panel */}
              <div className="w-72 bg-[#252525] border-l border-[#333] flex flex-col">
                {/* Chat header */}
                <div className="p-3 border-b border-[#333] flex items-center">
                  <div className="flex-1">
                    <h3 className="text-white text-sm font-medium">VibeAlong Chat</h3>
                    <p className="text-xs text-gray-400">2 participants</p>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                      +
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="p-2 border-b border-[#333] flex items-center space-x-3">
                  <div className="flex items-center">
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="Sarah K."
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#252525]"></div>
                    </div>
                    <span className="ml-2 text-xs text-white">Sarah K. (Vibe Coder)</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                  <div className="flex items-center">
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?height=24&width=24"
                        alt="You"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#252525]"></div>
                    </div>
                    <span className="ml-2 text-xs text-white">You (Developer)</span>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 p-3 overflow-auto space-y-4">
                  <div className="flex items-start">
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="Sarah K."
                      width={32}
                      height={32}
                      className="rounded-full mr-2 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium text-white">Sarah K.</span>
                        <span className="text-xs text-gray-500 ml-2">10:32 AM</span>
                      </div>
                      <div className="bg-[#333] rounded-lg p-2.5 text-sm text-white max-w-[200px]">
                        Hey! I'm reviewing your earnings calculation function. Looking good so far!
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="Sarah K."
                      width={32}
                      height={32}
                      className="rounded-full mr-2 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium text-white">Sarah K.</span>
                        <span className="text-xs text-gray-500 ml-2">10:33 AM</span>
                      </div>
                      <div className="bg-[#333] rounded-lg p-2.5 text-sm text-white max-w-[200px]">
                        I think we should handle decimal precision in the earnings calculation. Users will expect clean
                        dollar amounts.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-end">
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-xs text-gray-500 mr-2">10:34 AM</span>
                        <span className="text-xs font-medium text-white">You</span>
                      </div>
                      <div className="bg-blue-600 rounded-lg p-2.5 text-sm text-white max-w-[200px]">
                        Good catch! I'll add toFixed(2) to the output to ensure we display dollars and cents properly.
                      </div>
                    </div>
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="You"
                      width={32}
                      height={32}
                      className="rounded-full ml-2 mt-0.5"
                    />
                  </div>

                  <div className="flex items-start">
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="Sarah K."
                      width={32}
                      height={32}
                      className="rounded-full mr-2 mt-0.5"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium text-white">Sarah K.</span>
                        <span className="text-xs text-gray-500 ml-2">10:36 AM</span>
                      </div>
                      <div className="bg-[#333] rounded-lg p-2.5 text-sm text-white max-w-[200px]">
                        Perfect! That looks good now. Should we also add a currency formatter for different regions?
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-end">
                    <div className="text-right">
                      <div className="flex items-center justify-end mb-1">
                        <span className="text-xs text-gray-500 mr-2">10:37 AM</span>
                        <span className="text-xs font-medium text-white">You</span>
                      </div>
                      <div className="bg-blue-600 rounded-lg p-2.5 text-sm text-white max-w-[200px]">
                        Great idea! I'll create a separate utility function for that in the next PR. Let's finish this
                        one first.
                      </div>
                    </div>
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="You"
                      width={32}
                      height={32}
                      className="rounded-full ml-2 mt-0.5"
                    />
                  </div>

                  {isTyping && (
                    <div className="flex items-start">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="Sarah K."
                        width={32}
                        height={32}
                        className="rounded-full mr-2 mt-0.5"
                      />
                      <div className="bg-[#333] rounded-lg p-2.5 text-sm text-white">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat input */}
                <div className="p-3 border-t border-[#333]">
                  <div className="bg-[#333] rounded-lg flex items-center p-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="bg-transparent text-sm text-white flex-1 outline-none"
                    />
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Smile className="w-5 h-5 cursor-pointer hover:text-gray-300" />
                      <Send className="w-5 h-5 cursor-pointer hover:text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MacBook base */}
        <div className="bg-[#333] h-3 rounded-b-xl"></div>
        <div className="bg-[#252525] h-1 mx-auto w-24 rounded-b-xl"></div>
      </div>
    </div>
  )
}
