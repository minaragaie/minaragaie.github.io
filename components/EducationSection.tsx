import { GraduationCap, Calendar, Building } from "lucide-react"
import type { ResumeData } from "@/lib/api/apiSlice"

interface EducationSectionProps {
  resumeData: ResumeData
}

export default function EducationSection({ resumeData }: EducationSectionProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-[var(--vscode-text)]">
          <span className="font-mono text-[var(--vscode-blue)]">class</span>{" "}
          <span className="text-[var(--vscode-green)]">Education</span>
        </h2>
        <p className="max-w-xl mx-auto font-mono text-sm sm:text-base text-[var(--vscode-text-muted)]">
          // Academic foundation in computer science and technology
        </p>
      </div>

      {/* Education cards */}
      <div className="grid gap-6 sm:gap-8">
        {resumeData.education.map((edu, index) => (
          <div
            key={index}
            className="rounded-lg p-6 sm:p-8 border transition-all duration-300 group opacity-100 translate-y-0"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--vscode-border)",
              transitionDelay: `${index * 200}ms`,
              transitionDuration: "600ms",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(to bottom right, var(--vscode-blue), var(--vscode-green))`,
                  }}
                >
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--vscode-text)]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-[var(--vscode-green)] transition-colors duration-300"
                  style={{ color: "var(--vscode-text)" }}
                >
                  {edu.degree}
                </h3>

                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 mb-4">
                  <div className="flex items-center gap-2 text-[var(--vscode-text-muted)] text-sm sm:text-base">
                    <Building className="w-4 h-4 text-[var(--vscode-blue)]" />
                    <span>{edu.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--vscode-text-muted)] text-sm sm:text-base">
                    <Calendar className="w-4 h-4 text-[var(--vscode-green)]" />
                    <span>{edu.year}</span>
                  </div>
                </div>

                <div className="leading-relaxed text-sm sm:text-base text-[var(--vscode-text-muted)]">
                  <p>
                    Strong technical fundamentals in computer science, software engineering, and web
                    development technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
