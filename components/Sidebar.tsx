"use client"

import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  ChevronRight,
  User,
  Briefcase,
  Code,
  GraduationCap,
  Award,
  Mail,
  FolderOpen,
  Search,
  GitBranch,
  Settings,
  Utensils as Extensions,
  Folder,
  FileText,
  X,
} from "lucide-react"

import { staticResumeData } from "@/lib/resume-data"
import { useResumeData } from "@/hooks/useResumeData"
import { useExplorer } from "@/context/ExplorerContext"

// Type for static resume data
interface StaticResumeData {
  experience?: Array<{ id: number; company: string; degree?: string }>
  education?: Array<{ degree: string }>
  certifications?: Array<{ name: string }>
  projects?: Array<{ name: string; githubUrl?: string; slug?: string }>
}

// Cast staticResumeData to the proper type
const resumeData = staticResumeData as StaticResumeData | null
import { slugify } from "@/lib/utils"
import TreeItem from "./TreeItem"
import CommandPalette from "./CommandPalette"
import CareerGitHistory from "./CareerGitHistory"
import SkillsMarketplace from "./SkillsMarketplace"
import RecruiterDashboard from "./RecruiterDashboard"

interface SidebarProps {
  currentSection: string
  onSectionClick: (sectionId: string) => void
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ currentSection, onSectionClick, isCollapsed, onToggle }: SidebarProps) {
  const { isOpen: explorerOpen, activeTab } = useExplorer()
  const { resumeData: apiResumeData } = useResumeData()
  const [isExplorerOpen, setIsExplorerOpen] = useState(true)
  const touchStartXRef = useRef<number | null>(null)
  const touchCurrentXRef = useRef<number | null>(null)
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    projects: false,
    experience: false,
    education: false,
    certifications: false,
  })
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().includes("MAC")
  const shortcutKey = isMac ? "⌘⇧P" : "Ctrl+Shift+P"

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toUpperCase() === "P") {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      // Close overlay on Escape
      if (e.key === "Escape" && !isCollapsed) {
        onToggle()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Broadcast explorer open/close state to other components (e.g., StatusBar)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ev = new CustomEvent('explorer-state', { detail: { open: !isCollapsed } })
      window.dispatchEvent(ev)
    }
  }, [isCollapsed])

  // Panel is controlled externally via SearchPanel

  // Persist active tab and explorer state
  useEffect(() => {
    const savedExplorer = typeof window !== 'undefined' ? localStorage.getItem('sidebar.explorerOpen') : null
    if (savedExplorer) setIsExplorerOpen(savedExplorer === '1')
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar.explorerOpen', isExplorerOpen ? '1' : '0')
    }
  }, [isExplorerOpen])

  // Basic swipe gestures: open with edge swipe, close with right swipe on overlay
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const x = e.touches[0]?.clientX ?? 0
      // Only start from left edge when collapsed
      if (isCollapsed && x <= 24) {
        touchStartXRef.current = x
        touchCurrentXRef.current = x
      } else if (!isCollapsed) {
        // When open, allow swipe anywhere on left half
        touchStartXRef.current = x
        touchCurrentXRef.current = x
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartXRef.current !== null) {
        touchCurrentXRef.current = e.touches[0]?.clientX ?? touchCurrentXRef.current
      }
    }
    const onTouchEnd = () => {
      if (touchStartXRef.current !== null && touchCurrentXRef.current !== null) {
        const deltaX = touchCurrentXRef.current - touchStartXRef.current
        // Threshold
        if (isCollapsed && deltaX > 50) {
          onToggle() // open
        } else if (!isCollapsed && deltaX < -50) {
          onToggle() // close
        }
      }
      touchStartXRef.current = null
      touchCurrentXRef.current = null
    }
    // Mobile only listeners
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isCollapsed, onToggle])

  const toggleDirectory = (dirId: string) => {
    setExpandedDirs((prev) => ({ ...prev, [dirId]: !prev[dirId] }))
  }

  const generateFileStructure = () => {
    const structure: any[] = [
      { id: "hero", name: "hero.ts", icon: User, color: "#007acc", type: "file" },
      { id: "technologies", name: "technologies.ts", icon: Code, color: "#9cdcfe", type: "file" },
      { id: "contact", name: "contact.ts", icon: Mail, color: "#b5cea8", type: "file" },
    ]

    // Use projects from API if available, otherwise show empty
    const projectsList = apiResumeData?.projects && apiResumeData.projects.length > 0
      ? apiResumeData.projects.map((p: any) => (p as any).slug || slugify(p.name))
      : []
    
    const projectsChildren = projectsList.length > 0
      ? projectsList.map((slug) => ({
          id: `projects-${slug}`,
          name: `${slug}.ts`,
          icon: FileText,
          color: "#4ec9b0",
          parent: "projects",
        }))
      : [{
          id: "projects-empty",
          name: "No projects available.ts",
          icon: FileText,
          color: "#757575",
          parent: "projects",
          empty: true,
        }]

    structure.push({
      id: "projects",
      name: "projects/",
      icon: Folder,
      color: "#dcb67a",
      type: "directory",
      children: projectsChildren,
    })

    const experienceChildren = (resumeData?.experience || []).map((exp: any) => ({
      id: `experience-${exp.id}`,
      name: `${slugify(exp.company.toLowerCase())}.ts`,
      icon: Briefcase,
      color: "#dcdcaa",
      parent: "experience",
    }))

    structure.push({
      id: "experience",
      name: "experience/",
      icon: Folder,
      color: "#dcb67a",
      type: "directory",
      children: experienceChildren,
    })

    const educationChildren = (resumeData?.education || []).map((edu: any, idx: any) => ({
      id: `education-${idx}`,
      name: `${slugify((edu.degree || "unknown-degree").toLowerCase())}.ts`,
      icon: GraduationCap,
      color: "#c586c0",
      parent: "education",
    }))

    structure.push({
      id: "education",
      name: "education/",
      icon: Folder,
      color: "#dcb67a",
      type: "directory",
      children: educationChildren,
    })

    const certificationsChildren = (resumeData?.certifications || []).map((cert: any, idx: any) => ({
      id: `certifications-${idx}`,
      name: `${slugify((cert.name || "unknown-certificate").toLowerCase())}.ts`,
      icon: Award,
      color: "#ce9178",
      parent: "certifications",
    }))

    structure.push({
      id: "certifications",
      name: "certifications/",
      icon: Folder,
      color: "#dcb67a",
      type: "directory",
      children: certificationsChildren,
    })

    return structure
  }

  const fileStructure = generateFileStructure()

  const getTotalFileCount = () =>
    fileStructure.reduce((acc, item) => acc + (item.type === "directory" ? item.children.length : 1), 0)

  const scrollToSection = (sectionId: string) => {
    // Handle empty projects case
    if (sectionId === "projects-empty") {
      return // Don't do anything for empty state
    }
    
    // Handle project navigation
    if (sectionId.startsWith("projects-")) {
      const projectSlug = sectionId.replace("projects-", "")
      // Navigate to project page
      window.location.href = `/projects/${projectSlug}/`
      return
    }

    let targetId = sectionId
    if (sectionId.includes("-")) {
      const [parent, idxOrName] = sectionId.split("-")
      if (parent === "projects") targetId = "projects"
      if (parent === "certifications") {
        const cert = resumeData?.certifications?.[Number(idxOrName)]
        if (cert) targetId = `cert-${cert.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
      }
    }

    // Use the parent's navigation handler
    onSectionClick(targetId)
  }

  const sidebarTabs = [
    { id: "explorer", icon: FolderOpen, tooltip: "Explorer" },
    { id: "search", icon: Search, tooltip: "Search" },
    { id: "git", icon: GitBranch, tooltip: "Source Control" },
    { id: "extensions", icon: Extensions, tooltip: "Extensions" },
    { id: "settings", icon: Settings, tooltip: "Settings" },
  ]

  return (
    <div className={`relative h-full transition-all duration-300 ease-in-out overflow-hidden w-0 md:w-12`}>
      {/* Activity Bar (hidden on mobile, left rail on md+) */}
      <div className="hidden md:flex md:absolute md:left-0 md:top-0 md:w-12 md:h-full bg-[var(--activity-bar-bg)] md:border-r border-[var(--activity-bar-border)] flex-col z-40">
          <div className="flex flex-col py-2">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = explorerOpen && activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  const ev = new CustomEvent('open-explorer', { detail: { tab: tab.id } })
                  window.dispatchEvent(ev)
                }}
                className={`w-12 h-12 flex items-center justify-center transition-all duration-200 relative group rounded mx-1 my-0.5 ${
                  isActive
                    ? "text-[var(--activity-bar-text-active)] bg-[var(--activity-bar-active)]"
                    : "text-[var(--activity-bar-text)] hover:text-[var(--activity-bar-text-active)] hover:bg-[var(--activity-bar-hover)]"
                }`}
                title={tab.tooltip}
              >
                <Icon size={20} />
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--activity-bar-text-active)]"></div>
                )}
              </button>
            )
          })}

          <div className="mt-auto mb-2">
            <button
              onClick={() => {
                // Close panel if open
                if (explorerOpen) {
                  const evClose = new Event('close-explorer')
                  window.dispatchEvent(evClose)
                } else if (isCollapsed) {
                  // If panel closed and rail collapsed, open explorer panel first
                  const evOpen = new CustomEvent('open-explorer', { detail: { tab: 'explorer' } })
                  window.dispatchEvent(evOpen)
                }
                // Then toggle the rail collapse/expand
                onToggle()
              }}
              className="w-12 h-12 flex items-center justify-center text-[var(--activity-bar-text)] hover:text-[var(--activity-bar-text-active)] hover:bg-[var(--activity-bar-hover)] transition-all duration-200 rounded mx-1 my-0.5"
              title={isCollapsed ? "Show Sidebar" : "Hide Sidebar"}
            >
              <ChevronRight className={`transition-transform duration-200 ${isCollapsed ? "rotate-0" : "rotate-180"}`} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Panel is rendered by SearchPanel component */}

      {showCommandPalette && <CommandPalette onNavigate={scrollToSection} onClose={() => setShowCommandPalette(false)} />}
    </div>
  )
}

