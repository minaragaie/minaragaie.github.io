"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Quote, 
  Star, 
  User, 
  Building, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Linkedin,
  Github,
  Mail,
  Award,
  ThumbsUp,
  MessageCircle
} from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  text: string
  date: string
  project?: string
  linkedin?: string
  github?: string
  email?: string
  verified: boolean
  category: 'colleague' | 'client' | 'manager' | 'mentor'
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Product Manager',
    company: 'TechCorp Solutions',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Mina is an exceptional full-stack developer who consistently delivers high-quality solutions. His attention to detail, problem-solving skills, and ability to work under pressure are outstanding. He transformed our legacy system into a modern, scalable platform that improved our performance by 300%.',
    date: '2024-08-15',
    project: 'Legacy System Modernization',
    linkedin: 'https://linkedin.com/in/sarahchen',
    verified: true,
    category: 'client'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    role: 'Engineering Director',
    company: 'InnovateLab',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Working with Mina was a game-changer for our team. His expertise in React, Node.js, and cloud architecture helped us build a robust e-commerce platform that handles 100K+ daily users. His mentoring skills also elevated our junior developers significantly.',
    date: '2024-07-22',
    project: 'E-commerce Platform',
    linkedin: 'https://linkedin.com/in/michaelrodriguez',
    verified: true,
    category: 'manager'
  },
  {
    id: '3',
    name: 'Emily Watson',
    role: 'UX Designer',
    company: 'DesignStudio Pro',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Mina\'s collaboration skills are phenomenal. He seamlessly bridges the gap between design and development, ensuring pixel-perfect implementations while maintaining excellent performance. His proactive communication and technical insights greatly enhanced our design system.',
    date: '2024-06-10',
    project: 'Design System Implementation',
    linkedin: 'https://linkedin.com/in/emilywatson',
    verified: true,
    category: 'colleague'
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'CTO',
    company: 'StartupVentures',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Mina joined our startup during a critical phase and immediately made an impact. His full-stack expertise, security focus, and ability to work with limited resources helped us scale from 0 to 50K users. He\'s not just a developer, he\'s a true technical leader.',
    date: '2024-05-18',
    project: 'MVP Development & Scaling',
    linkedin: 'https://linkedin.com/in/davidkim',
    verified: true,
    category: 'manager'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    role: 'DevOps Engineer',
    company: 'CloudTech Inc',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Mina\'s understanding of cloud architecture and DevOps practices is impressive. He helped us implement CI/CD pipelines, containerization, and monitoring systems that reduced our deployment time by 80%. His security-first approach prevented several potential vulnerabilities.',
    date: '2024-04-12',
    project: 'DevOps & Security Implementation',
    linkedin: 'https://linkedin.com/in/lisathompson',
    verified: true,
    category: 'colleague'
  },
  {
    id: '6',
    name: 'Alex Johnson',
    role: 'Junior Developer',
    company: 'CodeAcademy Pro',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    text: 'Mina was my mentor for 6 months and completely transformed my understanding of modern web development. His patience, clear explanations, and hands-on approach helped me grow from a junior to a confident mid-level developer. I can\'t recommend him enough!',
    date: '2024-03-28',
    project: 'Mentorship Program',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    verified: true,
    category: 'mentor'
  }
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filter, setFilter] = useState<'all' | 'colleague' | 'client' | 'manager' | 'mentor'>('all')
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const filteredTestimonials = filter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === filter)

  const currentTestimonial = filteredTestimonials[currentIndex]

  // Auto-play testimonials
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, filteredTestimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'colleague': return <User className="w-4 h-4" />
      case 'client': return <Building className="w-4 h-4" />
      case 'manager': return <Award className="w-4 h-4" />
      case 'mentor': return <MessageCircle className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'colleague': return 'text-blue-400 bg-blue-400/10'
      case 'client': return 'text-green-400 bg-green-400/10'
      case 'manager': return 'text-purple-400 bg-purple-400/10'
      case 'mentor': return 'text-yellow-400 bg-yellow-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--vscode-text)] mb-2">
          <span className="text-[var(--vscode-blue)] font-mono">const</span>{" "}
          <span className="text-[var(--vscode-green)]">testimonials</span>{" "}
          <span className="text-[var(--vscode-text)]">=</span>{" "}
          <span className="text-[var(--vscode-string)]">"professional-recommendations"</span>
        </h2>
        <p className="text-[var(--vscode-text-muted)] max-w-2xl mx-auto">
          Recommendations from colleagues, clients, and managers showcasing professional excellence and impact
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'all', label: 'All', count: testimonials.length },
          { id: 'colleague', label: 'Colleagues', count: testimonials.filter(t => t.category === 'colleague').length },
          { id: 'client', label: 'Clients', count: testimonials.filter(t => t.category === 'client').length },
          { id: 'manager', label: 'Managers', count: testimonials.filter(t => t.category === 'manager').length },
          { id: 'mentor', label: 'Mentoring', count: testimonials.filter(t => t.category === 'mentor').length }
        ].map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => {
              setFilter(id as any)
              setCurrentIndex(0)
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              filter === id
                ? 'bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] text-white shadow-lg'
                : 'bg-[var(--vscode-bg-secondary)] text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-bg-tertiary)]'
            }`}
          >
            <span>{label}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{count}</span>
          </button>
        ))}
      </div>

      {/* Main Testimonial Display */}
      <div className="relative">
        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-2xl">
          <CardContent className="p-8">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] rounded-full flex items-center justify-center">
                <Quote className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="text-center mb-8">
              <p className="text-lg text-[var(--vscode-text)] leading-relaxed mb-6 italic">
                "{currentTestimonial.text}"
              </p>
              
              {/* Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < currentTestimonial.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-600'
                    }`} 
                  />
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full border-2 border-[var(--vscode-blue)]"
                />
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-[var(--vscode-text)]">
                    {currentTestimonial.name}
                  </h3>
                  <p className="text-[var(--vscode-text-muted)]">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getCategoryColor(currentTestimonial.category)}`}>
                      {getCategoryIcon(currentTestimonial.category)}
                      <span className="capitalize">{currentTestimonial.category}</span>
                    </span>
                    {currentTestimonial.verified && (
                      <span className="text-green-400 text-xs flex items-center">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info */}
            {currentTestimonial.project && (
              <div className="bg-[var(--vscode-bg-secondary)] rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-[var(--vscode-text)] mb-2">Project Context</h4>
                <p className="text-sm text-[var(--vscode-text-muted)]">{currentTestimonial.project}</p>
                <p className="text-xs text-[var(--vscode-text-muted)] mt-1">
                  {new Date(currentTestimonial.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}

            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {currentTestimonial.linkedin && (
                <a
                  href={currentTestimonial.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {currentTestimonial.github && (
                <a
                  href={currentTestimonial.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {currentTestimonial.email && (
                <a
                  href={`mailto:${currentTestimonial.email}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center space-x-4 mt-6">
          <Button
            onClick={prevTestimonial}
            variant="outline"
            size="sm"
            className="border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-[var(--vscode-blue)]'
                    : 'bg-[var(--vscode-border)] hover:bg-[var(--vscode-text-muted)]'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextTestimonial}
            variant="outline"
            size="sm"
            className="border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Auto-play Toggle */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            variant="outline"
            size="sm"
            className="border-[var(--vscode-border)] text-[var(--vscode-text)] hover:bg-[var(--vscode-bg-tertiary)]"
          >
            {isAutoPlaying ? 'Pause' : 'Play'} Auto-rotation
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-[var(--vscode-blue)] mb-2">
              {testimonials.length}
            </div>
            <p className="text-sm text-[var(--vscode-text-muted)]">Total Recommendations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-[var(--vscode-green)] mb-2">
              {testimonials.filter(t => t.rating === 5).length}
            </div>
            <p className="text-sm text-[var(--vscode-text-muted)]">5-Star Reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-[var(--vscode-purple)] mb-2">
              {testimonials.filter(t => t.verified).length}
            </div>
            <p className="text-sm text-[var(--vscode-text-muted)]">Verified References</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-[#30363d] shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-[var(--vscode-yellow)] mb-2">
              {new Set(testimonials.map(t => t.company)).size}
            </div>
            <p className="text-sm text-[var(--vscode-text-muted)]">Companies Represented</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

