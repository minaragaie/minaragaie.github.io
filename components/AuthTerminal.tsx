"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { Terminal, Shield, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthTerminalProps {
  onLogin: (username: string, password: string) => Promise<boolean>
  onClose: () => void
}

type AuthState = 'welcome' | 'username' | 'password' | 'authenticating' | 'success' | 'error'

const AuthTerminal = memo(function AuthTerminal({ onLogin, onClose }: AuthTerminalProps) {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>('welcome')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentInput, setCurrentInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [terminalText, setTerminalText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const initializedRef = useRef(false)

  // Authentication will be handled by backend

  // Initialize terminal with welcome message and start authentication
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    console.log('AuthTerminal initializing...')

    // Set welcome text immediately
    const welcomeText = `Welcome to Mina.dev Admin Terminal

System Information:
OS: macOS 14.0 (Darwin 23.0.0)
Kernel: 23.0.0
Architecture: arm64
Terminal: xterm-256color

Last login: ${new Date().toLocaleString()}

Authentication required to access admin panel.

Username: `

    // Reset state and set welcome text immediately
    setTerminalText(welcomeText)
    setUsername('')
    setPassword('')
    setCurrentInput('')
    setErrorMessage('')
    setAuthState('username')
    setIsInitialized(true)

    console.log('Welcome text set, ready for input')
  }, [])

  // Cursor blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [terminalText, currentInput])

  // Focus input when needed
  useEffect(() => {
    if (authState === 'username' || authState === 'password') {
      inputRef.current?.focus()
    }
  }, [authState])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    console.log('Key pressed:', e.key, 'AuthState:', authState, 'CurrentInput:', currentInput)

    if (authState === 'username') {
      if (e.key === 'Enter') {
        const enteredUsername = currentInput || ''
        setUsername(enteredUsername)
        setTerminalText(prev => prev + enteredUsername + '\n')
        setTerminalText(prev => prev + 'Password: ')
        setAuthState('password')
        setCurrentInput('')
        setShowPassword(false)
      } else if (e.key === 'Backspace') {
        setCurrentInput(prev => (prev || '').slice(0, -1))
      } else if (e.key.length === 1) {
        setCurrentInput(prev => (prev || '') + e.key)
      }
    } else if (authState === 'password') {
      if (e.key === 'Enter') {
        const enteredPassword = currentInput || ''
        setPassword(enteredPassword)
        setTerminalText(prev => prev + (showPassword ? enteredPassword : '*'.repeat(enteredPassword.length)) + '\n')
        setTerminalText(prev => prev + '\nAuthenticating...\n')
        setAuthState('authenticating')
        setCurrentInput('')
        
        // Authenticate with backend
        onLogin(username, enteredPassword)
          .then(success => {
            if (success) {
              setTerminalText(prev => prev + '✓ Authentication successful!\n')
              setTerminalText(prev => prev + 'Welcome, ' + username + '!\n')
              setTerminalText(prev => prev + 'Redirecting to admin panel...\n')
              setAuthState('success')
              
              // Redirect to admin page after a short delay
              setTimeout(() => {
                router.push('/admin')
              }, 2000)
            } else {
              setTerminalText(prev => prev + '✗ Authentication failed!\n')
              setTerminalText(prev => prev + 'Invalid username or password.\n')
              setTerminalText(prev => prev + 'Please try again.\n\n')
              setTerminalText(prev => prev + 'Username: ')
              setAuthState('username')
              setUsername('')
              setPassword('')
              setCurrentInput('')
            }
          })
          .catch(() => {
            setTerminalText(prev => prev + '✗ Authentication error!\n')
            setTerminalText(prev => prev + 'Network error. Please try again.\n\n')
            setTerminalText(prev => prev + 'Username: ')
            setAuthState('username')
            setUsername('')
            setPassword('')
            setCurrentInput('')
          })
      } else if (e.key === 'Backspace') {
        setCurrentInput(prev => (prev || '').slice(0, -1))
      } else if (e.key.length === 1) {
        setCurrentInput(prev => (prev || '') + e.key)
      }
    }
  }, [authState, currentInput, username, onLogin, onClose, showPassword])

  // Keyboard event handling - only when terminal is focused
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      // Only handle if the terminal container is focused or contains the active element
      if (containerRef.current && (
        containerRef.current.contains(document.activeElement) ||
        document.activeElement === containerRef.current
      )) {
        handleKeyPress(e)
      }
    }
    
    window.addEventListener('keydown', handleGlobalKeyPress)
    return () => window.removeEventListener('keydown', handleGlobalKeyPress)
  }, [handleKeyPress])

  const getDisplayInput = () => {
    const input = currentInput || ''
    if (authState === 'password') {
      return showPassword ? input : '*'.repeat(input.length)
    }
    return input
  }

  const getPrompt = () => {
    switch (authState) {
      case 'username':
        return 'Username: '
      case 'password':
        return 'Password: '
      case 'authenticating':
        return ''
      case 'success':
        return ''
      case 'error':
        return 'Username: '
      default:
        return 'Username: '
    }
  }

  return (
    <div 
      className="bg-[var(--terminal-bg)] rounded-lg border border-[var(--vscode-border)] overflow-hidden shadow-2xl focus:outline-none"
      tabIndex={0}
      onFocus={() => {
        // Ensure the terminal gets focus when clicked
        if (containerRef.current) {
          containerRef.current.focus()
        }
      }}
    >
      {/* Header */}
      <div className="bg-[var(--terminal-title-bar)] px-4 py-2 flex items-center gap-2 border-b border-[var(--vscode-border)]">
        <Terminal className="w-4 h-4 text-[var(--vscode-text-muted)]" />
        <span className="text-sm text-[var(--vscode-text-muted)]">Admin Terminal</span>
        <div className="ml-auto flex gap-1">
          <div
            className="w-3 h-3 bg-[var(--vscode-error)] rounded-full cursor-pointer"
            onClick={onClose}
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
          {isInitialized && authState !== 'authenticating' && authState !== 'success' && (authState === 'username' || authState === 'password') && (
            <>
              <span>{getDisplayInput()}</span>
              <span className="bg-[var(--terminal-bg)] text-[var(--terminal-text)]">
                {showCursor ? "█" : ""}
              </span>
            </>
          )}
          {authState === 'authenticating' && (
            <div className="flex items-center gap-2 text-[#4ec9b0]">
              <div className="w-2 h-2 bg-[#4ec9b0] rounded-full animate-pulse" />
              <span>Authenticating...</span>
            </div>
          )}
          {authState === 'success' && (
            <div className="flex items-center gap-2 text-[#4ec9b0]">
              <Shield className="w-4 h-4" />
              <span>Access granted! Redirecting...</span>
            </div>
          )}
        </pre>
      </div>

      {/* Password visibility toggle */}
      {authState === 'password' && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      )}
    </div>
  )
})

AuthTerminal.displayName = 'AuthTerminal'
export default AuthTerminal
