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
import { resumeData as initialResumeData } from "@/lib/resume-data"
import { useAuth } from "@/context/AuthContext"

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

export default function AdminPage() {
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
    const loadResumeData = () => {
      // Transform the static data to match the expected format
      const transformedData: ResumeData = {
        personalInfo: {
          name: initialResumeData.personalInfo.name,
          email: initialResumeData.personalInfo.email,
          phone: initialResumeData.personalInfo.phone,
          location: initialResumeData.personalInfo.location,
          linkedin: initialResumeData.personalInfo.linkedin,
          github: "",
          website: "",
          summary: initialResumeData.highlights,
        },
        experience: initialResumeData.experience.map((exp, index) => ({
          id: index,
          company: exp.company,
          title: exp.title,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          technologies: exp.technologies || [],
        })),
        education: initialResumeData.education.map((edu) => ({
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
          gpa: "",
        })),
        certifications: initialResumeData.certifications.map((cert) => ({
          name: cert.name,
          issuer: cert.issuer,
          icon: cert.icon,
          status: cert.status,
          description: cert.description,
          color: cert.color,
          skills: cert.skills,
          verify: cert.verify || "",
          pathway: cert.pathway || [],
        })),
        skills: {
          technical: initialResumeData.skills.technologies || [],
          soft: [],
          languages: initialResumeData.skills.languages || [],
          tools: initialResumeData.skills.versionControl || [],
        },
        projects: [],
        additionalInfo: initialResumeData.additionalInfo || "",
      }

      setResumeData(transformedData)
      setLoading(false)
    }

    loadResumeData()
  }, [])

  const saveResumeData = async () => {
    if (!resumeData) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/admin/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      })
      
      if (response.ok) {
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        console.log('Resume data saved successfully!')
        
        // Show success message
        alert('Resume data saved successfully! Changes will be reflected on the home page.')
      } else {
        console.error('Failed to save resume data')
      }
    } catch (error) {
      console.error('Error saving resume data:', error)
    } finally {
      setSaving(false)
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            saveResumeData()
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
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault()
        const tabs = ['personal', 'experience', 'skills', 'education', 'certifications']
        const tabIndex = parseInt(e.key) - 1
        if (tabs[tabIndex]) {
          // This would need to be implemented with a ref to the tabs component
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPreview, saveResumeData])

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
              
              {/* Mobile Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button
                  onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                  variant="outline"
                  className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#d2a8ff] transition-all duration-200 text-xs"
                >
                  <Keyboard className="w-3 h-3 mr-1" />
                  Shortcuts
                </Button>
                <Button 
                  onClick={saveResumeData} 
                  disabled={saving} 
                  className="bg-gradient-to-r from-[#007acc] to-[#005a9e] hover:from-[#005a9e] hover:to-[#004080] text-white shadow-lg transition-all duration-200 text-xs"
                >
                  <Save className="w-3 h-3 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white transition-all duration-200 text-xs"
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
              <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search resume content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] focus:ring-2 focus:ring-[#4ec9b0]/20"
                  />
                </div>
                
                {/* Status Indicators */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] rounded-lg border border-[#30363d]">
                    {hasUnsavedChanges ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">Unsaved changes</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">All saved</span>
                      </>
                    )}
                  </div>
                  
                  {lastSaved && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] rounded-lg border border-[#30363d]">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Last saved: {lastSaved.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#1e1e1e] to-[#2d2d30] rounded-xl border border-[#30363d] shadow-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300 font-medium">Welcome, {username}</span>
                  <div className="w-6 h-6 bg-gradient-to-br from-[#4ec9b0] to-[#007acc] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{username?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200"
                    title="Toggle Preview"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  
                  <Button
                    onClick={() => {/* Export functionality */}}
                    variant="outline"
                    className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#7ee787] transition-all duration-200"
                    title="Export Resume"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  
                  <Button
                    onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                    variant="outline"
                    className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#d2a8ff] transition-all duration-200"
                    title="Keyboard Shortcuts"
                  >
                    <Keyboard className="w-4 h-4 mr-2" />
                    Shortcuts
                  </Button>
                  
                  <Button 
                    onClick={saveResumeData} 
                    disabled={saving} 
                    className="bg-gradient-to-r from-[#007acc] to-[#005a9e] hover:from-[#005a9e] hover:to-[#004080] text-white shadow-lg transition-all duration-200 hover:scale-105 px-6"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  
                  <Button
                    onClick={() => window.open("/", "_blank")}
                    variant="outline"
                    className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0] transition-all duration-200 px-6"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    View Resume
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
        </div>

        <div className="p-2 sm:p-4 lg:p-6">
          {/* Statistics Dashboard */}
          <div className="mb-4 sm:mb-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Experience</p>
                    <p className="text-2xl font-bold text-[#4ec9b0]">{resumeData?.experience.length || 0}</p>
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
                      {(resumeData?.skills.technical.length || 0) + (resumeData?.skills.soft.length || 0)}
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
                    <p className="text-2xl font-bold text-[#d2a8ff]">{resumeData?.education.length || 0}</p>
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
                    <p className="text-2xl font-bold text-[#ffa657]">{resumeData?.certifications.length || 0}</p>
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
                </TabsList>
              </div>

              {/* Desktop Tabs */}
              <div className="hidden lg:block">
                <TabsList className="grid w-full grid-cols-5 bg-[#161b22] border border-[#30363d] rounded-xl p-2 shadow-xl">
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
                        value={resumeData.personalInfo.name}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                          })
                        }
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#4ec9b0] rounded-full"></span>
                        Email
                      </label>
                      <Input
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                          })
                        }
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] focus:ring-2 focus:ring-[#4ec9b0]/20 transition-all duration-200 hover:border-[#007acc] h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#f85149] rounded-full"></span>
                        Phone
                      </label>
                      <Input
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                          })
                        }
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#f85149] focus:ring-2 focus:ring-[#f85149]/20 transition-all duration-200 hover:border-[#ffa657] h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ffa657] rounded-full"></span>
                        Location
                      </label>
                      <Input
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                          })
                        }
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] focus:ring-2 focus:ring-[#ffa657]/20 transition-all duration-200 hover:border-[#f85149] h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#a5d6ff] rounded-full"></span>
                        LinkedIn
                      </label>
                      <Input
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                          })
                        }
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#a5d6ff] focus:ring-2 focus:ring-[#a5d6ff]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#d4d4d4] mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#7ee787] rounded-full"></span>
                        GitHub
                      </label>
                      <Input
                        value={resumeData.personalInfo.github}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, github: e.target.value },
                          })
                        }
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
                      value={resumeData.personalInfo.summary}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, summary: e.target.value },
                        })
                      }
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
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#4ec9b0] transition-all duration-200">
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
                              onClick={() => setEditingExperience(editingExperience === index ? null : index)}
                              className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#4ec9b0]"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              {editingExperience === index ? "Cancel" : "Edit"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newExperience = resumeData.experience.filter((_, i) => i !== index)
                                setResumeData({ ...resumeData, experience: newExperience })
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
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        const newExp = {
                          id: resumeData.experience.length,
                          company: "",
                          title: "",
                          startDate: "",
                          endDate: "",
                          description: "",
                          technologies: [],
                        }
                        setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] })
                        setEditingExperience(resumeData.experience.length)
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
                        {resumeData.skills.technical.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                const newSkills = [...resumeData.skills.technical]
                                newSkills[index] = e.target.value
                                setResumeData({
                                  ...resumeData,
                                  skills: { ...resumeData.skills, technical: newSkills },
                                })
                              }}
                              className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] h-10"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newSkills = resumeData.skills.technical.filter((_, i) => i !== index)
                                setResumeData({
                                  ...resumeData,
                                  skills: { ...resumeData.skills, technical: newSkills },
                                })
                              }}
                              className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            setResumeData({
                              ...resumeData,
                              skills: { ...resumeData.skills, technical: [...resumeData.skills.technical, ""] },
                            })
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
                        Soft Skills
                      </h3>
                      <div className="space-y-2">
                        {resumeData.skills.soft.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={skill}
                              onChange={(e) => {
                                const newSkills = [...resumeData.skills.soft]
                                newSkills[index] = e.target.value
                                setResumeData({
                                  ...resumeData,
                                  skills: { ...resumeData.skills, soft: newSkills },
                                })
                              }}
                              className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#4ec9b0] h-10"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newSkills = resumeData.skills.soft.filter((_, i) => i !== index)
                                setResumeData({
                                  ...resumeData,
                                  skills: { ...resumeData.skills, soft: newSkills },
                                })
                              }}
                              className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            setResumeData({
                              ...resumeData,
                              skills: { ...resumeData.skills, soft: [...resumeData.skills.soft, ""] },
                            })
                          }}
                          className="w-full border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Soft Skill
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
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#d2a8ff] transition-all duration-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Degree</label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => {
                                const newEducation = [...resumeData.education]
                                newEducation[index] = { ...edu, degree: e.target.value }
                                setResumeData({ ...resumeData, education: newEducation })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#d2a8ff] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Institution</label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => {
                                const newEducation = [...resumeData.education]
                                newEducation[index] = { ...edu, institution: e.target.value }
                                setResumeData({ ...resumeData, education: newEducation })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#d2a8ff] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Year</label>
                            <Input
                              value={edu.year}
                              onChange={(e) => {
                                const newEducation = [...resumeData.education]
                                newEducation[index] = { ...edu, year: e.target.value }
                                setResumeData({ ...resumeData, education: newEducation })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#d2a8ff] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">GPA (Optional)</label>
                            <Input
                              value={edu.gpa || ""}
                              onChange={(e) => {
                                const newEducation = [...resumeData.education]
                                newEducation[index] = { ...edu, gpa: e.target.value }
                                setResumeData({ ...resumeData, education: newEducation })
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
                              const newEducation = resumeData.education.filter((_, i) => i !== index)
                              setResumeData({ ...resumeData, education: newEducation })
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
                        const newEdu = { degree: "", institution: "", year: "", gpa: "" }
                        setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] })
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
                    {resumeData.certifications.map((cert, index) => (
                      <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#ffa657] transition-all duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Certification Name</label>
                            <Input
                              value={cert.name}
                              onChange={(e) => {
                                const newCerts = [...resumeData.certifications]
                                newCerts[index] = { ...cert, name: e.target.value }
                                setResumeData({ ...resumeData, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Issuer</label>
                            <Input
                              value={cert.issuer}
                              onChange={(e) => {
                                const newCerts = [...resumeData.certifications]
                                newCerts[index] = { ...cert, issuer: e.target.value }
                                setResumeData({ ...resumeData, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Status</label>
                            <Input
                              value={cert.status}
                              onChange={(e) => {
                                const newCerts = [...resumeData.certifications]
                                newCerts[index] = { ...cert, status: e.target.value }
                                setResumeData({ ...resumeData, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Icon</label>
                            <Input
                              value={cert.icon}
                              onChange={(e) => {
                                const newCerts = [...resumeData.certifications]
                                newCerts[index] = { ...cert, icon: e.target.value }
                                setResumeData({ ...resumeData, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Color</label>
                            <Input
                              value={cert.color}
                              onChange={(e) => {
                                const newCerts = [...resumeData.certifications]
                                newCerts[index] = { ...cert, color: e.target.value }
                                setResumeData({ ...resumeData, certifications: newCerts })
                              }}
                              className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-10"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Verify URL</label>
                            <Input
                              value={cert.verify}
                              onChange={(e) => {
                                const newCerts = [...resumeData.certifications]
                                newCerts[index] = { ...cert, verify: e.target.value }
                                setResumeData({ ...resumeData, certifications: newCerts })
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
                              const newCerts = [...resumeData.certifications]
                              newCerts[index] = { ...cert, description: e.target.value }
                              setResumeData({ ...resumeData, certifications: newCerts })
                            }}
                            className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] min-h-[80px]"
                            placeholder="Describe the certification..."
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-[#d4d4d4] mb-2">Skills</label>
                          <div className="space-y-2">
                            {cert.skills.map((skill, skillIndex) => (
                              <div key={skillIndex} className="flex items-center gap-2">
                                <Input
                                  value={skill}
                                  onChange={(e) => {
                                    const newCerts = [...resumeData.certifications]
                                    const newSkills = [...cert.skills]
                                    newSkills[skillIndex] = e.target.value
                                    newCerts[index] = { ...cert, skills: newSkills }
                                    setResumeData({ ...resumeData, certifications: newCerts })
                                  }}
                                  className="bg-[#161b22] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-8"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newCerts = [...resumeData.certifications]
                                    const newSkills = cert.skills.filter((_, i) => i !== skillIndex)
                                    newCerts[index] = { ...cert, skills: newSkills }
                                    setResumeData({ ...resumeData, certifications: newCerts })
                                  }}
                                  className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white h-8 px-2"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              onClick={() => {
                                const newCerts = [...resumeData.certifications]
                                const newSkills = [...cert.skills, ""]
                                newCerts[index] = { ...cert, skills: newSkills }
                                setResumeData({ ...resumeData, certifications: newCerts })
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
                                          const newCerts = [...resumeData.certifications]
                                          const newPathway = [...cert.pathway!]
                                          newPathway[pathIndex] = { ...path, name: e.target.value }
                                          newCerts[index] = { ...cert, pathway: newPathway }
                                          setResumeData({ ...resumeData, certifications: newCerts })
                                        }}
                                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-8 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-400 mb-1">Status</label>
                                      <Input
                                        value={path.status}
                                        onChange={(e) => {
                                          const newCerts = [...resumeData.certifications]
                                          const newPathway = [...cert.pathway!]
                                          newPathway[pathIndex] = { ...path, status: e.target.value }
                                          newCerts[index] = { ...cert, pathway: newPathway }
                                          setResumeData({ ...resumeData, certifications: newCerts })
                                        }}
                                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#ffa657] h-8 text-sm"
                                      />
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className="block text-xs text-gray-400 mb-1">Description</label>
                                      <Input
                                        value={path.description}
                                        onChange={(e) => {
                                          const newCerts = [...resumeData.certifications]
                                          const newPathway = [...cert.pathway!]
                                          newPathway[pathIndex] = { ...path, description: e.target.value }
                                          newCerts[index] = { ...cert, pathway: newPathway }
                                          setResumeData({ ...resumeData, certifications: newCerts })
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
                                        const newCerts = [...resumeData.certifications]
                                        const newPathway = cert.pathway!.filter((_, i) => i !== pathIndex)
                                        newCerts[index] = { ...cert, pathway: newPathway }
                                        setResumeData({ ...resumeData, certifications: newCerts })
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
                                  const newCerts = [...resumeData.certifications]
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
                                  setResumeData({ ...resumeData, certifications: newCerts })
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
                              const newCerts = [...resumeData.certifications]
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
                              setResumeData({ ...resumeData, certifications: newCerts })
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
                              const newCerts = resumeData.certifications.filter((_, i) => i !== index)
                              setResumeData({ ...resumeData, certifications: newCerts })
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
                        setResumeData({ ...resumeData, certifications: [...resumeData.certifications, newCert] })
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
                {resumeData?.experience.length || 0} exp • {resumeData?.skills.technical.length || 0} skills
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
                <span className="text-gray-400">Auto-save: {hasUnsavedChanges ? 'Disabled' : 'Enabled'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-gray-400">
                {resumeData?.experience.length || 0} experiences • {resumeData?.skills.technical.length || 0} skills • {resumeData?.education.length || 0} education
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