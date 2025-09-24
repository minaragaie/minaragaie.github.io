import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { config } from '@/lib/config'

// Define types for our API responses
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
    type?: string
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
    technical: string[]
    soft: string[]
    languages: string[]
    tools: string[]
    // API fields for backward compatibility
    frameworks: string[]
    databases: string[]
    technologies: string[]
    versionControl: string[]
    methodologies: string[]
    standards: string[]
  }
  projects: any[]
  additionalInfo: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  message?: string
}

export interface ResumeResponse {
  success: boolean
  data: ResumeData
  message?: string
}

export interface LoginRequest {
  username: string
  password: string
}

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
      // Only add authorization header for endpoints that require authentication
      // The resume endpoint should be publicly accessible
      if (endpoint === 'login' || endpoint === 'verifyToken') {
        const token = localStorage.getItem('admin_token')
        if (token) {
          headers.set('authorization', `Bearer ${token}`)
        }
      }
      // For updateResume, add authorization header as it requires authentication
      if (endpoint === 'updateResume') {
        const token = localStorage.getItem('admin_token')
        if (token) {
          headers.set('authorization', `Bearer ${token}`)
        }
        return headers
      }
      // For resume GET requests, don't send authorization header to avoid CORS issues
      if (endpoint === 'getResume' || endpoint === 'getPublicResume') {
        // Don't add authorization header for public resume access
        return headers
      }
      return headers
    },
  }),
  tagTypes: ['Resume', 'Auth'],
  endpoints: (builder) => ({
    // Resume endpoints
    getResume: builder.query<ResumeResponse, void>({
      query: () => config.ENDPOINTS.RESUME,
      providesTags: ['Resume'],
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          // Transform API skills structure to UI structure
          const apiSkills = response.data.skills
          const transformedSkills = {
            technical: [
              ...(apiSkills.technologies || []),
              ...(apiSkills.frameworks || []),
              ...(apiSkills.databases || []),
              ...(apiSkills.versionControl || []),
              ...(apiSkills.methodologies || []),
              ...(apiSkills.standards || [])
            ],
            soft: [], // No soft skills in API
            languages: apiSkills.languages || [],
            tools: apiSkills.versionControl || [],
            // Keep original API fields for backward compatibility - ensure they're always arrays
            frameworks: apiSkills.frameworks || [],
            databases: apiSkills.databases || [],
            technologies: apiSkills.technologies || [],
            versionControl: apiSkills.versionControl || [],
            methodologies: apiSkills.methodologies || [],
            standards: apiSkills.standards || []
          }
          
          return {
            ...response,
            data: {
              ...response.data,
              skills: transformedSkills
            }
          }
        }
        return response
      },
    }),
    // Public resume endpoint (no auth required)
    getPublicResume: builder.query<ResumeResponse, void>({
      query: () => config.ENDPOINTS.PUBLIC_RESUME,
      providesTags: ['Resume'],
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          // Transform API skills structure to UI structure
          const apiSkills = response.data.skills
          const transformedSkills = {
            technical: [
              ...(apiSkills.technologies || []),
              ...(apiSkills.frameworks || []),
              ...(apiSkills.databases || []),
              ...(apiSkills.versionControl || []),
              ...(apiSkills.methodologies || []),
              ...(apiSkills.standards || [])
            ],
            soft: [], // No soft skills in API
            languages: apiSkills.languages || [],
            tools: apiSkills.versionControl || [],
            // Keep original API fields for backward compatibility - ensure they're always arrays
            frameworks: apiSkills.frameworks || [],
            databases: apiSkills.databases || [],
            technologies: apiSkills.technologies || [],
            versionControl: apiSkills.versionControl || [],
            methodologies: apiSkills.methodologies || [],
            standards: apiSkills.standards || []
          }
          
          return {
            ...response,
            data: {
              ...response.data,
              skills: transformedSkills
            }
          }
        }
        return response
      },
    }),
    updateResume: builder.mutation<ResumeResponse, ResumeData>({
      query: (resumeData) => {
        // Transform UI skills structure back to API structure
        const uiSkills = resumeData.skills
        const apiSkills = {
          languages: uiSkills.languages,
          frameworks: uiSkills.frameworks,
          databases: uiSkills.databases,
          technologies: uiSkills.technologies,
          versionControl: uiSkills.tools,
          methodologies: uiSkills.methodologies,
          standards: uiSkills.standards
        }
        
        return {
          url: config.ENDPOINTS.RESUME,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            ...resumeData,
            skills: apiSkills
          },
        }
      },
      invalidatesTags: ['Resume'],
    }),
    
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: config.ENDPOINTS.AUTH,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    verifyToken: builder.query<AuthResponse, void>({
      query: () => ({
        url: config.ENDPOINTS.AUTH,
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
    
    // PDF generation
    generatePDF: builder.mutation<Blob, void>({
      query: () => ({
        url: config.ENDPOINTS.GENERATE_PDF,
        method: 'POST',
        responseHandler: 'content-type',
      }),
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetResumeQuery,
  useGetPublicResumeQuery,
  useUpdateResumeMutation,
  useLoginMutation,
  useVerifyTokenQuery,
  useGeneratePDFMutation,
} = apiSlice
