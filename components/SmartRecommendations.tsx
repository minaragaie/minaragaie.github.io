"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Brain, 
  Target, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Star,
  CheckCircle,
  AlertCircle,
  Zap,
  Award,
  Code,
  Database,
  Globe,
  Shield,
  BarChart3,
  Lightbulb,
  ArrowRight,
  ExternalLink
} from "lucide-react"

interface JobRecommendation {
  id: string
  title: string
  company: string
  location: string
  salary: {
    min: number
    max: number
    currency: string
  }
  type: 'full-time' | 'contract' | 'part-time' | 'freelance'
  experience: string
  skills: string[]
  matchScore: number
  description: string
  benefits: string[]
  requirements: string[]
  postedDate: string
  applicationUrl: string
  companySize: string
  industry: string
  remote: boolean
  urgency: 'high' | 'medium' | 'low'
}

interface SkillAnalysis {
  skill: string
  level: 'expert' | 'advanced' | 'intermediate' | 'beginner'
  demand: 'high' | 'medium' | 'low'
  trend: 'rising' | 'stable' | 'declining'
  salaryImpact: number
}

const mockRecommendations: JobRecommendation[] = [
  {
    id: '1',
    title: 'Senior Full-Stack Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA (Remote)',
    salary: { min: 120000, max: 180000, currency: 'USD' },
    type: 'full-time',
    experience: '5+ years',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
    matchScore: 95,
    description: 'Lead development of scalable web applications using modern technologies. Work with cross-functional teams to deliver high-quality software solutions.',
    benefits: ['Health Insurance', '401k', 'Flexible Hours', 'Remote Work', 'Stock Options'],
    requirements: ['5+ years full-stack experience', 'Strong React/Node.js skills', 'AWS experience', 'Team leadership'],
    postedDate: '2024-09-20',
    applicationUrl: 'https://techcorp.com/careers/senior-fullstack',
    companySize: '201-500',
    industry: 'Technology',
    remote: true,
    urgency: 'high'
  },
  {
    id: '2',
    title: 'Lead Software Engineer',
    company: 'DataInsights Inc',
    location: 'New York, NY',
    salary: { min: 140000, max: 200000, currency: 'USD' },
    type: 'full-time',
    experience: '6+ years',
    skills: ['Python', 'React', 'Docker', 'Kubernetes', 'MongoDB'],
    matchScore: 88,
    description: 'Architect and build data visualization platforms. Lead a team of engineers in developing real-time analytics solutions.',
    benefits: ['Health Insurance', '401k', 'Unlimited PTO', 'Learning Budget', 'Gym Membership'],
    requirements: ['6+ years software engineering', 'Python expertise', 'Data visualization experience', 'Team leadership'],
    postedDate: '2024-09-18',
    applicationUrl: 'https://datainsights.com/careers/lead-engineer',
    companySize: '51-200',
    industry: 'Data & Analytics',
    remote: false,
    urgency: 'medium'
  },
  {
    id: '3',
    title: 'Full-Stack Developer (Contract)',
    company: 'StartupVentures',
    location: 'Remote',
    salary: { min: 80, max: 120, currency: 'USD' },
    type: 'contract',
    experience: '3+ years',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
    matchScore: 92,
    description: '6-month contract to build MVP for fintech startup. Work directly with founders to develop core platform features.',
    benefits: ['Flexible Schedule', 'Remote Work', 'Equity Opportunity'],
    requirements: ['3+ years full-stack experience', 'Startup experience preferred', 'Fintech knowledge a plus'],
    postedDate: '2024-09-22',
    applicationUrl: 'https://startupventures.com/careers/contract-dev',
    companySize: '11-50',
    industry: 'Fintech',
    remote: true,
    urgency: 'high'
  }
]

const skillAnalysis: SkillAnalysis[] = [
  { skill: 'React', level: 'expert', demand: 'high', trend: 'rising', salaryImpact: 15 },
  { skill: 'Node.js', level: 'expert', demand: 'high', trend: 'stable', salaryImpact: 12 },
  { skill: 'TypeScript', level: 'advanced', demand: 'high', trend: 'rising', salaryImpact: 18 },
  { skill: 'AWS', level: 'advanced', demand: 'high', trend: 'rising', salaryImpact: 20 },
  { skill: 'Python', level: 'intermediate', demand: 'high', trend: 'rising', salaryImpact: 10 },
  { skill: 'Docker', level: 'advanced', demand: 'medium', trend: 'stable', salaryImpact: 8 },
  { skill: 'PostgreSQL', level: 'advanced', demand: 'medium', trend: 'stable', salaryImpact: 6 },
  { skill: 'MongoDB', level: 'intermediate', demand: 'medium', trend: 'stable', salaryImpact: 5 }
]

