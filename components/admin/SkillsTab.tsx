"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Code, Plus, X } from "lucide-react"
import { ResumeData } from "./types"

interface SkillsTabProps {
  resumeData: ResumeData | null
  onUpdateResumeData: (data: ResumeData) => void
  validationErrors: Record<string, string>
  validationWarnings: Record<string, string>
}

export default function SkillsTab({ 
  resumeData, 
  onUpdateResumeData, 
  validationErrors, 
  validationWarnings 
}: SkillsTabProps) {
  if (!resumeData) return null

  const skillCategories = [
    { key: 'languages', label: 'Programming Languages', color: 'text-[#007acc]' },
    { key: 'frameworks', label: 'Frameworks & Libraries', color: 'text-[#4ec9b0]' },
    { key: 'databases', label: 'Databases', color: 'text-[#d2a8ff]' },
    { key: 'technologies', label: 'Technologies & Tools', color: 'text-[#ffa657]' },
    { key: 'versionControl', label: 'Version Control', color: 'text-[#f85149]' },
    { key: 'methodologies', label: 'Methodologies', color: 'text-[#56d364]' },
    { key: 'standards', label: 'Standards & Protocols', color: 'text-[#8b949e]' }
  ] as const

  const addSkill = (category: keyof ResumeData['skills'], skill: string) => {
    if (!resumeData || !skill.trim()) return
    const newData = { ...resumeData }
    const existingSkills = newData.skills[category] || []
    if (!existingSkills.includes(skill.trim())) {
      newData.skills[category] = [...existingSkills, skill.trim()]
      onUpdateResumeData(newData)
    }
  }

  const removeSkill = (category: keyof ResumeData['skills'], skillIndex: number) => {
    if (!resumeData) return
    const newData = { ...resumeData }
    newData.skills[category] = newData.skills[category].filter((_, i) => i !== skillIndex)
    onUpdateResumeData(newData)
  }

  const SkillCategory = ({ category, label, color }: { category: keyof ResumeData['skills'], label: string, color: string }) => {
    const skills = resumeData?.skills[category] || []
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${color} flex items-center gap-2`}>
            <Code className="w-5 h-5" />
            {label}
          </h3>
          <span className="text-sm text-[#8b949e]">{skills.length} skills</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <Badge key={index} className="bg-[#21262d] text-[#007acc] border-[#30363d] flex items-center gap-1">
              {skill}
              <button
                onClick={() => removeSkill(category, index)}
                className="ml-1 hover:text-[#f85149] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder={`Add ${label.toLowerCase()}...`}
            className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addSkill(category, e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => {
              const input = document.querySelector(`input[placeholder="Add ${label.toLowerCase()}..."]`) as HTMLInputElement
              if (input) {
                addSkill(category, input.value)
                input.value = ''
              }
            }}
            className="bg-[#007acc] hover:bg-[#4ec9b0] text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
        <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          Technical Skills
        </CardTitle>
        <CardDescription className="text-[#8b949e] text-base">
          Organize your technical skills by category
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {skillCategories.map(({ key, label, color }) => (
            <SkillCategory
              key={key}
              category={key}
              label={label}
              color={color}
            />
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-[#0d1117] border border-[#30363d] rounded-lg">
          <h3 className="text-lg font-semibold text-[#d4d4d4] mb-2">Quick Add Skills</h3>
          <p className="text-sm text-[#8b949e] mb-4">
            Add multiple skills at once, separated by commas
          </p>
          <div className="space-y-2">
            {skillCategories.map(({ key, label }) => (
              <div key={key} className="flex gap-2">
                <Input
                  placeholder={`${label} (comma-separated)`}
                  className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const skills = e.currentTarget.value.split(',').map(s => s.trim()).filter(s => s)
                      skills.forEach(skill => addSkill(key, skill))
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.querySelector(`input[placeholder="${label} (comma-separated)"]`) as HTMLInputElement
                    if (input) {
                      const skills = input.value.split(',').map(s => s.trim()).filter(s => s)
                      skills.forEach(skill => addSkill(key, skill))
                      input.value = ''
                    }
                  }}
                  className="bg-[#007acc] hover:bg-[#4ec9b0] text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
