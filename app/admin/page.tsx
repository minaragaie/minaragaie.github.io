"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Save, Edit, X } from "lucide-react"
import { resumeData as initialResumeData } from "@/lib/resume-data"

interface ResumeData {
  personalInfo: {
    name: string
    linkedin: string
    location: string
    phone: string
    email: string
    profileImage: string
  }
  highlights: string
  experience: Array<{
    id?: number
    title: string
    company: string
    startDate?: string
    endDate?: string
    duration?: string
    type?: string
    description: string
    achievements?: string[]
    technologies?: string[]
  }>
  skills: {
    languages: string[]
    frameworks: string[]
    databases: string[]
    versionControl: string[]
    technologies: string[]
    methodologies: string[]
    standards: string[]
  }
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  certifications:
    | string[]
    | Array<{
        name: string
        issuer: string
        status: string
        description: string
      }>
  additionalInfo: string
}

export default function AdminPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingExperience, setEditingExperience] = useState<number | null>(null)

  useEffect(() => {
    const loadResumeData = () => {
      // Transform the static data to match the expected format
      const transformedData: ResumeData = {
        ...initialResumeData,
        experience: initialResumeData.experience.map((exp, index) => ({
          id: index + 1,
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate?.split(" - ")[0] || "",
          endDate: exp.endDate?.split(" - ")[1] || "",
          description: exp.description,
          achievements: [],
          technologies: [],
        })),
        certifications: Array.isArray(initialResumeData.certifications)
          ? initialResumeData.certifications.map((cert) =>
              typeof cert === "string" ? { name: cert, issuer: "", status: "Active", description: "" } : cert,
            )
          : [],
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
      alert("Demo mode: Changes are not persisted in static export. This would normally save to a database or API.")
    } catch (error) {
      console.error("Error saving resume:", error)
      alert("Error saving resume")
    } finally {
      setSaving(false)
    }
  }

  const addExperience = () => {
    if (!resumeData) return

    const newExperience = {
      id: Date.now(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
      achievements: [""],
      technologies: [""],
    }

    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience],
    })
    setEditingExperience(newExperience.id)
  }

  const deleteExperience = (id: number) => {
    if (!resumeData) return

    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter((exp) => exp.id !== id),
    })
  }

  const updateExperience = (id: number, field: string, value: any) => {
    if (!resumeData) return

    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    })
  }

  const addArrayItem = (category: keyof ResumeData["skills"], item = "") => {
    if (!resumeData) return

    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: [...resumeData.skills[category], item],
      },
    })
  }

  const removeArrayItem = (category: keyof ResumeData["skills"], index: number) => {
    if (!resumeData) return

    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: resumeData.skills[category].filter((_, i) => i !== index),
      },
    })
  }

  const updateArrayItem = (category: keyof ResumeData["skills"], index: number, value: string) => {
    if (!resumeData) return

    const newArray = [...resumeData.skills[category]]
    newArray[index] = value

    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: newArray,
      },
    })
  }

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
        <p>Error loading resume data</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4]">
      {/* VSCode-style header */}
      <div className="bg-[#252526] border-b border-[#3e3e42] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
            </div>
            <h1 className="text-xl font-semibold">Resume Admin Panel</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveResumeData} disabled={saving} className="bg-[#007acc] hover:bg-[#005a9e] text-white">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={() => window.open("/", "_blank")}
              variant="outline"
              className="border-[#3e3e42] text-[#d4d4d4] hover:bg-[#2d2d30]"
            >
              View Resume
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-[#252526] border border-[#3e3e42]">
            <TabsTrigger value="personal" className="data-[state=active]:bg-[#007acc] data-[state=active]:text-white">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-[#007acc] data-[state=active]:text-white">
              Experience
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-[#007acc] data-[state=active]:text-white">
              Skills
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-[#007acc] data-[state=active]:text-white">
              Education
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
            >
              Certifications
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-[#252526] border-[#3e3e42]">
              <CardHeader>
                <CardTitle className="text-[#d4d4d4]">Personal Information</CardTitle>
                <CardDescription className="text-[#969696]">Update your basic contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      value={resumeData.personalInfo.name}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                        })
                      }
                      className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      value={resumeData.personalInfo.email}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                        })
                      }
                      className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={resumeData.personalInfo.phone}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                        })
                      }
                      className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <Input
                      value={resumeData.personalInfo.location}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                        })
                      }
                      className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                    <Input
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value },
                        })
                      }
                      className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Professional Highlights</label>
                  <Textarea
                    value={resumeData.highlights}
                    onChange={(e) => setResumeData({ ...resumeData, highlights: e.target.value })}
                    className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4] min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Professional Experience</h2>
              <Button onClick={addExperience} className="bg-[#4ec9b0] hover:bg-[#3ea896] text-black">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </div>

            {resumeData.experience.map((exp, index) => (
              <Card key={exp.id || index} className="bg-[#252526] border-[#3e3e42]">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-[#d4d4d4]">
                        {editingExperience === (exp.id || index) ? (
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id || index, "title", e.target.value)}
                            className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4] mb-2"
                            placeholder="Job Title"
                          />
                        ) : (
                          exp.title || "New Position"
                        )}
                      </CardTitle>
                      <CardDescription className="text-[#969696]">
                        {editingExperience === (exp.id || index) ? (
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id || index, "company", e.target.value)}
                            className="bg-[#1e1e1e] border-[#3e3e42] text-[#969696]"
                            placeholder="Company Name"
                          />
                        ) : (
                          exp.company
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditingExperience(editingExperience === (exp.id || index) ? null : exp.id || index)
                        }
                        className="border-[#3e3e42] text-[#d4d4d4] hover:bg-[#2d2d30]"
                      >
                        {editingExperience === (exp.id || index) ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteExperience(exp.id || index)}
                        className="border-[#f44747] text-[#f44747] hover:bg-[#f44747] hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {editingExperience === (exp.id || index) && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Date</label>
                        <Input
                          value={exp.startDate || ""}
                          onChange={(e) => updateExperience(exp.id || index, "startDate", e.target.value)}
                          className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                          placeholder="May 2023"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">End Date</label>
                        <Input
                          value={exp.endDate || ""}
                          onChange={(e) => updateExperience(exp.id || index, "endDate", e.target.value)}
                          className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                          placeholder="Present"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Type (Optional)</label>
                        <Input
                          value={exp.type || ""}
                          onChange={(e) => updateExperience(exp.id || index, "type", e.target.value)}
                          className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                          placeholder="Part Time, Contract, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id || index, "description", e.target.value)}
                        className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                        placeholder="Brief description of the role..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Key Achievements</label>
                      {(exp.achievements || []).map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-2 mb-2">
                          <Textarea
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...(exp.achievements || [])]
                              newAchievements[achIndex] = e.target.value
                              updateExperience(exp.id || index, "achievements", newAchievements)
                            }}
                            className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4] flex-1"
                            placeholder="Achievement description..."
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newAchievements = (exp.achievements || []).filter((_, i) => i !== achIndex)
                              updateExperience(exp.id || index, "achievements", newAchievements)
                            }}
                            className="border-[#f44747] text-[#f44747] hover:bg-[#f44747] hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        onClick={() =>
                          updateExperience(exp.id || index, "achievements", [...(exp.achievements || []), ""])
                        }
                        className="bg-[#4ec9b0] hover:bg-[#3ea896] text-black"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Achievement
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Technologies Used</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(exp.technologies || []).map((tech, techIndex) => (
                          <div key={techIndex} className="flex items-center gap-1">
                            <Input
                              value={tech}
                              onChange={(e) => {
                                const newTechnologies = [...(exp.technologies || [])]
                                newTechnologies[techIndex] = e.target.value
                                updateExperience(exp.id || index, "technologies", newTechnologies)
                              }}
                              className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4] w-32"
                              placeholder="Technology"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newTechnologies = (exp.technologies || []).filter((_, i) => i !== techIndex)
                                updateExperience(exp.id || index, "technologies", newTechnologies)
                              }}
                              className="border-[#f44747] text-[#f44747] hover:bg-[#f44747] hover:text-white p-1"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateExperience(exp.id || index, "technologies", [...(exp.technologies || []), ""])
                        }
                        className="bg-[#4ec9b0] hover:bg-[#3ea896] text-black"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Technology
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <h2 className="text-2xl font-bold">Skills & Technologies</h2>

            {Object.entries(resumeData.skills).map(([category, items]) => (
              <Card key={category} className="bg-[#252526] border-[#3e3e42]">
                <CardHeader>
                  <CardTitle className="text-[#d4d4d4] capitalize">
                    {category.replace(/([A-Z])/g, " $1").trim()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge variant="secondary" className="bg-[#1e1e1e] text-[#d4d4d4] border border-[#3e3e42]">
                          <Input
                            value={item}
                            onChange={(e) =>
                              updateArrayItem(category as keyof ResumeData["skills"], index, e.target.value)
                            }
                            className="bg-transparent border-none text-[#d4d4d4] p-0 h-auto min-w-[60px] w-auto"
                            style={{ width: `${Math.max(item.length, 8)}ch` }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeArrayItem(category as keyof ResumeData["skills"], index)}
                            className="ml-1 p-0 h-4 w-4 text-[#f44747] hover:bg-[#f44747] hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addArrayItem(category as keyof ResumeData["skills"], "")}
                    className="bg-[#4ec9b0] hover:bg-[#3ea896] text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {category.slice(0, -1)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <h2 className="text-2xl font-bold">Education</h2>

            {resumeData.education.map((edu, index) => (
              <Card key={index} className="bg-[#252526] border-[#3e3e42]">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Degree</label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...resumeData.education]
                          newEducation[index] = { ...edu, degree: e.target.value }
                          setResumeData({ ...resumeData, education: newEducation })
                        }}
                        className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Institution</label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => {
                          const newEducation = [...resumeData.education]
                          newEducation[index] = { ...edu, institution: e.target.value }
                          setResumeData({ ...resumeData, education: newEducation })
                        }}
                        className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year</label>
                      <Input
                        value={edu.year}
                        onChange={(e) => {
                          const newEducation = [...resumeData.education]
                          newEducation[index] = { ...edu, year: e.target.value }
                          setResumeData({ ...resumeData, education: newEducation })
                        }}
                        className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-6">
            <h2 className="text-2xl font-bold">Certifications</h2>

            {Array.isArray(resumeData.certifications) &&
              resumeData.certifications.map((cert, index) => (
                <Card key={index} className="bg-[#252526] border-[#3e3e42]">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Certification Name</label>
                        <Input
                          value={typeof cert === "string" ? cert : cert.name}
                          onChange={(e) => {
                            const newCertifications = [...resumeData.certifications] as any[]
                            if (typeof cert === "string") {
                              newCertifications[index] = {
                                name: e.target.value,
                                issuer: "",
                                status: "Active",
                                description: "",
                              }
                            } else {
                              newCertifications[index] = { ...cert, name: e.target.value }
                            }
                            setResumeData({ ...resumeData, certifications: newCertifications })
                          }}
                          className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Issuer</label>
                        <Input
                          value={typeof cert === "string" ? "" : cert.issuer}
                          onChange={(e) => {
                            const newCertifications = [...resumeData.certifications] as any[]
                            if (typeof cert === "string") {
                              newCertifications[index] = {
                                name: cert,
                                issuer: e.target.value,
                                status: "Active",
                                description: "",
                              }
                            } else {
                              newCertifications[index] = { ...cert, issuer: e.target.value }
                            }
                            setResumeData({ ...resumeData, certifications: newCertifications })
                          }}
                          className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <Input
                        value={typeof cert === "string" ? "Active" : cert.status}
                        onChange={(e) => {
                          const newCertifications = [...resumeData.certifications] as any[]
                          if (typeof cert === "string") {
                            newCertifications[index] = {
                              name: cert,
                              issuer: "",
                              status: e.target.value,
                              description: "",
                            }
                          } else {
                            newCertifications[index] = { ...cert, status: e.target.value }
                          }
                          setResumeData({ ...resumeData, certifications: newCertifications })
                        }}
                        className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={typeof cert === "string" ? "" : cert.description}
                        onChange={(e) => {
                          const newCertifications = [...resumeData.certifications] as any[]
                          if (typeof cert === "string") {
                            newCertifications[index] = {
                              name: cert,
                              issuer: "",
                              status: "Active",
                              description: e.target.value,
                            }
                          } else {
                            newCertifications[index] = { ...cert, description: e.target.value }
                          }
                          setResumeData({ ...resumeData, certifications: newCertifications })
                        }}
                        className="bg-[#1e1e1e] border-[#3e3e42] text-[#d4d4d4]"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
