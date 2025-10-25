"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ExternalLink, 
  Github, 
  Play, 
  ChevronRight, 
  ChevronDown,
  Code,
  Database,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Target
} from "lucide-react"

interface CaseStudy {
  id: string
  title: string
  company: string
  duration: string
  teamSize: number
  budget: string
  category: string
  technologies: string[]
  challenge: string
  solution: string
  impact: {
    metric: string
    value: string
    description: string
  }[]
  results: string[]
  testimonial: {
    text: string
    author: string
    role: string
  }
  images: string[]
  githubUrl?: string
  liveUrl?: string
  status: 'completed' | 'ongoing' | 'archived'
}

const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'E-commerce Platform Modernization',
    company: 'TechCorp Solutions',
    duration: '6 months',
    teamSize: 8,
    budget: '$150K',
    category: 'Full-Stack Development',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes'],
    challenge: 'Legacy PHP-based e-commerce platform with 300% slower load times, poor mobile experience, and security vulnerabilities. The system couldn\'t handle more than 1,000 concurrent users and had frequent downtime during peak hours.',
    solution: 'Architected and developed a modern microservices-based platform using React for the frontend, Node.js for APIs, and PostgreSQL with Redis caching. Implemented containerization with Docker and orchestration with Kubernetes for scalability. Added comprehensive monitoring and automated CI/CD pipelines.',
    impact: [
      { metric: 'Performance Improvement', value: '300%', description: 'Faster page load times' },
      { metric: 'Scalability', value: '10x', description: 'Increased concurrent user capacity' },
      { metric: 'Uptime', value: '99.9%', description: 'Reduced downtime to near zero' },
      { metric: 'Mobile Conversion', value: '150%', description: 'Improved mobile user experience' },
      { metric: 'Security Score', value: 'A+', description: 'Eliminated all vulnerabilities' }
    ],
    results: [
      'Reduced page load time from 8 seconds to 2.5 seconds',
      'Increased concurrent user capacity from 1,000 to 10,000+',
      'Achieved 99.9% uptime with zero security incidents',
      'Improved mobile conversion rate by 150%',
      'Reduced server costs by 40% through optimization'
    ],
    testimonial: {
      text: 'Mina\'s technical leadership transformed our entire e-commerce platform. The performance improvements and scalability gains exceeded our expectations. His attention to security and best practices gave us confidence in our system.',
      author: 'Sarah Chen',
      role: 'Senior Product Manager'
    },
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
    ],
    githubUrl: 'https://github.com/minaragaie/ecommerce-platform',
    liveUrl: 'https://demo-ecommerce.minaragaie.com',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Real-time Analytics Dashboard',
    company: 'DataInsights Inc',
    duration: '4 months',
    teamSize: 5,
    budget: '$80K',
    category: 'Data Visualization',
    technologies: ['React', 'D3.js', 'WebSocket', 'Python', 'MongoDB', 'Redis', 'AWS Lambda'],
    challenge: 'Client needed a real-time analytics dashboard to monitor 50+ KPIs across multiple data sources. Existing solution was slow, outdated, and couldn\'t handle real-time updates. Data visualization was poor and insights were hard to extract.',
    solution: 'Built a responsive dashboard with real-time data streaming using WebSockets, interactive visualizations with D3.js, and efficient data processing with Python microservices. Implemented intelligent caching and data aggregation for optimal performance.',
    impact: [
      { metric: 'Real-time Updates', value: '< 100ms', description: 'Data refresh latency' },
      { metric: 'User Engagement', value: '200%', description: 'Increased dashboard usage' },
      { metric: 'Data Processing', value: '50x', description: 'Faster data analysis' },
      { metric: 'Insight Discovery', value: '300%', description: 'More actionable insights' },
      { metric: 'Mobile Usage', value: '400%', description: 'Mobile dashboard adoption' }
    ],
    results: [
      'Reduced data refresh time from 30 seconds to under 100ms',
      'Increased daily active users by 200%',
      'Enabled real-time decision making for business stakeholders',
      'Improved data accuracy and consistency across all sources',
      'Created mobile-first responsive design with 400% mobile usage increase'
    ],
    testimonial: {
      text: 'The analytics dashboard Mina built revolutionized how we make business decisions. The real-time capabilities and beautiful visualizations help us spot trends and opportunities instantly.',
      author: 'Michael Rodriguez',
      role: 'Engineering Director'
    },
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
    ],
    githubUrl: 'https://github.com/minaragaie/analytics-dashboard',
    liveUrl: 'https://demo-analytics.minaragaie.com',
    status: 'completed'
  },
  {
    id: '3',
    title: 'AI-Powered Content Management System',
    company: 'ContentFlow',
    duration: '8 months',
    teamSize: 6,
    budget: '$200K',
    category: 'AI/ML Integration',
    technologies: ['React', 'Python', 'TensorFlow', 'OpenAI API', 'PostgreSQL', 'Docker', 'AWS SageMaker'],
    challenge: 'Content creation team was overwhelmed with manual content generation and optimization. Needed an AI-powered system to automate content creation, SEO optimization, and content scheduling across multiple platforms.',
    solution: 'Developed an intelligent CMS with AI-powered content generation, automated SEO optimization, and smart scheduling. Integrated OpenAI API for content creation, custom ML models for optimization, and built a user-friendly interface for content management.',
    impact: [
      { metric: 'Content Production', value: '500%', description: 'Increased content output' },
      { metric: 'SEO Score', value: '95%', description: 'Average SEO optimization' },
      { metric: 'Time Savings', value: '80%', description: 'Reduced manual work' },
      { metric: 'Engagement', value: '250%', description: 'Improved content performance' },
      { metric: 'Cost Reduction', value: '60%', description: 'Lower content production costs' }
    ],
    results: [
      'Increased content production from 20 to 100+ articles per week',
      'Achieved 95% average SEO score across all generated content',
      'Reduced content creation time by 80% through automation',
      'Improved content engagement rates by 250%',
      'Reduced content production costs by 60%'
    ],
    testimonial: {
      text: 'Mina\'s AI-powered CMS transformed our content strategy. The quality of AI-generated content is remarkable, and the SEO optimization features are game-changing for our organic reach.',
      author: 'Emily Watson',
      role: 'Content Director'
    },
    images: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop'
    ],
    githubUrl: 'https://github.com/minaragaie/ai-cms',
    liveUrl: 'https://demo-ai-cms.minaragaie.com',
    status: 'completed'
  }
]

