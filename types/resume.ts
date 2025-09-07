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

export type Theme =  "dark" | "light" | "high-contrast" | "monokai"
