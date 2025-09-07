"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Settings,
  Palette,
  Zap,
  User,
  Code,
  Briefcase,
  Award,
  Mail,
  ChevronDown,
  ChevronRight,
  Rocket,
  Target,
  Clock,
} from "lucide-react"

type FontSize = "small" | "medium" | "large"

interface RecruiterDashboardProps {
  onNavigate: (sectionId: string) => void
}

/* ----------------------------- Config Arrays ----------------------------- */
const SETTINGS_SECTIONS = [
  { id: "theme", label: "Theme", icon: Palette },
  { id: "quickActions", label: "Quick Actions", icon: Zap },
]

const QUICK_ACTIONS = [
  { id: "hero", label: "Profile Overview", icon: User, description: "Personal info & summary" },
  { id: "skills", label: "Technical Skills", icon: Code, description: "Programming languages & frameworks" },
  { id: "experience", label: "Work Experience", icon: Briefcase, description: "Career journey & achievements" },
  { id: "certifications", label: "Certifications", icon: Award, description: "Professional certifications" },
  { id: "contact", label: "Contact Info", icon: Mail, description: "Get in touch" },
]

const POPULAR_SEARCHES = [
  { label: "React Experience", target: "skills", icon: Target },
  { label: "Recent Projects", target: "experience", icon: Clock },
  { label: "Leadership Skills", target: "experience", icon: Rocket },
]

const KEYBOARD_SHORTCUTS = [
  { combo: "⌘/Ctrl + Shift + P", desc: "Command Palette" },
  { combo: "⌘/Ctrl + K", desc: "Quick Navigation" },
]

/* ----------------------------- Subcomponents ----------------------------- */

