"use client"
import React, { useState, useRef, memo, useCallback, useEffect } from "react"
import { FileCode, X, Github, FileText, Settings } from "lucide-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

interface Tab {
  id: "mina" | "signin" | "admin" | "github"
  label: string
  icon: React.ReactNode
  path: string
}

const getInitialTabs = (isAuthenticated: boolean): Tab[] => [
  { id: "mina", label: "mina-youaness-resume.tsx", icon: <FileCode className="w-4 h-4" />, path: "/" },
  { 
    id: isAuthenticated ? "admin" : "signin", 
    label: isAuthenticated ? "admin.md" : "signin.md", 
    icon: isAuthenticated ? <Settings className="w-4 h-4" /> : <FileText className="w-4 h-4" />, 
    path: isAuthenticated ? "/admin" : "/signin" 
  },
  { id: "github", label: "GitHub Activity", icon: <Github className="w-4 h-4" />, path: "/github" },
]

const TAB_TYPE = "TAB"

interface DraggableTabProps {
  tab: Tab
  index: number
  moveTab: (fromIndex: number, toIndex: number) => void
  isActive: boolean
  onNavigate: (path: string) => void
  onTabClose?: (id: Tab["id"]) => void
  onMountRef?: (el: HTMLDivElement | null, index: number) => void
}

const DraggableTab: React.FC<DraggableTabProps> = memo(({ tab, index, moveTab, isActive, onNavigate, onTabClose, onMountRef }) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleNavigate = useCallback(() => {
    onNavigate(tab.path)
  }, [onNavigate, tab.path])

  const handleTabClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onTabClose?.(tab.id)
  }, [onTabClose, tab.id])

  const [, drop] = useDrop({
    accept: TAB_TYPE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientX = clientOffset.x - hoverBoundingRect.left

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return

      moveTab(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: TAB_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  useEffect(() => {
    onMountRef?.(ref.current, index)
  }, [onMountRef, index])

  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 px-2 sm:px-3 py-1 h-8 cursor-pointer relative snap-start ${
        tab.id !== "github" ? "border-r border-[var(--vscode-border,#333)]" : ""
      } ${
        isActive
          ? "bg-[var(--sidebar-bg-hover)] text-[var(--vscode-text)]"
          : "bg-[var(--bg-secondary)] text-[var(--vscode-tab-inactiveForeground,#888)] hover:text-[var(--vscode-text)]"
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={handleNavigate}
    >
      {tab.icon}
      <span className="whitespace-nowrap text-sm sm:text-base max-w-[38vw] sm:max-w-none truncate">{tab.label}</span>

      {isActive ? (
        <div className="ml-2 w-2 h-2 bg-[var(--vscode-text)] rounded-full" role="status" aria-label="File synced" />
      ) : (
        <button
          onClick={handleTabClose}
          className="ml-2 text-xs opacity-50 hover:opacity-100 hidden sm:inline"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Ink bar */}
      <div
        className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[var(--vscode-blue)] transform origin-left transition-transform duration-200 ease-out ${
          isActive ? 'scale-x-100' : 'scale-x-0'
        }`}
        aria-hidden
      />
    </div>
  )
})

DraggableTab.displayName = 'DraggableTab'

const Header: React.FC = memo(() => {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [tabs, setTabs] = useState<Tab[]>(getInitialTabs(isAuthenticated))

  // Update tabs when authentication status changes
  useEffect(() => {
    setTabs(getInitialTabs(isAuthenticated))
  }, [isAuthenticated])

  const moveTab = useCallback((fromIndex: number, toIndex: number) => {
    setTabs(prev => {
      const updated = Array.from(prev)
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated
    })
  }, [])

  const handleNavigate = useCallback((path: string) => {
    router.push(path)
  }, [router])

  const handleTabClose = useCallback((id: Tab["id"]) => {
    setTabs(prev => prev.filter(t => t.id !== id))
  }, [])

  const tabRefs = useRef<Array<HTMLDivElement | null>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeIndex = tabs.findIndex(t => t.path === pathname)
    const el = tabRefs.current[activeIndex]
    const container = containerRef.current
    if (!el || !container) return
    try {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    } catch {}
    // Fallback precise centering
    const containerRect = container.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const delta = (elRect.left + elRect.width / 2) - (containerRect.left + containerRect.width / 2)
    container.scrollTo({ left: container.scrollLeft + delta, behavior: 'smooth' })
  }, [pathname, tabs])

  return (
    <DndProvider backend={HTML5Backend}>
      <div ref={containerRef} className="sticky top-0 w-full bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-border)] flex items-center gap-2 flex-shrink-0 transition-colors duration-300 z-30 overflow-x-auto scrollbar-hide snap-x">
        <div className="flex items-center flex-nowrap min-w-max">
          {tabs.map((tab, index) => (
            <DraggableTab
              key={tab.id}
              tab={tab}
              index={index}
              moveTab={moveTab}
              isActive={pathname === tab.path}
              onNavigate={handleNavigate}
              onTabClose={handleTabClose}
              onMountRef={(el) => { tabRefs.current[index] = el }}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
})

Header.displayName = 'Header'
export default Header
