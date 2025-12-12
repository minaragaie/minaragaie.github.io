"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, Edit, X, LogOut, User, Briefcase, GraduationCap, Award, Code, Terminal, Database, Settings, Activity, Search, Download, Upload, Eye, Clock, CheckCircle, AlertCircle, Info, BarChart3, Keyboard, Zap } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

// External API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://resume-backend-service.vercel.app"

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
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
    gpa?: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    icon: string
    status: string
    description: string
    color: string
    skills: string[]
    verify?: string
    pathway?: Array<{
      name: string
      issuer: string
      icon: string
      status: string
      description: string
      color: string
      skills: string[]
      verify?: string
    }>
  }>
  skills: {
    technical: string[]
    soft: string[]
    languages: string[]
    tools: string[]
  }
  projects: Array<{
    id: number
    name: string
    description: string
    technologies: string[]
    githubUrl?: string
    liveUrl?: string
    imageUrl?: string
  }>
  additionalInfo: string
}

export default function AdminPageExternalAPI() {
  const { username, logout } = useAuth()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingExperience, setEditingExperience] = useState<number | null>(null)
  const [editingProject, setEditingProject] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin?type=resume`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setResumeData(result.data)
          } else {
            console.error('Failed to load resume data:', result.message)
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
                technical: [],
                soft: [],
                languages: [],
                tools: []
              },
              projects: [],
              additionalInfo: ""
            })
          }
        } else {
          console.error('Failed to fetch resume data')
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
              technical: [],
              soft: [],
              languages: [],
              tools: []
            },
            projects: [],
            additionalInfo: ""
          })
        }
      } catch (error) {
        console.error('Error loading resume data:', error)
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
            technical: [],
            soft: [],
            languages: [],
            tools: []
          },
          projects: [],
          additionalInfo: ""
        })
      } finally {
        setLoading(false)
      }
    }

    loadResumeData()
  }, [])

  const saveResumeData = async () => {
    if (!resumeData) return
    
    setSaving(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin?type=resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setLastSaved(new Date())
          setHasUnsavedChanges(false)
          console.log('Resume data saved successfully!')
          
          // Show success message
          alert('Resume data saved successfully! Changes will be reflected on the home page.')
        } else {
          console.error('Failed to save resume data:', result.message)
          alert('Failed to save resume data: ' + result.message)
        }
      } else {
        console.error('Failed to save resume data')
        alert('Failed to save resume data. Please try again.')
      }
    } catch (error) {
      console.error('Error saving resume data:', error)
      alert('Error saving resume data. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Individual CRUD operations using external API
  const deleteExperience = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin?type=experience&id=${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Reload data to reflect changes
          const loadResponse = await fetch(`${API_BASE_URL}/api/admin?type=resume`)
          if (loadResponse.ok) {
            const loadResult = await loadResponse.json()
            if (loadResult.success) {
              setResumeData(loadResult.data)
              setLastSaved(new Date())
            }
          }
        } else {
          alert('Failed to delete experience: ' + result.message)
        }
      } else {
        alert('Failed to delete experience. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
      alert('Error deleting experience. Please try again.')
    }
  }

  const deleteEducation = async (index: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin?type=education&index=${index}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Reload data to reflect changes
          const loadResponse = await fetch(`${API_BASE_URL}/api/admin?type=resume`)
          if (loadResponse.ok) {
            const loadResult = await loadResponse.json()
            if (loadResult.success) {
              setResumeData(loadResult.data)
              setLastSaved(new Date())
            }
          }
        } else {
          alert('Failed to delete education: ' + result.message)
        }
      } else {
        alert('Failed to delete education. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting education:', error)
      alert('Error deleting education. Please try again.')
    }
  }

  const deleteCertification = async (index: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin?type=certifications&index=${index}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Reload data to reflect changes
          const loadResponse = await fetch(`${API_BASE_URL}/api/admin?type=resume`)
          if (loadResponse.ok) {
            const loadResult = await loadResponse.json()
            if (loadResult.success) {
              setResumeData(loadResult.data)
              setLastSaved(new Date())
            }
          }
        } else {
          alert('Failed to delete certification: ' + result.message)
        }
      } else {
        alert('Failed to delete certification. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting certification:', error)
      alert('Error deleting certification. Please try again.')
    }
  }

  const resetResumeData = async () => {
    if (!confirm('Are you sure you want to reset all resume data? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin?type=resume`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Reload data to reflect changes
          const loadResponse = await fetch(`${API_BASE_URL}/api/admin?type=resume`)
          if (loadResponse.ok) {
            const loadResult = await loadResponse.json()
            if (loadResult.success) {
              setResumeData(loadResult.data)
              setLastSaved(new Date())
              setHasUnsavedChanges(false)
              alert('Resume data has been reset to default.')
            }
          }
        } else {
          alert('Failed to reset resume data: ' + result.message)
        }
      } else {
        alert('Failed to reset resume data. Please try again.')
      }
    } catch (error) {
      console.error('Error resetting resume data:', error)
      alert('Error resetting resume data. Please try again.')
    }
  }

  // Auto-save detection
  useEffect(() => {
    if (resumeData && !saving) {
      setHasUnsavedChanges(true)
    }
  }, [resumeData, saving])

  // Auto-save after user stops typing
  useEffect(() => {
    if (!hasUnsavedChanges || saving) return

    const autoSaveTimer = setTimeout(() => {
      saveResumeData()
    }, 2000) // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer)
  }, [hasUnsavedChanges, saving])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#007acc] mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] flex items-center justify-center">
        <div className="text-center">
          <p>Error loading resume data</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#1e1e1e] to-[#0d1117] text-[#d4d4d4]">
        {/* Header with External API indicator */}
        <div className="bg-gradient-to-r from-[#0d1117] via-[#1e1e1e] to-[#0d1117] border-b border-[#30363d] shadow-2xl">
          <div className="p-4">
            <div className="flex items-center justify-between">
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
                    <p className="text-sm text-gray-400">External API • Resume Management System v2.0</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1e1e1e] to-[#2d2d30] rounded-xl border border-[#30363d] shadow-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300 font-medium">Welcome, {username}</span>
                </div>
                <Button
                  onClick={resetResumeData}
                  variant="outline"
                  className="border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white transition-all duration-200 hover:scale-105 px-6"
                  title="Reset all resume data to default"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Reset Data
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white transition-all duration-200 hover:scale-105 px-6"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
              <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-[#4ec9b0] to-[#007acc] rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                External API Configuration
              </CardTitle>
              <CardDescription className="text-[#8b949e] text-base">
                Admin panel connected to external Vercel backend service
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="bg-[#0d1117] border border-[#4ec9b0] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#d4d4d4] mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#4ec9b0]" />
                    Backend Service Status
                  </h3>
                  <div className="space-y-3 text-[#8b949e]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#4ec9b0] rounded-full"></div>
                      <span>API Base URL: <code className="bg-[#21262d] px-2 py-1 rounded text-[#4ec9b0]">{API_BASE_URL}</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#4ec9b0] rounded-full"></div>
                      <span>Full CRUD operations supported</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#4ec9b0] rounded-full"></div>
                      <span>Real-time data persistence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#4ec9b0] rounded-full"></div>
                      <span>Automatic backup system</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => window.open("/", "_blank")}
                    className="bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white px-6"
                  >
                    View Resume
                  </Button>
                  <Button
                    onClick={() => window.open("https://github.com/minaragaie/resume-backend-service", "_blank")}
                    variant="outline"
                    className="border-[#4ec9b0] text-[#4ec9b0] hover:bg-[#4ec9b0] hover:text-[#0d1117] px-6"
                  >
                    View Backend Repo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
