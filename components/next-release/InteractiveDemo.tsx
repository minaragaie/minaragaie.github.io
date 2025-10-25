"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Code, 
  Terminal, 
  Database, 
  Zap, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"

interface DemoState {
  isRunning: boolean
  currentStep: number
  output: string[]
  error: string | null
  success: boolean
}

const demos = [
  {
    id: 'api-test',
    title: 'API Performance Test',
    description: 'Test the performance of your portfolio API endpoints',
    code: `// Testing API response times
const testAPI = async () => {
  const start = performance.now()
  const response = await fetch('/api/resume')
  const data = await response.json()
  const end = performance.now()
  
  return {
    responseTime: \`\${(end - start).toFixed(2)}ms\`,
    status: response.status,
    dataSize: JSON.stringify(data).length
  }
}`,
    steps: [
      'Initializing API test...',
      'Fetching resume data...',
      'Measuring response time...',
      'Validating data structure...',
      'Calculating performance metrics...',
      '✅ API test completed successfully!'
    ],
    result: {
      responseTime: '45ms',
      status: 200,
      dataSize: '2.3KB',
      performance: 'Excellent'
    }
  },
  {
    id: 'code-quality',
    title: 'Code Quality Analysis',
    description: 'Analyze code quality metrics and best practices',
    code: `// Code quality analysis
const analyzeCode = (code) => {
  const metrics = {
    complexity: calculateComplexity(code),
    maintainability: calculateMaintainability(code),
    testCoverage: calculateTestCoverage(code),
    security: analyzeSecurity(code)
  }
  
  return {
    score: calculateOverallScore(metrics),
    recommendations: generateRecommendations(metrics)
  }
}`,
    steps: [
      'Analyzing code structure...',
      'Calculating complexity metrics...',
      'Checking maintainability index...',
      'Running security analysis...',
      'Generating recommendations...',
      '✅ Code quality analysis complete!'
    ],
    result: {
      score: 92,
      complexity: 'Low',
      maintainability: 'High',
      security: 'Secure',
      recommendations: 3
    }
  },
  {
    id: 'database-query',
    title: 'Database Query Optimization',
    description: 'Demonstrate efficient database querying techniques',
    code: `// Optimized database query
const getResumeData = async () => {
  const query = \`
    SELECT 
      p.*,
      e.title, e.company, e.start_date, e.end_date,
      s.category, s.skills
    FROM personal_info p
    LEFT JOIN experience e ON p.id = e.person_id
    LEFT JOIN skills s ON p.id = s.person_id
    WHERE p.id = ?
    ORDER BY e.start_date DESC
  \`
  
  return await db.query(query, [userId])
}`,
    steps: [
      'Connecting to database...',
      'Building optimized query...',
      'Executing query with indexes...',
      'Processing results...',
      'Caching response...',
      '✅ Database query optimized!'
    ],
    result: {
      queryTime: '12ms',
      rowsReturned: 15,
      cacheHit: true,
      optimization: 'Indexed'
    }
  }
]

