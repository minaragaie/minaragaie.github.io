"use client"

import { useEffect, useMemo, useState } from "react"
import { useExplorer } from "@/context/ExplorerContext"
import { useResumeData } from "@/hooks/useResumeData"
import { staticResumeData } from "@/lib/resume-data"
import { slugify } from "@/lib/utils"
import { ChevronDown, ChevronRight, FolderOpen, X, User, Code, Mail, Briefcase, GraduationCap, Award, FileText } from "lucide-react"
import TreeItem from "./TreeItem"
import CareerGitHistory from "./CareerGitHistory"
import SkillsMarketplace from "./SkillsMarketplace"
import RecruiterDashboard from "./RecruiterDashboard"

interface StaticResumeData {
  experience?: Array<{ id: number; company: string; degree?: string }>
  education?: Array<{ degree: string }>
  certifications?: Array<{ name: string }>
  projects?: Array<{ name: string; githubUrl?: string; slug?: string }>
}

const resumeData = staticResumeData as StaticResumeData | null

export default function SearchPanel() {
  const { isOpen, closeExplorer, activeTab } = useExplorer()
  const { resumeData: apiResumeData } = useResumeData()
  const [isExplorerOpen, setIsExplorerOpen] = useState(true)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null)

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeExplorer()
    }
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [isOpen, closeExplorer])

  // Lock body scroll when panel is open (parity with previous behavior)
  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    if (isOpen) {
      body.classList.add('overflow-hidden')
    } else {
      body.classList.remove('overflow-hidden')
    }
    return () => body.classList.remove('overflow-hidden')
  }, [isOpen])

  // Basic mobile swipe: open with edge swipe, close with left swipe
  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const x = e.touches[0]?.clientX ?? 0
      if (!isOpen && x <= 24) {
        setTouchStartX(x)
        setTouchCurrentX(x)
      } else if (isOpen) {
        setTouchStartX(x)
        setTouchCurrentX(x)
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartX !== null) {
        setTouchCurrentX(e.touches[0]?.clientX ?? touchCurrentX)
      }
    }
    const onTouchEnd = () => {
      if (touchStartX !== null && touchCurrentX !== null) {
        const deltaX = touchCurrentX - touchStartX
        if (!isOpen && deltaX > 50) {
          const ev = new CustomEvent('open-explorer', { detail: { tab: 'explorer' } })
          window.dispatchEvent(ev)
        } else if (isOpen && deltaX < -50) {
          closeExplorer()
        }
      }
      setTouchStartX(null)
      setTouchCurrentX(null)
    }
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isOpen, touchStartX, touchCurrentX, closeExplorer])

  const fileStructure = useMemo(() => {
    const structure: any[] = [
      { id: "hero", name: "hero.ts", icon: User, color: "#007acc", type: "file" },
      { id: "technologies", name: "technologies.ts", icon: Code, color: "#9cdcfe", type: "file" },
      { id: "contact", name: "contact.ts", icon: Mail, color: "#b5cea8", type: "file" },
    ]
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
      : [{ id: "projects-empty", name: "No projects available.ts", icon: FileText, color: "#757575", parent: "projects", empty: true }]

    structure.push({ id: "projects", name: "projects/", icon: FolderOpen, color: "#dcb67a", type: "directory", children: projectsChildren })

    const experienceChildren = (resumeData?.experience || []).map((exp: any) => ({
      id: `experience-${exp.id}`,
      name: `${slugify(exp.company.toLowerCase())}.ts`,
      icon: Briefcase,
      color: "#dcdcaa",
      parent: "experience",
    }))
    structure.push({ id: "experience", name: "experience/", icon: FolderOpen, color: "#dcb67a", type: "directory", children: experienceChildren })

    const educationChildren = (resumeData?.education || []).map((edu: any, idx: any) => ({
      id: `education-${idx}`,
      name: `${slugify((edu.degree || "unknown-degree").toLowerCase())}.ts`,
      icon: GraduationCap,
      color: "#c586c0",
      parent: "education",
    }))
    structure.push({ id: "education", name: "education/", icon: FolderOpen, color: "#dcb67a", type: "directory", children: educationChildren })

    const certificationsChildren = (resumeData?.certifications || []).map((cert: any, idx: any) => ({
      id: `certifications-${idx}`,
      name: `${slugify((cert.name || "unknown-certificate").toLowerCase())}.ts`,
      icon: Award,
      color: "#ce9178",
      parent: "certifications",
    }))
    structure.push({ id: "certifications", name: "certifications/", icon: FolderOpen, color: "#dcb67a", type: "directory", children: certificationsChildren })

    return structure
  }, [apiResumeData])

  const getTotalFileCount = () => fileStructure.reduce((acc: number, item: any) => acc + (item.type === "directory" ? item.children.length : 1), 0)

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "projects-empty") return
    if (sectionId.startsWith("projects-")) {
      const projectSlug = sectionId.replace("projects-", "")
      window.location.href = `/projects/${projectSlug}/`
      return
    }
    let targetId = sectionId
    if (sectionId.includes("-")) {
      const [parent, idxOrName] = sectionId.split("-")
      if (parent === "projects") targetId = "projects"
      if (parent === "certifications") {
        const cert = (resumeData?.certifications as any)?.[Number(idxOrName)]
        if (cert) targetId = `cert-${cert.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
      }
    }
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    closeExplorer()
  }

  const onNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    closeExplorer()
  }

  return (
    <>
      {/* Mobile overlay (kept mounted for smooth enter/exit) */}
      <div className="md:hidden">
        <div
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 bg-black/40 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={closeExplorer}
          aria-hidden="true"
        />
        <div
          className={`fixed inset-x-0 bottom-14 top-0 bg-[var(--sidebar-bg)] border-l border-[var(--sidebar-border)] flex flex-col h-[calc(100%-3.5rem)] z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 animate-slide-in-left' : 'translate-x-[-100%]'}`}
          role="dialog"
          aria-modal
          aria-hidden={!isOpen}
        >
            <div className="absolute top-2 right-2 z-50">
              <button onClick={closeExplorer} className="w-10 h-10 flex items-center justify-center text-[var(--activity-bar-text)] hover:text-[var(--activity-bar-text-active)] hover:bg-[var(--activity-bar-hover)] rounded-full transition-all duration-200" aria-label="Close Explorer">
                <X size={18} />
              </button>
            </div>

            {activeTab === "explorer" && (
              <>
                <div className="h-9 bg-[var(--sidebar-bg)] flex items-center px-3 text-xs text-[var(--sidebar-text)] font-medium border-b border-[var(--sidebar-border)] uppercase tracking-wide">Explorer</div>
                <div className="p-2 overflow-y-auto flex-1 sidebar-scrollbar">
                  <div className="mb-2">
                    <button onClick={() => setIsExplorerOpen(!isExplorerOpen)} className="flex items-center gap-2 text-xs text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] transition-colors w-full py-1 px-2 hover:bg-[var(--sidebar-hover)] rounded">
                      {isExplorerOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      <FolderOpen size={14} className="text-[var(--sidebar-directory-color)]" />
                      <span className="font-medium uppercase tracking-wide truncate">Resume-Portfolio</span>
                    </button>
                  </div>
                  {isExplorerOpen && (
                    <div className="ml-4 space-y-0.5">
                      {fileStructure.map((item: any) => (
                        <TreeItem key={item.id} id={item.id} name={item.name} icon={item.icon} color={item.color} isActive={false} isExpanded={item.type === "directory" ? false : undefined} onClick={scrollToSection}>
                          {item.children &&
                            item.children.map((child: any) => (
                              <TreeItem key={child.id} id={child.id} name={child.name} icon={child.icon} color={child.color} isActive={false} onClick={scrollToSection} />
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

            {activeTab === "search" && (
              <div className="flex flex-col h-full">
                <div className="h-9 bg-[var(--sidebar-bg)] flex items-center px-3 text-xs text-[var(--sidebar-text)] font-medium border-b border-[var(--sidebar-border)] uppercase tracking-wide">Search</div>
                <div className="p-4 flex-1 sidebar-scrollbar">
                  <button onClick={() => onNavigate("projects")} className="w-full flex items-center gap-3 p-3 bg-[var(--sidebar-hover)] hover:bg-[var(--sidebar-hover-active)] rounded-md transition-colors text-left">
                    <Code size={16} className="text-[var(--sidebar-text)]" />
                    <span className="text-sm text-[var(--sidebar-text)]">Search resume content...</span>
                    <div className="ml-auto text-xs text-[var(--sidebar-text)]">
                      <kbd className="px-1.5 py-0.5 bg-[var(--sidebar-hover)] rounded font-sans">⌘⇧P</kbd>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "git" && <CareerGitHistory onNavigate={onNavigate} />}
            {activeTab === "extensions" && <SkillsMarketplace onNavigate={onNavigate} />}
            {activeTab === "settings" && <RecruiterDashboard onNavigate={onNavigate} />}
        </div>
      </div>

      {/* Desktop docked panel (kept mounted for smooth enter/exit) */}
      {/* Desktop outside-click closes panel: transparent backdrop */}
      <div
        className={`hidden md:block fixed inset-0 z-30 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={isOpen ? closeExplorer : undefined}
        aria-hidden="true"
      />
      <div
        className={`hidden md:flex md:absolute md:left-12 md:top-0 md:w-64 md:h-full bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex-col z-40 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible pointer-events-auto translate-x-0' : 'opacity-0 invisible pointer-events-none -translate-x-2'}`}
      >
          {activeTab === "explorer" && (
            <>
              <div className="h-9 bg-[var(--sidebar-bg)] flex items-center px-3 text-xs text-[var(--sidebar-text)] font-medium border-b border-[var(--sidebar-border)] uppercase tracking-wide">Explorer</div>
              <div className="p-2 overflow-y-auto flex-1 sidebar-scrollbar">
                <div className="mb-2">
                  <button onClick={() => setIsExplorerOpen(!isExplorerOpen)} className="flex items-center gap-2 text-xs text-[var(--sidebar-text)] hover:text-[var(--sidebar-text-active)] transition-colors w-full py-1 px-2 hover:bg-[var(--sidebar-hover)] rounded">
                    {isExplorerOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    <FolderOpen size={14} className="text-[var(--sidebar-directory-color)]" />
                    <span className="font-medium uppercase tracking-wide truncate">Resume-Portfolio</span>
                  </button>
                </div>
                {isExplorerOpen && (
                  <div className="ml-4 space-y-0.5">
                    {fileStructure.map((item: any) => (
                      <TreeItem key={item.id} id={item.id} name={item.name} icon={item.icon} color={item.color} isActive={false} isExpanded={item.type === "directory" ? false : undefined} onClick={scrollToSection}>
                        {item.children &&
                          item.children.map((child: any) => (
                            <TreeItem key={child.id} id={child.id} name={child.name} icon={child.icon} color={child.color} isActive={false} onClick={scrollToSection} />
                          ))}
                      </TreeItem>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === "search" && (
            <div className="flex flex-col h-full">
              <div className="h-9 bg-[var(--sidebar-bg)] flex items-center px-3 text-xs text-[var(--sidebar-text)] font-medium border-b border-[var(--sidebar-border)] uppercase tracking-wide">Search</div>
              <div className="p-4 flex-1 sidebar-scrollbar">
                <button onClick={() => onNavigate("projects")} className="w-full flex items-center gap-3 p-3 bg-[var(--sidebar-hover)] hover:bg-[var(--sidebar-hover-active)] rounded-md transition-colors text-left">
                  <Code size={16} className="text-[var(--sidebar-text)]" />
                  <span className="text-sm text-[var(--sidebar-text)]">Search resume content...</span>
                </button>
              </div>
            </div>
          )}
          {activeTab === "git" && <CareerGitHistory onNavigate={onNavigate} />}
          {activeTab === "extensions" && <SkillsMarketplace onNavigate={onNavigate} />}
          {activeTab === "settings" && <RecruiterDashboard onNavigate={onNavigate} />}
        </div>
    </>
  )
}
