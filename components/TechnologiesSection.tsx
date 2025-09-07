"use client"
import { Code, Database, Globe, Wrench, Shield, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import resumeData from "@/data/resume.json"

const techCategories = [
  {
    name: "Languages",
    icon: Code,
    color: "from-blue-400 to-cyan-500",
    items: resumeData.skills.languages,
  },
  {
    name: "Frameworks",
    icon: Globe,
    color: "from-green-400 to-emerald-500",
    items: resumeData.skills.frameworks,
  },
  {
    name: "Databases",
    icon: Database,
    color: "from-purple-400 to-violet-500",
    items: resumeData.skills.databases,
  },
  {
    name: "Tools & Technologies",
    icon: Wrench,
    color: "from-orange-400 to-red-500",
    items: [...resumeData.skills.technologies, ...resumeData.skills.versionControl],
  },
  {
    name: "Methodologies",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    items: resumeData.skills.methodologies,
  },
  {
    name: "Standards & Best Practices",
    icon: Shield,
    color: "from-indigo-400 to-blue-500",
    items: resumeData.skills.standards,
  },
]

interface TechnologiesSectionProps {
  isVisible: boolean
}

export default function TechnologiesSection({ isVisible }: TechnologiesSectionProps) {
  return (
    <div className="max-w-6xl mx-auto">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-bold mb-4 text-[var(--tech-text-white)]">
      <span className="text-[var(--tech-text-accent-blue)] font-mono">const</span>{" "}
      <span className="text-[var(--tech-text-accent-green)]">techStack</span>{" "}
      <span className="text-[var(--tech-text-white)]">=</span>{" "}
      <span className="text-[var(--tech-text-accent-orange)]">{"{"}</span>
    </h2>
    <p className="text-[var(--tech-text-muted)] max-w-2xl mx-auto font-mono">
      // Comprehensive technology ecosystem mastery
    </p>
  </div>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {techCategories.map((category, index) => {
      const Icon = category.icon
      return (
        <div
          key={category.name}
          className={`
            bg-[var(--tech-bg)] 
            border border-[var(--tech-border)] 
            rounded-lg p-6 
            hover:border-[var(--tech-primary)] 
            hover:shadow-[var(--tech-shadow)] 
            transition-all duration-300 
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
          style={{
            transitionDelay: `${index * 150}ms`,
            transitionDuration: "600ms",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 bg-gradient-to-br ${category.color} rounded-lg`}>
              <Icon className="w-6 h-6 text-[var(--tech-text-white)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--tech-text-white)]">{category.name}</h3>
              <p className="text-sm text-[var(--tech-text-muted)]">{category.items.length} technologies</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-[var(--tech-card-bg)] rounded p-3 mb-4">
              <code className="text-xs text-[var(--tech-text-accent-blue)] font-mono">
                {category.name.toLowerCase().replace(/\s+/g, "")}: [
              </code>
            </div>

            <div className="flex flex-wrap gap-2">
              {category.items.map((item, itemIndex) => (
                <Badge
                  key={itemIndex}
                  variant="secondary"
                  className="
                    bg-[var(--tech-card-bg)] 
                    text-[var(--tech-text-muted)] 
                    border border-[var(--tech-border)] 
                    hover:border-[var(--tech-primary)] 
                    hover:text-[var(--tech-primary)] 
                    transition-colors text-xs
                  "
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )
    })}
  </div>
</div>

  )
}
