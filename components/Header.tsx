"use client"

import React, { useEffect, useMemo, useState } from "react"
import { FileCode, Github, FileText, Settings, X as CloseIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"

interface TabDef {
  id: string
  label: string
  icon: React.ReactNode
  path: string
  isDynamic?: boolean
}

const getBaseTabs = (isAuthenticated: boolean): TabDef[] => [
  { id: "mina", label: "mina-youaness-resume.tsx", icon: <FileCode className="w-4 h-4" />, path: "/" },
  {
    id: isAuthenticated ? "admin" : "signin",
    label: isAuthenticated ? "admin.md" : "signin.md",
    icon: isAuthenticated ? <Settings className="w-4 h-4" /> : <FileText className="w-4 h-4" />,
    path: isAuthenticated ? "/admin" : "/signin",
  },
  { id: "github", label: "GitHub Activity", icon: <Github className="w-4 h-4" />, path: "/github" },
]

const normalizePath = (p: string) => (!p ? p : p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p)

const Header: React.FC = () => {
  const pathname = normalizePath(usePathname())
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const baseTabs = useMemo(() => getBaseTabs(isAuthenticated), [isAuthenticated])
  const [dynamicTabs, setDynamicTabs] = useState<TabDef[]>([])

  const tabs = useMemo(() => [...baseTabs, ...dynamicTabs], [baseTabs, dynamicTabs])

  const value = useMemo(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const full = normalizePath(pathname) + hash
    // Try exact match including hash first
    let idx = tabs.findIndex(t => normalizePath(t.path) === full)
    if (idx !== -1) return idx
    // Fallback to pathname-only match
    idx = tabs.findIndex(t => normalizePath(t.path) === normalizePath(pathname))
    return idx === -1 ? 0 : idx
  }, [tabs, pathname])

  const closeTab = (pathToClose: string) => {
    const nPathToClose = normalizePath(pathToClose)
    const currentIndex = tabs.findIndex(t => normalizePath(t.path) === pathname)
    const tabsAfter = tabs.filter(t => normalizePath(t.path) !== nPathToClose)

    setDynamicTabs(prev => prev.filter(t => normalizePath(t.path) !== nPathToClose))

    // If we closed the active tab, navigate to a sensible neighbor
    if (normalizePath(pathname) === nPathToClose) {
      const nextIndex = Math.max(0, Math.min(currentIndex - 1, tabsAfter.length - 1))
      const fallback = tabsAfter[nextIndex] || baseTabs[0]
      if (fallback) router.push(fallback.path)
    }
  }

  // Expose global: headerAddTab(label, path)
  useEffect(() => {
    (window as any).headerAddTab = (label: string, path: string) => {
      if (!label || !path) return
      setDynamicTabs(prev => {
        if ([...baseTabs, ...prev].some(t => normalizePath(t.path) === normalizePath(path))) return prev
        return [...prev, { id: label, label, icon: <FileText className="w-4 h-4" />, path, isDynamic: true }]
      })
      router.push(path)
    }
    return () => {
      if ((window as any).headerAddTab) delete (window as any).headerAddTab
    }
  }, [router, baseTabs])

  // Listen for open-file-tab to add/select a dynamic tab
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ id: string; label: string; path: string }>
      const { id, label, path } = ce.detail || ({} as any)
      if (!label || !path) return
      setDynamicTabs(prev => {
        if ([...baseTabs, ...prev].some(t => normalizePath(t.path) === normalizePath(path))) return prev
        return [...prev, { id: id || label, label, icon: <FileText className="w-4 h-4" />, path, isDynamic: true }]
      })
      router.push(path)
    }
    window.addEventListener("open-file-tab", handler as EventListener)
    return () => window.removeEventListener("open-file-tab", handler as EventListener)
  }, [router, baseTabs])

  // Ensure a project page always has a corresponding tab
  useEffect(() => {
    if (typeof window === 'undefined') return
    const path = window.location.pathname + window.location.hash
    if (!path.startsWith('/projects/')) return
    const slugMatch = path.match(/^\/projects\/([^/#]+)(?:\/?#.*)?$/)
    if (!slugMatch) return
    const slug = slugMatch[1]
    const fullPath = normalizePath(window.location.pathname) + (window.location.hash || '')

    setDynamicTabs(prev => {
      if ([...baseTabs, ...prev].some(t => normalizePath(t.path) === normalizePath(fullPath))) return prev
      return [...prev, { id: `projects-${slug}`, label: `${slug}.ts`, icon: <FileText className="w-4 h-4" />, path: fullPath, isDynamic: true }]
    })
  }, [baseTabs, pathname])

  return (
    <div className="sticky top-0 w-full bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-border)] z-30">
      <Tabs
        value={value}
        onChange={(_, newIndex: number) => {
          const target = tabs[newIndex]
          if (target) router.push(target.path)
        }}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        TabIndicatorProps={{ style: { backgroundColor: "var(--vscode-blue, #007acc)", height: 2 } }}
        sx={{
          minHeight: 32,
          "& .MuiTabs-flexContainer": { alignItems: "center" },
          "& .MuiTab-root": {
            minHeight: 32,
            padding: "4px 8px",
            marginRight: "2px",
            textTransform: "none",
            color: "var(--vscode-tab-inactiveForeground, #888)",
            backgroundColor: "var(--bg-secondary)",
            borderRight: "1px solid var(--vscode-border,#333)",
            fontSize: "0.95rem",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "var(--vscode-text)",
            backgroundColor: "var(--sidebar-bg-hover)",
          },
          "& .MuiTab-iconWrapper": { fontSize: 0, marginRight: 6 },
          "& .MuiTabs-scrollButtons": { color: "var(--vscode-text)" },
        }}
      >
        {tabs.map((t, index) => (
          <Tab
            key={`${t.id}-${t.path}`}
            disableRipple
            icon={t.icon as any}
            iconPosition="start"
            label={
              <span className="group inline-flex items-center gap-2 whitespace-nowrap text-sm sm:text-base truncate max-w-[38vw] sm:max-w-none">
                {t.label}
                {/* VS Code-like active dot that turns into an X on hover for dynamic tabs */}
                {t.isDynamic && value === index && (
                  <>
                    <span className="ml-1 w-2 h-2 bg-[var(--vscode-text)] rounded-full group-hover:hidden" aria-hidden />
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); closeTab(t.path) }}
                      className="ml-1 hidden group-hover:inline-flex items-center justify-center rounded hover:bg-[var(--vscode-border,#333)]/60"
                      title="Close"
                      aria-label={`Close ${t.label}`}
                      style={{ width: 16, height: 16 }}
                    >
                      <CloseIcon className="w-3 h-3 opacity-80" />
                    </button>
                  </>
                )}
                {/* For non-active dynamic tabs, show close on hover only */}
                {t.isDynamic && value !== index && (
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); closeTab(t.path) }}
                    className="ml-1 hidden group-hover:inline-flex items-center justify-center rounded hover:bg-[var(--vscode-border,#333)]/60"
                    title="Close"
                    aria-label={`Close ${t.label}`}
                    style={{ width: 16, height: 16 }}
                  >
                    <CloseIcon className="w-3 h-3 opacity-80" />
                  </button>
                )}
              </span>
            }
          />
        ))}
      </Tabs>
    </div>
  )
}

export default React.memo(Header)
