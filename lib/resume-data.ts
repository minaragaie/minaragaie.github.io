// This file is no longer needed as we use the useResumeData hook
// Keeping for backward compatibility if needed

interface ResumeData {
  experience?: Array<{
    id: number
    company: string
    title: string
    startDate: string
    endDate: string
    description: string
    technologies: string[]
  }>
  projects?: Array<{
    id?: number
    name: string
    description: string
    technologies: string[]
    icon: string
    color: string
    status: string
    year: string
    detailsFile?: string
    featured?: boolean
    githubUrl?: string
    liveUrl?: string
    imageUrl?: string
  }>
  skills?: {
    languages: string[]
    frameworks: string[]
    databases: string[]
    technologies: string[]
    versionControl: string[]
    methodologies: string[]
    standards: string[]
  }
  certifications?: Array<{
    name: string
    issuer: string
    date: string
  }>
}

export const resumeData: ResumeData | null = null
export const staticResumeData: ResumeData | null = null
