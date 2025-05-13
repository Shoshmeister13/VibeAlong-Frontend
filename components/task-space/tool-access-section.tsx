"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Database, Key, Laptop, Link, Plus } from "lucide-react"

interface Tool {
  id: string
  name: string
  type: "database" | "api" | "repository" | "other"
  accessReceived: boolean
}

interface ToolAccessSectionProps {
  taskId: string
  isVibeCoder: boolean
}

export function ToolAccessSection({ taskId, isVibeCoder }: ToolAccessSectionProps) {
  const [tools, setTools] = useState<Tool[]>([
    { id: "1", name: "GitHub Repository", type: "repository", accessReceived: false },
    { id: "2", name: "Database Credentials", type: "database", accessReceived: false },
    { id: "3", name: "API Keys", type: "api", accessReceived: false },
  ])
  const [showAddTool, setShowAddTool] = useState(false)
  const [newToolName, setNewToolName] = useState("")
  const [newToolType, setNewToolType] = useState<Tool["type"]>("other")

  const toggleToolAccess = (id: string) => {
    setTools(tools.map((tool) => (tool.id === id ? { ...tool, accessReceived: !tool.accessReceived } : tool)))
  }

  const addTool = () => {
    if (newToolName.trim() === "") return

    const newId = (tools.length + 1).toString()
    setTools([
      ...tools,
      {
        id: newId,
        name: newToolName,
        type: newToolType,
        accessReceived: false,
      },
    ])
    setNewToolName("")
    setShowAddTool(false)
  }

  const getToolIcon = (type: Tool["type"]) => {
    switch (type) {
      case "database":
        return <Database className="h-4 w-4" />
      case "api":
        return <Key className="h-4 w-4" />
      case "repository":
        return <Link className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Laptop className="h-5 w-5 mr-2" />
            Tool Access
          </CardTitle>
          {!isVibeCoder && !showAddTool && (
            <Button variant="outline" size="sm" onClick={() => setShowAddTool(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Request Access
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tools.length > 0 ? (
            <div className="space-y-3">
              {tools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getToolIcon(tool.type)}
                    <span className="text-sm">{tool.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {tool.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`tool-${tool.id}`}
                      checked={tool.accessReceived}
                      onCheckedChange={() => toggleToolAccess(tool.id)}
                    />
                    <label htmlFor={`tool-${tool.id}`} className="text-xs text-muted-foreground">
                      {tool.accessReceived ? "Access Received" : "Pending"}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No tools or access requirements specified yet.</div>
          )}

          {showAddTool && (
            <div className="space-y-3 border-t pt-3">
              <h4 className="text-sm font-medium">Request Additional Access</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Tool or access name..."
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  className="text-sm"
                />
                <select
                  value={newToolType}
                  onChange={(e) => setNewToolType(e.target.value as Tool["type"])}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="repository">Repository</option>
                  <option value="database">Database</option>
                  <option value="api">API</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddTool(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={addTool} disabled={newToolName.trim() === ""}>
                  Request
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
