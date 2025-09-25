"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Award, Edit, X, Plus, CheckCircle } from "lucide-react"
import { ResumeData } from "./types"

interface CertificationsTabProps {
  resumeData: ResumeData | null
  onUpdateResumeData: (data: ResumeData) => void
  validationErrors: Record<string, string>
  validationWarnings: Record<string, string>
}

export default function CertificationsTab({ 
  resumeData, 
  onUpdateResumeData, 
  validationErrors, 
  validationWarnings 
}: CertificationsTabProps) {
  if (!resumeData) return null

  const [editingCertification, setEditingCertification] = useState<number | null>(null)

  const createArrayHandler = (index: number, field: string) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!resumeData) return
      const newData = { ...resumeData }
      if (newData.certifications[index]) {
        newData.certifications[index] = { ...newData.certifications[index], [field]: e.target.value }
        onUpdateResumeData(newData)
      }
    }

  const addCertification = () => {
    if (!resumeData) return
    const newCertification = {
      name: "",
      issuer: "",
      icon: "",
      status: "",
      description: "",
      color: "#007acc",
      skills: [],
      verify: "",
      pathway: [],
      date: ""
    }
    onUpdateResumeData({
      ...resumeData,
      certifications: [...resumeData.certifications, newCertification]
    })
    setEditingCertification(resumeData.certifications.length)
  }

  const removeCertification = (index: number) => {
    if (!resumeData) return
    const newCertifications = resumeData.certifications.filter((_, i) => i !== index)
    onUpdateResumeData({ ...resumeData, certifications: newCertifications })
    if (editingCertification === index) {
      setEditingCertification(null)
    }
  }

  const addSkill = (certIndex: number, skill: string) => {
    if (!resumeData || !skill.trim()) return
    const newData = { ...resumeData }
    const existingSkills = newData.certifications[certIndex].skills || []
    if (!existingSkills.includes(skill.trim())) {
      newData.certifications[certIndex].skills = [...existingSkills, skill.trim()]
      onUpdateResumeData(newData)
    }
  }

  const removeSkill = (certIndex: number, skillIndex: number) => {
    if (!resumeData) return
    const newData = { ...resumeData }
    newData.certifications[certIndex].skills = newData.certifications[certIndex].skills?.filter((_, i) => i !== skillIndex) || []
    onUpdateResumeData(newData)
  }

  return (
    <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
        <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
          Certifications
        </CardTitle>
        <CardDescription className="text-[#8b949e] text-base">
          Manage your professional certifications and credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#007acc] transition-all duration-200">
              {editingCertification === index ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#007acc] flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Editing Certification
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCertification(null)}
                        className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#007acc]"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setEditingCertification(null)}
                        className="bg-[#238636] hover:bg-[#2ea043] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Certification Name</label>
                      <Input
                        value={cert.name}
                        onChange={createArrayHandler(index, 'name')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., AWS Certified Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Issuing Organization</label>
                      <Input
                        value={cert.issuer}
                        onChange={createArrayHandler(index, 'issuer')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., Amazon Web Services"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Status</label>
                      <Input
                        value={cert.status || ""}
                        onChange={createArrayHandler(index, 'status')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., Active, Expired, In Progress"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Date</label>
                      <Input
                        value={cert.date || ""}
                        onChange={createArrayHandler(index, 'date')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="e.g., 2023-06"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Verification URL</label>
                      <Input
                        value={cert.verify || ""}
                        onChange={createArrayHandler(index, 'verify')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="https://verify.example.com/certificate/123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Color (Hex)</label>
                      <Input
                        value={cert.color || ""}
                        onChange={createArrayHandler(index, 'color')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12"
                        placeholder="#007acc"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Description</label>
                    <Textarea
                      value={cert.description || ""}
                      onChange={createArrayHandler(index, 'description')}
                      className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] min-h-[100px]"
                      placeholder="Describe the certification and its value..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Skills Covered</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {cert.skills?.map((skill, skillIndex) => (
                        <Badge key={skillIndex} className="bg-[#21262d] text-[#007acc] border-[#30363d] flex items-center gap-1">
                          {skill}
                          <button
                            onClick={() => removeSkill(index, skillIndex)}
                            className="ml-1 hover:text-[#f85149] transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add skill (press Enter)"
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] focus:ring-2 focus:ring-[#007acc]/20 transition-all duration-200 hover:border-[#4ec9b0] h-12 flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkill(index, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector(`input[placeholder="Add skill (press Enter)"]`) as HTMLInputElement
                          if (input) {
                            addSkill(index, input.value)
                            input.value = ''
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
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: cert.color || '#007acc' }}
                        >
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#d4d4d4]">{cert.name}</h3>
                          <p className="text-[#007acc] font-medium">{cert.issuer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#8b949e]">
                        {cert.status && <span>Status: {cert.status}</span>}
                        {cert.date && <span>Date: {cert.date}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCertification(index)}
                        className="border-[#30363d] text-[#d4d4d4] hover:bg-[#21262d] hover:border-[#007acc]"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCertification(index)}
                        className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {cert.description && (
                    <p className="text-[#8b949e] mb-4">{cert.description}</p>
                  )}
                  
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cert.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} className="bg-[#21262d] text-[#007acc] border-[#30363d] hover:bg-[#007acc] hover:text-[#0d1117] transition-colors">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {cert.verify && (
                    <a 
                      href={cert.verify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#007acc] hover:text-[#4ec9b0] text-sm underline"
                    >
                      Verify Certificate
                    </a>
                  )}
                </>
              )}
            </div>
          ))}
          
          <Button
            onClick={addCertification}
            className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
