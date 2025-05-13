"use client"

import { Input } from "@/components/ui/input"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface MultiSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  options: { label: string; value: string }[]
  selected: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchable?: boolean
}

export function MultiSelect({ options, selected, onChange, placeholder, searchable }: MultiSelectProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <div className="space-y-2">
      {searchable && (
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2 pl-8"
          />
          <div className="absolute left-2.5 top-2.5 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filteredOptions.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              className={cn(
                "flex items-center space-x-2 border rounded-md p-2 cursor-pointer transition-all text-sm",
                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              )}
              onClick={() => toggleOption(option.value)}
            >
              <div
                className={cn(
                  "h-4 w-4 min-w-4 rounded-sm border flex items-center justify-center mr-2",
                  isSelected ? "bg-primary border-primary text-primary-foreground" : "border-primary",
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </div>
              <span className="truncate">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
