"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor,
  Zap,
  Activity,
  Target,
  Award
} from "lucide-react"

interface AnalyticsData {
  visitors: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
  }
  performance: {
    loadTime: number
    coreWebVitals: {
      lcp: number
      fid: number
      cls: number
    }
    lighthouse: {
      performance: number
      accessibility: number
      bestPractices: number
      seo: number
    }
  }
  engagement: {
    avgSessionDuration: number
    bounceRate: number
    pagesPerSession: number
    returnVisitors: number
  }
  technology: {
    browsers: Record<string, number>
    devices: Record<string, number>
    countries: Record<string, number>
  }
  github: {
    contributions: number
    stars: number
    forks: number
    languages: Record<string, number>
  }
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'engagement' | 'technology'>('overview')

  useEffect(() => {
    // Simulate analytics data - in real implementation, this would come from your analytics service
    const mockAnalytics: AnalyticsData = {
      visitors: {
        total: 2847,
        today: 23,
        thisWeek: 156,
        thisMonth: 892
      },
      performance: {
        loadTime: 1.2,
        coreWebVitals: {
          lcp: 1.1,
          fid: 45,
          cls: 0.05
        },
        lighthouse: {
          performance: 98,
          accessibility: 100,
          bestPractices: 95,
          seo: 100
        }
      },
      engagement: {
        avgSessionDuration: 4.2,
        bounceRate: 12.5,
        pagesPerSession: 3.8,
        returnVisitors: 68.3
      },
      technology: {
        browsers: {
          'Chrome': 65.2,
          'Safari': 18.7,
          'Firefox': 12.1,
          'Edge': 4.0
        },
        devices: {
          'Desktop': 58.3,
          'Mobile': 35.2,
          'Tablet': 6.5
        },
        countries: {
          'United States': 35.2,
          'Canada': 18.7,
          'United Kingdom': 12.3,
          'Germany': 8.9,
          'Australia': 6.1
        }
      },
      github: {
        contributions: 1234,
        stars: 47,
        forks: 23,
        languages: {
          'TypeScript': 35.2,
          'JavaScript': 28.7,
          'Python': 18.3,
          'Go': 12.1,
          'Java': 5.7
        }
      }
    }

    setTimeout(() => {
      setAnalytics(mockAnalytics)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--vscode-blue)] mx-auto"></div>
          <p className="mt-4 text-[var(--vscode-text-muted)]">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
          <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
          <span className="text-[var(--vscode-green)]">analytics</span>{" "}
          <span className="text-[var(--vscode-text)]">=</span>{" "}
          <span className="text-[var(--vscode-string)]">"portfolio-insights"</span>
        </h2>
        <p className="text-[var(--vscode-text-muted)] max-w-2xl mx-auto">
          Real-time performance metrics and visitor analytics showcasing technical excellence
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'performance', label: 'Performance', icon: Zap },
          { id: 'engagement', label: 'Engagement', icon: Activity },
          { id: 'technology', label: 'Technology', icon: Globe }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Visitor Stats */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Visitors</p>
                  <p className="text-3xl font-bold text-[#4ec9b0]">{analytics.visitors.total.toLocaleString()}</p>
                  <p className="text-xs text-green-400 mt-1">+12% this month</p>
                </div>
                <Users className="w-8 h-8 text-[#4ec9b0]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Today's Visitors</p>
                  <p className="text-3xl font-bold text-[#007acc]">{analytics.visitors.today}</p>
                  <p className="text-xs text-blue-400 mt-1">+3 from yesterday</p>
                </div>
                <Eye className="w-8 h-8 text-[#007acc]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Load Time</p>
                  <p className="text-3xl font-bold text-[#d2a8ff]">{analytics.performance.loadTime}s</p>
                  <p className="text-xs text-purple-400 mt-1">Excellent performance</p>
                </div>
                <Zap className="w-8 h-8 text-[#d2a8ff]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">GitHub Stars</p>
                  <p className="text-3xl font-bold text-[#ffa657]">{analytics.github.stars}</p>
                  <p className="text-xs text-orange-400 mt-1">+5 this week</p>
                </div>
                <Award className="w-8 h-8 text-[#ffa657]" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Web Vitals */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-[var(--vscode-blue)]" />
                Core Web Vitals
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--vscode-text-muted)]">Largest Contentful Paint</span>
                  <span className="text-green-400 font-mono">{analytics.performance.coreWebVitals.lcp}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--vscode-text-muted)]">First Input Delay</span>
                  <span className="text-green-400 font-mono">{analytics.performance.coreWebVitals.fid}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--vscode-text-muted)]">Cumulative Layout Shift</span>
                  <span className="text-green-400 font-mono">{analytics.performance.coreWebVitals.cls}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lighthouse Scores */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-[var(--vscode-green)]" />
                Lighthouse Scores
              </h3>
              <div className="space-y-4">
                {Object.entries(analytics.performance.lighthouse).map(([key, score]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-[var(--vscode-text-muted)] capitalize">{key}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] h-2 rounded-full"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-[var(--vscode-text)] font-mono w-8">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Engagement Tab */}
      {activeTab === 'engagement' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Session</p>
                  <p className="text-2xl font-bold text-[#4ec9b0]">{analytics.engagement.avgSessionDuration}m</p>
                </div>
                <Clock className="w-6 h-6 text-[#4ec9b0]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Bounce Rate</p>
                  <p className="text-2xl font-bold text-[#007acc]">{analytics.engagement.bounceRate}%</p>
                </div>
                <Activity className="w-6 h-6 text-[#007acc]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pages/Session</p>
                  <p className="text-2xl font-bold text-[#d2a8ff]">{analytics.engagement.pagesPerSession}</p>
                </div>
                <Globe className="w-6 h-6 text-[#d2a8ff]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Return Visitors</p>
                  <p className="text-2xl font-bold text-[#ffa657]">{analytics.engagement.returnVisitors}%</p>
                </div>
                <Users className="w-6 h-6 text-[#ffa657]" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Technology Tab */}
      {activeTab === 'technology' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Browsers */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4">Browsers</h3>
              <div className="space-y-3">
                {Object.entries(analytics.technology.browsers).map(([browser, percentage]) => (
                  <div key={browser} className="flex justify-between items-center">
                    <span className="text-[var(--vscode-text-muted)]">{browser}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[var(--vscode-text)] font-mono text-sm w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Devices */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4">Devices</h3>
              <div className="space-y-3">
                {Object.entries(analytics.technology.devices).map(([device, percentage]) => (
                  <div key={device} className="flex justify-between items-center">
                    <span className="text-[var(--vscode-text-muted)] flex items-center">
                      {device === 'Desktop' ? <Monitor className="w-4 h-4 mr-2" /> : 
                       device === 'Mobile' ? <Smartphone className="w-4 h-4 mr-2" /> : 
                       <Monitor className="w-4 h-4 mr-2" />}
                      {device}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[var(--vscode-text)] font-mono text-sm w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Countries */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4">Top Countries</h3>
              <div className="space-y-3">
                {Object.entries(analytics.technology.countries).map(([country, percentage]) => (
                  <div key={country} className="flex justify-between items-center">
                    <span className="text-[var(--vscode-text-muted)]">{country}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-[var(--vscode-text)] font-mono text-sm w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

