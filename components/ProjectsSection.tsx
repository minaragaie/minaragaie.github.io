"use client"
import { memo, useMemo } from "react"
import Link from "next/link"
import { Building2, Users, GraduationCap, Stethoscope, Calendar, MessageCircle, BookOpen, ExternalLink, Sparkles } from "lucide-react"

// Icon mapping for converting string names to icon components
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2,
  Users,
  GraduationCap,
  Stethoscope,
  Calendar,
  MessageCircle,
  BookOpen,
}

interface ProjectCardProps {
  project: any
  index: number
  companyName?: string
}

const ProjectCard = memo(({ project, index, companyName }: ProjectCardProps) => {
  // Get the icon component from the icon map (if icon is a string) or use it directly (if already a component)
  const Icon = typeof project.icon === 'string' 
    ? (iconMap[project.icon] || Building2)
    : (project.icon || Building2)
  
  // Use project slug field
  const slug = project.slug || ''
  
  return (
    <div
      className="
        bg-[var(--projects-bg)] 
        border border-[var(--projects-border)] 
        rounded-lg p-6 
        hover:border-[var(--projects-primary)] 
        hover:shadow-[var(--projects-shadow)] 
        transition-all duration-700 transform
        hover:scale-105
        translate-y-0 opacity-100 scale-100
      "
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3 mb-4 transition-all duration-500 translate-x-0 opacity-100">
        <div
          className={`p-2 bg-gradient-to-br ${project.color} rounded-lg transition-transform duration-300 hover:rotate-12 hover:scale-110`}
        >
          <Icon className="w-5 h-5" style={{ color: "var(--projects-text-white)" }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1.5 truncate" style={{ color: "var(--projects-text-white)" }}>
            {project.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-1.5 py-0.5 rounded" style={{ 
              color: "var(--projects-text-accent-green)",
              backgroundColor: "var(--projects-card-bg)"
            }}>
              {project.status}
            </span>
            <span style={{ color: "var(--projects-text-muted)" }}>
              {project.year}
            </span>
            {companyName ? (
              <>
                <span style={{ color: "var(--projects-text-muted)" }}>•</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium" style={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59, 130, 246, 0.2)"
                }}>
                  <Building2 className="w-3 h-3" />
                  {companyName}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: "var(--projects-text-muted)" }}>•</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium" style={{
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  color: "#a78bfa",
                  border: "1px solid rgba(139, 92, 246, 0.2)"
                }}>
                  <Sparkles className="w-3 h-3" />
                  Side Project
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className="rounded p-3 mb-4 transition-all duration-500 bg-[var(--projects-card-bg)] translate-y-0 opacity-100"
      >
        <p className="text-xs leading-relaxed" style={{ color: "var(--projects-text-muted)" }}>
          {project.description}
        </p>
      </div>

      <div
        className="space-y-2 transition-all duration-500 translate-y-0 opacity-100"
      >
        <h4 className="text-xs font-medium" style={{ color: "var(--projects-text-accent-blue)" }}>
          Technologies:
        </h4>
        <div className="flex flex-wrap gap-1">
          {project.technologies.map((tech: string, techIndex: number) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded border transition-all duration-500 translate-x-0 opacity-100 scale-100"
              style={{ transitionDelay: `${techIndex * 50}ms` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Read More Button */}
      {slug && (
        <div className="mt-4 pt-4 border-t border-[var(--projects-border)]">
          <Link
            href={`/projects/${slug}`}
            className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            style={{
              color: "var(--projects-primary)",
              backgroundColor: "var(--projects-card-bg)",
              border: "1px solid var(--projects-primary)",
            }}
          >
            <span>Read Full Case Study</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  )
})

ProjectCard.displayName = 'ProjectCard'

interface ResumeData {
  projects: any[]
  experience?: Array<{
    company: string
    projects?: string[]
  }>
}

interface ProjectsSectionProps {
  resumeData: ResumeData
}

const ProjectsSection = memo(({ resumeData }: ProjectsSectionProps) => {
  // Use projects from resumeData, fallback to empty array if not available
  const memoizedProjects = useMemo(() => {
    return resumeData?.projects || []
  }, [resumeData?.projects])

  // Helper function to find company name for a project
  const getProjectCompany = (projectSlug: string) => {
    if (!resumeData?.experience) return undefined
    const experience = resumeData.experience.find(exp => 
      exp.projects?.includes(projectSlug)
    )
    return experience?.company
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 transition-all duration-1000 translate-y-0 opacity-100">
        <h2 className="text-4xl font-bold mb-4" style={{ color: "var(--projects-text-white)" }}>
          <span className="font-mono" style={{ color: "var(--projects-text-accent-blue)" }}>
            const
          </span>{" "}
          <span className="font-mono" style={{ color: "var(--projects-text-accent-green)" }}>
            recentProjects
          </span>{" "}
          <span style={{ color: "var(--projects-text-white)" }}>=</span>{" "}
          <span style={{ color: "var(--projects-text-accent-orange)" }}>{"["}</span>
        </h2>
        <p className="max-w-2xl mx-auto font-mono" style={{ color: "var(--projects-text-muted)" }}>
          // Showcasing innovative solutions built with modern technologies
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memoizedProjects.map((project, projectIndex) => {
          const projectSlug = project.slug || ''
          const companyName = getProjectCompany(projectSlug)
          
          return (
            <ProjectCard
              key={project.name}
              project={project}
              index={projectIndex}
              companyName={companyName}
            />
          )
        })}
      </div>
    </div>
  )
})

ProjectsSection.displayName = 'ProjectsSection'
export default ProjectsSection
