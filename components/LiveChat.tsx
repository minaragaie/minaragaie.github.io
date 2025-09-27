"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { aiService } from '@/lib/ai-service'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2, 
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Code,
  Lightbulb,
  Star,
  ThumbsUp,
  ThumbsDown,
  Terminal
} from "lucide-react"

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isTyping?: boolean
  suggestions?: string[]
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatState {
  isOpen: boolean
  isMinimized: boolean
  isOnline: boolean
  lastSeen: Date | null
}

const botResponses = [
  "I'd be happy to help you with that! Let me provide some detailed information.",
  "That's a great question! Based on my experience, here's what I recommend:",
  "I understand you're looking for information about that. Let me share some insights:",
  "Excellent question! This is something I've worked on extensively. Here's my take:",
  "I'm glad you asked about that! It's a topic I'm passionate about. Let me explain:",
  "That's an interesting topic! I have some experience with this. Here's what I think:",
  "Great question! This is something I've encountered in my projects. Here's my perspective:",
  "I'd love to help you with that! Let me break it down for you:",
  "That's a common question I get! Here's my professional opinion:",
  "I'm excited to discuss this with you! Here's what I know about it:"
]

const quickSuggestions = [
  "Tell me about your experience",
  "What projects have you worked on?",
  "What technologies do you use?",
  "How can I contact you?",
  "What's your availability?",
  "Tell me about your rates",
  "What's your process?",
  "Show me your portfolio"
]