export default function CaseStudiesSection() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['challenge']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10'
      case 'ongoing': return 'text-blue-400 bg-blue-400/10'
      case 'archived': return 'text-gray-400 bg-gray-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Full-Stack Development': return <Code className="w-5 h-5" />
      case 'Data Visualization': return <TrendingUp className="w-5 h-5" />
      case 'AI/ML Integration': return <Zap className="w-5 h-5" />
      default: return <Code className="w-5 h-5" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
          <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
          <span className="text-[var(--vscode-green)]">caseStudies</span>{" "}
          <span className="text-[var(--vscode-text)]">=</span>{" "}
          <span className="text-[var(--vscode-string)]">"project-showcase"</span>
        </h2>
        <p className="text-[var(--vscode-text-muted)] max-w-2xl mx-auto">
          Detailed project walkthroughs showcasing problem-solving approach, technical implementation, and measurable impact
        </p>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {caseStudies.map((caseStudy) => (
          <Card 
            key={caseStudy.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              selectedCase?.id === caseStudy.id
                ? 'bg-gradient-to-br from-[var(--vscode-blue)]/10 to-[var(--vscode-green)]/10 border-[var(--vscode-blue)]'
                : 'bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] hover:bg-[var(--vscode-bg-tertiary)]'
            }`}
            onClick={() => setSelectedCase(caseStudy)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(caseStudy.category)}
                  <span className="text-sm font-medium text-[var(--vscode-text)]">
                    {caseStudy.category}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(caseStudy.status)}`}>
                  {caseStudy.status}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-[var(--vscode-text)] mb-2">
                {caseStudy.title}
              </h3>
              
              <p className="text-sm text-[var(--vscode-text-muted)] mb-4">
                {caseStudy.company}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-[var(--vscode-blue)]">{caseStudy.duration}</div>
                  <div className="text-xs text-[var(--vscode-text-muted)]">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[var(--vscode-green)]">{caseStudy.teamSize}</div>
                  <div className="text-xs text-[var(--vscode-text-muted)]">Team Size</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {caseStudy.technologies.slice(0, 3).map((tech) => (
                  <span 
                    key={tech}
                    className="px-2 py-1 bg-[var(--vscode-bg-tertiary)] text-[var(--vscode-text-muted)] text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
                {caseStudy.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-[var(--vscode-bg-tertiary)] text-[var(--vscode-text-muted)] text-xs rounded">
                    +{caseStudy.technologies.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                {caseStudy.githubUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(caseStudy.githubUrl, '_blank')
                    }}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                )}
                {caseStudy.liveUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(caseStudy.liveUrl, '_blank')
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Case Study View */}
      {selectedCase && (
        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[var(--vscode-text)] mb-2">
                  {selectedCase.title}
                </h3>
                <p className="text-[var(--vscode-text-muted)] mb-4">
                  {selectedCase.company} • {selectedCase.duration} • Team of {selectedCase.teamSize}
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedCase.status)}`}>
                    {selectedCase.status}
                  </span>
                  <span className="text-sm text-[var(--vscode-text-muted)]">
                    Budget: {selectedCase.budget}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setSelectedCase(null)}
                variant="outline"
                size="sm"
                className="border-[var(--vscode-border)] text-[var(--vscode-text)]"
              >
                Close
              </Button>
            </div>

            {/* Technologies */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-[var(--vscode-text)] mb-3">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-[var(--vscode-bg-tertiary)] text-[var(--vscode-text)] text-sm rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              {/* Challenge */}
              <div className="border border-[var(--vscode-border)] rounded-lg">
                <button
                  onClick={() => toggleSection('challenge')}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-[var(--vscode-bg-tertiary)]"
                >
                  <h4 className="text-lg font-semibold text-[var(--vscode-text)] flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-400" />
                    Challenge
                  </h4>
                  {expandedSections.has('challenge') ? 
                    <ChevronDown className="w-5 h-5 text-[var(--vscode-text-muted)]" /> :
                    <ChevronRight className="w-5 h-5 text-[var(--vscode-text-muted)]" />
                  }
                </button>
                {expandedSections.has('challenge') && (
                  <div className="p-4 pt-0">
                    <p className="text-[var(--vscode-text)] leading-relaxed">
                      {selectedCase.challenge}
                    </p>
                  </div>
                )}
              </div>

              {/* Solution */}
              <div className="border border-[var(--vscode-border)] rounded-lg">
                <button
                  onClick={() => toggleSection('solution')}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-[var(--vscode-bg-tertiary)]"
                >
                  <h4 className="text-lg font-semibold text-[var(--vscode-text)] flex items-center">
                    <Code className="w-5 h-5 mr-2 text-blue-400" />
                    Solution
                  </h4>
                  {expandedSections.has('solution') ? 
                    <ChevronDown className="w-5 h-5 text-[var(--vscode-text-muted)]" /> :
                    <ChevronRight className="w-5 h-5 text-[var(--vscode-text-muted)]" />
                  }
                </button>
                {expandedSections.has('solution') && (
                  <div className="p-4 pt-0">
                    <p className="text-[var(--vscode-text)] leading-relaxed">
                      {selectedCase.solution}
                    </p>
                  </div>
                )}
              </div>

              {/* Impact */}
              <div className="border border-[var(--vscode-border)] rounded-lg">
                <button
                  onClick={() => toggleSection('impact')}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-[var(--vscode-bg-tertiary)]"
                >
                  <h4 className="text-lg font-semibold text-[var(--vscode-text)] flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Impact & Results
                  </h4>
                  {expandedSections.has('impact') ? 
                    <ChevronDown className="w-5 h-5 text-[var(--vscode-text-muted)]" /> :
                    <ChevronRight className="w-5 h-5 text-[var(--vscode-text-muted)]" />
                  }
                </button>
                {expandedSections.has('impact') && (
                  <div className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {selectedCase.impact.map((impact, index) => (
                        <div key={index} className="bg-[var(--vscode-bg-secondary)] p-4 rounded-lg">
                          <div className="text-2xl font-bold text-[var(--vscode-green)] mb-1">
                            {impact.value}
                          </div>
                          <div className="text-sm font-medium text-[var(--vscode-text)] mb-1">
                            {impact.metric}
                          </div>
                          <div className="text-xs text-[var(--vscode-text-muted)]">
                            {impact.description}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h5 className="font-semibold text-[var(--vscode-text)] mb-3">Key Results:</h5>
                      <ul className="space-y-2">
                        {selectedCase.results.map((result, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-[var(--vscode-green)] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-[var(--vscode-text)]">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Testimonial */}
              <div className="border border-[var(--vscode-border)] rounded-lg">
                <button
                  onClick={() => toggleSection('testimonial')}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-[var(--vscode-bg-tertiary)]"
                >
                  <h4 className="text-lg font-semibold text-[var(--vscode-text)] flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    Client Testimonial
                  </h4>
                  {expandedSections.has('testimonial') ? 
                    <ChevronDown className="w-5 h-5 text-[var(--vscode-text-muted)]" /> :
                    <ChevronRight className="w-5 h-5 text-[var(--vscode-text-muted)]" />
                  }
                </button>
                {expandedSections.has('testimonial') && (
                  <div className="p-4 pt-0">
                    <blockquote className="text-[var(--vscode-text)] italic mb-4">
                      "{selectedCase.testimonial.text}"
                    </blockquote>
                    <div className="text-sm text-[var(--vscode-text-muted)]">
                      — {selectedCase.testimonial.author}, {selectedCase.testimonial.role}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


