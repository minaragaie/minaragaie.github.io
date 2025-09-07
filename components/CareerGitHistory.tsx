"use client"

import { useState } from "react"
import { GitBranch, GitCommitIcon, GitMerge, Plus, ChevronRight, ChevronDown } from "lucide-react"
import { staticResumeData } from "@/lib/resume-data"

interface CareerCommit {
  hash: string
  message: string
  author: string
  date: string
  type: "feat" | "refactor" | "merge" | "docs"
  changes: {
    additions: string[]
    removals: string[]
  }
  branch: string
}

interface CareerGitHistoryProps {
  onNavigate: (sectionId: string) => void
}

export default function CareerGitHistory({ onNavigate }: CareerGitHistoryProps) {
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null)

  const generateCareerCommits = (): CareerCommit[] => {
    const commits: CareerCommit[] = []

    const parseResumeDate = (dateStr: string): string => {
      if (!dateStr) return "2020-01-01"
      const monthYearMatch = dateStr.match(/(\w+)\s+(\d{4})/)
      if (monthYearMatch) {
        const [, month, year] = monthYearMatch
        const monthMap: { [key: string]: string } = {
          January: "01", Jan: "01", February: "02", Feb: "02", March: "03", Mar: "03", April: "04", Apr: "04", May: "05", June: "06", Jun: "06", July: "07", Jul: "07", August: "08", Aug: "08", September: "09", Sep: "09", October: "10", Oct: "10", November: "11", Nov: "11", December: "12", Dec: "12",
        }
        const monthNum = monthMap[month] || "01"
        return `${year}-${monthNum}-01`
      }
      return "2020-01-01"
    }

    // Initial commit
    commits.push({
      hash: "a1b2c3d",
      message: "Initial commit: Started career journey",
      author: "Mina Youaness",
      date: "2016-04-01",
      type: "feat",
      changes: {
        additions: ["Computer Science Foundation", "Problem Solving Skills"],
        removals: [],
      },
      branch: "main",
    })

    // Experience commits
    staticResumeData.experience.forEach((exp, index) => {
      const startDate = parseResumeDate(exp.startDate)
      commits.push({
        hash: `${Math.random().toString(36).substr(2, 7)}`,
        message: `feat: joined ${exp.company} as ${exp.title}`,
        author: "Mina Youaness",
        date: startDate,
        type: "feat",
        changes: {
          additions: exp.technologies || [],
          removals: index > 0 ? ["Previous Role Responsibilities"] : [],
        },
        branch: "career",
      })
      if (exp.endDate && exp.endDate !== "April 2025") {
        const endDate = parseResumeDate(exp.endDate)
        commits.push({
          hash: `${Math.random().toString(36).substr(2, 7)}`,
          message: `refactor: completed tenure at ${exp.company}`,
          author: "Mina Youaness",
          date: endDate,
          type: "refactor",
          changes: {
            additions: ["Enhanced Experience", "New Achievements"],
            removals: [],
          },
          branch: "career",
        })
      }
    })

    // Skill merges
    const skillMergeDates = {
      languages: "2017-06-15",
      frameworks: "2018-08-20",
      databases: "2019-03-10",
      versionControl: "2017-01-15",
      technologies: "2020-09-05",
      methodologies: "2018-11-12",
      standards: "2021-07-18",
    }
    Object.entries(staticResumeData.skills).forEach(([category, skills]) => {
      commits.push({
        hash: `${Math.random().toString(36).substr(2, 7)}`,
        message: `merge: integrated ${category} expertise into main skillset`,
        author: "Mina Youaness",
        date: skillMergeDates[category as keyof typeof skillMergeDates] || "2020-06-15",
        type: "merge",
        changes: {
          additions: Array.isArray(skills) ? skills : [],
          removals: [],
        },
        branch: `feature/${category}`,
      })
    })

    // Certification commits
    const certificationDates = [
      "2018-03-15", "2019-08-22", "2020-11-10", "2021-05-18", "2022-09-25", "2023-12-08", "2024-06-15", "2020-01-20",
    ]
    staticResumeData.certifications.forEach((cert, index) => {
      commits.push({
        hash: `${Math.random().toString(36).substr(2, 7)}`,
        message: `docs: earned ${cert.name} certification`,
        author: "Mina Youaness",
        date: certificationDates[index] || "2022-01-01",
        type: "docs",
        changes: {
          additions: [cert.name, `Issued by ${cert.issuer}`],
          removals: [],
        },
        branch: "certifications",
      })
    })

    return commits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const commits = generateCareerCommits()

  const getCommitIcon = (type: string) => {
    switch (type) {
      case "feat":
        return <GitCommitIcon size={14} className="text-[var(--vscode-green)]" />
      case "merge":
        return <GitMerge size={14} className="text-[var(--vscode-purple)]" />
      case "refactor":
        return <GitBranch size={14} className="text-[var(--vscode-blue)]" />
      case "docs":
        return <GitCommitIcon size={14} className="text-[var(--vscode-yellow)]" />
      default:
        return <GitCommitIcon size={14} className="text-[var(--vscode-text-muted)]" />
    }
  }

  const getBranchColor = (branch: string) => {
    switch (branch) {
      case "main":
        return "text-[var(--vscode-green)]"
      case "career":
        return "text-[var(--vscode-blue)]"
      case "certifications":
        return "text-[var(--vscode-yellow)]"
      default:
        return "text-[var(--vscode-purple)]"
    }
  }

  const getBranchBadgeStyle = (branch: string) => {
    switch (branch) {
      case "main":
        return "bg-[var(--vscode-green)]/20 text-[var(--vscode-green)] border border-[var(--vscode-green)]/30"
      case "career":
        return "bg-[var(--vscode-blue)]/20 text-[var(--vscode-blue)] border border-[var(--vscode-blue)]/30"
      case "certifications":
        return "bg-[var(--vscode-yellow)]/20 text-[var(--vscode-yellow)] border border-[var(--vscode-yellow)]/30"
      default:
        return "bg-[var(--vscode-purple)]/20 text-[var(--vscode-purple)] border border-[var(--vscode-purple)]/30"
    }
  }

  const handleCommitNavigation = (commit: CareerCommit) => {
    if (commit.message.includes("joined") || commit.message.includes("completed tenure")) {
      onNavigate("experience")
    } else if (commit.message.includes("certification") || commit.message.includes("earned")) {
      onNavigate("certifications")
    } else if (commit.message.includes("skillset") || commit.message.includes("expertise")) {
      onNavigate("skills")
    } else if (commit.message.includes("education") || commit.message.includes("degree")) {
      onNavigate("education")
    } else if (commit.message.includes("Initial commit") || commit.message.includes("career journey")) {
      onNavigate("hero")
    } else {
      onNavigate("experience")
    }
  }

  return (
    <div className="flex flex-col bg-[var(--vscode-bg)] h-full text-xs">
      <div className="h-8 bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-blue-light)] flex items-center px-2 text-white border-b border-[var(--vscode-blue)]/30">
        <GitBranch size={12} className="text-white mr-2" />
        <div className="text-xs font-semibold">SOURCE CONTROL</div>
      </div>

      <div className="p-2 border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar)]">
        <div className="grid grid-cols-3 gap-1 text-xs">
          <div className="bg-[var(--vscode-tab)] rounded p-2 border border-[var(--vscode-border)] text-center">
            <div className="text-[var(--vscode-green)] font-mono text-xs">{commits.length}</div>
            <div className="text-[var(--vscode-text-muted)] text-xs">commits</div>
          </div>
          <div className="bg-[var(--vscode-tab)] rounded p-2 border border-[var(--vscode-border)] text-center">
            <div className="text-[var(--vscode-blue)] font-mono text-xs">main</div>
            <div className="text-[var(--vscode-text-muted)] text-xs">branch</div>
          </div>
          <div className="bg-[var(--vscode-tab)] rounded p-2 border border-[var(--vscode-border)] text-center">
            <div className="text-[var(--vscode-purple)] font-mono text-xs">live</div>
            <div className="text-[var(--vscode-text-muted)] text-xs">status</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {commits.slice(0, 8).map((commit, index) => (
            <div key={commit.hash} className="group">
              <div
                className={`flex items-center gap-2 p-2 rounded hover:bg-[var(--vscode-sidebar)] cursor-pointer transition-all ${
                  selectedCommit === commit.hash ? "bg-[var(--vscode-blue)]/30 border border-[var(--vscode-blue)]/50" : ""
                }`}
                onClick={() => {
                  setSelectedCommit(commit.hash)
                  setExpandedCommit(expandedCommit === commit.hash ? null : commit.hash)
                  handleCommitNavigation(commit)
                }}
              >
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-[var(--vscode-tab)] border border-current flex items-center justify-center">
                    {getCommitIcon(commit.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--vscode-text)] truncate mb-1 group-hover:text-[var(--vscode-blue)]">{commit.message}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-[var(--vscode-blue)] text-xs">{commit.hash}</span>
                    <span className="text-[var(--vscode-text-muted)]">•</span>
                    <span className="text-[var(--vscode-text-muted)] text-xs">
                      {new Date(commit.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <div className={`px-1 py-0.5 rounded text-xs ${getBranchBadgeStyle(commit.branch)}`}>
                      {commit.branch}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {expandedCommit === commit.hash ? (
                    <ChevronDown size={12} className="text-[var(--vscode-blue)]" />
                  ) : (
                    <ChevronRight size={12} className="text-[var(--vscode-text-muted)]" />
                  )}
                </div>
              </div>

              {expandedCommit === commit.hash && (
                <div className="ml-6 mt-1 mb-2 p-2 bg-[var(--vscode-tab)] rounded border border-[var(--vscode-blue)]/30">
                  {commit.changes.additions.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs text-[var(--vscode-green)] mb-1 flex items-center gap-1">
                        <Plus size={10} />+{commit.changes.additions.length}
                      </div>
                      {commit.changes.additions.slice(0, 3).map((addition, index) => (
                        <div key={index} className="text-xs text-[var(--vscode-green)]/70 ml-3 truncate">
                          {addition}
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCommitNavigation(commit)
                    }}
                    className="text-xs px-2 py-1 bg-[var(--vscode-blue)] text-white rounded hover:bg-[var(--vscode-blue-light)] transition-colors"
                  >
                    View →
                  </button>
                </div>
              )}

              {index < commits.slice(0, 8).length - 1 && <div className="ml-4 w-px h-2 bg-[var(--vscode-border)]"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-[var(--vscode-border)] bg-[var(--vscode-sidebar)]">
        <div className="flex items-center justify-between text-xs text-[var(--vscode-text-muted)]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[var(--vscode-green)] rounded-full"></div>
            <span>Live</span>
          </div>
          <div className="text-[var(--vscode-blue)] font-mono">HEAD → main</div>
        </div>
      </div>
    </div>
  )
}
