"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User } from "lucide-react"
import { ResumeData } from "./types"

interface PersonalInfoTabProps {
  resumeData: ResumeData | null
  onUpdateResumeData: (data: ResumeData) => void
  validationErrors: Record<string, string>
  validationWarnings: Record<string, string>
}

export default function PersonalInfoTab({ 
  resumeData, 
  onUpdateResumeData, 
  validationErrors, 
  validationWarnings 
}: PersonalInfoTabProps) {
  if (!resumeData) return null

  const createInputHandler = (field: keyof ResumeData['personalInfo']) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdateResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: e.target.value
      }
    })
  }

  return (
    <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
        <CardTitle className="text-[#d4d4d4] flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-br from-[#007acc] to-[#4ec9b0] rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          Personal Information
        </CardTitle>
        <CardDescription className="text-[#8b949e] text-base">
          Manage your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Full Name *
              </label>
              <Input
                value={resumeData.personalInfo.name}
                onChange={createInputHandler('name')}
                className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] ${
                  validationErrors['personalInfo.name'] ? 'border-red-500' : 
                  validationWarnings['personalInfo.name'] ? 'border-yellow-500' : ''
                }`}
                placeholder="Enter your full name"
              />
              {validationErrors['personalInfo.name'] && (
                <p className="text-red-400 text-xs mt-1">{validationErrors['personalInfo.name']}</p>
              )}
              {validationWarnings['personalInfo.name'] && (
                <p className="text-yellow-400 text-xs mt-1">{validationWarnings['personalInfo.name']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={resumeData.personalInfo.email}
                onChange={createInputHandler('email')}
                className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] ${
                  validationErrors['personalInfo.email'] ? 'border-red-500' : 
                  validationWarnings['personalInfo.email'] ? 'border-yellow-500' : ''
                }`}
                placeholder="your.email@example.com"
              />
              {validationErrors['personalInfo.email'] && (
                <p className="text-red-400 text-xs mt-1">{validationErrors['personalInfo.email']}</p>
              )}
              {validationWarnings['personalInfo.email'] && (
                <p className="text-yellow-400 text-xs mt-1">{validationWarnings['personalInfo.email']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Phone Number
              </label>
              <Input
                value={resumeData.personalInfo.phone}
                onChange={createInputHandler('phone')}
                className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] ${
                  validationErrors['personalInfo.phone'] ? 'border-red-500' : 
                  validationWarnings['personalInfo.phone'] ? 'border-yellow-500' : ''
                }`}
                placeholder="(555) 123-4567"
              />
              {validationErrors['personalInfo.phone'] && (
                <p className="text-red-400 text-xs mt-1">{validationErrors['personalInfo.phone']}</p>
              )}
              {validationWarnings['personalInfo.phone'] && (
                <p className="text-yellow-400 text-xs mt-1">{validationWarnings['personalInfo.phone']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Location
              </label>
              <Input
                value={resumeData.personalInfo.location}
                onChange={createInputHandler('location')}
                className="bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc]"
                placeholder="City, State/Country"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                LinkedIn Profile
              </label>
              <Input
                value={resumeData.personalInfo.linkedin}
                onChange={createInputHandler('linkedin')}
                className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] ${
                  validationErrors['personalInfo.linkedin'] ? 'border-red-500' : 
                  validationWarnings['personalInfo.linkedin'] ? 'border-yellow-500' : ''
                }`}
                placeholder="https://linkedin.com/in/yourprofile"
              />
              {validationErrors['personalInfo.linkedin'] && (
                <p className="text-red-400 text-xs mt-1">{validationErrors['personalInfo.linkedin']}</p>
              )}
              {validationWarnings['personalInfo.linkedin'] && (
                <p className="text-yellow-400 text-xs mt-1">{validationWarnings['personalInfo.linkedin']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                GitHub Profile
              </label>
              <Input
                value={resumeData.personalInfo.github}
                onChange={createInputHandler('github')}
                className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] ${
                  validationErrors['personalInfo.github'] ? 'border-red-500' : 
                  validationWarnings['personalInfo.github'] ? 'border-yellow-500' : ''
                }`}
                placeholder="https://github.com/yourusername"
              />
              {validationErrors['personalInfo.github'] && (
                <p className="text-red-400 text-xs mt-1">{validationErrors['personalInfo.github']}</p>
              )}
              {validationWarnings['personalInfo.github'] && (
                <p className="text-yellow-400 text-xs mt-1">{validationWarnings['personalInfo.github']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Website
              </label>
              <Input
                value={resumeData.personalInfo.website}
                onChange={createInputHandler('website')}
                className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] ${
                  validationErrors['personalInfo.website'] ? 'border-red-500' : 
                  validationWarnings['personalInfo.website'] ? 'border-yellow-500' : ''
                }`}
                placeholder="https://yourwebsite.com"
              />
              {validationErrors['personalInfo.website'] && (
                <p className="text-red-400 text-xs mt-1">{validationErrors['personalInfo.website']}</p>
              )}
              {validationWarnings['personalInfo.website'] && (
                <p className="text-yellow-400 text-xs mt-1">{validationWarnings['personalInfo.website']}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
            Professional Summary *
          </label>
          <Textarea
            value={resumeData.personalInfo.summary}
            onChange={createInputHandler('summary')}
            className={`bg-[#0d1117] border-[#30363d] text-[#d4d4d4] focus:border-[#007acc] min-h-[120px] ${
              validationErrors['personalInfo.summary'] ? 'border-red-500' : 
              validationWarnings['personalInfo.summary'] ? 'border-yellow-500' : ''
            }`}
            placeholder="Write a compelling summary of your professional background, skills, and career objectives..."
          />
          {validationErrors['personalInfo.summary'] && (
            <p className="text-red-400 text-xs mt-1">{validationErrors['personalInfo.summary']}</p>
          )}
          {validationWarnings['personalInfo.summary'] && (
            <p className="text-yellow-400 text-xs mt-1">{validationWarnings['personalInfo.summary']}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
