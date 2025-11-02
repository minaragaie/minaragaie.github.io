"use client"
import { Project } from "@/types/resume"
import { Lock, Building2 } from "lucide-react"

interface ProjectMetadataProps {
  project: Project
  resumeData?: any
}

export default function ProjectMetadata({ project, resumeData }: ProjectMetadataProps) {
  // Find company for this project
  const getProjectCompany = () => {
    if (!resumeData?.experience) return undefined
    const experience = resumeData.experience.find((exp: any) => 
      exp.projects?.includes(project.slug)
    )
    return experience?.company
  }
  
  const companyName = getProjectCompany()

  return (
    <div className="mb-8 pb-6 border-b border-[var(--projects-border)]">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h1
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
        >
          {project.name}
        </h1>
        {(project as any).isPrivateRepo && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-xs font-medium text-amber-500">Private Repository</span>
          </div>
        )}
        {companyName && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
            <Building2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-blue-400">{companyName}</span>
          </div>
        )}
      </div>
      <p
        className="text-base md:text-lg mb-4 leading-relaxed"
        style={{ color: "var(--projects-text-muted)" }}
      >
        {project.description}
      </p>
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 rounded-md"
              style={{
                backgroundColor: "var(--projects-card-bg)",
                color: "var(--projects-text-accent-blue)",
                border: "1px solid var(--projects-border)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Related Repositories */}
      {project.relatedRepos && project.relatedRepos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--projects-border)]">
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--projects-text-white)" }}>
            📦 Related Repositories
          </h3>
          <div className="space-y-2">
            {project.relatedRepos.map((repo, index) => (
              <a
                key={index}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm p-2 rounded hover:bg-white/5 transition-colors"
                style={{ color: "var(--projects-text-muted)" }}
              >
                <span className="text-blue-400">→</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-medium text-blue-400 hover:text-blue-300">
                    {repo.name}
                    {repo.isPrivate && (
                      <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" title="Private repository" />
                    )}
                  </div>
                  <div className="text-xs opacity-80">{repo.description}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