export default function LiveChat() {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    isMinimized: false,
    isOnline: true,
    lastSeen: new Date()
  })
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: aiService.isAvailable() 
        ? "Hi! I'm Mina's AI assistant powered by advanced language models. I can help answer questions about his experience, projects, and availability. What would you like to know?"
        : "Hi! I'm Mina's AI assistant. I can help answer questions about his experience, projects, and availability. What would you like to know?",
      timestamp: new Date(),
      suggestions: quickSuggestions.slice(0, 4)
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (chatState.isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [chatState.isOpen])

  // Convert chat messages to conversation format for AI
  const getConversationHistory = (): ConversationMessage[] => {
    return messages
      .filter(msg => msg.type === 'user' || msg.type === 'bot')
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
  }

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      // Get conversation history for context
      const conversationHistory = getConversationHistory()
      
      // Generate AI response
      const aiResponse = await aiService.generateResponse(content, conversationHistory)
      
      // Simulate realistic typing delay
      const typingDelay = Math.min(2000, Math.max(500, aiResponse.length * 20))
      await new Promise(resolve => setTimeout(resolve, typingDelay))

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: Math.random() > 0.5 ? quickSuggestions.slice(0, 3) : undefined
      }

      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error generating AI response:', error)
      
      // Fallback to default response
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or contact me directly through the other available methods.",
        timestamp: new Date(),
        suggestions: quickSuggestions.slice(0, 3)
      }
      
      setMessages(prev => [...prev, fallbackResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const toggleChat = () => {
    setChatState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      isMinimized: false
    }))
  }

  const toggleMinimize = () => {
    setChatState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized
    }))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (!chatState.isOpen) {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={toggleChat}
          className="bg-gradient-to-r from-[var(--vscode-blue)] to-[var(--vscode-green)] hover:from-[var(--vscode-blue)]/80 hover:to-[var(--vscode-green)]/80 text-white rounded-lg px-6 py-3 shadow-2xl animate-pulse font-mono text-sm"
        >
          <Terminal className="w-4 h-4 mr-2" />
          Open AI Assistant
        </Button>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--vscode-green)] rounded-full border-2 border-[var(--vscode-bg)] flex items-center justify-center">
          <div className="w-2 h-2 bg-[var(--vscode-bg)] rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out ${
      chatState.isOpen ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <Card className={`bg-[var(--terminal-bg)] border-[var(--vscode-border)] shadow-2xl mx-4 mb-4 rounded-t-lg border-b-0 ${
        chatState.isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardContent className="p-0 h-full flex flex-col">
          {/* Terminal Header */}
          <div className="bg-[var(--terminal-title-bar)] px-4 py-2 flex items-center gap-2 border-b border-[var(--vscode-border)]">
            <Terminal className="w-4 h-4 text-[var(--vscode-text-muted)]" />
            <span className="text-sm text-[var(--vscode-text-muted)]">AI Assistant Terminal</span>
            <div className="ml-auto flex gap-1">
              <div 
                className="w-3 h-3 bg-[var(--vscode-error)] rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                onClick={toggleChat}
                title="Close Chat"
              ></div>
              <div 
                className="w-3 h-3 bg-[var(--vscode-warning)] rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                onClick={toggleMinimize}
                title={chatState.isMinimized ? "Maximize" : "Minimize"}
              ></div>
              <div className="w-3 h-3 bg-[var(--vscode-green)] rounded-full"></div>
            </div>
          </div>

          {!chatState.isMinimized && (
            <>
              {/* Terminal Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm bg-[var(--terminal-bg)]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex space-x-2 max-w-[90%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
                        message.type === 'user' 
                          ? 'bg-[var(--vscode-blue)] text-white' 
                          : 'bg-[var(--vscode-green)] text-[var(--vscode-bg)]'
                      }`}>
                        {message.type === 'user' ? '>' : '$'}
                      </div>
                      <div className={`rounded p-2 flex-1 ${
                        message.type === 'user'
                          ? 'bg-[var(--vscode-blue)] text-white'
                          : 'bg-[var(--vscode-tab)] text-[var(--terminal-text)] border-l-2 border-[var(--vscode-green)]'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.type === 'bot' && (
                            <div className="flex space-x-1">
                              <button className="text-xs opacity-70 hover:opacity-100">
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              <button className="text-xs opacity-70 hover:opacity-100">
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        {message.suggestions && (
                          <div className="mt-3 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs p-2 rounded bg-[var(--vscode-tab)] hover:bg-[var(--vscode-sidebar)] transition-colors font-mono border-l-2 border-[var(--vscode-green)] text-[var(--terminal-text)]"
                              >
                                <span className="text-[var(--vscode-green)]">→</span> {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2">
                      <div className="w-6 h-6 rounded bg-[var(--vscode-green)] text-[var(--vscode-bg)] flex items-center justify-center text-xs">
                        $
                      </div>
                      <div className="bg-[var(--vscode-tab)] border-l-2 border-[var(--vscode-green)] rounded p-2">
                        <div className="flex space-x-1">
                          <span className="text-[var(--terminal-text)]">AI is typing</span>
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-[var(--vscode-green)] rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-[var(--vscode-green)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-[var(--vscode-green)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Terminal Input */}
              <div className="p-4 border-t border-[var(--vscode-border)] bg-[var(--terminal-bg)]">
                <form onSubmit={handleSendMessage} className="flex space-x-2 items-center">
                  <div className="flex items-center space-x-2 text-[var(--terminal-text)] font-mono text-sm">
                    <span className="text-[var(--vscode-green)]">user@portfolio</span>
                    <span className="text-[var(--vscode-text-muted)]">:</span>
                    <span className="text-[var(--vscode-blue)]">~</span>
                    <span className="text-[var(--vscode-text-muted)]">$</span>
                  </div>
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="ask about experience, projects, skills..."
                      className="w-full bg-transparent border-none text-[var(--terminal-text)] font-mono text-sm focus:ring-0 focus:outline-none placeholder:text-[var(--vscode-text-muted)]"
                      disabled={isTyping}
                    />
                    {!inputMessage && !isTyping && (
                      <div className="absolute right-0 top-0 h-full flex items-center">
                        <div className="w-0.5 h-4 bg-[var(--vscode-green)] animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-[var(--vscode-green)] hover:bg-[var(--vscode-green)]/80 text-[var(--vscode-bg)] font-mono text-xs px-3 py-1"
                  >
                    ENTER
                  </Button>
                </form>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
