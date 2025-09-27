"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { 
  Code, 
  GitBranch, 
  Star, 
  Users, 
  Clock, 
  Shield, 
  Zap, 
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

interface ProfessionalMetrics {
  codeQuality: {
    testCoverage: number
    codeComplexity: number
    maintainabilityIndex: number
    securityScore: number
  }
  performance: {
    bundleSize: number
    loadTime: number
    lighthouseScore: number
    accessibilityScore: number
  }
  collaboration: {
    codeReviews: number
    mentoring: number
    documentation: number
    knowledgeSharing: number
  }
  impact: {
    projectsDelivered: number
    bugsFixed: number
    featuresShipped: number
    teamSize: number
  }
  certifications: {
    total: number
    recent: number
    inProgress: number
    expired: number
  }
}

export default function ProfessionalMetrics() {
  const [metrics, setMetrics] = useState<ProfessionalMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<'quality' | 'performance' | 'collaboration' | 'impact'>('quality')

  useEffect(() => {
    // Simulate professional metrics data
    const mockMetrics: ProfessionalMetrics = {
      codeQuality: {
        testCoverage: 92,
        codeComplexity: 8.5,
        maintainabilityIndex: 85,
        securityScore: 98
      },
      performance: {
        bundleSize: 245,
        loadTime: 1.2,
        lighthouseScore: 98,
        accessibilityScore: 100
      },
      collaboration: {
        codeReviews: 156,
        mentoring: 12,
        documentation: 94,
        knowledgeSharing: 28
      },
      impact: {
        projectsDelivered: 24,
        bugsFixed: 187,
        featuresShipped: 89,
        teamSize: 8
      },
      certifications: {
        total: 8,
        recent: 3,
        inProgress: 2,
        expired: 0
      }
    }

    setTimeout(() => {
      setMetrics(mockMetrics)
      setLoading(false)
    }, 800)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--vscode-blue)] mx-auto"></div>
          <p className="mt-4 text-[var(--vscode-text-muted)]">Loading professional metrics...</p>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  const getScoreColor = (score: number, max: number = 100) => {
    const percentage = (score / max) * 100
    if (percentage >= 90) return 'text-green-400'
    if (percentage >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number, max: number = 100) => {
    const percentage = (score / max) * 100
    if (percentage >= 90) return 'from-green-500 to-green-600'
    if (percentage >= 70) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
          <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
          <span className="text-[var(--vscode-green)]">professionalMetrics</span>{" "}
          <span className="text-[var(--vscode-text)]">=</span>{" "}
          <span className="text-[var(--vscode-string)]">"excellence-in-numbers"</span>
        </h2>
        <p className="text-[var(--vscode-text-muted)] max-w-2xl mx-auto">
          Quantified expertise demonstrating technical proficiency, collaboration skills, and measurable impact
        </p>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'quality', label: 'Code Quality', icon: Code },
          { id: 'performance', label: 'Performance', icon: Zap },
          { id: 'collaboration', label: 'Collaboration', icon: Users },
          { id: 'impact', label: 'Impact', icon: Target }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeCategory === id
                ? 'bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] text-white shadow-lg'
                : 'bg-[var(--vscode-bg-secondary)] text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-bg-tertiary)]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Code Quality Tab */}
      {activeCategory === 'quality' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Test Coverage</h3>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{metrics.codeQuality.testCoverage}%</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${metrics.codeQuality.testCoverage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[var(--vscode-text-muted)] mt-2">Industry standard: 80%+</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Code Complexity</h3>
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{metrics.codeQuality.codeComplexity}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${(metrics.codeQuality.codeComplexity / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[var(--vscode-text-muted)] mt-2">Lower is better (1-10 scale)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Maintainability</h3>
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">{metrics.codeQuality.maintainabilityIndex}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${metrics.codeQuality.maintainabilityIndex}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[var(--vscode-text-muted)] mt-2">Excellent maintainability</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Security Score</h3>
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{metrics.codeQuality.securityScore}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${metrics.codeQuality.securityScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[var(--vscode-text-muted)] mt-2">Security-first approach</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Tab */}
      {activeCategory === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Bundle Size</h3>
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{metrics.performance.bundleSize}KB</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    style={{ width: `${(metrics.performance.bundleSize / 500) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[var(--vscode-text-muted)] mt-2">Optimized for speed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Load Time</h3>
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{metrics.performance.loadTime}s</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${(1.2 / 3) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[var(--vscode-text-muted)] mt-2">Lightning fast</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Lighthouse</h3>
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{metrics.performance.lighthouseScore}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full"
                    style={{ width: `${metrics.performance.lighthouseScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[var(--vscode-text-muted)] mt-2">Outstanding performance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Accessibility</h3>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{metrics.performance.accessibilityScore}</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${metrics.performance.accessibilityScore}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[var(--vscode-text-muted)] mt-2">Fully accessible</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collaboration Tab */}
      {activeCategory === 'collaboration' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Code Reviews</h3>
                <GitBranch className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{metrics.collaboration.codeReviews}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Reviews conducted</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Mentoring</h3>
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{metrics.collaboration.mentoring}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Team members mentored</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Documentation</h3>
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">{metrics.collaboration.documentation}%</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Code documentation coverage</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Knowledge Sharing</h3>
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{metrics.collaboration.knowledgeSharing}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Technical talks given</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Impact Tab */}
      {activeCategory === 'impact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Projects Delivered</h3>
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">{metrics.impact.projectsDelivered}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Successful projects</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Bugs Fixed</h3>
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">{metrics.impact.bugsFixed}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Issues resolved</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Features Shipped</h3>
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">{metrics.impact.featuresShipped}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Features delivered</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Team Size</h3>
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">{metrics.impact.teamSize}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Team members led</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Certifications Summary */}
      <div className="mt-8">
        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-[var(--vscode-text)] mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-[var(--vscode-yellow)]" />
              Professional Certifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--vscode-blue)]">{metrics.certifications.total}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Total Certifications</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--vscode-green)]">{metrics.certifications.recent}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Recent (2024)</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--vscode-yellow)]">{metrics.certifications.inProgress}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">In Progress</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[var(--vscode-text-muted)]">{metrics.certifications.expired}</div>
                <p className="text-sm text-[var(--vscode-text-muted)]">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

