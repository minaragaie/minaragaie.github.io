"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Linkedin,
  Github,
  Twitter,
  MessageCircle,
  Video,
  FileText,
  Download,
  Copy,
  ExternalLink,
  User,
  Building,
  Globe,
  Zap,
  Shield,
  Star
} from "lucide-react"

interface ContactMethod {
  id: string
  type: 'email' | 'phone' | 'calendar' | 'linkedin' | 'github' | 'twitter'
  label: string
  value: string
  description: string
  icon: any
  color: string
  priority: 'high' | 'medium' | 'low'
  available: boolean
  responseTime: string
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
  timezone: string
}

const contactMethods: ContactMethod[] = [
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    value: 'mina.youaness@example.com',
    description: 'Best for detailed inquiries and project discussions',
    icon: Mail,
    color: 'text-red-400',
    priority: 'high',
    available: true,
    responseTime: 'Within 2 hours'
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone',
    value: '+1 (555) 123-4567',
    description: 'Available for urgent matters and quick calls',
    icon: Phone,
    color: 'text-green-400',
    priority: 'high',
    available: true,
    responseTime: 'Immediate'
  },
  {
    id: 'calendar',
    type: 'calendar',
    label: 'Schedule Meeting',
    value: 'Book a 30-min call',
    description: 'Reserve time for in-depth discussions',
    icon: Calendar,
    color: 'text-blue-400',
    priority: 'high',
    available: true,
    responseTime: 'Scheduled'
  },
  {
    id: 'linkedin',
    type: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/minaragaie',
    description: 'Professional networking and career opportunities',
    icon: Linkedin,
    color: 'text-blue-600',
    priority: 'medium',
    available: true,
    responseTime: 'Within 24 hours'
  },
  {
    id: 'github',
    type: 'github',
    label: 'GitHub',
    value: 'github.com/minaragaie',
    description: 'View my code and open source contributions',
    icon: Github,
    color: 'text-gray-400',
    priority: 'medium',
    available: true,
    responseTime: 'N/A'
  },
  {
    id: 'twitter',
    type: 'twitter',
    label: 'Twitter',
    value: '@minaragaie',
    description: 'Quick updates and tech discussions',
    icon: Twitter,
    color: 'text-blue-400',
    priority: 'low',
    available: true,
    responseTime: 'Within 48 hours'
  }
]

const timeSlots: TimeSlot[] = [
  { date: '2024-09-27', time: '09:00', available: true, timezone: 'EST' },
  { date: '2024-09-27', time: '10:30', available: true, timezone: 'EST' },
  { date: '2024-09-27', time: '14:00', available: false, timezone: 'EST' },
  { date: '2024-09-27', time: '15:30', available: true, timezone: 'EST' },
  { date: '2024-09-28', time: '09:00', available: true, timezone: 'EST' },
  { date: '2024-09-28', time: '11:00', available: true, timezone: 'EST' },
  { date: '2024-09-28', time: '13:30', available: true, timezone: 'EST' },
  { date: '2024-09-28', time: '16:00', available: false, timezone: 'EST' }
]

