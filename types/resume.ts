export interface Certificate {
  name: string
  issuer: string
  status: string
  description: string
  color: string
  skills: string[]
  icon: string
  verify?: string
  pathway?: Certificate[]

}

export interface Project {
  id?: number
  name: string
  slug?: string       // URL slug for the project page
  description: string
  technologies?: string[]
  icon?: string
  color?: string
  status: string
  year: string
  featured?: boolean
  githubUrl?: string  // Required for portfolio.md fetching
  relatedRepos?: Array<{
    name: string
    url: string
    description: string
  }>
  portfolioLocation?: string // Which repo has portfolio.md (e.g., "frontend", "monorepo")
  liveUrl?: string
  imageUrl?: string
}

export interface ResumeData {
  personalInfo: {
    name: string
    linkedin: string
    location: string
    phone: string
    email: string
    profileImage: string
  }
  highlights: string
  experience: Array<{
    id: number
    title: string
    company: string
    startDate: string
    endDate: string
    type?: string
    description: string
    achievements: string[]
    technologies: string[]
  }>
  projects: Project[]
  skills: {
    languages: string[]
    frameworks: string[]
    databases: string[]
    versionControl: string[]
    technologies: string[]
    methodologies: string[]
    standards: string[]
  }
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  certifications: Certificate[]
  additionalInfo: string
}

export type Theme =  "dark" | "light" | "high-contrast" | "monokai" | "devtool"