function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [isChanging, setIsChanging] = useState(false)

  const handleThemeChange = (newTheme: string) => {
    if (isChanging || theme === newTheme) return

    console.log("[v0] Theme changing from", theme, "to", newTheme)
    setIsChanging(true)

    try {
      const validThemes = ["dark", "light", "high-contrast", "monokai"]
      requestAnimationFrame(() => {
        document.documentElement.className = document.documentElement.className
          .split(" ")
          .filter((cls) => !validThemes.includes(cls))
          .concat(newTheme)
          .join(" ")
      })

      setTheme(newTheme)
      localStorage.setItem("theme", newTheme)

      setTimeout(() => {
        console.log("[v0] Theme change completed, resetting isChanging")
        setIsChanging(false)
      }, 50)
    } catch (error) {
      console.error("[v0] Theme change error:", error)
      setIsChanging(false)
    }
  }

  const themeOptions = [
    { value: "dark", label: "Dark (Default)", desc: "VS Code dark theme" },
    { value: "light", label: "Light", desc: "Clean light theme" },
    { value: "high-contrast", label: "High Contrast", desc: "Enhanced accessibility" },
    { value: "monokai", label: "Monokai", desc: "Popular developer theme" },
  ]

  return (
    <div>
      <h4 className="text-xs font-medium text-[var(--sidebar-text)] mb-2 flex items-center gap-1">
        <Palette size={10} /> Color Theme
      </h4>
      <div className="space-y-2">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
            disabled={isChanging}
            className={`w-full text-left p-2 rounded border transition-colors ${
              theme === option.value
                ? "bg-[var(--sidebar-bg-active)] border-[var(--sidebar-border-active)] text-[var(--sidebar-text-active)]"
                : "bg-[var(--sidebar-bg-hover)] border-[var(--sidebar-border)] text-[var(--sidebar-text)] hover:bg-[var(--sidebar-bg)]"
            } ${isChanging ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="text-xs font-medium">{option.label}</div>
            <div className="text-xs opacity-70">{option.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function FontSizeSettings({ fontSize, onChange }: { fontSize: FontSize; onChange: (s: FontSize) => void }) {
  const sizes: FontSize[] = ["small", "medium", "large"]

  return (
    <div>
      <h4 className="text-xs font-medium text-[var(--vscode-text)] mb-2">Font Size</h4>
      <div className="flex gap-1">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`flex-1 p-1.5 text-xs rounded transition-colors capitalize ${
              fontSize === size
                ? "bg-[var(--vscode-blue)] text-white"
                : "bg-[var(--vscode-tab)] hover:bg-[var(--vscode-blue)] rounded transition-colors text-left group"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}

function QuickActionsSettings({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div>
      <h4 className="text-xs font-medium text-[var(--vscode-text)] mb-2 flex items-center gap-1">
        <Zap size={10} /> Navigate to Section
      </h4>
      <div className="space-y-1">
        {QUICK_ACTIONS.map((action) => {
          const ActionIcon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className="w-full flex items-center gap-2 p-2 bg-[var(--vscode-tab)] hover:bg-[var(--vscode-blue)] rounded transition-colors text-left group"
            >
              <ActionIcon size={12} className="text-[var(--vscode-text-muted)] group-hover:text-white" />
              <div className="flex-1">
                <div className="text-xs font-medium text-[var(--vscode-text)] group-hover:text-white">
                  {action.label}
                </div>
                <div className="text-xs text-[var(--vscode-text-muted)] group-hover:text-blue-100">
                  {action.description}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PopularSearches({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div>
      <h4 className="text-xs font-medium text-[var(--vscode-text)] mb-2 flex items-center gap-1">
        <Target size={10} /> Popular Searches
      </h4>
      <div className="space-y-1">
        {POPULAR_SEARCHES.map((search, idx) => {
          const SearchIcon = search.icon
          return (
            <button
              key={idx}
              onClick={() => onNavigate(search.target)}
              className="w-full flex items-center gap-2 p-1.5 text-xs text-[var(--vscode-text)] hover:text-[var(--vscode-blue)] hover:bg-[var(--vscode-tab)] rounded transition-colors"
            >
              <SearchIcon size={10} />
              <span>{search.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function KeyboardShortcuts() {
  return (
    <div className="mt-4 p-2 bg-[var(--vscode-bg)] rounded border border-[var(--vscode-border)]">
      <h4 className="text-xs font-medium text-[var(--vscode-text)] mb-1">Keyboard Shortcuts</h4>
      <div className="space-y-1 text-xs text-[var(--vscode-text-muted)]">
        {KEYBOARD_SHORTCUTS.map((s, i) => (
          <div key={i}>
            {s.combo} - {s.desc}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ----------------------------- Main Component ----------------------------- */

export default function RecruiterDashboard({ onNavigate }: RecruiterDashboardProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["theme"])
  const [fontSize, setFontSize] = useState<FontSize>("medium")

  useEffect(() => {
    const savedFont = (localStorage.getItem("fontSize") as FontSize) || fontSize
    const sizeMap: Record<FontSize, string> = { small: "14px", medium: "16px", large: "18px" }
    document.documentElement.style.setProperty("--base-font-size", sizeMap[savedFont])
    setFontSize(savedFont)
  }, [])

  const toggleAccordion = (id: string) =>
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size)
    const sizeMap: Record<FontSize, string> = { small: "14px", medium: "16px", large: "18px" }
    document.documentElement.style.setProperty("--base-font-size", sizeMap[size])
    localStorage.setItem("fontSize", size)
  }

  return (
    <div className="flex flex-col bg-[var(--vscode-sidebar)] min-h-0 flex-1">
      {/* Header */}
      <div className="flex-shrink-0 h-9 bg-[var(--vscode-sidebar)] flex items-center px-3 text-xs text-[var(--vscode-text)] font-medium border-b border-[var(--vscode-border)] uppercase tracking-wide">
        <Settings size={12} className="mr-2" /> Settings
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon
          const isExpanded = expandedSections.includes(section.id)
          return (
            <div key={section.id} className="border-b border-[var(--vscode-border)]">
              <button
                onClick={() => toggleAccordion(section.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-[var(--vscode-text)] hover:bg-[var(--vscode-tab)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon size={12} />
                  <span>{section.label}</span>
                </div>
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-3">
                  {section.id === "theme" && (
                    <>
                      <ThemeSettings />
                      <FontSizeSettings fontSize={fontSize} onChange={handleFontSizeChange} />
                    </>
                  )}
                  {section.id === "quickActions" && (
                    <>
                      <QuickActionsSettings onNavigate={onNavigate} />
                      <PopularSearches onNavigate={onNavigate} />
                      <KeyboardShortcuts />
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
