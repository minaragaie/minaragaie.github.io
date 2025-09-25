"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Code, GraduationCap, Award, Terminal } from "lucide-react"
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
        <TabsList className="grid w-full grid-cols-3 bg-[#0d1117] border border-[#30363d] p-1 rounded-lg">
          <TabsTrigger 
            value="personal" 
            className="text-xs data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            Personal
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            className="text-xs data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            Experience
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="text-xs data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            Skills
          </TabsTrigger>
        </TabsList>
        <TabsList className="grid w-full grid-cols-3 bg-[#0d1117] border border-[#30363d] p-1 rounded-lg mt-2">
          <TabsTrigger 
            value="education" 
            className="text-xs data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            Education
          </TabsTrigger>
          <TabsTrigger 
            value="certifications" 
            className="text-xs data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            Certifications
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="text-xs data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            Projects
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden lg:block">
        <TabsList className="grid w-full grid-cols-6 bg-[#0d1117] border border-[#30363d] p-1 rounded-lg">
          <TabsTrigger 
            value="personal" 
            className="flex items-center gap-2 data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            <Briefcase className="w-4 h-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            className="flex items-center gap-2 data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            <Briefcase className="w-4 h-4" />
            Experience
          </TabsTrigger>
          <TabsTrigger 
            value="skills" 
            className="flex items-center gap-2 data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            <Code className="w-4 h-4" />
            Skills
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="flex items-center gap-2 data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            <GraduationCap className="w-4 h-4" />
            Education
          </TabsTrigger>
          <TabsTrigger 
            value="certifications" 
            className="flex items-center gap-2 data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            <Award className="w-4 h-4" />
            Certifications
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="flex items-center gap-2 data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
          >
            <Terminal className="w-4 h-4" />
            Projects
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
          />
        </TabsContent>
      </div>
    </Tabs>
  )
}
