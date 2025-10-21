// Alternative AI Service using Groq (faster, free tier: 14,400 requests/day)
// https://console.groq.com/

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

class GroqAIService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
    this.baseUrl = 'https://api.groq.com/openai/v1'
  }

  async generateResponse(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackResponse(userMessage)
    }

    try {
      const messages = [
        {
          role: 'system',
          content: `You are Mina's AI assistant, a professional full-stack developer with 5+ years of experience. 
          You specialize in React, Node.js, TypeScript, AWS, and cloud technologies. 
          You're helpful, professional, and knowledgeable about software development, 
          project management, and career advice. Keep responses concise but informative (max 200 words).`
        },
        ...conversationHistory.slice(-8), // Keep last 8 messages for context
        { role: 'user', content: userMessage }
      ]

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192', // Fast, free model
          messages: messages,
          max_tokens: 200,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`Groq API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message)
      }

      return this.cleanResponse(data.choices[0]?.message?.content || '')
    } catch (error) {
      console.error('Groq AI Service Error:', error)
      return this.getFallbackResponse(userMessage)
    }
  }

  private getFallbackResponse(userMessage: string): string {
    // Same fallback responses as Hugging Face service
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
      return "I have 5+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. I've led teams of up to 8 developers and delivered 24+ successful projects across various industries including fintech, e-commerce, and data analytics."
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
      return "Some of my notable projects include: 1) E-commerce platform modernization (300% performance improvement), 2) Real-time analytics dashboard (<100ms data refresh), and 3) AI-powered content management system (500% content production increase). You can see detailed case studies on my portfolio."
    }
    
    if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('skill')) {
      return "My core technologies include React, TypeScript, Node.js, Python, AWS, Docker, and PostgreSQL. I'm also experienced with AI/ML integration, real-time systems, and microservices architecture. I stay current with the latest trends and have 8 professional certifications."
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('available')) {
      return "You can reach me through multiple channels: Email (mina.youaness@example.com) for detailed discussions, phone for urgent matters, or schedule a meeting through my calendar. I typically respond within 2 hours for high-priority inquiries. I'm available for both full-time positions and contract work."
    }
    
    if (lowerMessage.includes('rate') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "My rates vary based on project scope and duration. For full-time positions, I'm looking at $120K-$180K depending on the role and company. For contract work, I typically charge $80-$120/hour. I'm open to discussing rates based on your specific needs and project requirements."
    }
    
    if (lowerMessage.includes('process') || lowerMessage.includes('workflow') || lowerMessage.includes('approach')) {
      return "My development process follows agile methodologies with a focus on: 1) Requirements analysis and planning, 2) Architecture design and prototyping, 3) Iterative development with regular feedback, 4) Testing and quality assurance, 5) Deployment and monitoring. I emphasize communication, documentation, and continuous improvement throughout the project lifecycle."
    }
    
    if (lowerMessage.includes('availability') || lowerMessage.includes('when') || lowerMessage.includes('schedule')) {
      return "I'm currently available for new opportunities and can start immediately. I'm flexible with working arrangements - fully remote, hybrid, or on-site depending on the project needs. I can work across different time zones and am available for both short-term contracts and long-term engagements."
    }
    
    const defaultResponses = [
      "I'd be happy to help you with that! Let me provide some detailed information about my experience and capabilities.",
      "That's a great question! Based on my 5+ years of experience in full-stack development, here's what I can tell you:",
      "I understand you're looking for information about that. Let me share some insights from my professional experience:",
      "Excellent question! This is something I've worked on extensively in my career. Here's my perspective:",
      "I'm glad you asked about that! It's a topic I'm passionate about. Let me explain based on my experience:",
      "That's an interesting topic! I have some experience with this from my various projects. Here's what I think:",
      "Great question! This is something I've encountered in my projects. Here's my professional perspective:",
      "I'd love to help you with that! Let me break it down based on my technical background:",
      "That's a common question I get! Here's my professional opinion based on my experience:",
      "I'm excited to discuss this with you! Here's what I know about it from my development work:"
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)] + " I have extensive experience in full-stack development, cloud architecture, and team leadership. I'd be happy to discuss how my skills can benefit your project or organization. What specific aspect would you like to know more about?"
  }

  private cleanResponse(response: string): string {
    return response
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\n+/g, ' ') // Replace multiple newlines with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .substring(0, 500) // Limit length
  }

  isAvailable(): boolean {
    return !!this.apiKey
  }

  getStatus(): { available: boolean; model: string; provider: string } {
    return {
      available: this.isAvailable(),
      model: 'llama3-8b-8192',
      provider: 'Groq'
    }
  }
}

export const groqAIService = new GroqAIService()
export default groqAIService


