"use client"

import { useState, useMemo } from "react"
import { GitBranch, GitCommitIcon, GitMerge, Plus, ChevronRight, ChevronDown, TrendingUp, Award, Code, Clock, Users, Zap } from "lucide-react"
import { staticResumeData } from "@/lib/resume-data"
import { useResumeData } from "@/hooks/useResumeData"

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

interface SkillTimelineEntry {
  year: string
  skills: {
    skill: string
    category: string
    source: 'job' | 'project' | 'certification' | 'skill-merge'
    firstUsed: string
    context?: string
  }[]
  categoriesBreakdown: { [key: string]: number }
  totalSkills: number
}

export default function CareerGitHistory({ onNavigate }: CareerGitHistoryProps) {
  const { resumeData: apiResumeData } = useResumeData()
  const data: any = apiResumeData || staticResumeData
  
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null)
  const [expandedTimeline, setExpandedTimeline] = useState<{
    isExpanded: boolean
    selectedYear: string | null
  }>({
    isExpanded: false,
    selectedYear: null
  })

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
    if (data?.experience) {
      data.experience.forEach((exp: any, index: number) => {
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
    }

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
    if (data?.skills) {
      Object.entries(data.skills).forEach(([category, skills]) => {
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
    }

    // Certification commits
    const certificationDates = [
      "2018-03-15", "2019-08-22", "2020-11-10", "2021-05-18", "2022-09-25", "2023-12-08", "2024-06-15", "2020-01-20",
    ]
    if (data?.certifications) {
      data.certifications.forEach((cert: any, index: number) => {
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
    }

    return commits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const commits = generateCareerCommits()

  // Calculate recruiter-focused metrics
  const metrics = useMemo(() => {
    const experienceCount = data?.experience?.length || 0
    const projectsCount = data?.projects?.length || 0
    const certificationsCount = data?.certifications?.length || 0
    
    // Calculate total skills
    const totalSkills = data?.skills ? Object.values(data.skills).flat().length : 0
    
    // Calculate years of experience
    const firstJob = data?.experience?.[data.experience.length - 1]
    let startYear = new Date().getFullYear()
    if (firstJob?.startDate) {
      const yearMatch = firstJob.startDate.match(/\d{4}/)
      if (yearMatch) {
        startYear = parseInt(yearMatch[0])
      }
    }
    const yearsOfExperience = Math.max(0, new Date().getFullYear() - startYear)
    
    // Calculate unique technologies
    const allTechs = new Set<string>()
    data?.experience?.forEach((exp: any) => exp.technologies?.forEach((tech: string) => allTechs.add(tech)))
    data?.projects?.forEach((proj: any) => proj.technologies?.forEach((tech: string) => allTechs.add(tech)))
    const uniqueTechs = allTechs.size
    
    return {
      yearsOfExperience,
      projectsCount,
      certificationsCount,
      totalSkills,
      uniqueTechs,
      experienceCount,
    }
  }, [data])

  // Calculate detailed skills evolution timeline
  const skillsTimeline = useMemo(() => {
    const timeline: { [year: string]: SkillTimelineEntry['skills'] } = {}
    
    // Helper to categorize a skill
    const categorizeSkill = (skill: string): string => {
      const skillsObj = data?.skills || {}
      for (const [category, skills] of Object.entries(skillsObj)) {
        if (Array.isArray(skills) && skills.includes(skill)) {
          return category
        }
      }
      // Default categorization based on keywords
      const lowerSkill = skill.toLowerCase()
      if (lowerSkill.includes('react') || lowerSkill.includes('angular') || lowerSkill.includes('vue') || lowerSkill.includes('next')) return 'frameworks'
      if (lowerSkill.includes('mysql') || lowerSkill.includes('postgres') || lowerSkill.includes('mongo') || lowerSkill.includes('redis')) return 'databases'
      if (lowerSkill.includes('git') || lowerSkill.includes('svn')) return 'versionControl'
      if (lowerSkill.includes('agile') || lowerSkill.includes('scrum') || lowerSkill.includes('kanban')) return 'methodologies'
      if (lowerSkill.includes('rest') || lowerSkill.includes('graphql') || lowerSkill.includes('http') || lowerSkill.includes('api')) return 'standards'
      if (lowerSkill.includes('javascript') || lowerSkill.includes('typescript') || lowerSkill.includes('python') || lowerSkill.includes('java') || lowerSkill.includes('c++') || lowerSkill.includes('php')) return 'languages'
      return 'technologies'
    }
    
    // From Experience
    data?.experience?.forEach((exp: any) => {
      const yearMatch = exp.startDate?.match(/\d{4}/)
      const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString()
      exp.technologies?.forEach((tech: string) => {
        if (!timeline[year]) timeline[year] = []
        if (!timeline[year].some(s => s.skill === tech)) {
          timeline[year].push({
            skill: tech,
            category: categorizeSkill(tech),
            source: 'job',
            firstUsed: exp.startDate,
            context: `${exp.title} at ${exp.company}`
          })
        }
      })
    })
    
    // From Projects
    data?.projects?.forEach((proj: any) => {
      const year = proj.year || "2020"
      proj.technologies?.forEach((tech: string) => {
        if (!timeline[year]) timeline[year] = []
        if (!timeline[year].some(s => s.skill === tech)) {
          timeline[year].push({
            skill: tech,
            category: categorizeSkill(tech),
            source: 'project',
            firstUsed: year,
            context: proj.name
          })
        }
      })
    })
    
    // From Certifications
    data?.certifications?.forEach((cert: any) => {
      const yearMatch = cert.date?.match(/\d{4}/) || cert.name?.match(/\d{4}/)
      const year = yearMatch ? yearMatch[0] : "2020"
      // Add skills from certification if available
      if (cert.skills && Array.isArray(cert.skills)) {
        cert.skills.forEach((skill: string) => {
          if (!timeline[year]) timeline[year] = []
          if (!timeline[year].some(s => s.skill === skill)) {
            timeline[year].push({
              skill,
              category: categorizeSkill(skill),
              source: 'certification',
              firstUsed: year,
              context: cert.name
            })
          }
        })
      }
    })
    
    // Process into final structure with categories breakdown
    return Object.entries(timeline)
      .map(([year, skills]) => {
        const categoriesBreakdown: { [key: string]: number } = {}
        skills.forEach(s => {
          categoriesBreakdown[s.category] = (categoriesBreakdown[s.category] || 0) + 1
        })
        return {
          year,
          skills,
          categoriesBreakdown,
          totalSkills: skills.length
        }
      })
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
  }, [data])

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
      <div className="h-7 sm:h-8 bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-blue-light)] flex items-center px-1.5 sm:px-2 text-white border-b border-[var(--vscode-blue)]/30">
        <GitBranch size={10} className="sm:w-3 sm:h-3 text-white mr-1.5 sm:mr-2 flex-shrink-0" />
        <div className="text-[10px] sm:text-xs font-semibold truncate">SOURCE CONTROL</div>
      </div>

      <div className="p-1.5 sm:p-2 border-b border-[var(--vscode-border)] bg-[var(--vscode-sidebar)]">
        {/* Impact Metrics Dashboard */}
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5 text-xs mb-1.5 sm:mb-2">
          <div className="bg-[var(--vscode-tab)] rounded p-1.5 sm:p-2 border border-[var(--vscode-border)] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-[var(--vscode-green)]/10 rounded-bl-full"></div>
            <Clock size={10} className="sm:w-3 sm:h-3 mx-auto mb-0.5 sm:mb-1 text-[var(--vscode-green)]" />
            <div className="text-[var(--vscode-green)] font-mono text-[10px] sm:text-xs font-bold">{metrics.yearsOfExperience}+</div>
            <div className="text-[var(--vscode-text-muted)] text-[9px] sm:text-xs">years exp</div>
          </div>
          <div className="bg-[var(--vscode-tab)] rounded p-1.5 sm:p-2 border border-[var(--vscode-border)] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-[var(--vscode-blue)]/10 rounded-bl-full"></div>
            <Code size={10} className="sm:w-3 sm:h-3 mx-auto mb-0.5 sm:mb-1 text-[var(--vscode-blue)]" />
            <div className="text-[var(--vscode-blue)] font-mono text-[10px] sm:text-xs font-bold">{metrics.projectsCount}</div>
            <div className="text-[var(--vscode-text-muted)] text-[9px] sm:text-xs">projects</div>
          </div>
          <div className="bg-[var(--vscode-tab)] rounded p-1.5 sm:p-2 border border-[var(--vscode-border)] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-[var(--vscode-yellow)]/10 rounded-bl-full"></div>
            <Award size={10} className="sm:w-3 sm:h-3 mx-auto mb-0.5 sm:mb-1 text-[var(--vscode-yellow)]" />
            <div className="text-[var(--vscode-yellow)] font-mono text-[10px] sm:text-xs font-bold">{metrics.certificationsCount}</div>
            <div className="text-[var(--vscode-text-muted)] text-[9px] sm:text-xs">certs</div>
          </div>
        </div>
        
        {/* Achievement Badges */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[var(--vscode-green)]/20 border border-[var(--vscode-green)]/30 rounded text-[10px] sm:text-xs">
            <TrendingUp size={9} className="sm:w-2.5 sm:h-2.5 text-[var(--vscode-green)] flex-shrink-0" />
            <span className="text-[var(--vscode-green)] font-medium truncate">{metrics.uniqueTechs} Tech Stack</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[var(--vscode-blue)]/20 border border-[var(--vscode-blue)]/30 rounded text-[10px] sm:text-xs">
            <Zap size={9} className="sm:w-2.5 sm:h-2.5 text-[var(--vscode-blue)] flex-shrink-0" />
            <span className="text-[var(--vscode-blue)] font-medium truncate">{metrics.totalSkills} Skills</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[var(--vscode-purple)]/20 border border-[var(--vscode-purple)]/30 rounded text-[10px] sm:text-xs">
            <Users size={9} className="sm:w-2.5 sm:h-2.5 text-[var(--vscode-purple)] flex-shrink-0" />
            <span className="text-[var(--vscode-purple)] font-medium truncate">{metrics.experienceCount} Roles</span>
          </div>
        </div>

        {/* Skills Evolution Timeline - Expandable */}
        {skillsTimeline.length > 0 && (
          <div className="mt-2 bg-gradient-to-br from-[var(--vscode-tab)] to-[var(--vscode-sidebar)] rounded-lg border border-[var(--vscode-border)] shadow-sm overflow-hidden">
            {/* Header - Clickable to expand */}
            <button
              onClick={() => setExpandedTimeline(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
              className="w-full flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 text-xs bg-[var(--vscode-tab)]/50 hover:bg-[var(--vscode-tab)] transition-all duration-200 group"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                <div className="p-1 sm:p-1.5 rounded-md bg-[var(--vscode-blue)]/20 group-hover:bg-[var(--vscode-blue)]/30 transition-colors flex-shrink-0">
                  <TrendingUp size={11} className="sm:w-3 sm:h-3 text-[var(--vscode-blue)]" />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                  <span className="text-[var(--vscode-text)] font-semibold text-[10px] sm:text-xs truncate">Skills Evolution Timeline</span>
                  <span className="px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] bg-[var(--vscode-blue)]/20 text-[var(--vscode-blue)] font-mono font-medium flex-shrink-0">
                    {skillsTimeline.length} years
                  </span>
                </div>
              </div>
              <ChevronRight 
                size={12}
                className={`sm:w-3.5 sm:h-3.5 text-[var(--vscode-text-muted)] transition-all duration-300 flex-shrink-0 ml-1 ${expandedTimeline.isExpanded ? 'rotate-90 text-[var(--vscode-blue)]' : 'group-hover:text-[var(--vscode-blue)]'}`}
              />
            </button>
            
            {/* Compact view (default) - Enhanced cards */}
            {!expandedTimeline.isExpanded && (
              <div className="p-1.5 sm:p-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {skillsTimeline.slice(0, 3).map((entry, idx) => (
                    <div 
                      key={entry.year} 
                      className="group relative cursor-pointer bg-[var(--vscode-bg)] hover:bg-[var(--vscode-sidebar)] rounded-md p-2 sm:p-2.5 border border-[var(--vscode-border)] hover:border-[var(--vscode-blue)]/50 transition-all duration-200 hover:shadow-md overflow-hidden"
                      onClick={() => setExpandedTimeline({ isExpanded: true, selectedYear: entry.year })}
                      title={`${entry.totalSkills} skills learned in ${entry.year}: ${entry.skills.slice(0, 3).map(s => s.skill).join(', ')}`}
                    >
                      {/* Year badge */}
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2 min-w-0">
                        <span className="text-[var(--vscode-blue)] font-mono text-xs sm:text-sm font-bold flex-shrink-0">{entry.year}</span>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--vscode-blue)]/40 group-hover:bg-[var(--vscode-blue)] transition-colors flex-shrink-0"></div>
                      </div>
                      
                      {/* Skills count */}
                      <div className="flex items-baseline gap-1 mb-1.5 sm:mb-2 min-w-0">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-[var(--vscode-text)] flex-shrink-0">{entry.totalSkills}</span>
                        <span className="text-[9px] sm:text-[10px] text-[var(--vscode-text-muted)] uppercase flex-shrink-0">skills</span>
                      </div>
                      
                      {/* Category indicators - Enhanced */}
                      <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2 min-w-0">
                        {Object.entries(entry.categoriesBreakdown).slice(0, 3).map(([cat, count]) => (
                          <div 
                            key={cat}
                            className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 rounded bg-[var(--vscode-tab)] border border-[var(--vscode-border)]/50 flex-shrink-0"
                            title={`${cat.replace(/([A-Z])/g, ' $1').trim()}: ${count} skills`}
                          >
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[var(--vscode-blue)]/70 flex-shrink-0"></div>
                            <span className="text-[9px] sm:text-[10px] text-[var(--vscode-text-muted)] font-medium">{count}</span>
                          </div>
                        ))}
                        {Object.keys(entry.categoriesBreakdown).length > 3 && (
                          <div className="px-1 sm:px-1.5 py-0.5 rounded bg-[var(--vscode-tab)] border border-[var(--vscode-border)]/50 flex-shrink-0">
                            <span className="text-[9px] sm:text-[10px] text-[var(--vscode-text-muted)]">+{Object.keys(entry.categoriesBreakdown).length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* View all indicator */}
                {skillsTimeline.length > 3 && (
                  <button
                    onClick={() => setExpandedTimeline(prev => ({ ...prev, isExpanded: true }))}
                    className="w-full mt-2 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs text-center text-[var(--vscode-blue)] hover:text-[var(--vscode-blue-light)] hover:bg-[var(--vscode-blue)]/10 rounded-md transition-colors border border-[var(--vscode-border)]/50"
                  >
                    View all {skillsTimeline.length} years →
                  </button>
                )}
              </div>
            )}
            
            {/* Expanded view - Enhanced */}
            {expandedTimeline.isExpanded && (
              <div className="p-1.5 sm:p-2.5 space-y-2 max-h-64 sm:max-h-80 overflow-y-auto scrollbar-thin">
                {skillsTimeline.map((entry, idx) => (
                  <div 
                    key={entry.year}
                    className={`relative rounded-lg border transition-all duration-300 ${
                      expandedTimeline.selectedYear === entry.year
                        ? 'border-[var(--vscode-blue)] bg-gradient-to-r from-[var(--vscode-blue)]/10 to-[var(--vscode-blue)]/5 shadow-lg'
                        : 'border-[var(--vscode-border)] bg-[var(--vscode-bg)] hover:border-[var(--vscode-blue)]/50 hover:shadow-md'
                    }`}
                  >
                    {/* Timeline connector line */}
                    {idx < skillsTimeline.length - 1 && (
                      <div className="absolute left-3 sm:left-5 top-full w-0.5 h-2 bg-[var(--vscode-border)]"></div>
                    )}
                    
                    {/* Year header - Enhanced */}
                    <button
                      onClick={() => setExpandedTimeline(prev => ({ 
                        ...prev, 
                        selectedYear: prev.selectedYear === entry.year ? null : entry.year 
                      }))}
                      className="w-full flex items-center justify-between p-2 sm:p-3 hover:bg-[var(--vscode-tab)]/30 transition-colors rounded-t-lg"
                    >
                      <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap flex-1 min-w-0">
                        {/* Year badge */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--vscode-blue)] border-2 border-[var(--vscode-bg)] shadow-sm"></div>
                          <span className="text-[var(--vscode-blue)] font-mono text-sm sm:text-base font-bold">{entry.year}</span>
                        </div>
                        
                        {/* Skills count badge */}
                        <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-[var(--vscode-tab)] border border-[var(--vscode-border)] flex-shrink-0">
                          <span className="text-[10px] sm:text-xs text-[var(--vscode-text)] font-semibold">
                            {entry.totalSkills} <span className="text-[var(--vscode-text-muted)] font-normal hidden sm:inline">skills</span>
                          </span>
                        </div>
                        
                        {/* Category badges - Enhanced */}
                        <div className="flex gap-1 sm:gap-1.5 flex-wrap flex-1">
                          {Object.entries(entry.categoriesBreakdown).map(([cat, count]) => {
                            const categoryStyles: { [key: string]: { bg: string; text: string; border: string } } = {
                              languages: { bg: 'bg-[#007acc]/20', text: 'text-[#007acc]', border: 'border-[#007acc]/30' },
                              frameworks: { bg: 'bg-[#9cdcfe]/20', text: 'text-[#9cdcfe]', border: 'border-[#9cdcfe]/30' },
                              databases: { bg: 'bg-[#4ec9b0]/20', text: 'text-[#4ec9b0]', border: 'border-[#4ec9b0]/30' },
                              technologies: { bg: 'bg-[#dcdcaa]/20', text: 'text-[#dcdcaa]', border: 'border-[#dcdcaa]/30' },
                              versionControl: { bg: 'bg-[var(--vscode-red)]/20', text: 'text-[var(--vscode-red)]', border: 'border-[var(--vscode-red)]/30' },
                              methodologies: { bg: 'bg-[#4ec9b0]/20', text: 'text-[#4ec9b0]', border: 'border-[#4ec9b0]/30' },
                              standards: { bg: 'bg-[#ce9178]/20', text: 'text-[#ce9178]', border: 'border-[#ce9178]/30' },
                            }
                            const style = categoryStyles[cat.toLowerCase()] || { bg: 'bg-[var(--vscode-tab)]', text: 'text-[var(--vscode-text-muted)]', border: 'border-[var(--vscode-border)]' }
                            return (
                              <span 
                                key={cat}
                                className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium border flex-shrink-0 ${style.bg} ${style.text} ${style.border}`}
                                title={`${cat.replace(/([A-Z])/g, ' $1').trim()}: ${count} skills`}
                              >
                                <span className="hidden sm:inline">{cat.replace(/([A-Z])/g, ' $1').trim().slice(0, 10)}: </span>{count}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      
                      <ChevronRight 
                        size={11}
                        className={`sm:w-3 sm:h-3 text-[var(--vscode-text-muted)] transition-all duration-300 flex-shrink-0 ml-1 ${expandedTimeline.selectedYear === entry.year ? 'rotate-90 text-[var(--vscode-blue)]' : ''}`}
                      />
                    </button>
                    
                    {/* Expanded skills list - Enhanced */}
                    {expandedTimeline.selectedYear === entry.year && (
                      <div className="px-2 sm:px-3 pb-2 sm:pb-3 pt-1.5 sm:pt-2 space-y-2 sm:space-y-3 border-t border-[var(--vscode-border)]/50 mt-1">
                        {/* Group by category */}
                        {Object.entries(
                          entry.skills.reduce((acc, skill) => {
                            if (!acc[skill.category]) acc[skill.category] = []
                            acc[skill.category].push(skill)
                            return acc
                          }, {} as { [key: string]: typeof entry.skills })
                        ).map(([category, skills]) => {
                          const categoryIcons: { [key: string]: string } = {
                            languages: '🔷',
                            frameworks: '⚛️',
                            databases: '💾',
                            technologies: '🛠️',
                            versionControl: '📦',
                            methodologies: '📋',
                            standards: '📐',
                          }
                          return (
                            <div key={category} className="space-y-1.5 sm:space-y-2">
                              {/* Category header */}
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                                <span className="text-xs sm:text-sm flex-shrink-0">{categoryIcons[category.toLowerCase()] || '📌'}</span>
                                <h4 className="text-[10px] sm:text-xs text-[var(--vscode-text)] font-bold uppercase tracking-wide truncate flex-1 min-w-0">
                                  {category.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <div className="flex-1 h-px bg-[var(--vscode-border)] mx-1"></div>
                                <span className="text-[9px] sm:text-[10px] text-[var(--vscode-text-muted)] flex-shrink-0">{skills.length}</span>
                              </div>
                              
                              {/* Skills grid */}
                              <div className="flex flex-wrap gap-1 sm:gap-1.5 pl-3 sm:pl-5">
                                {skills.map((skill, idx) => {
                                  const sourceColors = {
                                    job: 'bg-[var(--vscode-green)]/10 border-[var(--vscode-green)]/30 text-[var(--vscode-green)] hover:bg-[var(--vscode-green)]/20',
                                    project: 'bg-[var(--vscode-blue)]/10 border-[var(--vscode-blue)]/30 text-[var(--vscode-blue)] hover:bg-[var(--vscode-blue)]/20',
                                    certification: 'bg-[var(--vscode-yellow)]/10 border-[var(--vscode-yellow)]/30 text-[var(--vscode-yellow)] hover:bg-[var(--vscode-yellow)]/20',
                                  }
                                  const sourceIcons = {
                                    job: '💼',
                                    project: '🚀',
                                    certification: '🎓',
                                  }
                                  return (
                                    <div
                                      key={idx}
                                      className={`group relative px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md border transition-all duration-200 cursor-pointer ${sourceColors[skill.source as keyof typeof sourceColors] || 'bg-[var(--vscode-tab)] border-[var(--vscode-border)]'}`}
                                      title={`${skill.source.charAt(0).toUpperCase() + skill.source.slice(1)}: ${skill.context || skill.skill}`}
                                    >
                                      <div className="flex items-center gap-1 sm:gap-1.5">
                                        <span className="text-[9px] sm:text-[10px] flex-shrink-0">{sourceIcons[skill.source as keyof typeof sourceIcons] || '📌'}</span>
                                        <span className="text-[10px] sm:text-xs text-[var(--vscode-text)] font-medium truncate max-w-[120px] sm:max-w-none">{skill.skill}</span>
                                      </div>
                                      {/* Hover tooltip - hidden on mobile */}
                                      <div className="hidden sm:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] bg-[var(--vscode-tab)] border border-[var(--vscode-border)] text-[var(--vscode-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                        {skill.context}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 sm:p-2 scrollbar-thin">
        <div className="space-y-1 sm:space-y-1.5">
          {commits.slice(0, 8).map((commit, index) => (
            <div key={commit.hash} className="group">
              <div
                className={`flex items-start sm:items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded hover:bg-[var(--vscode-sidebar)] cursor-pointer transition-all ${
                  selectedCommit === commit.hash ? "bg-[var(--vscode-blue)]/30 border border-[var(--vscode-blue)]/50 shadow-sm" : ""
                }`}
                onClick={() => {
                  setSelectedCommit(commit.hash)
                  setExpandedCommit(expandedCommit === commit.hash ? null : commit.hash)
                  handleCommitNavigation(commit)
                }}
              >
                <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[var(--vscode-tab)] border border-current flex items-center justify-center shadow-sm">
                    {getCommitIcon(commit.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-xs text-[var(--vscode-text)] mb-1 group-hover:text-[var(--vscode-blue)] transition-colors line-clamp-2 sm:truncate leading-tight sm:leading-normal">
                    {commit.message}
                  </div>
                  <div className="flex items-center flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-1 text-xs">
                    <span className="font-mono text-[var(--vscode-blue)] text-[9px] sm:text-xs flex-shrink-0">{commit.hash}</span>
                    <span className="text-[var(--vscode-text-muted)] text-[9px] sm:text-xs">•</span>
                    <span className="text-[var(--vscode-text-muted)] text-[9px] sm:text-xs flex-shrink-0">
                      {new Date(commit.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <div className={`px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-xs truncate max-w-[120px] sm:max-w-none ${getBranchBadgeStyle(commit.branch)}`}>
                      {commit.branch}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                  {expandedCommit === commit.hash ? (
                    <ChevronDown size={10} className="sm:w-3 sm:h-3 text-[var(--vscode-blue)]" />
                  ) : (
                    <ChevronRight size={10} className="sm:w-3 sm:h-3 text-[var(--vscode-text-muted)]" />
                  )}
                </div>
              </div>

              {expandedCommit === commit.hash && (
                <div className="ml-4 sm:ml-6 mt-1 mb-1.5 sm:mb-2 p-1.5 sm:p-2 bg-[var(--vscode-tab)] rounded border border-[var(--vscode-blue)]/30 shadow-sm">
                  {commit.changes.additions.length > 0 && (
                    <div className="mb-1.5 sm:mb-2">
                      <div className="text-[10px] sm:text-xs text-[var(--vscode-green)] mb-1 flex items-center gap-1 font-semibold">
                        <Plus size={9} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                        <span>+{commit.changes.additions.length} additions</span>
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        {commit.changes.additions.slice(0, 5).map((addition, index) => (
                          <div key={index} className="text-[10px] sm:text-xs text-[var(--vscode-green)]/80 ml-2 sm:ml-3 flex items-center gap-1 sm:gap-1.5">
                            <div className="w-1 h-1 bg-[var(--vscode-green)] rounded-full flex-shrink-0"></div>
                            <span className="truncate line-clamp-1">{addition}</span>
                          </div>
                        ))}
                        {commit.changes.additions.length > 5 && (
                          <div className="text-[10px] sm:text-xs text-[var(--vscode-text-muted)] ml-2 sm:ml-3 italic">
                            +{commit.changes.additions.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Impact Metrics for this commit */}
                  {commit.message.includes("joined") && (
                    <div className="mb-1.5 sm:mb-2 p-1.5 sm:p-2 bg-[var(--vscode-bg)] rounded border border-[var(--vscode-border)]/50">
                      <div className="text-[10px] sm:text-xs text-[var(--vscode-blue)] mb-1 font-semibold">Impact Metrics</div>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                        <div>
                          <div className="text-[var(--vscode-text-muted)] text-[9px] sm:text-xs">Technologies</div>
                          <div className="text-[var(--vscode-green)] font-medium text-[10px] sm:text-xs">{commit.changes.additions.length}</div>
                        </div>
                        <div>
                          <div className="text-[var(--vscode-text-muted)] text-[9px] sm:text-xs">Type</div>
                          <div className="text-[var(--vscode-blue)] font-medium capitalize text-[10px] sm:text-xs">{commit.type}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCommitNavigation(commit)
                    }}
                      className="flex-1 text-[10px] sm:text-xs px-2 sm:px-3 py-1.5 bg-[var(--vscode-blue)] text-white rounded hover:bg-[var(--vscode-blue-light)] transition-colors font-medium"
                  >
                      View Details →
                  </button>
                  </div>
                </div>
              )}

              {index < commits.slice(0, 8).length - 1 && <div className="ml-2.5 sm:ml-4 w-px h-1.5 sm:h-2 bg-[var(--vscode-border)]"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="p-1.5 sm:p-2 border-t border-[var(--vscode-border)] bg-[var(--vscode-sidebar)]">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-[var(--vscode-text-muted)] mb-1.5 sm:mb-2">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[var(--vscode-green)] rounded-full animate-pulse flex-shrink-0"></div>
            <span className="truncate">Live</span>
          </div>
          <div className="text-[var(--vscode-blue)] font-mono text-[10px] sm:text-xs truncate ml-1">HEAD → main</div>
        </div>
        
        {/* Career Progress Indicator */}
        <div className="pt-1.5 sm:pt-2 border-t border-[var(--vscode-border)]/50">
          <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
            <span className="text-[var(--vscode-text-muted)] truncate">Career Progress</span>
            <span className="text-[var(--vscode-green)] font-medium ml-1 flex-shrink-0">{Math.round((metrics.yearsOfExperience / 10) * 100)}%</span>
          </div>
          <div className="w-full h-1 sm:h-1.5 bg-[var(--vscode-tab)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--vscode-green)] to-[var(--vscode-blue)] transition-all duration-500"
              style={{ width: `${Math.min((metrics.yearsOfExperience / 10) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
