"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { Terminal } from "lucide-react"
import { aiService } from '@/lib/ai-service'
import { useTerminalFocus } from "@/context/TerminalFocusContext"

interface ChatTerminalProps {
  onClose: () => void
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

const ChatTerminal = memo(function ChatTerminal({ onClose }: ChatTerminalProps) {
  const { activeTerminal, setActiveTerminal } = useTerminalFocus()
  const [terminalText, setTerminalText] = useState('')
  const [currentInput, setCurrentInput] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [showProcessingCursor, setShowProcessingCursor] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initializedRef = useRef(false)

  // Initialize terminal with welcome sequence
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const welcomeSequence = [
      'AI Assistant Terminal v1.0.0',
      '',
      'System Information:',
      'OS: macOS 14.0 (Darwin 23.0.0)',
      'Kernel: 23.0.0',
      'Architecture: arm64',
      'Terminal: xterm-256color',
      'AI Model: GPT-4',
      '',
      'Last login: ' + new Date().toLocaleString(),
      '',
      'AI Assistant ready. Type your questions about Mina\'s experience, projects, or skills.',
      'Use "help" for available commands or just ask naturally.',
      '',
      'user@portfolio:~$ '
    ]

    let commandIndex = 0
    let charIndex = 0
    let currentText = ""
    const typingSpeed = 30

    const typeText = () => {
      if (commandIndex < welcomeSequence.length) {
        const currentCommand = welcomeSequence[commandIndex]
        if (charIndex < currentCommand.length) {
          currentText += currentCommand[charIndex]
          setTerminalText(currentText)
          charIndex++
          setTimeout(typeText, typingSpeed)
        } else {
          currentText += "\n"
          setTerminalText(currentText)
          commandIndex++
          charIndex = 0
          setTimeout(typeText, 50)
        }
      } else {
        setShowCursor(true)
        setIsTyping(false)
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    }

    setIsTyping(true)
    typeText()
  }, [])

  // Cursor blinking effect
  useEffect(() => {
    if (!isTyping) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev)
      }, 400)
      return () => clearInterval(interval)
    }
  }, [isTyping])

  // Processing cursor blinking effect
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setShowProcessingCursor(prev => !prev)
      }, 400)
      return () => clearInterval(interval)
    } else {
      setShowProcessingCursor(true) // Reset when not processing
    }
  }, [isProcessing])

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [terminalText])

  const getConversationHistory = (): ConversationMessage[] => {
    return conversationHistory
  }


  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isTyping || isProcessing) return

    if (e.key === 'Enter') {
      e.preventDefault()
      const input = currentInput.trim()
      if (input) {
        // Add user input to terminal
        setTerminalText(prev => prev + input + '\n')
        setCurrentInput('')
        
        // Process the command
        processCommand(input)
      } else {
        // Just add a new prompt line
        setTerminalText(prev => prev + 'user@portfolio:~$ ')
      }
    } else if (e.key === 'Backspace') {
      setCurrentInput(prev => prev.slice(0, -1))
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      setCurrentInput(prev => prev + e.key)
    }
  }, [currentInput, isTyping, isProcessing])

  const processCommand = async (command: string) => {
    if (command.toLowerCase() === 'help') {
      const helpText = [
        'Available commands:',
        '  help          - Show this help message',
        '  clear         - Clear the terminal',
        '  about         - About Mina Youaness',
        '  experience    - Show work experience',
        '  projects      - Show recent projects',
        '  skills        - Show technical skills',
        '  contact       - Show contact information',
        '',
        'You can also ask natural questions like:',
        '  "What technologies do you use?"',
        '  "Tell me about your experience"',
        '  "What projects have you worked on?"',
        '',
        'user@portfolio:~$ '
      ]
      
      for (let i = 0; i < helpText.length; i++) {
        setTimeout(() => {
          setTerminalText(prev => prev + helpText[i] + '\n')
        }, i * 50)
      }
      return
    }

    if (command.toLowerCase() === 'clear') {
      setTerminalText('user@portfolio:~$ ')
      return
    }

    // Handle special commands
    if (['about', 'experience', 'projects', 'skills', 'contact'].includes(command.toLowerCase())) {
      setIsProcessing(true)
      setTerminalText(prev => prev + 'Processing command...\n')
      
      try {
        const conversationHistory = getConversationHistory()
        const aiResponse = await aiService.generateResponse(command, conversationHistory)
        
        // Add AI response with typing effect
        await typeAIResponse(aiResponse)
        
        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: command },
          { role: 'assistant', content: aiResponse }
        ])
      } catch (error) {
        setTerminalText(prev => prev + 'Error: Unable to process request. Please try again.\nuser@portfolio:~$ ')
      } finally {
        setIsProcessing(false)
      }
    } else {
      // Handle natural language questions
      setIsProcessing(true)
      setTerminalText(prev => prev + 'Processing...\n')
      
      try {
        const conversationHistory = getConversationHistory()
        const aiResponse = await aiService.generateResponse(command, conversationHistory)
        
        // Add AI response with typing effect
        await typeAIResponse(aiResponse)
        
        // Update conversation history
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: command },
          { role: 'assistant', content: aiResponse }
        ])
      } catch (error) {
        console.error('AI Error:', error)
        setTerminalText(prev => prev + 'Error: Unable to process request. Please try again.\nuser@portfolio:~$ ')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const typeAIResponse = async (response: string) => {
    // Remove the current prompt before typing response
    setTerminalText(prev => prev.replace(/user@portfolio:~$ $/, ''))
    
    // Add the response with a proper typing effect
    const lines = response.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (let j = 0; j < line.length; j++) {
        setTerminalText(prev => prev + line[j])
        await new Promise(resolve => setTimeout(resolve, 20))
      }
      if (i < lines.length - 1) {
        setTerminalText(prev => prev + '\n')
      }
    }
    
    // Add final prompt after response is complete
    setTerminalText(prev => prev + '\nuser@portfolio:~$ ')
  }

  // Keyboard event handling - only when this terminal is active
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (activeTerminal === 'chat') {
        handleKeyPress(e)
      }
    }
    
    document.addEventListener('keydown', handleGlobalKeyPress)
    return () => document.removeEventListener('keydown', handleGlobalKeyPress)
  }, [handleKeyPress, activeTerminal])

  return (
    <div 
      className="bg-[var(--terminal-bg)] rounded-lg border border-[var(--vscode-border)] overflow-hidden shadow-2xl focus:outline-none"
      tabIndex={0}
      onClick={() => {
        // Set this terminal as active and focus it
        setActiveTerminal('chat')
        if (containerRef.current) {
          containerRef.current.focus()
        }
      }}
      onFocus={() => {
        // Ensure the terminal gets focus when clicked
        if (containerRef.current) {
          containerRef.current.focus()
        }
      }}
    >
        {/* Terminal Header */}
        <div className="bg-[var(--terminal-title-bar)] px-4 py-2 flex items-center gap-2 border-b border-[var(--vscode-border)]">
          <Terminal className="w-4 h-4 text-[var(--vscode-text-muted)]" />
          <span className="text-sm text-[var(--vscode-text-muted)]">AI Assistant Terminal</span>
          <div className="ml-auto flex gap-1">
            <div
              className="w-3 h-3 bg-[var(--vscode-error)] rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onClose}
              title="Close Terminal"
            ></div>
            <div className="w-3 h-3 bg-[var(--vscode-warning)] rounded-full"></div>
            <div className="w-3 h-3 bg-[var(--vscode-green)] rounded-full"></div>
          </div>
        </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="p-4 font-mono text-sm overflow-y-auto h-80 text-[var(--terminal-text)] scrollbar-thin"
      >
            <pre className="whitespace-pre-wrap">
              {terminalText}
              {isProcessing && showProcessingCursor && (
                <span className="text-[var(--vscode-warning)]">█</span>
              )}
              {!isTyping && !isProcessing && (
                <span className="text-[var(--vscode-green)]">user@portfolio:~$ </span>
              )}
              <span className="text-[var(--terminal-text)]">{currentInput}</span>
              {!isTyping && !isProcessing && showCursor && (
                <span className="bg-[var(--terminal-text)] text-[var(--terminal-bg)]">█</span>
              )}
            </pre>
      </div>
    </div>
  )
})

export default ChatTerminal
