"use client"
import React, { useState, useRef, memo, useCallback } from "react"
import { FileCode, X, Github, FileText } from "lucide-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { usePathname, useRouter } from "next/navigation"

interface Tab {
  id: "mina" | "signin" | "github"
  label: string
  icon: React.ReactNode
  path: string
}

const initialTabs: Tab[] = [
  { id: "mina", label: "mina-youaness-resume.tsx", icon: <FileCode className="w-4 h-4" />, path: "/" },
  { id: "signin", label: "signin.md", icon: <FileText className="w-4 h-4" />, path: "/signin" },
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
}

const DraggableTab: React.FC<DraggableTabProps> = memo(({ tab, index, moveTab, isActive, onNavigate, onTabClose }) => {
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

  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 px-2 sm:px-3 py-1 h-8 cursor-pointer relative ${
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
      <span className="whitespace-nowrap text-sm sm:text-base">{tab.label}</span>

      {isActive ? (
        <div className="ml-2 w-2 h-2 bg-[var(--vscode-text)] rounded-full" role="status" aria-label="File synced" />
      ) : (
        <button
          onClick={handleTabClose}
          className="ml-2 text-xs opacity-50 hover:opacity-100"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
})

DraggableTab.displayName = 'DraggableTab'

const Header: React.FC = memo(() => {
  const pathname = usePathname()
  const router = useRouter()
  const [tabs, setTabs] = useState<Tab[]>(initialTabs)

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-border)] flex items-center gap-2 flex-shrink-0 transition-colors duration-300 z-10 overflow-x-auto scrollbar-hide">
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
            />
          ))}
        </div>
      </div>
    </DndProvider>
  )
})

Header.displayName = 'Header'
export default Header
