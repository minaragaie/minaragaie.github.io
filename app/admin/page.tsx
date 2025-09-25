"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, Edit, X, LogOut, User, Briefcase, GraduationCap, Award, Code, Terminal, Database, Settings, Activity, Search, Download, Upload, Eye, Clock, CheckCircle, AlertCircle, Info, BarChart3, Keyboard, Zap, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { config } from "@/lib/config"
import { SaveStatusIndicator } from "@/components/SaveStatusIndicator"

// Define ResumeData interface to match backend structure
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

export default function AdminPage() {
  const { username, isAuthenticated, logout } = useAuth()
  
  // Default resume data (fallback)
  const defaultResumeData: ResumeData = {
    personalInfo: { 
      name: "MINA YOUANESS!", 
      email: "minaragaie@hotmail.com", 
      phone: "609.839.3558", 
      location: "Voorhees, NJ", 
      linkedin: "https://www.linkedin.com/in/mina-youaness-ba833713/", 
      github: "https://github.com/minaragaie", 
      website: "https://minaragaie.github.io/",
      summary: "A highly innovative and passionate Full-Stack front-end web development technologist, with over 10 years of experience in developing and designing creative and interactive user-centric websites and portals."
    },
    experience: [
      {
        id: 1,
        title: "Full-Stack Developer",
        company: "Sample Company",
        startDate: "2020-01-01",
        endDate: "2023-12-31",
        description: "Developed and maintained web applications using modern technologies.",
        technologies: ["React", "Node.js", "TypeScript"],
        achievements: ["Improved performance by 50%", "Led team of 3 developers"]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "Sample University",
        year: "2019",
        gpa: "3.8"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        icon: "aws",
        status: "Active",
        description: "Certified in AWS development practices",
        color: "#FF9900",
        skills: ["AWS", "Cloud Computing"],
        verify: "https://aws.amazon.com/verification",
        pathway: [],
        date: "2023-01-01"
      }
    ],
    skills: { 
      languages: ["JavaScript", "TypeScript", "Python"], 
      frameworks: ["React", "Vue.js", "Angular"], 
      databases: ["PostgreSQL", "MongoDB", "Redis"], 
      technologies: ["Docker", "Kubernetes", "AWS"], 
      versionControl: ["Git", "GitHub", "GitLab"], 
      methodologies: ["Agile", "Scrum", "DevOps"], 
      standards: ["REST API", "GraphQL", "OAuth"]
    },
    projects: [
      {
        id: 1,
        name: "Turris ERP System",
        description: "Comprehensive enterprise resource planning system for managing day-to-day business activities with real-time data processing and advanced reporting capabilities.",
        technologies: ["Angular", "DevExtreme", "Node.js", "PostgreSQL", "WebSockets", "TypeScript"],
        status: "Production",
        year: "2023-2025"
      },
      {
        id: 2,
        name: "EntityConnect Platform",
        description: "Entity management & communications app with membership management, event registration, online donations, and workflow automation for organizations.",
        technologies: ["Angular", "Kendo UI", "SailsJS", "Node.js", "MySQL", "PWA"],
        status: "Live",
        year: "2018-2022"
      }
    ],
    additionalInfo: ""
  }

  // Load data from backend
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Optimistic updates state
  const [optimisticData, setOptimisticData] = useState<ResumeData | null>(null)
  const [pendingChanges, setPendingChanges] = useState<ResumeData | null>(null)
  const [syncInProgress, setSyncInProgress] = useState(false)

  const [editingExperience, setEditingExperience] = useState<number | null>(null)
  const [editingProject, setEditingProject] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)



  // Debounced search for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])



  // Use ref to avoid re-renders on every input change
  const resumeDataRef = useRef<ResumeData | null>(null)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Helper function to get current data (prioritizes optimistic data)
  const getCurrentData = useCallback(() => optimisticData || resumeData, [optimisticData, resumeData])
  
  // Memoized computed values for performance
  const stats = useMemo(() => {
    if (!optimisticData) return { experienceCount: 0, educationCount: 0, certCount: 0, skillCount: 0 }
    
    return {
      experienceCount: optimisticData.experience?.length || 0,
      educationCount: optimisticData.education?.length || 0,
      certCount: optimisticData.certifications?.length || 0,
      skillCount: (optimisticData.skills?.technologies?.length || 0) + (optimisticData.skills?.frameworks?.length || 0)
    }
  }, [optimisticData])

  // Memoized filtered data for search performance
  const filteredData = useMemo(() => {
    if (!optimisticData || !debouncedSearchQuery.trim()) return optimisticData
    
    const query = debouncedSearchQuery.toLowerCase()
    
    return {
      ...optimisticData,
      experience: optimisticData.experience?.filter(exp => 
        exp.title?.toLowerCase().includes(query) ||
        exp.company?.toLowerCase().includes(query) ||
        exp.description?.toLowerCase().includes(query)
      ) || [],
      education: optimisticData.education?.filter(edu =>
        edu.degree?.toLowerCase().includes(query) ||
        edu.institution?.toLowerCase().includes(query)
      ) || [],
      certifications: optimisticData.certifications?.filter(cert =>
        cert.name?.toLowerCase().includes(query) ||
        cert.issuer?.toLowerCase().includes(query) ||
        cert.description?.toLowerCase().includes(query)
      ) || []
    }
  }, [optimisticData, debouncedSearchQuery])

  
  // Rollback function for failed syncs
  const rollbackChanges = useCallback(() => {
    console.log('🔄 Rolling back optimistic changes...')
    setOptimisticData(resumeData)
    setPendingChanges(null)
    setHasUnsavedChanges(false)
    // You could also show a toast notification here
  }, [resumeData])




  // Save status state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Enhanced error handling state
  const [errorState, setErrorState] = useState<{
    hasError: boolean
    message: string
    type: 'network' | 'validation' | 'sync' | 'auth' | 'unknown'
    retryCount: number
    lastError: Date | null
  }>({
    hasError: false,
    message: '',
    type: 'unknown',
    retryCount: 0,
    lastError: null
  })
  
  const [isOffline, setIsOffline] = useState(false)
  const [retryQueue, setRetryQueue] = useState<ResumeData[]>([])
  
  // Data loading optimization state
  const [dataCache, setDataCache] = useState<{
    data: ResumeData | null
    timestamp: number
    version: string
  }>({
    data: null,
    timestamp: 0,
    version: ''
  })
  
  const [isPreloading, setIsPreloading] = useState(false)
  const [cacheHit, setCacheHit] = useState(false)
  
  // Data validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)

  // Cache management functions
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  const CACHE_KEY = 'resume_data_cache'
  
  // Save to cache
  const saveToCache = useCallback((data: ResumeData, version: string) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      version
    }
    setDataCache(cacheData)
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to save to localStorage cache:', error)
    }
  }, [])
  
  // Load from cache
  const loadFromCache = useCallback((): ResumeData | null => {
    // First check memory cache
    if (dataCache.data && (Date.now() - dataCache.timestamp) < CACHE_DURATION) {
      setCacheHit(true)
      console.log('🎯 Memory cache hit!')
      return dataCache.data
    }
    
    // Then check localStorage cache
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const cacheData = JSON.parse(cached)
        if ((Date.now() - cacheData.timestamp) < CACHE_DURATION) {
          setDataCache(cacheData)
          setCacheHit(true)
          console.log('🎯 localStorage cache hit!')
          return cacheData.data
        } else {
          console.log('⏰ Cache expired, clearing...')
          localStorage.removeItem(CACHE_KEY)
        }
      }
    } catch (error) {
      console.warn('Failed to load from localStorage cache:', error)
    }
    
    setCacheHit(false)
    return null
  }, [dataCache, CACHE_DURATION])
  
  // Clear cache
  const clearCache = useCallback(() => {
    setDataCache({ data: null, timestamp: 0, version: '' })
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error)
    }
  }, [])

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  const validateURL = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateRequired = (value: string): boolean => {
    return value.trim().length > 0
  }

  const validateMinLength = (value: string, minLength: number): boolean => {
    return value.trim().length >= minLength
  }

  const validateMaxLength = (value: string, maxLength: number): boolean => {
    return value.trim().length <= maxLength
  }

  // Comprehensive data validation
  const validateResumeData = useCallback((data: ResumeData): { errors: Record<string, string>, warnings: Record<string, string> } => {
    const errors: Record<string, string> = {}
    const warnings: Record<string, string> = {}

    // Personal Info Validation
    if (!validateRequired(data.personalInfo?.name || '')) {
      errors['personalInfo.name'] = 'Full name is required'
    } else if (!validateMinLength(data.personalInfo?.name || '', 2)) {
      errors['personalInfo.name'] = 'Full name must be at least 2 characters'
    } else if (!validateMaxLength(data.personalInfo?.name || '', 100)) {
      warnings['personalInfo.name'] = 'Full name is quite long'
    }

    if (data.personalInfo?.email && !validateEmail(data.personalInfo.email)) {
      errors['personalInfo.email'] = 'Please enter a valid email address'
    }

    if (data.personalInfo?.phone && !validatePhone(data.personalInfo.phone)) {
      errors['personalInfo.phone'] = 'Please enter a valid phone number'
    }

    if (data.personalInfo?.linkedin && !validateURL(data.personalInfo.linkedin)) {
      errors['personalInfo.linkedin'] = 'Please enter a valid LinkedIn URL'
    }

    if (data.personalInfo?.github && !validateURL(data.personalInfo.github)) {
      errors['personalInfo.github'] = 'Please enter a valid GitHub URL'
    }

    if (data.personalInfo?.summary && !validateMinLength(data.personalInfo.summary, 10)) {
      warnings['personalInfo.summary'] = 'Professional summary should be at least 10 characters'
    }

    // Experience Validation
    data.experience?.forEach((exp, index) => {
      if (!validateRequired(exp.title || '')) {
        errors[`experience.${index}.title`] = 'Job title is required'
      }
      if (!validateRequired(exp.company || '')) {
        errors[`experience.${index}.company`] = 'Company name is required'
      }
      if (exp.startDate && exp.endDate && new Date(exp.startDate) > new Date(exp.endDate)) {
        errors[`experience.${index}.dates`] = 'Start date cannot be after end date'
      }
      if (!validateMinLength(exp.description || '', 20)) {
        warnings[`experience.${index}.description`] = 'Job description should be more detailed'
      }
    })

    // Education Validation
    data.education?.forEach((edu, index) => {
      if (!validateRequired(edu.degree || '')) {
        errors[`education.${index}.degree`] = 'Degree is required'
      }
      if (!validateRequired(edu.institution || '')) {
        errors[`education.${index}.institution`] = 'Institution name is required'
      }
      if (edu.year && new Date(edu.year) > new Date()) {
        errors[`education.${index}.year`] = 'Graduation year cannot be in the future'
      }
    })

    // Certifications Validation
    data.certifications?.forEach((cert, index) => {
      if (!validateRequired(cert.name || '')) {
        errors[`certifications.${index}.name`] = 'Certification name is required'
      }
      if (!validateRequired(cert.issuer || '')) {
        errors[`certifications.${index}.issuer`] = 'Issuer is required'
      }
      if (cert.date && new Date(cert.date) > new Date()) {
        warnings[`certifications.${index}.date`] = 'Certification date is in the future'
      }
    })

    // Skills Validation
    if (data.skills?.technologies?.length === 0) {
      warnings['skills.technologies'] = 'Consider adding some technologies'
    }
    if (data.skills?.frameworks?.length === 0) {
      warnings['skills.frameworks'] = 'Consider adding some frameworks'
    }

    return { errors, warnings }
  }, [])

  // Real-time validation
  const validateField = useCallback((path: string, value: string, data: ResumeData) => {
    const newErrors = { ...validationErrors }
    const newWarnings = { ...validationWarnings }

    // Remove existing errors/warnings for this field
    delete newErrors[path]
    delete newWarnings[path]

    // Validate based on field type
    switch (path) {
      case 'personalInfo.name':
        if (!validateRequired(value)) {
          newErrors[path] = 'Full name is required'
        } else if (!validateMinLength(value, 2)) {
          newErrors[path] = 'Full name must be at least 2 characters'
        } else if (!validateMaxLength(value, 100)) {
          newWarnings[path] = 'Full name is quite long'
        }
        break
      case 'personalInfo.email':
        if (value && !validateEmail(value)) {
          newErrors[path] = 'Please enter a valid email address'
        }
        break
      case 'personalInfo.phone':
        if (value && !validatePhone(value)) {
          newErrors[path] = 'Please enter a valid phone number'
        }
        break
      case 'personalInfo.linkedin':
        if (value && !validateURL(value)) {
          newErrors[path] = 'Please enter a valid LinkedIn URL'
        }
        break
      case 'personalInfo.github':
        if (value && !validateURL(value)) {
          newErrors[path] = 'Please enter a valid GitHub URL'
        }
        break
      case 'personalInfo.summary':
        if (value && !validateMinLength(value, 10)) {
          newWarnings[path] = 'Professional summary should be at least 10 characters'
        }
        break
    }

    setValidationErrors(newErrors)
    setValidationWarnings(newWarnings)
  }, [validationErrors, validationWarnings])



  // Enhanced background sync with retry logic and validation
  const syncToBackend = useCallback(async (data: ResumeData, retryCount = 0) => {
    const maxRetries = 3
    const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Exponential backoff, max 10s
    
    try {
      setSyncInProgress(true)
      
      // Validate data before syncing
      setIsValidating(true)
      const { errors, warnings } = validateResumeData(data)
      
      if (Object.keys(errors).length > 0) {
        console.warn('⚠️ Validation errors found, but proceeding with sync:', errors)
        setValidationErrors(errors)
      } else {
        setValidationErrors({})
      }
      
      if (Object.keys(warnings).length > 0) {
        console.info('ℹ️ Validation warnings:', warnings)
        setValidationWarnings(warnings)
      } else {
        setValidationWarnings({})
      }
      
      setIsValidating(false)
      const token = localStorage.getItem('admin_token')
      const url = `${config.API_BASE_URL}${config.ENDPOINTS.RESUME}`
      
      console.log(`🔄 Background sync to backend... (attempt ${retryCount + 1}/${maxRetries + 1})`)
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Background sync successful:', result)
        
        // Update the authoritative data source
        setResumeData(data)
        setPendingChanges(null)
        setHasUnsavedChanges(false)
        setLastSaved(new Date())
        
        // Update cache with new data
        const version = result.timestamp || Date.now().toString()
        saveToCache(data, version)
        
        // Clear any previous errors
        setErrorState(prev => ({ ...prev, hasError: false, message: '', retryCount: 0 }))
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('❌ Background sync error:', error)
      
      const isNetworkError = error instanceof TypeError || 
                            (error instanceof Error && error.name === 'AbortError')
      const errorType = isNetworkError ? 'network' : 'sync'
    
      if (retryCount < maxRetries && !isOffline) {
        // Retry with exponential backoff
        console.log(`⏳ Retrying in ${retryDelay}ms...`)
        setErrorState(prev => ({
          ...prev,
          hasError: true,
          message: `Sync failed. Retrying in ${Math.ceil(retryDelay/1000)}s... (${retryCount + 1}/${maxRetries})`,
          type: errorType,
          retryCount: retryCount + 1,
          lastError: new Date()
        }))
        
        setTimeout(() => {
          syncToBackend(data, retryCount + 1)
        }, retryDelay)
      } else {
        // Max retries reached or offline - queue for later
        console.log('❌ Max retries reached, queuing for later sync')
        setRetryQueue(prev => [...prev, data])
        
        setErrorState(prev => ({
          ...prev,
          hasError: true,
          message: isOffline 
            ? 'You are offline. Changes will sync when connection is restored.'
            : 'Sync failed. Changes will be retried automatically.',
          type: errorType,
          retryCount: 0,
          lastError: new Date()
        }))
        
        // Don't rollback immediately - keep optimistic changes
        // rollbackChanges()
      }
    } finally {
      setSyncInProgress(false)
    }
  }, [rollbackChanges, isOffline])

  // Process retry queue when network is restored
  const processRetryQueue = useCallback(async () => {
    if (retryQueue.length === 0) return

    console.log(`🔄 Processing ${retryQueue.length} queued changes...`)
    
    for (const data of retryQueue) {
      try {
        await syncToBackend(data)
        setRetryQueue(prev => prev.filter(item => item !== data))
      } catch (error) {
        console.error('❌ Failed to sync queued data:', error)
        break // Stop processing if we encounter an error
      }
    }
  }, [retryQueue, syncToBackend])

  // Optimized update function with better performance
  const updateResumeData = useCallback((newData: ResumeData) => {
    // Batch state updates to prevent multiple re-renders
    setOptimisticData(newData)
      setHasUnsavedChanges(true)
    setPendingChanges(newData)
    
    // Update ref immediately
    resumeDataRef.current = newData
    
    // Trigger background sync with debouncing
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      syncToBackend(newData)
    }, 500) // Reduced debounce to 500ms for faster sync
  }, [syncToBackend])

  // Optimized data loading with caching
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        setIsLoading(true)
        
        // First, try to load from cache
        const cachedData = loadFromCache()
        if (cachedData) {
          console.log('🚀 Using cached data for instant loading!')
          console.log('📊 Cached Experience data:', cachedData.experience)
          console.log('📊 Cached Education data:', cachedData.education)
          console.log('📊 Cached Certifications data:', cachedData.certifications)
          console.log('📊 Cached Skills data:', cachedData.skills)
          setResumeData(cachedData)
          setOptimisticData(cachedData)
          setIsLoading(false)
          
          // Still fetch fresh data in background for updates
          setIsPreloading(true)
        }
        
        // Fetch fresh data from backend (same as home page, no auth for now)
        const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.RESUME}`)
        
        if (response.ok) {
          const result = await response.json()
          console.log('📥 Full response from backend:', result)
          if (result.success) {
            console.log('📥 Fresh data loaded from backend:', result.data)
            console.log('📊 Experience data:', result.data.experience)
            console.log('📊 Education data:', result.data.education)
            console.log('📊 Certifications data:', result.data.certifications)
            console.log('📊 Skills data:', result.data.skills)
            
       // Transform backend data to match frontend structure
       const transformedData = {
         ...result.data,
         personalInfo: {
           ...result.data.personalInfo,
           summary: result.data.summary || result.data.personalInfo?.summary || ''
         },
         projects: result.data.projects || []
       }
       
       // Check if data has changed
       const currentData = cachedData || resumeData
       const dataChanged = JSON.stringify(currentData) !== JSON.stringify(transformedData)
       
       if (dataChanged) {
         console.log('🔄 Data changed, updating...')
         setResumeData(transformedData)
         setOptimisticData(transformedData)
         
         // Save to cache with version
         const version = result.timestamp || Date.now().toString()
         saveToCache(transformedData, version)
       } else {
         console.log('✅ Data unchanged, keeping current version')
       }
               } else {
                 console.error('Failed to load resume data:', result.message)
                 if (!cachedData) {
                   console.log('📊 Using default data as fallback')
                   console.log('📊 Default Experience data:', defaultResumeData.experience)
                   console.log('📊 Default Education data:', defaultResumeData.education)
                   console.log('📊 Default Certifications data:', defaultResumeData.certifications)
                   console.log('📊 Default Skills data:', defaultResumeData.skills)
                   
                   // Transform default data to match structure
                   const transformedDefaultData = {
                     ...defaultResumeData,
                     personalInfo: {
                       ...defaultResumeData.personalInfo,
                       summary: defaultResumeData.personalInfo.summary || ''
                     }
                   }
                   
                   setResumeData(transformedDefaultData)
                   setOptimisticData(transformedDefaultData)
                 }
               }
             } else {
               console.error('Failed to fetch resume data:', response.statusText)
               if (!cachedData) {
                 console.log('📊 Using default data as fallback (fetch failed)')
                 
                 // Transform default data to match structure
                 const transformedDefaultData = {
                   ...defaultResumeData,
                   personalInfo: {
                     ...defaultResumeData.personalInfo,
                     summary: defaultResumeData.personalInfo.summary || ''
                   }
                 }
                 
                 setResumeData(transformedDefaultData)
                 setOptimisticData(transformedDefaultData)
               }
             }
           } catch (error) {
             console.error('Error loading resume data:', error)
             const cachedData = loadFromCache()
             if (!cachedData) {
               console.log('📊 Using default data as fallback (error)')
               
               // Transform default data to match structure
               const transformedDefaultData = {
                 ...defaultResumeData,
                 personalInfo: {
                   ...defaultResumeData.personalInfo,
                   summary: defaultResumeData.personalInfo.summary || ''
                 }
               }
               
               setResumeData(transformedDefaultData)
               setOptimisticData(transformedDefaultData)
             }
           } finally {
        setIsLoading(false)
        setIsPreloading(false)
      }
    }

    loadResumeData()
  }, [loadFromCache, saveToCache, resumeData])

  // Optimized input handlers with real-time validation
  const createInputHandler = useCallback((path: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      
      // Use requestAnimationFrame to prevent forced reflows
      requestAnimationFrame(() => {
        if (!optimisticData) return
        
        const newData = { ...optimisticData }
        const keys = path.split('.')
        let current = newData as any
        
        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {}
          current = current[keys[i]]
        }
        
        // Set the value
        current[keys[keys.length - 1]] = value
        
        // Real-time validation
        validateField(path, value, newData)
        
        updateResumeData(newData)
      })
    }
  }, [optimisticData, updateResumeData, validateField])

  // Optimized array update handlers
  const createArrayHandler = useCallback((path: string, index: number, field: string) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      
      // Use requestAnimationFrame to prevent forced reflows
      requestAnimationFrame(() => {
        if (!optimisticData) return
        
        const newData = { ...optimisticData }
        const keys = path.split('.')
        let current = newData as any
        
        // Navigate to the array
        for (const key of keys) {
          current = current[key]
        }
        
        // Update the specific item
        current[index] = { ...current[index], [field]: value }
        updateResumeData(newData)
      })
    }
  }, [optimisticData, updateResumeData])

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      setErrorState(prev => ({ ...prev, hasError: false, message: '' }))
      // Process retry queue when back online
      if (retryQueue.length > 0) {
        console.log('🔄 Network restored, processing retry queue...')
        processRetryQueue()
      }
    }

    const handleOffline = () => {
      setIsOffline(true)
      setErrorState(prev => ({
        ...prev,
        hasError: true,
        message: 'You are offline. Changes will sync when connection is restored.',
        type: 'network',
        lastError: new Date()
      }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial network status
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [retryQueue, processRetryQueue])
  
  // Refs to prevent unnecessary re-renders
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isSavingRef = useRef(false)
  const lastSavedDataRef = useRef<string>('')
  
  // Performance monitoring disabled for testing
  // const [performanceMetrics, setPerformanceMetrics] = useState({
  //   renderCount: 0,
  //   inputChanges: 0,
  //   apiCalls: 0
  // })

  // Debounced save function - only saves when data actually changes
  const debouncedSave = useCallback((data: ResumeData) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Check if data actually changed
    const dataString = JSON.stringify(data)
    if (dataString === lastSavedDataRef.current) {
      return // No changes, skip save
    }

    // Set timeout for debounced save - longer delay for better performance
    saveTimeoutRef.current = setTimeout(async () => {
      if (isSavingRef.current) return // Prevent concurrent saves
      
      try {
        isSavingRef.current = true
        setSaveStatus('saving')
        
        // const result = await updateResume(data).unwrap()
        console.log('Save successful')
        
        setSaveStatus('saved')
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        lastSavedDataRef.current = dataString
        
        // Performance tracking disabled for testing
        // setPerformanceMetrics(prev => ({
        //   ...prev,
        //   apiCalls: prev.apiCalls + 1
        // }))
        
        // Reset to idle after 1.5 seconds
        setTimeout(() => setSaveStatus('idle'), 1500)
      } catch (error: any) {
        console.error('Failed to save resume data:', {
          error: error,
          message: error?.message || 'Unknown error',
          status: error?.status,
          data: error?.data
        })
        setSaveStatus('error')
        
        // Check if it's a read-only filesystem error (backend issue)
        if (error?.data?.error?.includes('EROFS: read-only file system')) {
          console.warn('Backend filesystem is read-only. This is a server-side issue.')
        }
        
        // Reset to idle after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
        isSavingRef.current = false
    }
    }, 1000) // 1 second debounce for immediate saves
  }, [])

  // Auto-save disabled for performance testing
  // useEffect(() => {
  //   if (hasUnsavedChanges && resumeData) {
  //     const currentDataString = JSON.stringify(resumeData)
  //     if (currentDataString !== lastSavedDataRef.current) {
  //       // Auto-save after 2 minutes of inactivity
  //       const autoSaveTimeout = setTimeout(() => {
  //         debouncedSave(resumeData)
  //       }, 120000) // 2 minutes = 120000ms
  //       
  //       return () => clearTimeout(autoSaveTimeout)
  //     }
  //   }
  // }, [hasUnsavedChanges, resumeData, debouncedSave])



  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Manual save function (for immediate save button)
  const saveNow = useCallback(async () => {
    if (!optimisticData) {
      console.error('No resume data to save')
      return
    }
    
    // Clear any pending debounced saves
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    // Force immediate sync
    await syncToBackend(optimisticData)
  }, [optimisticData, syncToBackend])

  // Manual retry function for failed syncs
  const retryFailedSync = useCallback(async () => {
    if (retryQueue.length > 0) {
      console.log('🔄 Manually retrying failed syncs...')
      await processRetryQueue()
    } else if (optimisticData && errorState.hasError) {
      console.log('🔄 Manually retrying current sync...')
      await syncToBackend(optimisticData)
    }
  }, [retryQueue, processRetryQueue, optimisticData, errorState.hasError, syncToBackend])

  // Force refresh data from backend
  const refreshData = useCallback(async () => {
    console.log('🔄 Force refreshing data from backend...')
    clearCache()
    setIsLoading(true)
    
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.RESUME}`)
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          console.log('✅ Fresh data loaded:', result.data)
          setResumeData(result.data)
          setOptimisticData(result.data)
          
          // Save to cache
          const version = result.timestamp || Date.now().toString()
          saveToCache(result.data, version)
        }
      }
    } catch (error) {
      console.error('❌ Failed to refresh data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [clearCache, saveToCache])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            saveNow()
            break
          case 'f':
            e.preventDefault()
            const searchInput = document.querySelector('input[placeholder="Search resume content..."]') as HTMLInputElement
            searchInput?.focus()
            break
          case 'p':
            e.preventDefault()
            setShowPreview(!showPreview)
            break
          case 'e':
            e.preventDefault()
            // Export functionality
            break
        }
      }
      
      // Number keys for tab navigation
      if (e.key >= '1' && e.key <= '6') {
        e.preventDefault()
        const tabs = ['personal', 'experience', 'skills', 'education', 'certifications', 'projects']
        const tabIndex = parseInt(e.key) - 1
        if (tabs[tabIndex]) {
          const tabElement = document.querySelector(`[value="${tabs[tabIndex]}"]`) as HTMLElement
          tabElement?.click()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPreview, saveNow])


  if (isLoading || !optimisticData) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007acc] mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    )
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#1e1e1e] to-[#0d1117] text-[#d4d4d4]">
        {/* Efficient autosave is now handled by useEffect and debouncedSave */}
        {/* Enhanced Dev Tools Header - Responsive */}
        <div className="bg-gradient-to-r from-[#0d1117] via-[#1e1e1e] to-[#0d1117] border-b border-[#30363d] shadow-2xl">
          <div className="p-2 sm:p-4">
            {/* Mobile Header */}
            <div className="flex flex-col lg:hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f57] shadow-sm"></div>
                    <div className="w-2 h-2 rounded-full bg-[#ffbd2e] shadow-sm"></div>
                    <div className="w-2 h-2 rounded-full bg-[#28ca42] shadow-sm"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center shadow-lg">
                      <Terminal className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold bg-gradient-to-r from-[#007acc] to-[#4ec9b0] bg-clip-text text-transparent">
                        Admin
                      </h1>
                      <p className="text-xs text-gray-400">v2.0</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#4ec9b0] to-[#007acc] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{username?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] focus:ring-2 focus:ring-[#4ec9b0]/20"
                />
              </div>
              
              {/* Mobile Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-2 py-1 bg-[#0d1117] rounded-lg border border-[#30363d]">
                  {hasUnsavedChanges ? (
                    <>
                      <AlertCircle className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Unsaved</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">Saved</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  Welcome, {username}
                </div>
              </div>
              
              {/* Mobile Action Buttons - Responsive Layout */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                    className="flex-1 border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button
                  onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                  variant="outline"
                    className="flex-1 border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#d2a8ff] transition-all duration-200 text-xs"
                >
                  <Keyboard className="w-3 h-3 mr-1" />
                  Shortcuts
                </Button>
                </div>
                
                <SaveStatusIndicator
                  status={syncInProgress ? 'saving' : (pendingChanges ? 'saving' : 'saved')}
                  lastSaved={lastSaved}
                  hasUnsavedChanges={!!pendingChanges}
                  onSaveNow={saveNow}
                  className="text-xs"
                />
                {pendingChanges && (
                  <div className="flex items-center gap-1 text-xs text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Syncing...</span>
                  </div>
                )}
                
                {/* Error notification */}
                {errorState.hasError && (
                  <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                    errorState.type === 'network' 
                      ? 'bg-orange-900/20 text-orange-400 border border-orange-500/30'
                      : 'bg-red-900/20 text-red-400 border border-red-500/30'
                  }`}>
                    {errorState.type === 'network' ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span className="max-w-48 truncate">{errorState.message}</span>
                    {retryQueue.length > 0 && (
                      <span className="ml-1 text-xs opacity-75">({retryQueue.length} queued)</span>
                    )}
                    {!isOffline && (retryQueue.length > 0 || errorState.type === 'sync') && (
                <Button 
                        size="sm"
                        variant="outline"
                        onClick={retryFailedSync}
                        className="ml-2 h-6 px-2 text-xs border-current hover:bg-current/10"
                      >
                        Retry
                      </Button>
                    )}
                    
                    {/* Cache management button */}
                    {cacheHit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={clearCache}
                        className="ml-2 h-6 px-2 text-xs border-current hover:bg-current/10"
                        title="Clear cache and reload fresh data"
                      >
                        Clear Cache
                      </Button>
                    )}
                    
                    {/* Refresh data button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={refreshData}
                      disabled={isLoading}
                      className="ml-2 h-6 px-2 text-xs border-current hover:bg-current/10"
                      title="Refresh data from backend"
                    >
                      {isLoading ? '⏳' : '🔄'}
                    </Button>
                    
                    {/* Load sample data button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log('📊 Loading sample data...')
                        setResumeData(defaultResumeData)
                        setOptimisticData(defaultResumeData)
                        saveToCache(defaultResumeData, Date.now().toString())
                      }}
                      className="ml-2 h-6 px-2 text-xs border-current hover:bg-current/10"
                      title="Load sample data for testing"
                    >
                      📝 Sample
                    </Button>
                  </div>
                )}
                
                {/* Offline indicator */}
                {isOffline && (
                  <div className="flex items-center gap-1 text-xs text-orange-400">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Offline</span>
                  </div>
                )}
                
                {/* Cache status indicator */}
                {cacheHit && (
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Cache</span>
                  </div>
                )}
                
                {/* Preloading indicator */}
                {isPreloading && (
                  <div className="flex items-center gap-1 text-xs text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span>Updating...</span>
                  </div>
                )}
                
                {/* Validation indicator */}
                {isValidating && (
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span>Validating...</span>
                  </div>
                )}
                
                {/* Validation errors indicator */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-red-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>{Object.keys(validationErrors).length} error(s)</span>
                  </div>
                )}
                
                {/* Validation warnings indicator */}
                {Object.keys(validationWarnings).length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>{Object.keys(validationWarnings).length} warning(s)</span>
                  </div>
                )}
                
                {/* Validation summary button */}
                {(Object.keys(validationErrors).length > 0 || Object.keys(validationWarnings).length > 0) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const allIssues = { ...validationErrors, ...validationWarnings }
                      console.log('📋 Validation Summary:', allIssues)
                      alert(`Validation Issues:\n\nErrors: ${Object.keys(validationErrors).length}\nWarnings: ${Object.keys(validationWarnings).length}\n\nCheck console for details.`)
                    }}
                    className="ml-2 h-6 px-2 text-xs border-current hover:bg-current/10"
                    title="View validation summary"
                  >
                    📋 Issues
                  </Button>
                )}
                
                {hasUnsavedChanges && (
                <Button 
                    onClick={saveNow}
                    disabled={saveStatus === 'saving'}
                    className="w-full bg-[#238636] hover:bg-[#2ea043] text-white border-0 px-4 py-2 text-xs font-medium transition-all duration-200"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                  <Save className="w-3 h-3 mr-1" />
                        Save Now
                      </>
                    )}
                </Button>
                )}
                
                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white transition-all duration-200 text-xs"
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28ca42] shadow-sm"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-xl flex items-center justify-center shadow-lg">
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#007acc] to-[#4ec9b0] bg-clip-text text-transparent">
                      Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-400">Resume Management System v2.0</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Search Bar - Smaller */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48 bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] focus:ring-2 focus:ring-[#4ec9b0]/20"
                  />
                </div>
                
                {/* Status Indicator - Compact */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] rounded-lg border border-[#30363d]">
                    {hasUnsavedChanges ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400">Unsaved</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">Saved</span>
                      </>
                    )}
                  </div>
                  
                {/* User Info - Compact */}
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-[#1e1e1e] to-[#2d2d30] rounded-lg border border-[#30363d]">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 font-medium">{username}</span>
                  <div className="w-5 h-5 bg-gradient-to-br from-[#4ec9b0] to-[#007acc] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{username?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>

                {/* Action Buttons - Compact */}
                <div className="flex gap-1">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    size="sm"
                    className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200"
                    title="Toggle Preview"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                    variant="outline"
                    size="sm"
                    className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#d2a8ff] transition-all duration-200"
                    title="Keyboard Shortcuts"
                  >
                    <Keyboard className="w-3 h-3" />
                  </Button>
                  
                  {hasUnsavedChanges && (
                  <Button 
                      onClick={saveNow}
                      disabled={saveStatus === 'saving'}
                      size="sm"
                      className="bg-[#238636] hover:bg-[#2ea043] text-white border-0 px-2 transition-all duration-200"
                    >
                      {saveStatus === 'saving' ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                  </Button>
                  )}
                  
                  <Button
                    onClick={() => window.open("/", "_blank")}
                    variant="outline"
                    size="sm"
                    className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200"
                    title="View Resume"
                  >
                    <Activity className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white transition-all duration-200"
                    title="Logout"
                  >
                    <LogOut className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 sm:p-4 lg:p-6">
          {/* Statistics Dashboard */}
          <div className="mb-4 sm:mb-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Experience</p>
                    <p className="text-2xl font-bold text-[#4ec9b0]">{stats.experienceCount}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-[#4ec9b0]" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Skills Count</p>
                    <p className="text-2xl font-bold text-[#007acc]">
                      {(resumeData?.skills?.technologies?.length || 0) + (resumeData?.skills?.frameworks?.length || 0) + (resumeData?.skills?.languages?.length || 0)}
                    </p>
                  </div>
                  <Code className="w-8 h-8 text-[#007acc]" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Education</p>
                    <p className="text-2xl font-bold text-[#d2a8ff]">{stats.educationCount}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-[#d2a8ff]" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Certifications</p>
                    <p className="text-2xl font-bold text-[#ffa657]">{stats.certCount}</p>
                  </div>
                  <Award className="w-8 h-8 text-[#ffa657]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <div className="mb-4 sm:mb-8">
              {/* Mobile Tabs - Scrollable */}
              <div className="lg:hidden">
                <TabsList className="flex w-full bg-[#161b22] border border-[#30363d] rounded-xl p-1 shadow-xl overflow-x-auto scrollbar-hide">
                  <TabsTrigger 
                    value="personal" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px]"
                  >
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Personal</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px]"
                  >
                    <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Experience</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px]"
                  >
                    <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Skills</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px]"
                  >
                    <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Education</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="certifications"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px]"
                  >
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Certs</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px]"
                  >
                    <Terminal className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Projects</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Desktop Tabs */}
              <div className="hidden lg:block">
                <TabsList className="grid w-full grid-cols-6 bg-[#161b22] border border-[#30363d] rounded-xl p-2 shadow-xl">
                  <TabsTrigger 
                    value="personal" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger 
                    value="experience" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skills" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger
                    value="certifications"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Certifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg"
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    Projects
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl hover:shadow-3xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
                  <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-[#8b949e] text-base">
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#007acc] rounded-full"></span>
                        Full Name
                      </label>
                      <Input
                        defaultValue={optimisticData?.personalInfo.name || ''}
                        onChange={createInputHandler('personalInfo.name')}
                        className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12 ${
                          validationErrors['personalInfo.name'] 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : validationWarnings['personalInfo.name']
                            ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20'
                            : ''
                        }`}
                      />
                      {validationErrors['personalInfo.name'] && (
                        <p className="text-xs text-red-400 mt-1">{validationErrors['personalInfo.name']}</p>
                      )}
                      {validationWarnings['personalInfo.name'] && (
                        <p className="text-xs text-yellow-400 mt-1">{validationWarnings['personalInfo.name']}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#4ec9b0] rounded-full"></span>
                        Email
                      </label>
                      <Input
                        value={optimisticData?.personalInfo.email || ''}
                        onChange={createInputHandler('personalInfo.email')}
                        className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] focus:ring-2 focus:ring-[#4ec9b0]/20 transition-all duration-200 hover:border-[#007acc] h-12 ${
                          validationErrors['personalInfo.email'] 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : validationWarnings['personalInfo.email']
                            ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20'
                            : ''
                        }`}
                      />
                      {validationErrors['personalInfo.email'] && (
                        <p className="text-xs text-red-400 mt-1">{validationErrors['personalInfo.email']}</p>
                      )}
                      {validationWarnings['personalInfo.email'] && (
                        <p className="text-xs text-yellow-400 mt-1">{validationWarnings['personalInfo.email']}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#f85149] rounded-full"></span>
                        Phone
                      </label>
                      <Input
                        value={optimisticData?.personalInfo.phone || ''}
                        onChange={createInputHandler('personalInfo.phone')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#f85149] focus:ring-2 focus:ring-[#f85149]/20 transition-all duration-200 hover:border-[#ffa657] h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ffa657] rounded-full"></span>
                        Location
                      </label>
                      <Input
                        value={optimisticData?.personalInfo.location || ''}
                        onChange={createInputHandler('personalInfo.location')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] focus:ring-2 focus:ring-[#ffa657]/20 transition-all duration-200 hover:border-[#f85149] h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#a5d6ff] rounded-full"></span>
                        LinkedIn
                      </label>
                      <Input
                        value={optimisticData?.personalInfo.linkedin || ''}
                        onChange={createInputHandler('personalInfo.linkedin')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#a5d6ff] focus:ring-2 focus:ring-[#a5d6ff]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#7ee787] rounded-full"></span>
                        GitHub
                      </label>
                      <Input
                        value={optimisticData?.personalInfo.github || ''}
                        onChange={createInputHandler('personalInfo.github')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#7ee787] focus:ring-2 focus:ring-[#7ee787]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                      />
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#d2a8ff] rounded-full"></span>
                      Professional Summary
                    </label>
                    <Textarea
                      value={optimisticData?.personalInfo.summary || ''}
                      onChange={createInputHandler('personalInfo.summary')}
                      className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#d2a8ff] focus:ring-2 focus:ring-[#d2a8ff]/20 transition-all duration-200 hover:border-[#4ec9b0] min-h-[120px]"
                      placeholder="Write a brief professional summary..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
                  <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4ec9b0] to-[#007acc] rounded-lg flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    Work Experience
                  </CardTitle>
                  <CardDescription className="text-[#8b949e] text-base">
                    Manage your professional work history
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {optimisticData?.experience?.map((exp, index) => (
                      <div key={exp.id} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#4ec9b0] transition-all duration-200">
                        {editingExperience === index ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-[#4ec9b0] flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Editing Experience
                              </h3>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingExperience(null)}
                                  className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#4ec9b0]"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingExperience(null)}
                                  className="bg-[#238636] hover:bg-[#2ea043] text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Job Title</label>
                                <Input
                                  value={exp.title}
                                  onChange={createArrayHandler('experience', index, 'title')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0]"
                                  placeholder="e.g., Senior Developer"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Company</label>
                                <Input
                                  value={exp.company}
                                  onChange={createArrayHandler('experience', index, 'company')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0]"
                                  placeholder="e.g., Tech Corp"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Start Date</label>
                                <Input
                                  value={exp.startDate}
                                  onChange={createArrayHandler('experience', index, 'startDate')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0]"
                                  placeholder="e.g., Jan 2023"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">End Date</label>
                                <Input
                                  value={exp.endDate}
                                  onChange={createArrayHandler('experience', index, 'endDate')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0]"
                                  placeholder="e.g., Present"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Description</label>
                              <Textarea
                                value={exp.description}
                                onChange={createArrayHandler('experience', index, 'description')}
                                className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] min-h-[100px]"
                                placeholder="Describe your role and responsibilities..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Technologies</label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {exp.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} className="bg-[#21262d] text-[#4ec9b0] border-[#30363d] flex items-center gap-1">
                                    {tech}
                                    <button
                                      onClick={() => {
                                        if (!optimisticData) return
                                        const newTechnologies = exp.technologies.filter((_, i) => i !== techIndex)
                                        const newData = { ...optimisticData }
                                        newData.experience[index] = { ...newData.experience[index], technologies: newTechnologies }
                                        updateResumeData(newData)
                                      }}
                                      className="ml-1 hover:text-[#f85149] transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add technology (press Enter)"
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] flex-1"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      const input = e.target as HTMLInputElement
                                      const newTech = input.value.trim()
                                      if (newTech && !exp.technologies.includes(newTech)) {
                                        if (!optimisticData) return
                                        const newData = { ...optimisticData }
                                        newData.experience[index] = { 
                                          ...newData.experience[index], 
                                          technologies: [...exp.technologies, newTech] 
                                        }
                                        updateResumeData(newData)
                                        input.value = ''
                                      }
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const input = document.querySelector(`input[placeholder="Add technology (press Enter)"]`) as HTMLInputElement
                                    if (input) {
                                      const newTech = input.value.trim()
                                      if (newTech && !exp.technologies.includes(newTech)) {
                                        if (!optimisticData) return
                                        const newData = { ...optimisticData }
                                        newData.experience[index] = { 
                                          ...newData.experience[index], 
                                          technologies: [...exp.technologies, newTech] 
                                        }
                                        updateResumeData(newData)
                                        input.value = ''
                                      }
                                    }
                                  }}
                                  className="bg-[#007acc] hover:bg-[#4ec9b0] text-white"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Achievements</label>
                              <div className="space-y-2">
                                {(exp.achievements || []).map((achievement, achIndex) => (
                                  <div key={achIndex} className="flex items-center gap-2">
                                    <Input
                                      value={achievement}
                                      onChange={(e) => {
                                        if (!optimisticData) return
                                        const newData = { ...optimisticData }
                                        if (!newData.experience[index].achievements) {
                                          newData.experience[index].achievements = []
                                        }
                                        newData.experience[index].achievements![achIndex] = e.target.value
                                        updateResumeData(newData)
                                      }}
                                      className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] flex-1"
                                      placeholder="Describe a key achievement..."
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        if (!optimisticData) return
                                        const newData = { ...optimisticData }
                                        newData.experience[index].achievements = newData.experience[index].achievements!.filter((_, i) => i !== achIndex)
                                        updateResumeData(newData)
                                      }}
                                      className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (!optimisticData) return
                                  const newData = { ...optimisticData }
                                  if (!newData.experience[index].achievements) {
                                    newData.experience[index].achievements = []
                                  }
                                  newData.experience[index].achievements = [...newData.experience[index].achievements, '']
                                  updateResumeData(newData)
                                }}
                                className="mt-2 border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#4ec9b0]"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Add Achievement
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#d4d4d4] mb-1">{exp.title}</h3>
                            <p className="text-[#4ec9b0] font-medium">{exp.company}</p>
                            <p className="text-sm text-[#8b949e]">{exp.startDate} - {exp.endDate}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                                  onClick={() => setEditingExperience(index)}
                              className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#4ec9b0]"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                                  Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                    if (!optimisticData) return
                                    const newExperience = optimisticData.experience.filter((_, i) => i !== index)
                                    updateResumeData({ ...optimisticData, experience: newExperience })
                              }}
                              className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-[#8b949e] mb-4">{exp.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} className="bg-[#21262d] text-[#4ec9b0] border-[#30363d] hover:bg-[#4ec9b0] hover:text-[#0d1117] transition-colors">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                            {exp.achievements && exp.achievements.length > 0 && exp.achievements.some(ach => ach.trim() !== '') && (
                              <div className="mt-4">
                                <h4 className="text-sm font-semibold text-[#d4d4d4] mb-2">Key Achievements:</h4>
                                <ul className="space-y-1">
                                  {exp.achievements.filter(ach => ach.trim() !== '').map((achievement, achIndex) => (
                                    <li key={achIndex} className="text-sm text-[#8b949e] flex items-start gap-2">
                                      <span className="w-1.5 h-1.5 bg-[#4ec9b0] rounded-full mt-2 flex-shrink-0"></span>
                                      {achievement}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        if (!optimisticData) return
                        const newExp = {
                          id: optimisticData.experience.length,
                          company: "",
                          title: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                          technologies: [],
                          achievements: [""], // Initialize with one empty achievement
                        }
                        updateResumeData({ ...optimisticData, experience: [...optimisticData.experience, newExp] })
                        setEditingExperience(optimisticData.experience.length)
                      }}
                      className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
                  <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#f85149] to-[#ffa657] rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-white" />
                    </div>
                    Technical Skills
                  </CardTitle>
                  <CardDescription className="text-[#8b949e] text-base">
                    Manage your technical and soft skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#d4d4d4] flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#007acc] rounded-full"></span>
                        Technical Skills
                      </h3>
                      <div className="space-y-2">
                        {resumeData?.skills?.technologies?.map((skill: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                if (resumeData) {
                                const newSkills = [...(resumeData.skills?.technologies || [])]
                                newSkills[index] = e.target.value
                                updateResumeData({
                                  ...resumeData,
                                  skills: { ...resumeData.skills, technologies: newSkills },
                                })
                                }
                              }}
                              className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] h-10"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (resumeData) {
                                  const newTechnicalSkills = resumeData.skills.technologies.filter((_: string, i: number) => i !== index)
                                updateResumeData({
                                  ...resumeData,
                                    skills: { ...resumeData.skills, technologies: newTechnicalSkills },
                                })
                                }
                              }}
                              className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            if (resumeData) {
                            updateResumeData({
                              ...resumeData,
                              skills: { ...resumeData.skills, technologies: [...resumeData.skills.technologies, ""] },
                            })
                            }
                          }}
                          className="w-full border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Technical Skill
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#d4d4d4] flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#4ec9b0] rounded-full"></span>
                        Frameworks
                      </h3>
                      <div className="space-y-2">
                        {resumeData?.skills?.frameworks?.map((skill: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                if (resumeData) {
                                const newSkills = [...(resumeData.skills?.frameworks || [])]
                                newSkills[index] = e.target.value
                                updateResumeData({
                                  ...resumeData,
                                  skills: { ...resumeData.skills, frameworks: newSkills },
                                })
                                }
                              }}
                              className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] h-10"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (resumeData) {
                                  const newSoftSkills = resumeData.skills.frameworks.filter((_: string, i: number) => i !== index)
                                updateResumeData({
                                  ...resumeData,
                                    skills: { ...resumeData.skills, frameworks: newSoftSkills },
                                })
                                }
                              }}
                              className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            if (resumeData) {
                            updateResumeData({
                              ...resumeData,
                              skills: { ...resumeData.skills, frameworks: [...resumeData.skills.frameworks, ""] },
                            })
                            }
                          }}
                          className="w-full border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Framework
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
                  <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#d2a8ff] to-[#a5d6ff] rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    Education
                  </CardTitle>
                  <CardDescription className="text-[#8b949e] text-base">
                    Manage your educational background
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {optimisticData?.education?.map((edu, index) => (
                      <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#d2a8ff] transition-all duration-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Degree</label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => {
                                if (!optimisticData) return
                                const newEducation = [...optimisticData.education]
                                newEducation[index] = { ...edu, degree: e.target.value }
                                updateResumeData({ ...optimisticData, education: newEducation })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#d2a8ff] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Institution</label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => {
                                if (!optimisticData) return
                                const newEducation = [...optimisticData.education]
                                newEducation[index] = { ...edu, institution: e.target.value }
                                updateResumeData({ ...optimisticData, education: newEducation })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#d2a8ff] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Year</label>
                            <Input
                              value={edu.year}
                              onChange={(e) => {
                                if (!optimisticData) return
                                const newEducation = [...optimisticData.education]
                                newEducation[index] = { ...edu, year: e.target.value }
                                updateResumeData({ ...optimisticData, education: newEducation })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#d2a8ff] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">GPA (Optional)</label>
                            <Input
                              value={edu.gpa || ""}
                              onChange={(e) => {
                                if (!optimisticData) return
                                const newEducation = [...optimisticData.education]
                                newEducation[index] = { ...edu, gpa: e.target.value }
                                updateResumeData({ ...optimisticData, education: newEducation })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#d2a8ff] h-10"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (!optimisticData) return
                              const newEducation = optimisticData.education.filter((_, i) => i !== index)
                              updateResumeData({ ...optimisticData, education: newEducation })
                            }}
                            className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        if (!optimisticData) return
                        const newEdu = { degree: "", institution: "", year: "", gpa: "" }
                        updateResumeData({ ...optimisticData, education: [...optimisticData.education, newEdu] })
                      }}
                      className="w-full bg-gradient-to-r from-[#d2a8ff] to-[#a5d6ff] hover:from-[#a5d6ff] hover:to-[#d2a8ff] text-white h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="space-y-6">
              <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
                  <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#ffa657] to-[#f85149] rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    Certifications
                  </CardTitle>
                  <CardDescription className="text-[#8b949e] text-base">
                    Manage your professional certifications and pathways
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {optimisticData?.certifications?.map((cert, index) => (
                      <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#ffa657] transition-all duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Certification Name</label>
                            <Input
                              value={cert.name}
                              onChange={(e) => {
                                const newCerts = [...optimisticData!.certifications]
                                newCerts[index] = { ...cert, name: e.target.value }
                                updateResumeData({ ...optimisticData!, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Issuer</label>
                            <Input
                              value={cert.issuer}
                              onChange={(e) => {
                                const newCerts = [...optimisticData!.certifications]
                                newCerts[index] = { ...cert, issuer: e.target.value }
                                updateResumeData({ ...optimisticData!, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Status</label>
                            <Input
                              value={cert.status}
                              onChange={(e) => {
                                const newCerts = [...optimisticData!.certifications]
                                newCerts[index] = { ...cert, status: e.target.value }
                                updateResumeData({ ...optimisticData!, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Icon</label>
                            <Input
                              value={cert.icon}
                              onChange={(e) => {
                                const newCerts = [...optimisticData!.certifications]
                                newCerts[index] = { ...cert, icon: e.target.value }
                                updateResumeData({ ...optimisticData!, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Color</label>
                            <Input
                              value={cert.color}
                              onChange={(e) => {
                                const newCerts = [...optimisticData!.certifications]
                                newCerts[index] = { ...cert, color: e.target.value }
                                updateResumeData({ ...optimisticData!, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Verify URL</label>
                            <Input
                              value={cert.verify}
                              onChange={(e) => {
                                const newCerts = [...optimisticData!.certifications]
                                newCerts[index] = { ...cert, verify: e.target.value }
                                updateResumeData({ ...optimisticData!, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Description</label>
                          <Textarea
                            value={cert.description}
                            onChange={(e) => {
                              const newCerts = [...optimisticData!.certifications]
                              newCerts[index] = { ...cert, description: e.target.value }
                              updateResumeData({ ...optimisticData!, certifications: newCerts })
                            }}
                            className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] min-h-[80px]"
                            placeholder="Describe the certification..."
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Skills</label>
                          <div className="space-y-2">
                            {(cert.skills || []).map((skill, skillIndex) => (
                              <div key={skillIndex} className="flex items-center gap-2">
                                <Input
                                  value={skill}
                                  onChange={(e) => {
                                    const newCerts = [...optimisticData!.certifications]
                                    const newSkills = [...(cert.skills || [])]
                                    newSkills[skillIndex] = e.target.value
                                    newCerts[index] = { ...cert, skills: newSkills }
                                    updateResumeData({ ...optimisticData!, certifications: newCerts })
                                  }}
                                  className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-8"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newCerts = [...optimisticData!.certifications]
                                    const newSkills = (cert.skills || []).filter((_, i) => i !== skillIndex)
                                    newCerts[index] = { ...cert, skills: newSkills }
                                    updateResumeData({ ...optimisticData!, certifications: newCerts })
                                  }}
                                  className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white h-8 px-2"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              onClick={() => {
                                const newCerts = [...optimisticData!.certifications]
                                const newSkills = [...(cert.skills || []), ""]
                                newCerts[index] = { ...cert, skills: newSkills }
                                updateResumeData({ ...optimisticData!, certifications: newCerts })
                              }}
                              className="w-full border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] h-8"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Skill
                            </Button>
                          </div>
                        </div>

                        {/* Pathway Section */}
                        {cert.pathway && cert.pathway.length > 0 && (
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Pathway Courses</label>
                            <div className="space-y-3">
                              {cert.pathway.map((path, pathIndex) => (
                                <div key={pathIndex} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs text-gray-400 mb-1">Course Name</label>
                                      <Input
                                        value={path.name}
                                        onChange={(e) => {
                                          const newCerts = [...optimisticData!.certifications]
                                          const newPathway = [...(cert.pathway || [])]
                                          newPathway[pathIndex] = { ...path, name: e.target.value }
                                          newCerts[index] = { ...cert, pathway: newPathway }
                                          updateResumeData({ ...optimisticData!, certifications: newCerts })
                                        }}
                                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-400 mb-1">Status</label>
                                      <Input
                                        value={path.status}
                                        onChange={(e) => {
                                          const newCerts = [...optimisticData!.certifications]
                                          const newPathway = [...(cert.pathway || [])]
                                          newPathway[pathIndex] = { ...path, status: e.target.value }
                                          newCerts[index] = { ...cert, pathway: newPathway }
                                          updateResumeData({ ...optimisticData!, certifications: newCerts })
                                        }}
                                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-8 text-sm"
                                      />
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className="block text-xs text-gray-400 mb-1">Description</label>
                                      <Input
                                        value={path.description}
                                        onChange={(e) => {
                                          const newCerts = [...optimisticData!.certifications]
                                          const newPathway = [...(cert.pathway || [])]
                                          newPathway[pathIndex] = { ...path, description: e.target.value }
                                          newCerts[index] = { ...cert, pathway: newPathway }
                                          updateResumeData({ ...optimisticData!, certifications: newCerts })
                                        }}
                                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-8 text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-2 flex justify-end">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const newCerts = [...optimisticData!.certifications]
                                        const newPathway = (cert.pathway || []).filter((_, i) => i !== pathIndex)
                                        newCerts[index] = { ...cert, pathway: newPathway }
                                        updateResumeData({ ...optimisticData!, certifications: newCerts })
                                      }}
                                      className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white h-6 px-2"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              <Button
                                onClick={() => {
                                  const newCerts = [...optimisticData!.certifications]
                                  const newPathway = [...(cert.pathway || []), {
                                    name: "",
                                    issuer: cert.issuer,
                                    icon: cert.icon,
                                    status: "",
                                    description: "",
                                    color: cert.color,
                                    skills: [],
                                    verify: ""
                                  }]
                                  newCerts[index] = { ...cert, pathway: newPathway }
                                  updateResumeData({ ...optimisticData!, certifications: newCerts })
                                }}
                                className="w-full border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] h-8"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Pathway Course
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <Button
                            onClick={() => {
                              const newCerts = [...optimisticData!.certifications]
                              const newPathway = [...(cert.pathway || []), {
                                name: "",
                                issuer: cert.issuer,
                                icon: cert.icon,
                                status: "",
                                description: "",
                                color: cert.color,
                                skills: [],
                                verify: ""
                              }]
                              newCerts[index] = { ...cert, pathway: newPathway }
                              updateResumeData({ ...optimisticData!, certifications: newCerts })
                            }}
                            className="border-[#4ec9b0] text-[#4ec9b0] hover:bg-[#4ec9b0] hover:text-[#0d1117]"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Pathway
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (!optimisticData) return
                              const newCerts = optimisticData.certifications.filter((_, i) => i !== index)
                              updateResumeData({ ...optimisticData, certifications: newCerts })
                            }}
                            className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        const newCert = {
                          name: "",
                          issuer: "",
                          icon: "",
                          status: "",
                          description: "",
                          color: "",
                          skills: [],
                          verify: "",
                          pathway: []
                        }
                        updateResumeData({ ...optimisticData!, certifications: [...optimisticData!.certifications, newCert] })
                      }}
                      className="w-full bg-gradient-to-r from-[#ffa657] to-[#f85149] hover:from-[#f85149] hover:to-[#ffa657] text-white h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
                  <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-white" />
                    </div>
                    Projects
                  </CardTitle>
                  <CardDescription className="text-[#8b949e] text-base">
                    Manage your portfolio projects and showcase your work
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {optimisticData?.projects?.map((project, index) => (
                      <div key={project.id} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#007acc] transition-all duration-200">
                        {editingProject === index ? (
                          // Edit Mode
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-[#007acc] flex items-center gap-2">
                                <Edit className="w-4 h-4" />
                                Editing Project
                              </h3>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingProject(null)}
                                  className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#007acc]"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingProject(null)}
                                  className="bg-[#238636] hover:bg-[#2ea043] text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Project Name</label>
                                <Input
                                  value={project.name}
                                  onChange={createArrayHandler('projects', index, 'name')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                                  placeholder="e.g., E-Commerce Platform"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Status</label>
                                <Input
                                  value={project.status || ''}
                                  onChange={createArrayHandler('projects', index, 'status')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                                  placeholder="e.g., Live, Development, Completed"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Year</label>
                                <Input
                                  value={project.year || ''}
                                  onChange={createArrayHandler('projects', index, 'year')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                                  placeholder="e.g., 2023-2024"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">GitHub URL</label>
                                <Input
                                  value={project.githubUrl || ''}
                                  onChange={createArrayHandler('projects', index, 'githubUrl')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                                  placeholder="https://github.com/username/repo"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Live URL</label>
                                <Input
                                  value={project.liveUrl || ''}
                                  onChange={createArrayHandler('projects', index, 'liveUrl')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                                  placeholder="https://your-project.com"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Image URL</label>
                                <Input
                                  value={project.imageUrl || ''}
                                  onChange={createArrayHandler('projects', index, 'imageUrl')}
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                                  placeholder="https://example.com/image.jpg"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Description</label>
                              <Textarea
                                value={project.description}
                                onChange={createArrayHandler('projects', index, 'description')}
                                className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] min-h-[120px]"
                                placeholder="Describe your project, its features, and impact..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Technologies</label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {project.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} className="bg-[#21262d] text-[#007acc] border-[#30363d] flex items-center gap-1">
                                    {tech}
                                    <button
                                      onClick={() => {
                                        if (!optimisticData) return
                                        const newTechnologies = project.technologies.filter((_, i) => i !== techIndex)
                                        const newData = { ...optimisticData }
                                        newData.projects[index] = { ...newData.projects[index], technologies: newTechnologies }
                                        updateResumeData(newData)
                                      }}
                                      className="ml-1 hover:text-[#f85149] transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add technology (press Enter)"
                                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] flex-1"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      const input = e.target as HTMLInputElement
                                      const newTech = input.value.trim()
                                      if (newTech && !project.technologies.includes(newTech)) {
                                        if (!optimisticData) return
                                        const newData = { ...optimisticData }
                                        newData.projects[index] = { 
                                          ...newData.projects[index], 
                                          technologies: [...project.technologies, newTech] 
                                        }
                                        updateResumeData(newData)
                                        input.value = ''
                                      }
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const input = document.querySelector(`input[placeholder="Add technology (press Enter)"]`) as HTMLInputElement
                                    if (input) {
                                      const newTech = input.value.trim()
                                      if (newTech && !project.technologies.includes(newTech)) {
                                        if (!optimisticData) return
                                        const newData = { ...optimisticData }
                                        newData.projects[index] = { 
                                          ...newData.projects[index], 
                                          technologies: [...project.technologies, newTech] 
                                        }
                                        updateResumeData(newData)
                                        input.value = ''
                                      }
                                    }
                                  }}
                                  className="bg-[#007acc] hover:bg-[#4ec9b0] text-white"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[#d4d4d4] mb-1">{project.name}</h3>
                                <div className="flex items-center gap-4 text-sm text-[#8b949e] mb-2">
                                  {project.status && (
                                    <span className="px-2 py-1 bg-[#21262d] rounded text-[#007acc]">
                                      {project.status}
                                    </span>
                                  )}
                                  {project.year && (
                                    <span>{project.year}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  {project.githubUrl && (
                                    <a 
                                      href={project.githubUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[#007acc] hover:text-[#4ec9b0] transition-colors"
                                    >
                                      GitHub
                                    </a>
                                  )}
                                  {project.liveUrl && (
                                    <a 
                                      href={project.liveUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[#007acc] hover:text-[#4ec9b0] transition-colors"
                                    >
                                      Live Demo
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingProject(index)}
                                  className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#007acc]"
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (!optimisticData) return
                                    const newProjects = optimisticData.projects.filter((_, i) => i !== index)
                                    updateResumeData({ ...optimisticData, projects: newProjects })
                                  }}
                                  className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-[#8b949e] mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} className="bg-[#21262d] text-[#007acc] border-[#30363d] hover:bg-[#007acc] hover:text-[#0d1117] transition-colors">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        if (!optimisticData) return
                        const newProject = {
                          id: optimisticData.projects.length + 1,
                          name: "",
                          description: "",
                          technologies: [],
                          status: "",
                          year: "",
                          githubUrl: "",
                          liveUrl: "",
                          imageUrl: ""
                        }
                        updateResumeData({ ...optimisticData, projects: [...optimisticData.projects, newProject] })
                        setEditingProject(optimisticData.projects.length)
                      }}
                      className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Keyboard Shortcuts Modal - Responsive */}
        {showKeyboardShortcuts && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <Card className="w-full max-w-2xl bg-[#161b22] border-[#30363d] shadow-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
                <CardTitle className="text-[#d4d4d4] flex items-center gap-2 text-lg sm:text-xl">
                  <Keyboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#d2a8ff]" />
                  Keyboard Shortcuts
                </CardTitle>
                <CardDescription className="text-[#8b949e] text-sm">
                  Available keyboard shortcuts for faster navigation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#d4d4d4] mb-3">General</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Save changes</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+S</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Search content</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+F</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Toggle preview</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+P</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Export resume</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+E</kbd>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#d4d4d4] mb-3">Navigation</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Personal Info</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">1</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Experience</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">2</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Skills</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">3</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Education</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">4</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Certifications</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">5</kbd>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Projects</span>
                        <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">6</kbd>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#30363d]">
                  <Button
                    onClick={() => setShowKeyboardShortcuts(false)}
                    className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Status Bar - Responsive */}
        <div className="bg-[#0d1117] border-t border-[#30363d] px-2 sm:px-4 py-2">
          {/* Mobile Status Bar */}
          <div className="flex flex-col sm:hidden space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300">Ready</span>
              </div>
              <div className="text-xs text-gray-400">
                {stats.experienceCount} exp • {stats.skillCount} skills
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Database className="w-3 h-3 text-[#4ec9b0]" />
                <span className="text-gray-400">Data Loaded</span>
              </div>
              <div className="text-gray-500">© 2025</div>
            </div>
          </div>

          {/* Desktop Status Bar */}
          <div className="hidden sm:flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300">Admin Panel Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#4ec9b0]" />
                <span className="text-gray-400">Resume Data Loaded</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#ffa657]" />
                <span className="text-gray-400">Auto-save: Disabled</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#4ec9b0]" />
                <span className="text-gray-400">Performance: Optimized</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-gray-400">
                {stats.experienceCount} experiences • {stats.skillCount} skills • {stats.educationCount} education
              </div>
              <div className="text-gray-500">
                © 2025 Mina Youaness Admin Panel
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}