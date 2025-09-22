"use client"

import { useState } from "react"
import { Star, Download, Search, CheckCircle } from "lucide-react"
import { staticResumeData } from "@/lib/resume-data"

interface SkillsMarketplaceProps {
  onNavigate: (sectionId: string) => void
}

interface SkillExtension {
  id: string
  name: string
  category: string
  description: string
  rating: number
  downloads: string
  version: string
  publisher: string
  verified: boolean
  tags: string[]
  icon: string
}

export default function SkillsMarketplace({ onNavigate }: SkillsMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedExtension, setSelectedExtension] = useState<string | null>(null)

  const generateSkillExtensions = (): SkillExtension[] => {
    const extensions: SkillExtension[] = []

    // Generate extensions from skills data
    Object.entries(staticResumeData.skills).forEach(([category, skills]) => {
      skills.forEach((skill) => {
        const experienceYears = Math.floor(Math.random() * 8) + 2 // 2-10 years
        const projectCount = Math.floor(Math.random() * 15) + 5 // 5-20 projects

        extensions.push({
          id: `${category}-${skill.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          name: skill,
          category: category.charAt(0).toUpperCase() + category.slice(1),
          description: getSkillDescription(skill, category),
          rating: Math.random() > 0.3 ? 5 : Math.random() > 0.5 ? 4 : 3,
          downloads: `${projectCount} projects`,
          version: `v${experienceYears}.${Math.floor(Math.random() * 10)}.0`,
          publisher: getSkillPublisher(skill),
          verified: Math.random() > 0.4,
          tags: getSkillTags(skill, category),
          icon: getSkillIcon(skill),
        })
      })
    })

    return extensions.sort((a, b) => b.rating - a.rating)
  }

  const getSkillDescription = (skill: string, category: string): string => {
    const descriptions: Record<string, string> = {
      JavaScript: "Essential scripting language for modern web development with dynamic typing",
      React: "Component-based library for building interactive user interfaces",
      "Node.js": "Server-side JavaScript runtime for scalable network applications",
      TypeScript: "Strongly typed superset of JavaScript for large-scale applications",
      Angular: "Full-featured framework for building dynamic single-page applications",
      PostgreSQL: "Advanced open-source relational database with powerful features",
      Git: "Distributed version control system for tracking code changes",
      Docker: "Containerization platform for consistent deployment environments",
    }

    return descriptions[skill] || `Professional ${category} tool for modern development workflows`
  }

  const getSkillPublisher = (skill: string): string => {
    const publishers: Record<string, string> = {
      JavaScript: "Mozilla Foundation",
      React: "Meta",
      "Node.js": "Node.js Foundation",
      TypeScript: "Microsoft",
      Angular: "Google",
      PostgreSQL: "PostgreSQL Global Development Group",
      Git: "Linus Torvalds",
      Docker: "Docker Inc.",
    }

    return publishers[skill] || "Open Source Community"
  }

  const getSkillTags = (skill: string, category: string): string[] => {
    const baseTags = [category.toLowerCase()]

    if (["JavaScript", "TypeScript", "React", "Angular", "Node.js"].includes(skill)) {
      baseTags.push("web-development", "popular")
    }
    if (["PostgreSQL", "MySQL"].includes(skill)) {
      baseTags.push("database", "backend")
    }
    if (["Git", "Docker"].includes(skill)) {
      baseTags.push("devops", "essential")
    }

    return baseTags
  }

  const getSkillIcon = (skill: string): string => {
    const icons: Record<string, string> = {
      JavaScript: "🟨",
      TypeScript: "🔷",
      React: "⚛️",
      Angular: "🅰️",
      "Node.js": "🟢",
      PostgreSQL: "🐘",
      Git: "📝",
      Docker: "🐳",
    }

    return icons[skill] || "⚡"
  }

  const skillExtensions = generateSkillExtensions()

  const filteredExtensions = skillExtensions.filter((ext) => {
    const matchesSearch =
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || ext.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(skillExtensions.map((ext) => ext.category.toLowerCase())))]

  const handleExtensionClick = (extension: SkillExtension) => {
    setSelectedExtension(extension.id)
    // Navigate to skills section
    onNavigate("skills")
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="h-9 bg-[var(--sidebar-bg)] flex items-center px-3 text-xs text-[var(--sidebar-text)] font-medium border-b border-[var(--sidebar-border)] uppercase tracking-wide">
        Extensions
      </div>

      {/* Search and Filter */}
      <div className="p-3 border-b border-[var(--sidebar-border)] space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2 text-[var(--vscode-sidebar-info)]" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[var(--sidebar-hover)] text-xs text-[var(--sidebar-text)] rounded border-none outline-none focus:bg-[var(--sidebar-hover-active)]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-2 py-1.5 bg-[var(--sidebar-hover)] text-xs text-[var(--sidebar-text)] rounded border-none outline-none focus:bg-[var(--sidebar-hover-active)]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Extensions List */}
      <div className="max-h-80 overflow-y-auto p-2 space-y-2 scrollbar-thin">
        {filteredExtensions.map((extension) => (
          <div
            key={extension.id}
            onClick={() => handleExtensionClick(extension)}
            className="p-3 bg-[var(--sidebar-bg)] hover:bg-[var(--sidebar-hover)] rounded cursor-pointer transition-colors border border-transparent hover:border-[var(--vscode-blue)]/30"
          >
            <div className="flex items-start gap-3">
              <div className="text-lg">{extension.icon}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-[var(--sidebar-text)] truncate">{extension.name}</h3>
                  {extension.verified && <CheckCircle size={12} className="text-[var(--vscode-blue)] flex-shrink-0" />}
                </div>

                <p className="text-xs text-[var(--vscode-sidebar-info)] mb-2 line-clamp-2">{extension.description}</p>

                <div className="flex items-center gap-4 text-xs text-[var(--vscode-sidebar-info)]">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={i < extension.rating ? "text-[var(--vscode-yellow)] fill-current" : "text-[var(--sidebar-hover)]"}
                      />
                    ))}
                    <span className="ml-1">{extension.rating}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Download size={10} />
                    <span>{extension.downloads}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[var(--vscode-sidebar-info)]">{extension.publisher}</span>
                  <span className="text-xs text-[var(--vscode-blue)]">{extension.version}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
        <div className="text-xs text-[var(--vscode-sidebar-info)] space-y-1">
          <div className="flex items-center justify-between">
            <span>{filteredExtensions.length} skills available</span>
            <span className="text-[var(--vscode-blue)]">All installed ✓</span>
          </div>
          <div className="text-[var(--sidebar-text-muted)]">Marketplace updated: Recently</div>
        </div>
      </div>
    </div>
  )
}
