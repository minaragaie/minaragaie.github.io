// AI Service for Live Chat Bot
// Using backend API with Hugging Face integration

import { config } from './config'

interface AIResponse {
  response: string
  error?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

class AIService {
  private baseUrl: string

  constructor() {
    this.baseUrl = config.API_BASE_URL
  }

  // Generate response using backend API
  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}${config.ENDPOINTS.AI_CHAT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AIResponse = await response.json()
      
      if (data.error) {
        console.error('Backend AI Error:', data.error)
        return this.getFallbackResponse(userMessage)
      }

      return data.response || this.getFallbackResponse(userMessage)
      
    } catch (error) {
      console.error('AI Service Error:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  // Fallback responses when AI is unavailable
  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `╭─────────────────────────────────────────╮
│                HELLO THERE!                │
╰─────────────────────────────────────────╯

Hello! Welcome to my portfolio terminal! 👋

I'm Mina, a Senior Full-Stack Developer with 5+ years 
of experience in modern web technologies.

Quick Commands:
• 'help' - See all available commands
• 'about' - Learn about my background
• 'ls' - Browse my portfolio files
• 'whoami' - See my basic info

Feel free to ask me anything about my work, 
experience, or projects!`
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
      return `╭─────────────────────────────────────────╮
│           PROFESSIONAL EXPERIENCE          │
╰─────────────────────────────────────────╯

┌─ Senior Full-Stack Developer (5+ years)
├─ Team Leadership: Up to 8 developers
├─ Projects Delivered: 24+ successful projects
├─ Industries: Fintech, E-commerce, Data Analytics
└─ Specialization: React, Node.js, Cloud Technologies

Status: ✅ Available for new opportunities`
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
      return `╭─────────────────────────────────────────╮
│              NOTABLE PROJECTS              │
╰─────────────────────────────────────────╯

1. E-commerce Platform Modernization
   ├─ Performance: +300% improvement
   ├─ Tech Stack: React, Node.js, AWS
   └─ Impact: $2M+ revenue increase

2. Real-time Analytics Dashboard
   ├─ Response Time: <100ms data refresh
   ├─ Tech Stack: WebSocket, D3.js, PostgreSQL
   └─ Users: 10,000+ concurrent

3. AI-powered Content Management
   ├─ Production: +500% content increase
   ├─ Tech Stack: Python, TensorFlow, React
   └─ ROI: 400% within 6 months

Type 'projects' for detailed case studies`
    }
    
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('skill')) {
      return `╭─────────────────────────────────────────╮
│              TECHNICAL SKILLS              │
╰─────────────────────────────────────────╯

Frontend:     React, TypeScript, Next.js, Vue.js
Backend:      Node.js, Python, Express, FastAPI
Database:     PostgreSQL, MongoDB, Redis
Cloud:        AWS, Docker, Kubernetes, Terraform
DevOps:       CI/CD, Jenkins, GitHub Actions
AI/ML:        TensorFlow, PyTorch, OpenAI API
Certifications: 8 professional certifications

┌─ Proficiency Levels ─┐
│ Expert: ████████████ │
│ Advanced: ██████████ │
│ Intermediate: ██████ │
└─────────────────────┘`
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('available')) {
      return `╭─────────────────────────────────────────╮
│              CONTACT INFORMATION           │
╰─────────────────────────────────────────╯

📧 Email: mina.youaness@example.com
📱 Phone: +1 (555) 123-4567
💼 LinkedIn: /in/minayouaness
🐙 GitHub: /minaragaie
🌍 Location: Remote/Global
⏰ Timezone: Flexible (EST/PST/GMT)

Response Time: < 2 hours (urgent matters)
Availability: Open to opportunities
Type 'contact' for more details`
    }
    
    if (lowerMessage.includes('rate') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return `╭─────────────────────────────────────────╮
│                RATE INFORMATION            │
╰─────────────────────────────────────────╯

Full-time Positions: $120K - $180K
Contract Work: $80 - $120/hour
Project-based: Custom quotes available

Factors considered:
├─ Project complexity and scope
├─ Timeline and urgency
├─ Technology requirements
└─ Long-term vs short-term engagement

💡 Contact me for detailed pricing based on your needs`
    }
    
