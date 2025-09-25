"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/context/AuthContext"
import { config } from "@/lib/config"
import { ResumeData, AdminStats, ErrorState, CommitHistory, SaveStatus } from "./types"
import AdminHeader from "./AdminHeader"
import AdminFooter from "./AdminFooter"
import StatisticsDashboard from "./StatisticsDashboard"
import AdminTabs from "./AdminTabs"
import VersionHistoryModal from "./VersionHistoryModal"
import KeyboardShortcutsModal from "./KeyboardShortcutsModal"

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
}

export default function AdminPage() {
  const { username, isAuthenticated, logout } = useAuth()
  
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
  const [activeTab, setActiveTab] = useState("personal")

  // Save status state
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Enhanced error handling state
  const [errorState, setErrorState] = useState<ErrorState>({
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
  }>({
    data: null,
    timestamp: 0
  })
  
  const [isPreloading, setIsPreloading] = useState(false)
  const [cacheHit, setCacheHit] = useState(false)
  
  // Data validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)
  
  // Version Control State
  const [commitHistory, setCommitHistory] = useState<CommitHistory[]>([])
  const [currentCommitIndex, setCurrentCommitIndex] = useState(0)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)

  // Cache management functions
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  const CACHE_KEY = 'resume_data_cache'
  
  const saveToCache = useCallback((data: ResumeData, version?: string) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      version: version || Date.now().toString()
    }
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
      setDataCache(cacheData)
    } catch (error) {
      console.warn('Failed to save to cache:', error)
    }
  }, [])

  const loadFromCache = useCallback((): ResumeData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const cacheData = JSON.parse(cached)
        const isExpired = Date.now() - cacheData.timestamp > CACHE_DURATION
        if (!isExpired) {
          setCacheHit(true)
          return cacheData.data
        }
      }
    } catch (error) {
      console.warn('Failed to load from cache:', error)
    }
    setCacheHit(false)
    return null
  }, [])

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY)
      setDataCache({ data: null, timestamp: 0 })
      setCacheHit(false)
    } catch (error) {
      console.warn('Failed to clear cache:', error)
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

    // Projects Validation
    data.projects?.forEach((project, index) => {
      if (!validateRequired(project.name || '')) {
        errors[`projects.${index}.name`] = 'Project name is required'
      }
      if (project.year && new Date(project.year) > new Date()) {
        errors[`projects.${index}.year`] = 'Project year cannot be in the future'
      }
      if (project.githubUrl && !validateURL(project.githubUrl)) {
        errors[`projects.${index}.githubUrl`] = 'Please enter a valid GitHub URL'
      }
      if (project.liveUrl && !validateURL(project.liveUrl)) {
        errors[`projects.${index}.liveUrl`] = 'Please enter a valid live URL'
      }
      if (project.imageUrl && !validateURL(project.imageUrl)) {
        errors[`projects.${index}.imageUrl`] = 'Please enter a valid image URL'
      }
      if (!validateMinLength(project.description || '', 20)) {
        warnings[`projects.${index}.description`] = 'Project description should be more detailed'
      }
    })

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
      case 'projects.name':
        if (!validateRequired(value)) {
          newErrors[path] = 'Project name is required'
        }
        break
      case 'projects.year':
        if (value && new Date(value) > new Date()) {
          newErrors[path] = 'Project year cannot be in the future'
        }
        break
      case 'projects.githubUrl':
        if (value && !validateURL(value)) {
          newErrors[path] = 'Please enter a valid GitHub URL'
        }
        break
      case 'projects.liveUrl':
        if (value && !validateURL(value)) {
          newErrors[path] = 'Please enter a valid live URL'
        }
        break
      case 'projects.imageUrl':
        if (value && !validateURL(value)) {
          newErrors[path] = 'Please enter a valid image URL'
        }
        break
      case 'projects.description':
        if (value && !validateMinLength(value, 20)) {
          newWarnings[path] = 'Project description should be more detailed'
        }
        break
    }

    setValidationErrors(newErrors)
    setValidationWarnings(newWarnings)
  }, [validationErrors, validationWarnings])

  // Load resume data from backend
  const loadResumeData = useCallback(async () => {
    try {
      setIsLoading(true)
      setErrorState({ hasError: false, message: '', type: 'unknown', retryCount: 0, lastError: null })
      
      // Try cache first
      const cachedData = loadFromCache()
      if (cachedData) {
        console.log('📦 Using cached data')
        setResumeData(cachedData)
        setOptimisticData(cachedData)
        setCacheHit(true)
        setIsLoading(false)
        
        // Preload fresh data in background
        setIsPreloading(true)
      }
      
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.PUBLIC_RESUME}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📥 Full response from backend:', result)
      
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
        setOptimisticData(transformedData)
        saveToCache(transformedData)
        setCacheHit(false)
        console.log('✅ Data loaded and cached successfully')
      } else {
        throw new Error(result.message || 'Failed to fetch resume data')
      }
    } catch (error) {
      console.error('❌ Error loading resume data:', error)
      setErrorState({ 
        hasError: true, 
        message: `Error loading resume data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'network',
        retryCount: 0,
        lastError: new Date()
      })
      
      // Fallback to default data
      setResumeData(defaultResumeData)
      setOptimisticData(defaultResumeData)
    } finally {
      setIsLoading(false)
      setIsPreloading(false)
    }
  }, [loadFromCache, saveToCache])

  // Calculate stats
  const stats: AdminStats = useMemo(() => {
    if (!optimisticData) return {
      experienceCount: 0,
      skillCount: 0,
      educationCount: 0,
      certificationCount: 0,
      projectCount: 0
    }

    return {
      experienceCount: optimisticData.experience?.length || 0,
      skillCount: (optimisticData.skills?.technologies?.length || 0) + 
                 (optimisticData.skills?.frameworks?.length || 0) + 
                 (optimisticData.skills?.languages?.length || 0),
      educationCount: optimisticData.education?.length || 0,
      certificationCount: optimisticData.certifications?.length || 0,
      projectCount: optimisticData.projects?.length || 0
    }
  }, [optimisticData])

  // Update resume data function
  const updateResumeData = useCallback((newData: ResumeData) => {
    setOptimisticData(newData)
    setHasUnsavedChanges(true)
    
    // Debounced save
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      syncToBackend(newData)
    }, 500) // 500ms debounce
  }, [])

  // Sync to backend function
  const syncToBackend = useCallback(async (data: ResumeData) => {
    try {
      setSyncInProgress(true)
      setErrorState({ hasError: false, message: '', type: 'unknown', retryCount: 0, lastError: null })
      
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
      
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.RESUME}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setResumeData(data)
          setPendingChanges(null)
          setHasUnsavedChanges(false)
          setLastSaved(new Date())
          setSaveStatus('saved')
          saveToCache(data)
          console.log('✅ Data synced successfully')
        } else {
          throw new Error(result.message || 'Failed to save data')
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Sync failed:', error)
      setErrorState({ 
        hasError: true, 
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'sync',
        retryCount: 0,
        lastError: new Date()
      })
      setSaveStatus('error')
      
      // Add to retry queue
      setRetryQueue(prev => [...prev, data])
    } finally {
      setSyncInProgress(false)
      setIsValidating(false)
    }
  }, [saveToCache, validateResumeData])

  // Timeout refs
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load data on mount
  useEffect(() => {
    loadResumeData()
  }, [loadResumeData])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Manual save function
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

  // Version Control Functions
  const loadCommitHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true)
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.RESUME_HISTORY}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (result.success) {
        setCommitHistory(result.history)
        setCurrentCommitIndex(0) // Most recent commit
        console.log('📚 Commit history loaded:', result.history.length, 'commits')
      } else {
        throw new Error(result.message || 'Failed to load commit history')
      }
    } catch (error) {
      console.error('❌ Error loading commit history:', error)
      setErrorState({ 
        hasError: true, 
        message: `Error loading commit history: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'network',
        retryCount: 0,
        lastError: new Date()
      })
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  const restoreFromCommit = useCallback(async (commitSha: string) => {
    try {
      setSaveStatus('saving')
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.RESUME_RESTORE}&commit=${commitSha}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (result.success) {
        // Reload data after restore
        await loadResumeData()
        setSaveStatus('saved')
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        console.log('✅ Restored from commit:', commitSha)
      } else {
        throw new Error(result.message || 'Failed to restore from commit')
      }
    } catch (error) {
      console.error('❌ Error restoring from commit:', error)
      setSaveStatus('error')
      setErrorState({ 
        hasError: true, 
        message: `Error restoring from commit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'network',
        retryCount: 0,
        lastError: new Date()
      })
    }
  }, [loadResumeData])

  const previewCommit = useCallback(async (commitSha: string) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.RESUME_PREVIEW}&commit=${commitSha}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (result.success) {
        // Transform and set preview data
        const transformedData = {
          ...result.data,
          personalInfo: {
            ...result.data.personalInfo,
            summary: result.data.summary || result.data.personalInfo?.summary || ''
          },
          projects: result.data.projects || []
        }
        setOptimisticData(transformedData)
        console.log('👁️ Previewing commit:', commitSha)
      } else {
        throw new Error(result.message || 'Failed to preview commit')
      }
    } catch (error) {
      console.error('❌ Error previewing commit:', error)
      setErrorState({ 
        hasError: true, 
        message: `Error previewing commit: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'network',
        retryCount: 0,
        lastError: new Date()
      })
    }
  }, [])

  const handleUndo = useCallback(() => {
    if (currentCommitIndex < commitHistory.length - 1) {
      const nextIndex = currentCommitIndex + 1
      const commit = commitHistory[nextIndex]
      setCurrentCommitIndex(nextIndex)
      previewCommit(commit.sha)
    }
  }, [currentCommitIndex, commitHistory, previewCommit])

  const handleRedo = useCallback(() => {
    if (currentCommitIndex > 0) {
      const prevIndex = currentCommitIndex - 1
      const commit = commitHistory[prevIndex]
      setCurrentCommitIndex(prevIndex)
      previewCommit(commit.sha)
    }
  }, [currentCommitIndex, commitHistory, previewCommit])

  // Keyboard shortcuts - optimized to reduce DOM queries
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            saveNow()
            break
          case 'f':
            e.preventDefault()
            // Use a more specific selector and cache it
            const searchInput = document.querySelector('input[placeholder="Search..."]') as HTMLInputElement
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
          case 'z':
            e.preventDefault()
            handleUndo()
            break
          case 'y':
            e.preventDefault()
            handleRedo()
            break
          case 'h':
            e.preventDefault()
            setShowHistoryModal(true)
            loadCommitHistory()
            break
        }
      }
      
      // Number keys for tab navigation - optimized
      if (e.key >= '1' && e.key <= '6') {
        e.preventDefault()
        const tabs = ['personal', 'experience', 'skills', 'education', 'certifications', 'projects']
        const tabIndex = parseInt(e.key) - 1
        if (tabs[tabIndex]) {
          // Use a more efficient approach - trigger tab change directly
          setActiveTab(tabs[tabIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown, { passive: false })
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPreview, saveNow, handleUndo, handleRedo, loadCommitHistory, setActiveTab])

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
      <div className="h-screen bg-gradient-to-br from-[#0d1117] via-[#1e1e1e] to-[#0d1117] text-[#d4d4d4] flex flex-col">
        {/* Sticky Header */}
        <AdminHeader
          username={username}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          showKeyboardShortcuts={showKeyboardShortcuts}
          setShowKeyboardShortcuts={setShowKeyboardShortcuts}
          saveStatus={saveStatus}
          lastSaved={lastSaved}
          hasUnsavedChanges={hasUnsavedChanges}
          onSaveNow={saveNow}
          commitHistory={commitHistory}
          currentCommitIndex={currentCommitIndex}
          isLoadingHistory={isLoadingHistory}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onShowHistory={() => {
            setShowHistoryModal(true)
            loadCommitHistory()
          }}
          errorState={errorState}
          isOffline={isOffline}
          retryQueue={retryQueue}
          onRetryFailedSync={async () => {
            if (retryQueue.length > 0) {
              console.log('🔄 Manually retrying failed syncs...')
              for (const data of retryQueue) {
                try {
                  await syncToBackend(data)
                  setRetryQueue(prev => prev.filter(item => item !== data))
                } catch (error) {
                  console.error('❌ Failed to sync queued data:', error)
                  break
                }
              }
            } else if (optimisticData && errorState.hasError) {
              console.log('🔄 Manually retrying current sync...')
              await syncToBackend(optimisticData)
            }
          }}
          cacheHit={cacheHit}
          isPreloading={isPreloading}
          isValidating={isValidating}
          validationErrors={validationErrors}
          validationWarnings={validationWarnings}
          onRefreshData={loadResumeData}
          onLoadSampleData={() => {
            console.log('📊 Loading sample data...')
            setResumeData(defaultResumeData)
            setOptimisticData(defaultResumeData)
            saveToCache(defaultResumeData, Date.now().toString())
          }}
          onClearCache={clearCache}
          stats={stats}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-[#0d1117] hover:scrollbar-thumb-[#4ec9b0] relative">
          <div className="p-2 sm:p-4 lg:p-6">
            {/* Statistics Dashboard */}
            <StatisticsDashboard resumeData={resumeData} stats={stats} />

            {/* Admin Tabs */}
            <AdminTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              resumeData={optimisticData}
              onUpdateResumeData={updateResumeData}
              validationErrors={validationErrors}
              validationWarnings={validationWarnings}
              stats={stats}
              editingExperience={editingExperience}
              setEditingExperience={setEditingExperience}
              editingProject={editingProject}
              setEditingProject={setEditingProject}
            />
          </div>
          {/* Scroll indicator gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none opacity-60"></div>
        </div>

        {/* Sticky Footer */}
        <AdminFooter stats={stats} />

        {/* Modals */}
        <KeyboardShortcutsModal
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />

        <VersionHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          commitHistory={commitHistory}
          currentCommitIndex={currentCommitIndex}
          isLoadingHistory={isLoadingHistory}
          onPreviewCommit={previewCommit}
          onRestoreCommit={restoreFromCommit}
          onSetCurrentCommitIndex={setCurrentCommitIndex}
        />
      </div>
    </ProtectedRoute>
  )
}
