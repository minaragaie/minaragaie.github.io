"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { createPortal } from "react-dom"
import { Search, Code, Hash, Briefcase, Award } from "lucide-react"
import { staticResumeData } from "@/lib/resume-data"
import { useResumeData } from "@/hooks/useResumeData"
import { COMMANDS, NAVIGATION_COMMANDS } from "./data"
import { fuzzySearch } from "./fuzzy"
import { ResultList } from "./ResultList"
import type { CommandPaletteProps, SearchResult, IndexedData } from "./types"

// Command palette content - isolated from portal wrapper
function CommandPaletteContent({ onNavigate, onClose }: CommandPaletteProps) {
  const { resumeData: apiResumeData } = useResumeData()
  const data: any = apiResumeData || staticResumeData

  // Pre-index data ONCE - only recalculates when data changes
  const indexedData = useMemo<IndexedData>(() => {
    const skillsByCategory = data?.skills || staticResumeData?.skills || {}
    return {
      skillsCategories: Object.entries(skillsByCategory) as Array<[string, string[]]>,
      technologies: Array.isArray(data?.technologies) ? data.technologies : [],
      experience: Array.isArray(data?.experience) ? data.experience : [],
      certifications: Array.isArray(data?.certifications) ? data.certifications : [],
      projects: Array.isArray(data?.projects) ? data.projects : [],
    }
  }, [data])

  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [history, setHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const shortcutKey = isMac ? "⌘⇧P" : "Ctrl+Shift+P"

  // Debounce query input (120ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 120)
    return () => clearTimeout(timer)
  }, [query])

  // Reset selected index when debounced query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [debouncedQuery])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Optimized search function - works with pre-indexed data + fuzzy matching
  const results = useMemo(() => {
    const q = debouncedQuery.trim()
    const ql = q.toLowerCase()
    const results: SearchResult[] = []

    // Command mode: starts with '>'
    const isCommandMode = q.startsWith('>')
    const cq = isCommandMode ? q.slice(1).trim() : ''

    if (isCommandMode) {
      COMMANDS.forEach((cmd) => {
        if (!cq) {
          results.push({ ...cmd, score: 1.0 })
        } else {
          const score = fuzzySearch(cq, cmd.title, cmd.description)
          if (score > 0) {
            results.push({ ...cmd, score })
          }
        }
      })
      // Sort by score (highest first) and limit
      return results.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 10)
    }

    // Navigation commands (always available, filtered by query with fuzzy matching)
    NAVIGATION_COMMANDS.forEach((cmd) => {
      if (ql === "") {
        results.push({ ...cmd, score: 1.0 })
      } else {
        const score = fuzzySearch(ql, cmd.title, cmd.description)
        if (score > 0) {
          results.push({ ...cmd, score })
        }
      }
    })

    // Skills search - using pre-indexed data with fuzzy matching
    indexedData.skillsCategories.forEach(([category, skills]) => {
      const cat = String(category)
      const categoryTitle = `${cat.charAt(0).toUpperCase() + cat.slice(1)} Skills`
      const categoryDescription = `${skills?.length || 0} skills in ${cat}`
      
      if (ql === "") {
        results.push({
          id: `skills-${cat}`,
          title: categoryTitle,
          description: categoryDescription,
          category: "Skills",
          icon: Code,
          color: "#4ec9b0",
          type: "content",
          score: 1.0,
        })
      } else {
        const score = fuzzySearch(ql, cat, categoryTitle)
        if (score > 0.1) {
          results.push({
            id: `skills-${cat}`,
            title: categoryTitle,
            description: categoryDescription,
            category: "Skills",
            icon: Code,
            color: "#4ec9b0",
            type: "content",
            score,
          })
        }
      }
      
      // Individual skills with fuzzy matching
      if (ql && Array.isArray(skills)) {
        skills.forEach((skill: string) => {
          if (typeof skill === 'string') {
            const score = fuzzySearch(ql, skill)
            if (score > 0.1) {
              results.push({
                id: `skill-${cat}-${skill}`,
                title: skill,
                description: `${cat} skill`,
                category: "Skills",
                icon: Hash,
                color: "#4ec9b0",
                type: "content",
                score,
              })
            }
          }
        })
      }
    })

    // Root technologies - using pre-indexed data with fuzzy matching
    indexedData.technologies.forEach((tech: string) => {
      if (ql) {
        const score = fuzzySearch(ql, tech)
        if (score > 0.1) {
          results.push({
            id: `tech-${tech}`,
            title: tech,
            description: "Technology",
            category: "Technologies",
            icon: Code,
            color: "#9cdcfe",
            type: "content",
            score,
          })
        }
      }
    })

    // Experience search - using pre-indexed data with fuzzy matching
    indexedData.experience.forEach((exp: any) => {
      if (ql === "") {
        const duration = `${exp?.startDate || "Unknown"} - ${exp?.endDate || "Present"}`
        results.push({
          id: `experience-${exp?.id ?? "unknown"}`,
          title: exp?.company || "Experience",
          description: `${exp?.title || "Role"} • ${duration}`,
          category: "Experience",
          icon: Briefcase,
          color: "#dcdcaa",
          type: "content",
          score: 1.0,
        })
      } else {
        const techStrings = Array.isArray(exp?.technologies) ? exp.technologies.join(' ') : ''
        const score = fuzzySearch(
          ql,
          exp?.company,
          exp?.title,
          exp?.description,
          techStrings
        )
        if (score > 0.1) {
          const duration = `${exp?.startDate || "Unknown"} - ${exp?.endDate || "Present"}`
          results.push({
            id: `experience-${exp?.id ?? "unknown"}`,
            title: exp?.company || "Experience",
            description: `${exp?.title || "Role"} • ${duration}`,
            category: "Experience",
            icon: Briefcase,
            color: "#dcdcaa",
            type: "content",
            score,
          })
        }
      }
    })

    // Certifications search - using pre-indexed data with fuzzy matching
    indexedData.certifications.forEach((cert: any, index: number) => {
      if (ql === "") {
        results.push({
          id: `certifications-${index}`,
          title: cert?.name || "Certificate",
          description: cert?.issuer ? `Issued by ${cert.issuer}` : "Certification",
          category: "Certifications",
          icon: Award,
          color: "#ce9178",
          type: "content",
          score: 1.0,
        })
      } else {
        const score = fuzzySearch(ql, cert?.name, cert?.issuer)
        if (score > 0.1) {
          results.push({
            id: `certifications-${index}`,
            title: cert?.name || "Certificate",
            description: cert?.issuer ? `Issued by ${cert.issuer}` : "Certification",
            category: "Certifications",
            icon: Award,
            color: "#ce9178",
            type: "content",
            score,
          })
        }
      }
    })

    // Projects search - using pre-indexed data with fuzzy matching
    indexedData.projects.forEach((proj: any) => {
      if (ql) {
        const techStrings = Array.isArray(proj?.technologies) ? proj.technologies.join(' ') : ''
        const score = fuzzySearch(ql, proj?.name, proj?.description, techStrings)
        if (score > 0.1) {
          const slug = proj?.slug || (proj?.name ? proj.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "")
          results.push({
            id: `project-${slug}`,
            title: proj?.name || slug,
            description: proj?.description || "Project",
            category: "Projects",
            icon: Code,
            color: "#4ec9b0",
            type: "project",
            link: slug ? `/projects/${slug}/` : undefined,
            score,
          })
        }
      }
    })

    // Sort by score (highest first) and limit
    return results.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20)
  }, [debouncedQuery, indexedData])

  // Memoize handleSelect to prevent re-creating on every render
  const handleSelect = useCallback((result: SearchResult) => {
    setHistory((prev) => [query, ...prev.slice(0, 4)])
    if (result.type === 'project' && result.link) {
      if (typeof window !== 'undefined') {
        window.location.href = result.link
      }
      onClose()
      return
    }
    if (result.type === 'command') {
      if (result.id === 'cmd-settings') {
        if (typeof window !== 'undefined') {
          const ev = new CustomEvent('open-explorer', { detail: { tab: 'settings' } })
          window.dispatchEvent(ev)
        }
        onClose()
        return
      }
      if (result.link && typeof window !== 'undefined') {
        window.location.href = result.link
      }
      onClose()
      return
    }
    onNavigate(result.id)
    onClose()
  }, [query, onNavigate, onClose])

  // Memoize handleKeyDown to prevent re-creation on every render
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, [results, selectedIndex, handleSelect, onClose])

  // Memoize input change handler
  const handleInputChange = useCallback((value: string) => {
    setQuery(value)
    setSelectedIndex(0)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-start justify-center pt-20">
      <div className="bg-[var(--sidebar-bg)]/90 backdrop-blur-xl border border-[var(--sidebar-border)]/50 rounded-lg shadow-2xl w-full max-w-2xl mx-4 glass">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[var(--sidebar-border)]">
          <Search size={16} className="text-[var(--sidebar-text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search resume content or type > for commands..."
            className="flex-1 bg-transparent text-[var(--sidebar-text)] placeholder-[var(--sidebar-text-muted)] outline-none text-sm"
          />
          <div className="text-xs text-[var(--sidebar-text-muted)]">
            <kbd className="px-1.5 py-0.5 bg-[var(--sidebar-hover)] rounded text-xs">Esc</kbd>
          </div>
        </div>

        {/* Results - isolated re-renders */}
        <ResultList results={results} selectedIndex={selectedIndex} onSelect={handleSelect} />

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-[var(--sidebar-border)] text-xs text-[var(--sidebar-text-muted)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--sidebar-hover)] rounded">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--sidebar-hover)] rounded">Enter</kbd>
              <span>Select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--sidebar-hover)] rounded text-xs">{shortcutKey}</kbd>
              <span>Open</span>
            </div>
          </div>
          <div>{results.length} results</div>
        </div>
      </div>
    </div>
  )
}

// Portal wrapper - never re-renders
export default function CommandPalette({ onNavigate, onClose }: CommandPaletteProps) {
  if (typeof document !== 'undefined') {
    return createPortal(
      <CommandPaletteContent onNavigate={onNavigate} onClose={onClose} />,
      document.body
    )
  }
  return <CommandPaletteContent onNavigate={onNavigate} onClose={onClose} />
}