export default function EnhancedContactSection() {
  const [selectedMethod, setSelectedMethod] = useState<string>('email')
  const [showCalendar, setShowCalendar] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    urgency: 'medium',
    preferredTime: '',
    budget: '',
    timeline: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setSubmitStatus('success')
    setIsSubmitting(false)
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        urgency: 'medium',
        preferredTime: '',
        budget: '',
        timeline: ''
      })
      setSubmitStatus('idle')
    }, 3000)
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-red-400/10'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'low': return 'text-green-400 bg-green-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'low': return 'text-green-400 bg-green-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
          <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
          <span className="text-[var(--vscode-green)]">contact</span>{" "}
          <span className="text-[var(--vscode-text)]">=</span>{" "}
          <span className="text-[var(--vscode-string)]">"let's-connect"</span>
        </h2>
        <p className="text-[var(--vscode-text-muted)] max-w-2xl mx-auto">
          Multiple ways to reach out, schedule meetings, and start meaningful conversations about your next project
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Methods */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[var(--vscode-text)] mb-4">Contact Methods</h3>
          
          {contactMethods.map((method) => (
            <Card 
              key={method.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedMethod === method.id
                  ? 'bg-gradient-to-r from-[var(--vscode-blue)]/10 to-[var(--vscode-green)]/10 border-[var(--vscode-blue)]'
                  : 'bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] hover:bg-[var(--vscode-bg-tertiary)]'
              }`}
              onClick={() => {
                setSelectedMethod(method.id)
                if (method.type === 'calendar') {
                  setShowCalendar(true)
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <method.icon className={`w-6 h-6 ${method.color}`} />
                    <div>
                      <h4 className="font-semibold text-[var(--vscode-text)]">{method.label}</h4>
                      <p className="text-sm text-[var(--vscode-text-muted)]">{method.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(method.priority)}`}>
                      {method.priority}
                    </span>
                    {method.available ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[var(--vscode-text)] font-mono text-sm">{method.value}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(method.value, method.id)
                    }}
                    className="border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
                  >
                    {copiedField === method.id ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                <div className="mt-2 text-xs text-[var(--vscode-text-muted)]">
                  Response time: {method.responseTime}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-[var(--vscode-text)] mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowCalendar(true)}
                  className="bg-[var(--vscode-blue)] hover:bg-[var(--vscode-blue)]/80 text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Meeting
                </Button>
                <Button
                  onClick={() => window.open('/resume.pdf', '_blank')}
                  variant="outline"
                  className="border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[var(--vscode-text)] mb-4">Send Message</h3>
          
          <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--vscode-text)] mb-2">
                      Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] text-[var(--vscode-text)] focus:border-[var(--vscode-blue)]"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--vscode-text)] mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] text-[var(--vscode-text)] focus:border-[var(--vscode-blue)]"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--vscode-text)] mb-2">
                      Company
                    </label>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] text-[var(--vscode-text)] focus:border-[var(--vscode-blue)]"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--vscode-text)] mb-2">
                      Urgency
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="w-full p-2 bg-[var(--vscode-bg-secondary)] border border-[var(--vscode-border)] text-[var(--vscode-text)] rounded-md focus:border-[var(--vscode-blue)]"
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="medium">Medium - Project discussion</option>
                      <option value="high">High - Urgent matter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--vscode-text)] mb-2">
                    Subject *
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] text-[var(--vscode-text)] focus:border-[var(--vscode-blue)]"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--vscode-text)] mb-2">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="bg-[var(--vscode-bg-secondary)] border-[var(--vscode-border)] text-[var(--vscode-text)] focus:border-[var(--vscode-blue)] min-h-[120px]"
                    placeholder="Tell me about your project, requirements, timeline, and any specific questions..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--vscode-text)] mb-2">
                      Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full p-2 bg-[var(--vscode-bg-secondary)] border border-[var(--vscode-border)] text-[var(--vscode-text)] rounded-md focus:border-[var(--vscode-blue)]"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-10k">Under $10K</option>
                      <option value="10k-25k">$10K - $25K</option>
                      <option value="25k-50k">$25K - $50K</option>
                      <option value="50k-100k">$50K - $100K</option>
                      <option value="100k-plus">$100K+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--vscode-text)] mb-2">
                      Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      className="w-full p-2 bg-[var(--vscode-bg-secondary)] border border-[var(--vscode-border)] text-[var(--vscode-text)] rounded-md focus:border-[var(--vscode-blue)]"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">ASAP</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="3-6-months">3-6 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] hover:from-[var(--vscode-blue)]/80 hover:to-[var(--vscode-green)]/80 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {submitStatus === 'success' && (
                  <div className="text-center text-green-400 text-sm">
                    Thank you! I'll get back to you within 2 hours.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-[var(--vscode-bg-primary)] border-[var(--vscode-border)] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[var(--vscode-text)]">Schedule a Meeting</h3>
                <Button
                  onClick={() => setShowCalendar(false)}
                  variant="outline"
                  size="sm"
                  className="border-[var(--vscode-border)] text-[var(--vscode-text)]"
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-sm transition-all duration-200 ${
                      slot.available
                        ? 'bg-[var(--vscode-bg-secondary)] text-[var(--vscode-text)] hover:bg-[var(--vscode-blue)]/20 border border-[var(--vscode-border)]'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                    }`}
                  >
                    <div className="font-medium">{slot.date}</div>
                    <div className="text-xs text-[var(--vscode-text-muted)]">{slot.time} {slot.timezone}</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={() => window.open('https://calendly.com/minaragaie', '_blank')}
                  className="bg-[var(--vscode-blue)] hover:bg-[var(--vscode-blue)]/80 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Response Time Info */}
      <div className="mt-8">
        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[var(--vscode-text)] mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-[var(--vscode-yellow)]" />
              Response Time Guarantee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">2 hours</div>
                <div className="text-sm text-[var(--vscode-text-muted)]">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">24 hours</div>
                <div className="text-sm text-[var(--vscode-text-muted)]">Medium Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">48 hours</div>
                <div className="text-sm text-[var(--vscode-text-muted)]">Low Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

