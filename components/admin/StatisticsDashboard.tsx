"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Code, GraduationCap, Award, Terminal } from "lucide-react"
import { ResumeData, AdminStats } from "./types"

interface StatisticsDashboardProps {
  resumeData: ResumeData | null
  stats: AdminStats
}

export default function StatisticsDashboard({ resumeData, stats }: StatisticsDashboardProps) {
  return (
    <div className="mb-4 sm:mb-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Experience</p>
              <p className="text-2xl font-bold text-[#4ec9b0]">{stats.experienceCount}</p>
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
                {(resumeData?.skills?.technologies?.length || 0) + (resumeData?.skills?.frameworks?.length || 0) + (resumeData?.skills?.languages?.length || 0)}
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
              <p className="text-2xl font-bold text-[#d2a8ff]">{stats.educationCount}</p>
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
              <p className="text-2xl font-bold text-[#ffa657]">{stats.certificationCount}</p>
            </div>
            <Award className="w-8 h-8 text-[#ffa657]" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Projects</p>
              <p className="text-2xl font-bold text-[#4ec9b0]">{stats.projectCount}</p>
            </div>
            <Terminal className="w-8 h-8 text-[#4ec9b0]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
