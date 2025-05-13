"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, Copy, Download, FileCode, FileCog, FileText, Save } from "lucide-react"

export function CollaborationEditor() {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-80 grid-cols-3">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="gap-1" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </Tabs>
      </div>
      <div className="flex-1 overflow-auto">
        <TabsContent value="code" className="h-full">
          <div className="flex h-full">
            <div className="w-64 border-r p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Project Files</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                      <FileCode className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">index.html</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1">
                      <FileCode className="h-4 w-4 text-green-500" />
                      <span className="text-sm">styles.css</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                      <FileCode className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">script.js</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                      <FileCog className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">package.json</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">README.md</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium">Active Users</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 rounded-md px-2 py-1">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                      </span>
                      <span className="text-sm">You (Vibe-Coder)</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md px-2 py-1">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                      </span>
                      <span className="text-sm">John Doe (Developer)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="rounded-md border bg-muted">
                <div className="flex items-center justify-between border-b bg-background p-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">styles.css</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    CSS
                  </Badge>
                </div>
                <pre className="p-4 text-sm">
                  <code>{`/* Main Styles */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --text-color: #1f2937;
  --background-color: #ffffff;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Styles */
header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

/* Comment from John: We should add hover effects to the nav links */
`}</code>
                </pre>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="h-full">
          <div className="flex h-full items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-3xl rounded-lg border bg-white p-6 shadow-sm">
              <header className="bg-blue-500 p-4 text-white">
                <div className="container mx-auto flex items-center justify-between">
                  <h1 className="text-xl font-bold">E-commerce Platform</h1>
                  <nav>
                    <ul className="flex gap-6">
                      <li>Home</li>
                      <li>Products</li>
                      <li>About</li>
                      <li>Contact</li>
                    </ul>
                  </nav>
                </div>
              </header>
              <main className="p-4">
                <h2 className="mb-4 text-2xl font-bold">Featured Products</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-md border p-4">
                    <div className="mb-2 h-32 bg-gray-200"></div>
                    <h3 className="font-medium">Product 1</h3>
                    <p className="text-sm text-gray-500">$99.99</p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="mb-2 h-32 bg-gray-200"></div>
                    <h3 className="font-medium">Product 2</h3>
                    <p className="text-sm text-gray-500">$149.99</p>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="mb-2 h-32 bg-gray-200"></div>
                    <h3 className="font-medium">Product 3</h3>
                    <p className="text-sm text-gray-500">$199.99</p>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="files" className="h-full">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Project Files</h3>
              <Button variant="outline" size="sm">
                Upload File
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileCode className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">index.html</div>
                    <div className="text-xs text-muted-foreground">2.4 KB • HTML</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileCode className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">styles.css</div>
                    <div className="text-xs text-muted-foreground">1.8 KB • CSS</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileCode className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="font-medium">script.js</div>
                    <div className="text-xs text-muted-foreground">3.2 KB • JavaScript</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileCog className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">package.json</div>
                    <div className="text-xs text-muted-foreground">0.5 KB • JSON</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium">README.md</div>
                    <div className="text-xs text-muted-foreground">1.1 KB • Markdown</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </div>
    </div>
  )
}