export default function SmartRecommendations() {
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([])
  const [skills, setSkills] = useState<SkillAnalysis[]>([])
  const [loading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<JobRecommendation | null>(null)
  const [activeTab, setActiveTab] = useState<'jobs' | 'skills' | 'market'>('jobs')

  useEffect(() => {
    // Simulate AI analysis
    const analyzeProfile = async () => {
      setIsLoading(true)
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setRecommendations(mockRecommendations)
      setSkills(skillAnalysis)
      setIsLoading(false)
    }

    analyzeProfile()
  }, [])

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-400/10'
    if (score >= 80) return 'text-yellow-400 bg-yellow-400/10'
    if (score >= 70) return 'text-orange-400 bg-orange-400/10'
    return 'text-red-400 bg-red-400/10'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-400/10'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'low': return 'text-green-400 bg-green-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'stable': return <BarChart3 className="w-4 h-4 text-blue-400" />
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      default: return <BarChart3 className="w-4 h-4 text-gray-400" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-green-400 bg-green-400/10'
      case 'advanced': return 'text-blue-400 bg-blue-400/10'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10'
      case 'beginner': return 'text-gray-400 bg-gray-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--vscode-blue)] mx-auto mb-4"></div>
          <p className="text-[var(--vscode-text-muted)]">AI is analyzing your profile and finding the best matches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
          <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
          <span className="text-[var(--vscode-green)]">smartRecommendations</span>{" "}
          <span className="text-[var(--vscode-text)]">=</span>{" "}
          <span className="text-[var(--vscode-string)]">"ai-powered-career-matching"</span>
        </h2>
        <p className="text-[var(--vscode-text-muted)] max-w-2xl mx-auto">
          AI-powered job recommendations, skill analysis, and market insights tailored to your profile
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'jobs', label: 'Job Recommendations', icon: Target },
          { id: 'skills', label: 'Skill Analysis', icon: Code },
          { id: 'market', label: 'Market Insights', icon: TrendingUp }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === id
                ? 'bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] text-white shadow-lg'
                : 'bg-[var(--vscode-bg-secondary)] text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-bg-tertiary)]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Job Recommendations Tab */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-[var(--vscode-text-muted)]">
              Found {recommendations.length} jobs matching your profile
            </p>
          </div>

          {recommendations.map((job) => (
            <Card 
              key={job.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedJob?.id === job.id
                  ? 'bg-gradient-to-r from-[var(--vscode-blue)]/10 to-[var(--vscode-green)]/10 border-[var(--vscode-blue)]'
                  : 'bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] hover:bg-[var(--vscode-bg-tertiary)]'
              }`}
              onClick={() => setSelectedJob(job)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[var(--vscode-text)] mb-2">
                      {job.title}
                    </h3>
                    <p className="text-[var(--vscode-text-muted)] mb-2">{job.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-[var(--vscode-text-muted)]">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.experience}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(job.matchScore)}`}>
                      {job.matchScore}% Match
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getUrgencyColor(job.urgency)}`}>
                      {job.urgency} urgency
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[var(--vscode-text)] mb-3">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-2 py-1 bg-[var(--vscode-bg-tertiary)] text-[var(--vscode-text)] text-sm rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-[var(--vscode-text-muted)]">Company Size:</span>
                      <span className="text-[var(--vscode-text)] ml-2">{job.companySize} employees</span>
                    </div>
                    <div>
                      <span className="text-[var(--vscode-text-muted)]">Industry:</span>
                      <span className="text-[var(--vscode-text)] ml-2">{job.industry}</span>
                    </div>
                    <div>
                      <span className="text-[var(--vscode-text-muted)]">Remote:</span>
                      <span className="text-[var(--vscode-text)] ml-2">{job.remote ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-[var(--vscode-text-muted)]">
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[var(--vscode-blue)] hover:bg-[var(--vscode-blue)]/80 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(job.applicationUrl, '_blank')
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Skill Analysis Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-[var(--vscode-text-muted)]">
              Analysis of your technical skills and market demand
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <Card key={skill.skill} className="bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--vscode-text)]">
                      {skill.skill}
                    </h3>
                    {getTrendIcon(skill.trend)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--vscode-text-muted)]">Your Level:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--vscode-text-muted)]">Market Demand:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        skill.demand === 'high' ? 'text-green-400 bg-green-400/10' :
                        skill.demand === 'medium' ? 'text-yellow-400 bg-yellow-400/10' :
                        'text-red-400 bg-red-400/10'
                      }`}>
                        {skill.demand}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--vscode-text-muted)]">Trend:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        skill.trend === 'rising' ? 'text-green-400 bg-green-400/10' :
                        skill.trend === 'stable' ? 'text-blue-400 bg-blue-400/10' :
                        'text-red-400 bg-red-400/10'
                      }`}>
                        {skill.trend}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[var(--vscode-text-muted)]">Salary Impact:</span>
                      <span className="text-sm text-[var(--vscode-text)] font-medium">
                        +{skill.salaryImpact}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Market Insights Tab */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <p className="text-[var(--vscode-text-muted)]">
              Current market trends and salary insights for your skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[var(--vscode-text)] mb-2">$125K</h3>
                <p className="text-sm text-[var(--vscode-text-muted)]">Average Salary</p>
                <p className="text-xs text-green-400 mt-1">+12% from last year</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[var(--vscode-text)] mb-2">23%</h3>
                <p className="text-sm text-[var(--vscode-text-muted)]">Job Growth</p>
                <p className="text-xs text-blue-400 mt-1">Next 5 years</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[var(--vscode-text)] mb-2">78%</h3>
                <p className="text-sm text-[var(--vscode-text-muted)]">Remote Jobs</p>
                <p className="text-xs text-purple-400 mt-1">Available positions</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-[var(--vscode-yellow)]" />
                Career Recommendations
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[var(--vscode-text)]">Focus on TypeScript</h4>
                    <p className="text-sm text-[var(--vscode-text-muted)]">
                      High demand skill with 18% salary impact. Consider advanced TypeScript courses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[var(--vscode-text)]">Learn Cloud Architecture</h4>
                    <p className="text-sm text-[var(--vscode-text-muted)]">
                      AWS expertise has 20% salary impact. Consider AWS certification.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-[var(--vscode-text)]">Explore AI/ML</h4>
                    <p className="text-sm text-[var(--vscode-text-muted)]">
                      Growing field with high demand. Consider Python and machine learning basics.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

