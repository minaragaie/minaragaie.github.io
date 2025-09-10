import React from "react"
import { FileCode, X, Github, FileText } from "lucide-react"

interface HeaderProps {
  activeTab: "mina" | "signin" | "github"
  onTabChange: (tab: "mina" | "signin" | "github") => void
  onTabClose?: (tab: "mina" | "signin" | "github") => void
}

interface Tab {
  id: "mina" | "signin" | "github"
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    id: "mina",
    label: "mina-youaness-resume.tsx",
    icon: <FileCode className="w-4 h-4" aria-hidden="true" />
  },
  {
    id: "signin",
    label: "signin.md",
    icon: <FileText className="w-4 h-4" aria-hidden="true" />
  },
  {
    id: "github",
    label: "GitHub Activity",
    icon: <Github className="w-4 h-4" aria-hidden="true" />
  },
]

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onTabClose }) => {
  return (
    <div className="fixed w-full bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-border)] flex items-center gap-2 flex-shrink-0 transition-colors duration-300 z-[9999] overflow-x-auto scrollbar-hide">
      <div className="flex items-center flex-nowrap min-w-max">
        {tabs.map(({ id, label, icon }) => {
          const isActive = activeTab === id
          return (
            <div
              key={id}
              className={`flex items-center gap-2 px-2 sm:px-3 py-1 h-8 cursor-pointer relative ${
                id !== "github" ? "border-r border-[var(--vscode-border,#333)]" : ""
              } ${
                isActive
                  ? "bg-[var(--sidebar-bg-hover)] text-[var(--vscode-text)]"
                  : "bg-[var(--bg-secondary)] text-[var(--vscode-tab-inactiveForeground,#888)] hover:text-[var(--vscode-text)]"
              }`}
              onClick={() => onTabChange(id)}
            >
              {icon}
              <span className="whitespace-nowrap text-sm sm:text-base">{label}</span>

              {/* Right-side: Bubble if active, X if inactive */}
              {isActive ? (
                <div
                  className="ml-2 w-2 h-2 bg-[var(--vscode-text)] rounded-full"
                  role="status"
                  aria-label="File synced"
                />
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onTabClose?.(id)
                  }}
                  className="ml-2 text-xs opacity-50 hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Header
