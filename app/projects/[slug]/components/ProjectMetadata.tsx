"use client"
import { Project } from "@/types/resume"

interface ProjectMetadataProps {
  project: Project
}

export default function ProjectMetadata({ project }: ProjectMetadataProps) {
  return (
    <div className="mb-8 pb-6 border-b border-[var(--projects-border)]">
      <h1
        className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"
      >
        {project.name}
      </h1>
      <p
        className="text-base md:text-lg mb-4 leading-relaxed"
        style={{ color: "var(--projects-text-muted)" }}
      >
        {project.description}
      </p>
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
    </div>
  )
}

