"use client"

import { useState, useEffect } from "react"
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
  const [isExplorerOpen, setIsExplorerOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("explorer")
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
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const toggleDirectory = (dirId: string) => {
    setExpandedDirs((prev) => ({ ...prev, [dirId]: !prev[dirId] }))
  }

  const generateFileStructure = () => {
    const structure: any[] = [
      { id: "hero", name: "hero.ts", icon: User, color: "#007acc", type: "file" },
      { id: "technologies", name: "technologies.ts", icon: Code, color: "#9cdcfe", type: "file" },
      { id: "contact", name: "contact.ts", icon: Mail, color: "#b5cea8", type: "file" },
    ]

    const projectsChildren = [
      "turris-erp",
      "entityconnect",
      "abgadya-learning",
      "medical-rep",
      "booking-engine",
      "communication-suite",
    ].map((name) => ({
      id: `projects-${name}`,
      name: `${name}.ts`,
      icon: FileText,
      color: "#4ec9b0",
      parent: "projects",
    }))

    structure.push({
      id: "projects",
      name: "projects/",
      icon: Folder,
      color: "#dcb67a",
      type: "directory",
      children: projectsChildren,
    })

    const experienceChildren = staticResumeData.experience.map((exp) => ({
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

    const educationChildren = staticResumeData.education.map((edu, idx) => ({
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

    const certificationsChildren = staticResumeData.certifications.map((cert, idx) => ({
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
    let targetId = sectionId
    if (sectionId.includes("-")) {
      const [parent, idxOrName] = sectionId.split("-")
      if (parent === "projects") targetId = "projects"
      if (parent === "certifications") {
        const cert = staticResumeData.certifications[Number(idxOrName)]
        if (cert) targetId = `cert-${cert.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
      }
    }

    const element = document.getElementById(targetId)
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
    onSectionClick(sectionId)
  }

  const sidebarTabs = [
    { id: "explorer", icon: FolderOpen, tooltip: "Explorer" },
    { id: "search", icon: Search, tooltip: "Search" },
    { id: "git", icon: GitBranch, tooltip: "Source Control" },
    { id: "extensions", icon: Extensions, tooltip: "Extensions" },
    { id: "settings", icon: Settings, tooltip: "Settings" },
  ]

  return (
    <>
      {!isCollapsed && <div className="inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={onToggle} />}

      {/* Activity Bar */}
      <div className="w-12 h-full bg-[var(--activity-bar-bg)] border-r border-[var(--activity-bar-border)] flex flex-col z-50 min-h-screen">
        <div className="flex flex-col py-2">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  if (tab.id === "explorer" && activeTab === "explorer") onToggle()
                  if (isCollapsed) onToggle()
                }}
                className={`w-12 h-12 flex items-center justify-center transition-colors relative group ${
                  isActive && !isCollapsed
                    ? "text-[var(--activity-bar-text-active)] bg-[var(--activity-bar-active)]"
                    : "text-[var(--activity-bar-text)] hover:text-[var(--activity-bar-text-active)] hover:bg-[var(--activity-bar-hover)]"
                }`}
                title={tab.tooltip}
              >
                <Icon size={20} />
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--activity-bar-text-active)]"></div>
                )}
              </button>
            )
          })}

          <div className="mt-auto mb-2">
            <button
              onClick={onToggle}
              className="w-12 h-12 flex items-center justify-center text-[var(--activity-bar-text)] hover:text-[var(--activity-bar-text-active)] hover:bg-[var(--activity-bar-hover)] transition-colors"
              title={isCollapsed ? "Show Sidebar" : "Hide Sidebar"}
            >
              <ChevronRight className={`transition-transform duration-200 ${isCollapsed ? "rotate-0" : "rotate-180"}`} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Panel */}
      {!isCollapsed && (
        <div className="w-64 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] transition-all duration-300 z-40 min-h-screen fixed left-12 top-0 md:relative md:left-0 max-w-[calc(100vw-3rem)] overflow-x-hidden">
          <div className="md:hidden absolute top-2 right-2 z-50">
            <button onClick={onToggle} className="w-8 h-8 flex items-center justify-center text-[var(--activity-bar-text)] hover:text-[var(--activity-bar-text-active)] hover:bg-[var(--activity-bar-hover)] rounded transition-colors">
              <X size={16} />
            </button>
          </div>

          {activeTab === "explorer" && (
            <>
              <div className="h-9 bg-[var(--sidebar-bg)] flex items-center px-3 text-xs text-[var(--sidebar-text)] font-medium border-b border-[var(--sidebar-border)] uppercase tracking-wide">
                Explorer
              </div>
              <div className="p-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
                <div className="mb-2">
                  <button
                    onClick={() => setIsExplorerOpen(!isExplorerOpen)}
                    className="flex items-center gap-2 text-xs text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] transition-colors w-full py-1 px-2 hover:bg-[var(--sidebar-hover)] rounded"
                  >
                    {isExplorerOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <FolderOpen size={14} className="text-[var(--sidebar-directory-color)]" />
                    <span className="font-medium uppercase tracking-wide truncate">Resume-Portfolio</span>
                  </button>
                </div>

                {isExplorerOpen && (
                  <div className="ml-4 space-y-0.5">
                    {fileStructure.map((item) => (
                      <TreeItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        icon={item.icon}
                        color={item.color}
                        isActive={currentSection === item.id}
                        isExpanded={item.type === "directory" ? expandedDirs[item.id] : undefined}
                        onToggleExpand={item.type === "directory" ? toggleDirectory : undefined}
                        onClick={scrollToSection}
                      >
                        {item.children &&
                          item.children.map((child: any) => (
                            <TreeItem
                              key={child.id}
                              id={child.id}
                              name={child.name}
                              icon={child.icon}
                              color={child.color}
                              isActive={currentSection === child.id}
                              onClick={scrollToSection}
                            />
                          ))}
                      </TreeItem>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
                <div className="text-xs text-[var(--sidebar-text)] space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{getTotalFileCount()} files • Portfolio v1.0</span>
                  </div>
                  <div className="text-[var(--sidebar-text-muted)]">Last modified: Just now</div>
                </div>
              </div>
            </>
          )}

          {activeTab === "search" && <SearchTab shortcutKey={shortcutKey} onNavigate={scrollToSection} />}
          {activeTab === "git" && <CareerGitHistory onNavigate={scrollToSection} />}
          {activeTab === "extensions" && <SkillsMarketplace onNavigate={scrollToSection} />}
          {activeTab === "settings" && <RecruiterDashboard onNavigate={scrollToSection} />}
        </div>
      )}

      {showCommandPalette && <CommandPalette onNavigate={scrollToSection} onClose={() => setShowCommandPalette(false)} />}
    </>
  )
}

// Optional: Extracted SearchTab component for clarity
function SearchTab({ shortcutKey, onNavigate }: { shortcutKey: string; onNavigate: (id: string) => void }) {
  return (
    <div className="max-h-[calc(100vh-8rem)] flex flex-col">
      <div className="h-9 bg-[var(--sidebar-bg)] flex items-center px-3 text-xs text-[var(--sidebar-text)] font-medium border-b border-[var(--sidebar-border)] uppercase tracking-wide">
        Search
      </div>
      <div className="p-4 flex-1">
        <button
          onClick={() => onNavigate("projects")}
          className="w-full flex items-center gap-3 p-3 bg-[var(--sidebar-hover)] hover:bg-[var(--sidebar-hover-active)] rounded-md transition-colors text-left"
        >
          <Search size={16} className="text-[var(--sidebar-text)]" />
          <span className="text-sm text-[var(--sidebar-text)]">Search resume content...</span>
          <div className="ml-auto text-xs text-[var(--sidebar-text)]">
            <kbd className="px-1.5 py-0.5 bg-[var(--sidebar-hover)] rounded font-sans">{shortcutKey}</kbd>
          </div>
        </button>
      </div>
    </div>
  )
}
