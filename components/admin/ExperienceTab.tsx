"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Edit, X, Plus, CheckCircle } from "lucide-react"
import { ResumeData } from "./types"

interface ExperienceTabProps {
  resumeData: ResumeData | null
  onUpdateResumeData: (data: ResumeData) => void
  editingExperience: number | null
  setEditingExperience: (index: number | null) => void
  validationErrors: Record<string, string>
  validationWarnings: Record<string, string>
}

export default function ExperienceTab({ 
  resumeData, 
  onUpdateResumeData, 
  editingExperience,
  setEditingExperience,
  validationErrors, 
  validationWarnings 
}: ExperienceTabProps) {
  if (!resumeData) return null

  const createArrayHandler = (arrayName: keyof ResumeData, index: number, field: string) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!resumeData) return
      const newData = { ...resumeData }
      const array = newData[arrayName] as any[]
      if (array && array[index]) {
        array[index] = { ...array[index], [field]: e.target.value }
        onUpdateResumeData(newData)
      }
    }

  const addExperience = () => {
    if (!resumeData) return
    const newExperience = {
      id: Date.now(),
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: [],
      achievements: [""]
    }
    onUpdateResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience]
    })
    setEditingExperience(resumeData.experience.length)
  }

  const removeExperience = (index: number) => {
    if (!resumeData) return
    const newExperience = resumeData.experience.filter((_, i) => i !== index)
    onUpdateResumeData({ ...resumeData, experience: newExperience })
    if (editingExperience === index) {
      setEditingExperience(null)
    }
  }

  const addAchievement = (expIndex: number) => {
    if (!resumeData) return
    const newData = { ...resumeData }
    newData.experience[expIndex].achievements = [...(newData.experience[expIndex].achievements || []), ""]
    onUpdateResumeData(newData)
  }

  const removeAchievement = (expIndex: number, achIndex: number) => {
    if (!resumeData) return
    const newData = { ...resumeData }
    newData.experience[expIndex].achievements = newData.experience[expIndex].achievements?.filter((_, i) => i !== achIndex) || []
    onUpdateResumeData(newData)
  }

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    if (!resumeData) return
    const newData = { ...resumeData }
    if (newData.experience[expIndex].achievements) {
      newData.experience[expIndex].achievements[achIndex] = value
      onUpdateResumeData(newData)
    }
  }

  const addTechnology = (expIndex: number, tech: string) => {
    if (!resumeData || !tech.trim()) return
    const newData = { ...resumeData }
    const existingTechs = newData.experience[expIndex].technologies || []
    if (!existingTechs.includes(tech.trim())) {
      newData.experience[expIndex].technologies = [...existingTechs, tech.trim()]
      onUpdateResumeData(newData)
    }
  }

  const removeTechnology = (expIndex: number, techIndex: number) => {
    if (!resumeData) return
    const newData = { ...resumeData }
    newData.experience[expIndex].technologies = newData.experience[expIndex].technologies.filter((_, i) => i !== techIndex)
    onUpdateResumeData(newData)
  }

  return (
    <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
        <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          Professional Experience
        </CardTitle>
        <CardDescription className="text-[#8b949e] text-base">
          Manage your work experience and career history
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#007acc] transition-all duration-200">
              {editingExperience === index ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#007acc] flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editing Experience
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingExperience(null)}
                        className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#007acc]"
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
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Company</label>
                      <Input
                        value={exp.company}
                        onChange={createArrayHandler('experience', index, 'company')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., Tech Company Inc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Start Date</label>
                      <Input
                        value={exp.startDate}
                        onChange={createArrayHandler('experience', index, 'startDate')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., 2020-01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">End Date</label>
                      <Input
                        value={exp.endDate}
                        onChange={createArrayHandler('experience', index, 'endDate')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., 2023-12 or Present"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Description</label>
                    <Textarea
                      value={exp.description}
                      onChange={createArrayHandler('experience', index, 'description')}
                      className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] min-h-[120px]"
                      placeholder="Describe your role, responsibilities, and key achievements..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Technologies</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} className="bg-[#21262d] text-[#007acc] border-[#30363d] flex items-center gap-1">
                          {tech}
                          <button
                            onClick={() => removeTechnology(index, techIndex)}
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
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12 flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTechnology(index, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector(`input[placeholder="Add technology (press Enter)"]`) as HTMLInputElement
                          if (input) {
                            addTechnology(index, input.value)
                            input.value = ''
                          }
                        }}
                        className="bg-[#007acc] hover:bg-[#4ec9b0] text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Key Achievements</label>
                    <div className="space-y-2">
                      {exp.achievements?.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => updateAchievement(index, achIndex, e.target.value)}
                            className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12 flex-1"
                            placeholder="Enter a key achievement..."
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeAchievement(index, achIndex)}
                            className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addAchievement(index)}
                      className="mt-2 bg-[#007acc] hover:bg-[#4ec9b0] text-white"
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
                      <p className="text-[#007acc] font-medium mb-2">{exp.company}</p>
                      <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                        <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingExperience(index)}
                        className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#007acc]"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeExperience(index)}
                        className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-[#8b949e] mb-4">{exp.description}</p>
                  
                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-[#d4d4d4] mb-2">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-[#8b949e]">
                        {exp.achievements.map((achievement, achIndex) => (
                          <li key={achIndex}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} className="bg-[#21262d] text-[#007acc] border-[#30363d] hover:bg-[#007acc] hover:text-[#0d1117] transition-colors">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          
          <Button
            onClick={addExperience}
            className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
