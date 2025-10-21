"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { useResumeData } from "@/hooks/useResumeData"
import { Project } from "@/types/resume"
import ReadingProgress from "./components/ReadingProgress"
import ProjectHeader from "./components/ProjectHeader"
import TableOfContents from "./components/TableOfContents"
import ProjectMetadata from "./components/ProjectMetadata"
import ProjectContent from "./components/ProjectContent"
import ScrollToTop from "./components/ScrollToTop"
import {
  useReadingProgress,
  useActiveHeading,
  useHeadingExtraction,
} from "./components/useProjectScroll"
import "./styles/print.css"

export default function ProjectDetailClient() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { resumeData } = useResumeData()

  const [markdownContent, setMarkdownContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [project, setProject] = useState<Project | null>(null)

  // Ref to control scroll tracking
  const isScrollingProgrammatically = useRef(false)

  // Custom hooks for scroll behavior
  const readingProgress = useReadingProgress()
  const { headings, headingTree } = useHeadingExtraction(markdownContent)
  const activeId = useActiveHeading(headings, isScrollingProgrammatically)

  // Find project
  useEffect(() => {
    if (resumeData?.projects) {
      const found = resumeData.projects.find(
        (p: any) => p.detailsFile === `${slug}.md`
      )
      setProject(found || null)
    }
  }, [resumeData, slug])

  // Fetch markdown
  useEffect(() => {
    if (!project?.detailsFile) return

    setLoading(true)
    setError(null)

    fetch(`/data/projects/${project.detailsFile}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load")
        return response.text()
      })
      .then((text) => {
        setMarkdownContent(text)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load project details")
        setLoading(false)
      })
  }, [project])

  // Handle TOC click - memoized to prevent recreation
  const handleTOCClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const mainElement = document.getElementById("main-content")
    const targetElement = document.getElementById(id)
    
    if (mainElement && targetElement) {
      // Disable scroll tracking BEFORE any scroll happens
      isScrollingProgrammatically.current = true
      
      // Update hash first (only once)
      history.replaceState(null, "", `#${id}`)
      
      // Listen for scroll end to re-enable tracking
      const handleScrollEnd = () => {
        isScrollingProgrammatically.current = false
        mainElement.removeEventListener("scrollend", handleScrollEnd)
      }
      
      mainElement.addEventListener("scrollend", handleScrollEnd, { once: true })
      
      // Fallback timeout in case scrollend doesn't fire (older browsers)
      const fallbackTimeout = setTimeout(() => {
        if (isScrollingProgrammatically.current) {
          isScrollingProgrammatically.current = false
          mainElement.removeEventListener("scrollend", handleScrollEnd)
        }
      }, 1500)
      
      // Then scroll
      const elementTop = targetElement.offsetTop - mainElement.offsetTop
      mainElement.scrollTo({
        top: elementTop - 100, // Offset for header
        behavior: "smooth",
      })
      
      // Clear fallback if scrollend fires first
      mainElement.addEventListener("scrollend", () => clearTimeout(fallbackTimeout), { once: true })
    }
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007acc] mx-auto mb-4"></div>
          <p>Loading project details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#f48771] text-xl mb-2">Project not found</p>
          <p className="mb-6">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/#projects")}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-[#007acc]/20 border border-[#007acc] text-[#007acc]"
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      <ReadingProgress progress={readingProgress} />
      <ProjectHeader projectName={project.name} />

      <div className="flex-1 overflow-hidden min-h-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex gap-4 h-full py-4">
            <TableOfContents
              headingTree={headingTree}
              activeId={activeId}
              onTOCClick={handleTOCClick}
            />

            <main 
              id="main-content"
              className="flex-1 min-w-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              <div className="pr-4">
                <ProjectMetadata project={project} />
                <ProjectContent markdownContent={markdownContent} headingTree={headingTree} />

                <div
                  className="mt-12 pt-6 border-t border-[var(--projects-border)]"
                >
                  <button
                    onClick={() => router.push("/#projects")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-white/5"
                    style={{ color: "var(--projects-text-accent-blue)", border: "1px solid var(--projects-border)" }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to All Projects
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop threshold={300} mainElementId="main-content" />
    </div>
  )
}