    if (lowerMessage.includes('process') || lowerMessage.includes('workflow') || lowerMessage.includes('approach')) {
      return `╭─────────────────────────────────────────╮
│            DEVELOPMENT PROCESS             │
╰─────────────────────────────────────────╯

1. Requirements Analysis & Planning
   ├─ Stakeholder interviews
   ├─ Technical feasibility study
   └─ Project roadmap creation

2. Architecture Design & Prototyping
   ├─ System architecture design
   ├─ Database schema planning
   └─ API specification

3. Iterative Development
   ├─ Agile methodology (2-week sprints)
   ├─ Regular code reviews
   └─ Continuous integration

4. Testing & Quality Assurance
   ├─ Unit testing (90%+ coverage)
   ├─ Integration testing
   └─ Performance optimization

5. Deployment & Monitoring
   ├─ CI/CD pipeline setup
   ├─ Production monitoring
   └─ Post-launch support`
    }
    
    if (lowerMessage.includes('availability') || lowerMessage.includes('when') || lowerMessage.includes('schedule')) {
      return `╭─────────────────────────────────────────╮
│              AVAILABILITY STATUS           │
╰─────────────────────────────────────────╯

Current Status: ✅ Available
Start Date: Immediately
Work Arrangement: Flexible

Options:
├─ Fully Remote
├─ Hybrid (Office + Remote)
└─ On-site (if required)

Timezone: Flexible (EST/PST/GMT)
Engagement: Short-term contracts to long-term
Response Time: < 2 hours for urgent matters

Type 'contact' to schedule a meeting`
    }
    
    // Default responses
    const defaultResponses = [
      `╭─────────────────────────────────────────╮
│              GENERAL RESPONSE              │
╰─────────────────────────────────────────╯

I'd be happy to help you with that! Based on my 5+ years of 
experience in full-stack development, here's what I can tell you:

┌─ My Expertise ─┐
│ • React, Node.js, TypeScript              │
│ • AWS, Docker, Kubernetes                 │
│ • Team Leadership (up to 8 developers)    │
│ • 24+ successful projects delivered       │
└─────────────────┘

For specific information, try these commands:
• 'about' - My background and story
• 'experience' - Professional experience details  
• 'projects' - Portfolio and case studies
• 'skills' - Technical skills and certifications
• 'contact' - How to reach me`,

      `╭─────────────────────────────────────────╮
│              QUICK OVERVIEW                │
╰─────────────────────────────────────────╯

That's a great question! I'm Mina, a Senior Full-Stack Developer
with extensive experience in modern web technologies.

Key Highlights:
├─ 5+ years professional experience
├─ Led teams of up to 8 developers  
├─ Delivered 24+ successful projects
├─ Specialized in React, Node.js, AWS
└─ Available for new opportunities

Type 'help' for all available commands or ask me 
anything specific about my work!`,

      `╭─────────────────────────────────────────╮
│              HOW CAN I HELP?               │
╰─────────────────────────────────────────╯

I understand you're looking for information! I'm here to help
you learn about my professional background and capabilities.

Quick Commands:
• 'ls' - Browse my portfolio files
• 'cat README.md' - Read my introduction
• 'whoami' - See my basic info
• 'status' - Check system status

Or ask me anything about:
• My development experience
• Technical skills and technologies
• Project portfolio and case studies
• Availability and contact information`
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  // Clean up AI response
  private cleanResponse(response: string): string {
    return response
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\n+/g, ' ') // Replace multiple newlines with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .substring(0, 500) // Limit length
  }

  // Check if AI service is available
  isAvailable(): boolean {
    return true // Backend handles availability
  }

  // Get service status
  getStatus(): { available: boolean; model: string; provider: string } {
    return {
      available: true,
      model: 'Backend AI',
      provider: 'Backend API'
    }
  }
}

// Export singleton instance
export const aiService = new AIService()
export default aiService

