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

  // Helper: extract project slug from any pathname (works with basePath)
  const getProjectSlugFromPath = (path: string): string | null => {
    const parts = path.split('/').filter(Boolean)
    const idx = parts.indexOf('projects')
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    return null
  }

  // Helper: ensure a dynamic tab exists/updated for current /projects/[slug] route
  const ensureProjectTabFromLocation = () => {
    if (typeof window === 'undefined') return
    const path = window.location.pathname
    const hash = window.location.hash || ''
    const slug = getProjectSlugFromPath(path)
    if (!slug) return
    const fullPath = normalizePath(path) + hash
    const tabId = `projects-${slug}`
    setDynamicTabs(prev => {
      const existingIndex = prev.findIndex(t => t.id === tabId)
      if (existingIndex !== -1) {
        const next = [...prev]
        next[existingIndex] = { ...next[existingIndex], path: fullPath }
        return next
      }
      return [...prev, { id: tabId, label: `${slug}.ts`, icon: <FileText className="w-4 h-4" />, path: fullPath, isDynamic: true }]
    })
  }

  // Create/update project tab on pathname changes
  useEffect(() => {
    ensureProjectTabFromLocation()
  }, [pathname])

  // Keep selection hash-aware (recompute on hashchange) and ensure tab on hashchange
  const value = useMemo(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const full = normalizePath(pathname) + hash
    let idx = tabs.findIndex(t => normalizePath(t.path) === full)
    if (idx !== -1) return idx
    idx = tabs.findIndex(t => normalizePath(t.path) === normalizePath(pathname))
    return idx === -1 ? 0 : idx
  }, [tabs, pathname])

  useEffect(() => {
    const onHash = () => {
      ensureProjectTabFromLocation()
      // Trigger re-render so selection recalculates
      setDynamicTabs(prev => [...prev])
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const closeTab = (pathToClose: string) => {
    const nPathToClose = normalizePath(pathToClose)
    const indexToClose = tabs.findIndex(t => normalizePath(t.path) === nPathToClose)
    if (indexToClose === value) {
      const tabsAfter = tabs.filter(t => normalizePath(t.path) !== nPathToClose)
      const nextIndex = Math.max(0, Math.min(indexToClose - 1, tabsAfter.length - 1))
      const fallback = tabsAfter[nextIndex]
      if (fallback) router.push(fallback.path)
    }
    setDynamicTabs(prev => prev.filter(t => normalizePath(t.path) !== nPathToClose))
  }

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
                {t.isDynamic && value === index && (
                  <span className="ml-1 relative inline-flex items-center justify-center" style={{ width: 16, height: 16 }}>
                    <span
                      className="absolute w-2 h-2 bg-[var(--vscode-text)] rounded-full transition-opacity duration-150 group-hover:opacity-0"
                      aria-hidden
                    />
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); closeTab(t.path) }}
                      className="absolute inline-flex items-center justify-center rounded hover:bg-[var(--vscode-border,#333)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      title="Close"
                      aria-label={`Close ${t.label}`}
                      style={{ width: 16, height: 16 }}
                    >
                      <CloseIcon className="w-3 h-3 opacity-80" />
                    </button>
                  </span>
                )}
                {t.isDynamic && value !== index && (
                  <span className="ml-1 inline-flex items-center justify-center" style={{ width: 16, height: 16 }}>
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); closeTab(t.path) }}
                      className="inline-flex items-center justify-center rounded hover:bg-[var(--vscode-border,#333)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      title="Close"
                      aria-label={`Close ${t.label}`}
                      style={{ width: 16, height: 16 }}
                    >
                      <CloseIcon className="w-3 h-3 opacity-80" />
                    </button>
                  </span>
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
