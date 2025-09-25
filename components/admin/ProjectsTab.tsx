"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Terminal, Edit, X, Plus, CheckCircle, ExternalLink, Github } from "lucide-react"
import { ResumeData } from "./types"

interface ProjectsTabProps {
  resumeData: ResumeData | null
  onUpdateResumeData: (data: ResumeData) => void
  validationErrors: Record<string, string>
  validationWarnings: Record<string, string>
}

export default function ProjectsTab({ 
  resumeData, 
  onUpdateResumeData, 
  validationErrors, 
  validationWarnings 
}: ProjectsTabProps) {
  if (!resumeData) return null

  const [editingProject, setEditingProject] = useState<number | null>(null)

  const createArrayHandler = (index: number, field: string) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!resumeData) return
      const newData = { ...resumeData }
      if (newData.projects[index]) {
        newData.projects[index] = { ...newData.projects[index], [field]: e.target.value }
        onUpdateResumeData(newData)
      }
    }

  const addProject = () => {
    if (!resumeData) return
    const newProject = {
      id: Date.now(),
      name: "",
      description: "",
      technologies: [],
      status: "",
      year: "",
      githubUrl: "",
      liveUrl: "",
      imageUrl: ""
    }
    onUpdateResumeData({
      ...resumeData,
      projects: [...resumeData.projects, newProject]
    })
    setEditingProject(resumeData.projects.length)
  }

  const removeProject = (index: number) => {
    if (!resumeData) return
    const newProjects = resumeData.projects.filter((_, i) => i !== index)
    onUpdateResumeData({ ...resumeData, projects: newProjects })
    if (editingProject === index) {
      setEditingProject(null)
    }
  }

  const addTechnology = (projIndex: number, tech: string) => {
    if (!resumeData || !tech.trim()) return
    const newData = { ...resumeData }
    const existingTechs = newData.projects[projIndex].technologies || []
    if (!existingTechs.includes(tech.trim())) {
      newData.projects[projIndex].technologies = [...existingTechs, tech.trim()]
      onUpdateResumeData(newData)
    }
  }

  const removeTechnology = (projIndex: number, techIndex: number) => {
    if (!resumeData) return
    const newData = { ...resumeData }
    newData.projects[projIndex].technologies = newData.projects[projIndex].technologies.filter((_, i) => i !== techIndex)
    onUpdateResumeData(newData)
  }

  return (
    <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
        <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          Projects
        </CardTitle>
        <CardDescription className="text-[#8b949e] text-base">
          Showcase your personal and professional projects
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-6">
          {resumeData.projects.map((project, index) => (
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
                        onChange={createArrayHandler(index, 'name')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                        placeholder="e.g., E-commerce Platform"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Status</label>
                      <Input
                        value={project.status || ""}
                        onChange={createArrayHandler(index, 'status')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                        placeholder="e.g., Completed, In Progress, On Hold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Year</label>
                      <Input
                        value={project.year || ""}
                        onChange={createArrayHandler(index, 'year')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                        placeholder="e.g., 2023"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">GitHub URL</label>
                      <Input
                        value={project.githubUrl || ""}
                        onChange={createArrayHandler(index, 'githubUrl')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Live URL</label>
                      <Input
                        value={project.liveUrl || ""}
                        onChange={createArrayHandler(index, 'liveUrl')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                        placeholder="https://project-demo.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Image URL</label>
                      <Input
                        value={project.imageUrl || ""}
                        onChange={createArrayHandler(index, 'imageUrl')}
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                        placeholder="https://example.com/project-image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Description</label>
                    <Textarea
                      value={project.description}
                      onChange={createArrayHandler(index, 'description')}
                      className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] min-h-[120px]"
                      placeholder="Describe your project, its features, and technologies used..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">Technologies Used</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, techIndex) => (
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
                        className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] flex-1"
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
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#d4d4d4] mb-1">{project.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-[#8b949e] mb-2">
                        {project.status && <span>Status: {project.status}</span>}
                        {project.year && <span>Year: {project.year}</span>}
                      </div>
                      <p className="text-[#8b949e] mb-4">{project.description}</p>
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
                        onClick={() => removeProject(index)}
                        className="border-[#f85149] text-[#f85149] hover:bg-[#f85149] hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} className="bg-[#21262d] text-[#007acc] border-[#30363d] hover:bg-[#007acc] hover:text-[#0d1117] transition-colors">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#007acc] hover:text-[#4ec9b0] text-sm"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#007acc] hover:text-[#4ec9b0] text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          
          <Button
            onClick={addProject}
            className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
