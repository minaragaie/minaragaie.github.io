"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GraduationCap, Edit, X, Plus, CheckCircle } from "lucide-react"
import { ResumeData } from "./types"

interface EducationTabProps {
  resumeData: ResumeData | null
  onUpdateResumeData: (data: ResumeData) => void
  validationErrors: Record<string, string>
  validationWarnings: Record<string, string>
}

export default function EducationTab({ 
  resumeData, 
  onUpdateResumeData, 
  validationErrors, 
  validationWarnings 
}: EducationTabProps) {
  if (!resumeData) return null

  const [editingEducation, setEditingEducation] = useState<number | null>(null)

  const createArrayHandler = (index: number, field: string) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!resumeData) return
      const newData = { ...resumeData }
      if (newData.education[index]) {
        newData.education[index] = { ...newData.education[index], [field]: e.target.value }
        onUpdateResumeData(newData)
      }
    }

  const addEducation = () => {
    if (!resumeData) return
    const newEducation = {
      degree: "",
      institution: "",
      year: "",
      gpa: ""
    }
    onUpdateResumeData({
      ...resumeData,
      education: [...resumeData.education, newEducation]
    })
    setEditingEducation(resumeData.education.length)
  }

  const removeEducation = (index: number) => {
    if (!resumeData) return
    const newEducation = resumeData.education.filter((_, i) => i !== index)
    onUpdateResumeData({ ...resumeData, education: newEducation })
    if (editingEducation === index) {
      setEditingEducation(null)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
        <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          Education
        </CardTitle>
        <CardDescription className="text-[#8b949e] text-base">
          Manage your educational background and qualifications
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#007acc] transition-all duration-200">
              {editingEducation === index ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#007acc] flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editing Education
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEducation(null)}
                        className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#007acc]"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setEditingEducation(null)}
                        className="bg-[#238636] hover:bg-[#2ea043] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Degree</label>
                      <Input
                        value={edu.degree}
                        onChange={createArrayHandler(index, 'degree')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Institution</label>
                      <Input
                        value={edu.institution}
                        onChange={createArrayHandler(index, 'institution')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., University of Technology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Year</label>
                      <Input
                        value={edu.year}
                        onChange={createArrayHandler(index, 'year')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., 2020-2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">GPA (Optional)</label>
                      <Input
                        value={edu.gpa}
                        onChange={createArrayHandler(index, 'gpa')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., 3.8/4.0"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#d4d4d4] mb-1">{edu.degree}</h3>
                      <p className="text-[#007acc] font-medium mb-2">{edu.institution}</p>
                      <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                        <span>{edu.year}</span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingEducation(index)}
                        className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#007acc]"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeEducation(index)}
                        className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          
          <Button
            onClick={addEducation}
            className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
