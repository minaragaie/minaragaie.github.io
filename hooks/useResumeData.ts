import { useState, useEffect } from 'react'
import { config } from '@/lib/config'

interface ResumeData {
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
    projects?: string[] // Array of project slugs built during this experience
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
    icon: string
    status: string
    description: string
    color: string
    skills: string[]
    verify: string
    pathway: any[]
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
    id?: number
    name: string
    slug?: string
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
  additionalInfo: string
}

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchResumeData = async () => {
      let timeoutId: NodeJS.Timeout | null = null
      
      try {
        setLoading(true)
        setError(null)
        
        // Create abort controller for timeout
        const controller = new AbortController()
        
        // Set 15 second timeout
        timeoutId = setTimeout(() => {
          controller.abort()
        }, 15000)
        
        const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.RESUME}`, {
          signal: controller.signal
        })
        
        // Clear timeout on successful response
        if (timeoutId) clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
               if (result.success) {
                 // Transform backend data to match frontend structure
                 const transformedData = {
                   ...result.data,
                   personalInfo: {
                     ...result.data.personalInfo,
                     summary: result.data.summary || result.data.personalInfo?.summary || ''
                   },
                   projects: result.data.projects || []
                 }
                 setResumeData(transformedData)
               } else {
                 throw new Error(result.message || 'Failed to fetch resume data')
               }
      } catch (err) {
        // Clear timeout if error occurs
        if (timeoutId) clearTimeout(timeoutId)
        
        console.error('Error fetching resume data:', err)
        
        // Determine error message
        let errorMessage = 'Unknown error'
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            errorMessage = 'Request timeout - The server is taking too long to respond'
          } else {
            errorMessage = err.message
          }
        }
        
        setError(errorMessage)
        
        // Fallback to empty data structure
        setResumeData({
          personalInfo: {
            name: "",
            email: "",
            phone: "",
            location: "",
            linkedin: "",
            github: "",
            website: "",
            summary: ""
          },
          experience: [],
          education: [],
          certifications: [],
          skills: {
            languages: [],
            frameworks: [],
            databases: [],
            technologies: [],
            versionControl: [],
            methodologies: [],
            standards: []
          },
          projects: [],
          additionalInfo: ""
        })
      } finally {
        setLoading(false)
      }
    }

    fetchResumeData()
  }, [retryCount])

  const retry = () => {
    setRetryCount(prev => prev + 1)
  }

  return { resumeData, loading, error, retry }
}
