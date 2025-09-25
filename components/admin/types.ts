// Types and interfaces for admin components

export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    website: string
    summary: string
  }
  experience: Array<{
    id: number
    company: string
    title: string
    startDate: string
    endDate: string
    description: string
    technologies: string[]
    achievements?: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    gpa: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    icon?: string
    status?: string
    description?: string
    color?: string
    skills?: string[]
    verify?: string
    pathway?: any[]
    date?: string
  }>
  skills: {
    languages: string[]
    frameworks: string[]
    databases: string[]
    technologies: string[]
    versionControl: string[]
    methodologies: string[]
    standards: string[]
  }
  projects: Array<{
    id: number
    name: string
    description: string
    technologies: string[]
    status?: string
    year?: string
    githubUrl?: string
    liveUrl?: string
    imageUrl?: string
  }>
  additionalInfo: string
}

export interface AdminStats {
  experienceCount: number
  skillCount: number
  educationCount: number
  certificationCount: number
  projectCount: number
}

export interface ErrorState {
  hasError: boolean
  message: string
  type: "network" | "validation" | "sync" | "auth" | "unknown"
  retryCount: number
  lastError: Date | null
}

export interface CommitHistory {
  sha: string
  message: string
  author: string
  date: string
  url: string
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