export default function InteractiveDemo() {
  const [activeDemo, setActiveDemo] = useState(0)
  const [demoState, setDemoState] = useState<DemoState>({
    isRunning: false,
    currentStep: 0,
    output: [],
    error: null,
    success: false
  })

  const runDemo = async () => {
    setDemoState({
      isRunning: true,
      currentStep: 0,
      output: [],
      error: null,
      success: false
    })

    const demo = demos[activeDemo]
    
    for (let i = 0; i < demo.steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setDemoState(prev => ({
        ...prev,
        currentStep: i + 1,
        output: [...prev.output, demo.steps[i]]
      }))
    }

    setDemoState(prev => ({
      ...prev,
      isRunning: false,
      success: true
    }))
  }

  const resetDemo = () => {
    setDemoState({
      isRunning: false,
      currentStep: 0,
      output: [],
      error: null,
      success: false
    })
  }

  const currentDemo = demos[activeDemo]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
          <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
          <span className="text-[var(--vscode-green)]">interactiveDemo</span>{" "}
          <span className="text-[var(--vscode-text)]">=</span>{" "}
          <span className="text-[var(--vscode-string)]">"live-coding-showcase"</span>
        </h2>
        <p className="text-[var(--vscode-text-muted)] max-w-2xl mx-auto">
          Interactive demonstrations of technical skills, code quality, and problem-solving approach
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demo Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[var(--vscode-text)] mb-4">Select Demo</h3>
          {demos.map((demo, index) => (
            <Card 
              key={demo.id}
              className={`cursor-pointer transition-all duration-200 ${
                activeDemo === index 
                  ? 'bg-gradient-to-r from-[var(--vscode-blue)]/10 to-[var(--vscode-green)]/10 border-[var(--vscode-blue)]' 
                  : 'bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] hover:bg-[var(--vscode-bg-tertiary)]'
              }`}
              onClick={() => setActiveDemo(index)}
            >
              <CardContent className="p-4">
                <h4 className="font-semibold text-[var(--vscode-text)] mb-2">{demo.title}</h4>
                <p className="text-sm text-[var(--vscode-text-muted)]">{demo.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Execution */}
        <div className="space-y-6">
          {/* Code Display */}
          <Card className="bg-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)] flex items-center">
                  <Code className="w-5 h-5 mr-2 text-[var(--vscode-blue)]" />
                  {currentDemo.title}
                </h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={runDemo}
                    disabled={demoState.isRunning}
                    size="sm"
                    className="bg-[var(--vscode-blue)] hover:bg-[var(--vscode-blue)]/80"
                  >
                    {demoState.isRunning ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {demoState.isRunning ? 'Running...' : 'Run Demo'}
                  </Button>
                  <Button
                    onClick={resetDemo}
                    disabled={demoState.isRunning}
                    size="sm"
                    variant="outline"
                    className="border-[var(--vscode-border)] text-[var(--vscode-text)]"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <pre className="bg-[#161b22] p-4 rounded-lg overflow-x-auto text-sm text-[var(--vscode-text)]">
                <code>{currentDemo.code}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Terminal Output */}
          <Card className="bg-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[var(--vscode-text)] flex items-center">
                  <Terminal className="w-5 h-5 mr-2 text-[var(--vscode-green)]" />
                  Terminal Output
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="bg-[#161b22] p-4 rounded-lg h-48 overflow-y-auto font-mono text-sm">
                {demoState.output.length === 0 ? (
                  <p className="text-[var(--vscode-text-muted)]">Click "Run Demo" to see the output...</p>
                ) : (
                  <div className="space-y-1">
                    {demoState.output.map((line, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-[var(--vscode-blue)] mr-2">
                          {index + 1 < demoState.currentStep ? '✓' : 
                           index + 1 === demoState.currentStep ? '→' : '○'}
                        </span>
                        <span className={line.includes('✅') ? 'text-green-400' : 'text-[var(--vscode-text)]'}>
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {demoState.success && (
            <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                  <h3 className="text-lg font-semibold text-[var(--vscode-text)]">Demo Results</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentDemo.result).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-[var(--vscode-text)]">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                      </div>
                      <div className="text-sm text-[var(--vscode-text-muted)] capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Technical Skills Showcase */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-[var(--vscode-text)] text-center mb-8">
          Technical Skills Demonstrated
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6 text-center">
              <Database className="w-12 h-12 text-[var(--vscode-blue)] mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-[var(--vscode-text)] mb-2">Database Optimization</h4>
              <p className="text-sm text-[var(--vscode-text-muted)]">
                Efficient querying, indexing strategies, and performance optimization
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-[var(--vscode-green)] mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-[var(--vscode-text)] mb-2">Performance Testing</h4>
              <p className="text-sm text-[var(--vscode-text-muted)]">
                API testing, load optimization, and real-time performance monitoring
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6 text-center">
              <Code className="w-12 h-12 text-[var(--vscode-purple)] mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-[var(--vscode-text)] mb-2">Code Quality</h4>
              <p className="text-sm text-[var(--vscode-text-muted)]">
                Automated analysis, best practices, and maintainable code standards
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


