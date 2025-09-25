"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Code, GraduationCap, Award, Terminal, User } from "lucide-react"
import { ResumeData, AdminStats } from "./types"
import PersonalInfoTab from "./PersonalInfoTab"
import ExperienceTab from "./ExperienceTab"
import SkillsTab from "./SkillsTab"
import EducationTab from "./EducationTab"
import CertificationsTab from "./CertificationsTab"
import ProjectsTab from "./ProjectsTab"

interface AdminTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  resumeData: ResumeData | null
  onUpdateResumeData: (data: ResumeData) => void
  validationErrors: Record<string, string>
  validationWarnings: Record<string, string>
  stats: AdminStats
  editingExperience: number | null
  setEditingExperience: (index: number | null) => void
  editingProject: number | null
  setEditingProject: (index: number | null) => void
}

export default function AdminTabs({
  activeTab,
  setActiveTab,
  resumeData,
  onUpdateResumeData,
  validationErrors,
  validationWarnings,
  stats,
  editingExperience,
  setEditingExperience,
  editingProject,
  setEditingProject
}: AdminTabsProps) {
  if (!resumeData) return null

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Mobile Tabs - Scrollable */}
      <div className="lg:hidden">
        <TabsList className="flex w-full bg-[#161b22] border border-[#30363d] rounded-xl p-1 shadow-xl overflow-x-auto scrollbar-hide">
          <TabsTrigger 
            value="personal" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px] text-xs"
          >
            <User className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px] text-xs"
          >
            <Briefcase className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px] text-xs"
          >
            <Code className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px] text-xs"
          >
            <GraduationCap className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px] text-xs"
          >
            <Award className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Certs</span>
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#007acc] data-[state=active]:to-[#4ec9b0] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-[#21262d] rounded-lg flex-shrink-0 min-w-[80px] text-xs"
          >
            <Terminal className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden lg:block">
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

      {/* Tab Content */}
      <div className="mt-6">
        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoTab
            resumeData={resumeData}
            onUpdateResumeData={onUpdateResumeData}
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          />
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <ExperienceTab
            resumeData={resumeData}
            onUpdateResumeData={onUpdateResumeData}
            editingExperience={editingExperience}
            setEditingExperience={setEditingExperience}
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          />
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <SkillsTab
            resumeData={resumeData}
            onUpdateResumeData={onUpdateResumeData}
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <EducationTab
            resumeData={resumeData}
            onUpdateResumeData={onUpdateResumeData}
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          />
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <CertificationsTab
            resumeData={resumeData}
            onUpdateResumeData={onUpdateResumeData}
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ProjectsTab
            resumeData={resumeData}
            onUpdateResumeData={onUpdateResumeData}
            validationErrors={validationErrors}
            validationWarnings={validationWarnings}
            editingProject={editingProject}
            setEditingProject={setEditingProject}
          />
        </TabsContent>
      </div>
    </Tabs>
  )
}
