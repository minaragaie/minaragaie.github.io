"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Code, 
  Database, 
  Globe, 
  Shield, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star,
  Trophy,
  Target,
  TrendingUp,
  Award,
  Brain,
  Lightbulb,
  ArrowRight,
  RotateCcw
} from "lucide-react"

interface Question {
  id: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  timeLimit: number
  points: number
}

interface AssessmentResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  categoryScores: Record<string, number>
  skillLevel: string
  recommendations: string[]
  badges: string[]
}

const questions: Question[] = [
  {
    id: '1',
    category: 'React',
    difficulty: 'intermediate',
    question: 'What is the correct way to handle side effects in a React functional component?',
    options: [
      'Use useEffect hook',
      'Use componentDidMount',
      'Use useState hook',
      'Use componentWillMount'
    ],
    correctAnswer: 0,
    explanation: 'useEffect is the correct hook for handling side effects in functional components. componentDidMount and componentWillMount are lifecycle methods for class components.',
    timeLimit: 30,
    points: 10
  },
  {
    id: '2',
    category: 'JavaScript',
    difficulty: 'advanced',
    question: 'What will be the output of the following code?\n\nconst arr = [1, 2, 3, 4, 5];\nconst result = arr.reduce((acc, curr) => acc + curr, 0);\nconsole.log(result);',
    options: ['15', '10', '5', 'Error'],
    correctAnswer: 0,
    explanation: 'The reduce method sums all elements in the array: 1+2+3+4+5 = 15. The initial value is 0.',
    timeLimit: 45,
    points: 15
  },
  {
    id: '3',
    category: 'TypeScript',
    difficulty: 'intermediate',
    question: 'Which TypeScript feature allows you to create a type that represents all possible string values?',
    options: [
      'String literal types',
      'Template literal types',
      'Union types',
      'Intersection types'
    ],
    correctAnswer: 0,
    explanation: 'String literal types allow you to specify exact string values that a variable can have.',
    timeLimit: 30,
    points: 10
  },
  {
    id: '4',
    category: 'Node.js',
    difficulty: 'advanced',
    question: 'What is the difference between process.nextTick() and setImmediate()?',
    options: [
      'process.nextTick() has higher priority',
      'setImmediate() has higher priority',
      'They are identical',
      'process.nextTick() is deprecated'
    ],
    correctAnswer: 0,
    explanation: 'process.nextTick() has higher priority and executes before setImmediate() in the event loop.',
    timeLimit: 60,
    points: 20
  },
  {
    id: '5',
    category: 'AWS',
    difficulty: 'expert',
    question: 'Which AWS service would you use to create a serverless API with automatic scaling?',
    options: [
      'AWS Lambda + API Gateway',
      'AWS EC2 + Auto Scaling',
      'AWS ECS + Application Load Balancer',
      'AWS EKS + Kubernetes'
    ],
    correctAnswer: 0,
    explanation: 'AWS Lambda with API Gateway is the serverless solution that automatically scales based on demand.',
    timeLimit: 45,
    points: 25
  }
]

const categories = [
  { name: 'Frontend', icon: Globe, color: 'text-blue-400' },
  { name: 'Backend', icon: Database, color: 'text-green-400' },
  { name: 'DevOps', icon: Zap, color: 'text-yellow-400' },
  { name: 'Security', icon: Shield, color: 'text-red-400' }
]

