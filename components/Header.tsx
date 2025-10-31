"use client"

import React, { useMemo } from "react"
import { FileCode, Github, FileText, Settings } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"

interface TabDef {
  id: "mina" | "signin" | "admin" | "github"
  label: string
  icon: React.ReactNode
  path: string
}

const getTabs = (isAuthenticated: boolean): TabDef[] => [
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
  const tabs = useMemo(() => getTabs(isAuthenticated), [isAuthenticated])

  const value = useMemo(() => {
    const idx = tabs.findIndex(t => normalizePath(t.path) === pathname)
    return idx === -1 ? 0 : idx
  }, [tabs, pathname])

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
          
          "& .MuiTabs-flexContainer": {
            alignItems: "center",
          },
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
          "& .MuiTab-iconWrapper": {
            fontSize: 0,
            marginRight: 6,
          },
          "& .MuiTabs-scrollButtons": {
            color: "var(--vscode-text)",
          },
        }}
      >
        {tabs.map((t) => (
          <Tab
            key={t.id}
            disableRipple
            icon={t.icon as any}
            iconPosition="start"
            label={
              <span className="whitespace-nowrap text-sm sm:text-base truncate max-w-[38vw] sm:max-w-none">{t.label}</span>
            }
          />
        ))}
      </Tabs>
    </div>
  )
}

export default React.memo(Header)
