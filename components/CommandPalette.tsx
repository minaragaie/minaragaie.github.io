"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronRight, Hash, User, Briefcase, Code, GraduationCap, Award, Mail } from "lucide-react"
import { staticResumeData } from "@/lib/resume-data"

interface CommandPaletteProps {
  onNavigate: (sectionId: string) => void
  onClose: () => void
}

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  icon: any
  color: string
  type: "navigation" | "content" | "command"
}

export default function CommandPalette({ onNavigate, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const shortcutKey = isMac ? "⌘⇧P" : "Ctrl+Shift+P"

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const generateSearchResults = (): SearchResult[] => {
    const results: SearchResult[] = []

    // Navigation commands
    const navigationCommands = [
      {
        id: "hero",
        title: "Go to Hero Section",
        description: "Navigate to introduction",
        icon: User,
        color: "#007acc",
      },
      { id: "skills", title: "Go to Skills", description: "View technical skills", icon: Code, color: "#4ec9b0" },
      {
        id: "experience",
        title: "Go to Experience",
        description: "View work history",
        icon: Briefcase,
        color: "#dcdcaa",
      },
      { id: "technologies", title: "Go to Technologies", description: "View tech stack", icon: Code, color: "#9cdcfe" },
      {
        id: "education",
        title: "Go to Education",
        description: "View educational background",
        icon: GraduationCap,
        color: "#c586c0",
      },
      {
        id: "certifications",
        title: "Go to Certifications",
        description: "View certificates",
        icon: Award,
        color: "#ce9178",
      },
      { id: "contact", title: "Go to Contact", description: "Get in touch", icon: Mail, color: "#b5cea8" },
    ]

    // Add navigation commands
    navigationCommands.forEach((cmd) => {
      if (
        query === "" ||
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({
          ...cmd,
          category: "Navigation",
          type: "navigation",
        })
      }
    })

    // Skills search
    Object.entries(staticResumeData.skills).forEach(([category, skills]) => {
      if (query === "" || category.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: `skills-${category}`,
          title: `${category.charAt(0).toUpperCase() + category.slice(1)} Skills`,
          description: `${skills.length} skills in ${category}`,
          category: "Skills",
          icon: Code,
          color: "#4ec9b0",
          type: "content",
        })
      }

      // Individual skills
      skills.forEach((skill) => {
        if (query !== "" && skill && skill.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            id: `skills-${category}`,
            title: skill,
            description: `${category} skill`,
            category: "Skills",
            icon: Hash,
            color: "#4ec9b0",
            type: "content",
          })
        }
      })
    })

    // Experience search
    staticResumeData.experience.forEach((exp) => {
      if (
        query === "" ||
        (exp.company && exp.company.toLowerCase().includes(query.toLowerCase())) ||
        (exp.title && exp.title.toLowerCase().includes(query.toLowerCase()))
      ) {
        let duration = `${exp.startDate || "Unknown"} - ${exp.endDate || "Present"}`;
        results.push({
          id: `experience-${exp.id}`,
          title: exp.company || "Unknown Company",
          description: `${exp.title || "Unknown Title"} • ${duration || "Unknown Duration"}`,
          category: "Experience",
          icon: Briefcase,
          color: "#dcdcaa",
          type: "content",
        })
      }
    })

    // Certifications search
    staticResumeData.certifications.forEach((cert, index) => {
      if (
        query === "" ||
        (cert.name && cert.name.toLowerCase().includes(query.toLowerCase())) ||
        (cert.issuer && cert.issuer.toLowerCase().includes(query.toLowerCase()))
      ) {
        results.push({
          id: `certifications-${index}`,
          title: cert.name || "Unknown Certificate",
          description: `Issued by ${cert.issuer || "Unknown Issuer"}`,
          category: "Certifications",
          icon: Award,
          color: "#ce9178",
          type: "content",
        })
      }
    })

    return results.slice(0, 10) // Limit results
  }

  const results = generateSearchResults()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
        break
      case "Enter":
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        onClose()
        break
    }
  }

  const handleSelect = (result: SearchResult) => {
    setHistory((prev) => [query, ...prev.slice(0, 4)])
    onNavigate(result.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-[#252526] border border-[#3e3e42] rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#3e3e42]">
          <Search size={16} className="text-[#858585]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search resume content or type > for commands..."
            className="flex-1 bg-transparent text-[#cccccc] placeholder-[#858585] outline-none text-sm"
          />
          <div className="text-xs text-[#858585]">
            <kbd className="px-1.5 py-0.5 bg-[#3e3e42] rounded text-xs">Esc</kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => {
                const Icon = result.icon
                const isSelected = index === selectedIndex

                return (
                  <button
                    key={`${result.id}-${index}`}
                    onClick={() => handleSelect(result)}
                    className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${
                      isSelected ? "bg-[#094771] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e]"
                    }`}
                  >
                    <Icon size={16} style={{ color: result.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{result.title}</div>
                      <div className="text-xs text-[#858585] truncate">{result.description}</div>
                    </div>
                    <div className="text-xs text-[#858585] bg-[#3e3e42] px-2 py-1 rounded">{result.category}</div>
                    <ChevronRight size={12} className="text-[#858585]" />
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-[#858585]">
              <Search size={32} className="mx-auto mb-3 opacity-50" />
              <div className="text-sm">No results found</div>
              <div className="text-xs mt-1">Try searching for skills, companies, or certifications</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-[#3e3e42] text-xs text-[#858585]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#3e3e42] rounded">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#3e3e42] rounded">Enter</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#3e3e42] rounded text-xs">{shortcutKey}</kbd>
              <span>Open</span>
            </div>
          </div>
          <div>{results.length} results</div>
        </div>
      </div>
    </div>
  )
}
