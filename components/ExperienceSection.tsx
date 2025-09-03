"use client"
import { Calendar, MapPin, ArrowDown, Briefcase, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import resumeData from "@/data/resume.json"

interface ExperienceSectionProps {
  isVisible: boolean
}

export default function ExperienceSection({ isVisible }: ExperienceSectionProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-[var(--text-primary)]">
          <span className="text-[var(--vscode-blue)] font-mono">class</span>{" "}
          <span className="text-[var(--vscode-green)]">CareerJourney</span>
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto font-mono">
          // Navigating through professional milestones and growth
        </p>
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-3 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--vscode-blue)] via-[var(--vscode-green)] to-[var(--vscode-yellow)] opacity-30"></div>

        <div className="space-y-10 sm:space-y-12">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="relative">
              {/* Timeline marker */}
              <div className="absolute left-2 sm:left-6 top-0 w-3 sm:w-4 h-3 sm:h-4 bg-[var(--vscode-blue)] rounded-full border-2 sm:border-4 border-[var(--bg-primary)] z-10 shadow-md shadow-[var(--vscode-blue)]/50"></div>

              {/* Step card */}
              <div
                className={`bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg p-4 sm:p-8 hover:border-[var(--vscode-blue)] transition-all duration-700 hover:shadow-lg hover:shadow-[var(--vscode-blue)]/10 transform relative ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "opacity-0 sm:translate-x-12"
                }`}
                style={{
                  transitionDelay: `${index * 300}ms`,
                  transitionProperty: "transform, opacity",
                }}
              >
                {/* Triangle pointer */}
                <div className="absolute -left-3 sm:-left-4 top-6 sm:top-8 w-0 h-0 border-t-6 sm:border-t-8 border-b-6 sm:border-b-8 border-r-6 sm:border-r-8 border-transparent border-r-[var(--bg-tertiary)]"></div>

                {/* Card content */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6">
                  <div className="flex-1">
                    {/* Title + Badge */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[var(--vscode-green)]" />
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">{exp.title}</h3>
                      {exp.type && (
                        <Badge
                          variant="outline"
                          className="text-[var(--vscode-green)] border-[var(--vscode-green)]"
                        >
                          {exp.type}
                        </Badge>
                      )}
                    </div>

                    {/* Company + Dates */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[var(--text-primary)] mb-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MapPin className="w-4 h-4 text-[var(--vscode-blue)] flex-shrink-0" />
                        <span className="font-semibold text-[var(--vscode-blue)]">{exp.company}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar className="w-4 h-4 text-[var(--vscode-yellow)] flex-shrink-0" />
                        <span className="text-[var(--vscode-yellow)] text-sm sm:text-base">{exp.startDate} - {exp.endDate}</span>
                      </div>
                    </div>

                    <p className="text-[var(--text-primary)] text-sm sm:text-base mb-4">{exp.description}</p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="text-[var(--vscode-blue)] font-mono mb-2 sm:mb-3 text-sm sm:text-base">// Journey Milestones</h4>
                  <div className="bg-[var(--bg-primary)] rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 transition-all duration-500 border border-[var(--border-color)]">
                    <ul className="space-y-2">
                      {(exp.achievements || []).map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start gap-2 sm:gap-3 text-[var(--text-primary)] text-sm sm:text-base">
                          <CheckCircle className="w-4 h-4 text-[var(--vscode-green)] mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-[var(--vscode-blue)] font-mono mb-2 sm:mb-3 text-sm sm:text-base">// Tech Stack Evolved</h4>
                  <div className="flex flex-wrap gap-1">
                    {(exp.technologies || []).map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs sm:text-sm border border-[var(--border-color)] hover:border-[var(--vscode-blue)] hover:text-[var(--vscode-blue)] transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Down arrow */}
              {index < resumeData.experience.length - 1 && (
                <div className="absolute left-3 sm:left-7 -bottom-5 sm:-bottom-6 w-2 h-2">
                  <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--vscode-blue)] opacity-60 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* End marker */}
        <div className="absolute left-3 sm:left-6 bottom-0 w-3 sm:w-4 h-3 sm:h-4 bg-[var(--vscode-yellow)] rounded-full border-2 sm:border-4 border-[var(--bg-primary)] z-10 shadow-md shadow-[var(--vscode-yellow)]/50"></div>
      </div>
    </div>
  )
}