export default function SkillAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState<Record<string, { answer: number; correct: boolean; timeSpent: number }>>({})
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)

  const currentQ = questions[currentQuestion]

  useEffect(() => {
    if (isStarted && !isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(-1) // Timeout
    }
  }, [timeLeft, isAnswered, isStarted])

  const startAssessment = () => {
    setIsStarted(true)
    setStartTime(Date.now())
    setTimeLeft(currentQ.timeLimit)
  }

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return

    const isCorrect = answerIndex === currentQ.correctAnswer
    const timeSpent = currentQ.timeLimit - timeLeft

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        answer: answerIndex,
        correct: isCorrect,
        timeSpent
      }
    }))

    setSelectedAnswer(answerIndex)
    setIsAnswered(true)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setShowExplanation(false)
      setTimeLeft(questions[currentQuestion + 1].timeLimit)
    } else {
      completeAssessment()
    }
  }

  const completeAssessment = () => {
    const endTime = Date.now()
    const totalTime = startTime ? (endTime - startTime) / 1000 : 0
    
    const correctAnswers = Object.values(answers).filter(a => a.correct).length
    const totalScore = Object.values(answers).reduce((sum, answer) => {
      return sum + (answer.correct ? questions.find(q => q.id === Object.keys(answers).find(id => answers[id] === answer))?.points || 0 : 0)
    }, 0)

    const categoryScores: Record<string, number> = {}
    questions.forEach(q => {
      if (!categoryScores[q.category]) categoryScores[q.category] = 0
      const answer = answers[q.id]
      if (answer?.correct) {
        categoryScores[q.category] += q.points
      }
    })

    const skillLevel = totalScore >= 80 ? 'Expert' : totalScore >= 60 ? 'Advanced' : totalScore >= 40 ? 'Intermediate' : 'Beginner'
    
    const recommendations = [
      totalScore < 60 ? 'Consider taking advanced courses in your weak areas' : 'Great job! Keep practicing to maintain your skills',
      'Focus on the categories where you scored lowest',
      'Practice coding challenges regularly',
      'Stay updated with the latest technologies in your field'
    ]

    const badges = []
    if (totalScore >= 90) badges.push('Perfect Score', 'Code Master', 'Tech Expert')
    else if (totalScore >= 80) badges.push('Excellent', 'High Achiever')
    else if (totalScore >= 60) badges.push('Good Progress', 'Skill Builder')
    else badges.push('Keep Learning', 'Rising Star')

    setResult({
      score: totalScore,
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent: totalTime,
      categoryScores,
      skillLevel,
      recommendations,
      badges
    })

    setAssessmentComplete(true)
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setShowExplanation(false)
    setAnswers({})
    setAssessmentComplete(false)
    setResult(null)
    setIsStarted(false)
    setStartTime(null)
    setTimeLeft(0)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10'
      case 'advanced': return 'text-orange-400 bg-orange-400/10'
      case 'expert': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
            <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
            <span className="text-[var(--vscode-green)]">skillAssessment</span>{" "}
            <span className="text-[var(--vscode-text)]">=</span>{" "}
            <span className="text-[var(--vscode-string)]">"test-your-skills"</span>
          </h2>
          <p className="text-[var(--vscode-text-muted)] max-w-2xl mx-auto">
            Interactive skill assessment to evaluate your technical knowledge and get personalized recommendations
          </p>
        </div>

        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <Brain className="w-16 h-16 text-[var(--vscode-blue)] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[var(--vscode-text)] mb-4">Ready to Test Your Skills?</h3>
              <p className="text-[var(--vscode-text-muted)] mb-6">
                This assessment covers multiple technology areas and will help identify your strengths and areas for improvement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[var(--vscode-text)] mb-3">Assessment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--vscode-text-muted)]">Questions:</span>
                    <span className="text-[var(--vscode-text)]">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--vscode-text-muted)]">Time Limit:</span>
                    <span className="text-[var(--vscode-text)]">~5 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--vscode-text-muted)]">Categories:</span>
                    <span className="text-[var(--vscode-text)]">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--vscode-text-muted)]">Difficulty:</span>
                    <span className="text-[var(--vscode-text)]">Mixed levels</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[var(--vscode-text)] mb-3">Categories Covered</h4>
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <category.icon className={`w-4 h-4 ${category.color}`} />
                      <span className="text-sm text-[var(--vscode-text)]">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={startAssessment}
                className="bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] hover:from-[var(--vscode-blue)]/80 hover:to-[var(--vscode-green)]/80 text-white px-8 py-3 text-lg"
              >
                <Target className="w-5 h-5 mr-2" />
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (assessmentComplete && result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
            <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
            <span className="text-[var(--vscode-green)]">assessmentResult</span>{" "}
            <span className="text-[var(--vscode-text)]">=</span>{" "}
            <span className="text-[var(--vscode-string)]">"your-performance"</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Results Summary */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Trophy className="w-16 h-16 text-[var(--vscode-yellow)] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[var(--vscode-text)] mb-2">
                  {result.skillLevel} Level
                </h3>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                  {result.score}%
                </div>
                <p className="text-[var(--vscode-text-muted)]">
                  {result.correctAnswers} out of {result.totalQuestions} correct
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[var(--vscode-text-muted)]">Time Spent:</span>
                  <span className="text-[var(--vscode-text)]">{Math.round(result.timeSpent)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--vscode-text-muted)]">Average per Question:</span>
                  <span className="text-[var(--vscode-text)]">{Math.round(result.timeSpent / result.totalQuestions)}s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4">Category Scores</h3>
              <div className="space-y-3">
                {Object.entries(result.categoryScores).map(([category, score]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[var(--vscode-text)]">{category}</span>
                      <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-400' :
                          score >= 60 ? 'bg-yellow-400' :
                          score >= 40 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-[var(--vscode-yellow)]" />
              Badges Earned
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.badges.map((badge, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-[var(--vscode-blue)]/20 to-[var(--vscode-green)]/20 text-[var(--vscode-text)] rounded-full text-sm border border-[var(--vscode-border)]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-[var(--vscode-yellow)]" />
              Recommendations
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-[var(--vscode-text)]">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button
            onClick={resetAssessment}
            variant="outline"
            className="border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--vscode-text)] mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <div className="flex items-center justify-center space-x-4 text-sm text-[var(--vscode-text-muted)]">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {currentQ.points} points
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(currentQ.difficulty)}`}>
                {currentQ.difficulty}
              </span>
              <span className="text-[var(--vscode-text-muted)]">{currentQ.category}</span>
            </div>
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / currentQ.timeLimit) * 100}%` }}
              ></div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-[var(--vscode-text)] mb-6">
            {currentQ.question}
          </h3>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  isAnswered
                    ? index === currentQ.correctAnswer
                      ? 'border-green-400 bg-green-400/10 text-green-400'
                      : index === selectedAnswer && index !== currentQ.correctAnswer
                      ? 'border-red-400 bg-red-400/10 text-red-400'
                      : 'border-[var(--vscode-border)] bg-[var(--vscode-bg-secondary)] text-[var(--vscode-text-muted)]'
                    : 'border-[var(--vscode-border)] bg-[var(--vscode-bg-secondary)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)] hover:border-[var(--vscode-blue)]'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="bg-[var(--vscode-bg-secondary)] p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-[var(--vscode-text)] mb-2">Explanation:</h4>
              <p className="text-[var(--vscode-text-muted)]">{currentQ.explanation}</p>
            </div>
          )}

          {isAnswered && (
            <div className="flex justify-end">
              <Button
                onClick={nextQuestion}
                className="bg-[var(--vscode-blue)] hover:bg-[var(--vscode-blue)]/80 text-white"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

