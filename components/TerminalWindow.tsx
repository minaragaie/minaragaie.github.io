"use client"

import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react"
import { Terminal, Copy, Check } from "lucide-react"

interface TerminalWindowProps {
  title?: string
  commands?: string[]
  content?: string // For static content (no typing animation)
  height?: string
  cursorBlinkSpeed?: number
  isProcessing?: boolean
  autoCloseAfter?: number
  onClose?: () => void
  inputEnabled?: boolean
  onCommand?: (cmd: string) => void
  typingAnimation?: boolean // Enable/disable typing animation
  showCopyButton?: boolean // Show copy button in header
  language?: string // Language label for code blocks
}

const TerminalWindow = memo(({
  title = "Terminal",
  commands = [],
  content,
  height = "h-64",
  cursorBlinkSpeed = 400,
  isProcessing = false,
  autoCloseAfter = 5000,
  onClose,
  inputEnabled = false,
  onCommand,
  typingAnimation = true,
  showCopyButton = false,
  language
}: TerminalWindowProps) => {
  const [terminalText, setTerminalText] = useState(
    typingAnimation ? "Welcome to the shortcut terminal!\n\n" : (content || commands.join('\n'))
  )
  const [currentInput, setCurrentInput] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [finished, setFinished] = useState(!typingAnimation)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const terminalCommands = useMemo(() => commands, [commands])

  const typeTerminal = useCallback(() => {
    let commandIndex = 0
    let charIndex = 0
    let currentText = ""
    let isTyping = true
    const typingSpeed = 4
    const commandPause = 50

    const animate = () => {
      if (!isTyping || commandIndex >= terminalCommands.length) {
        setFinished(true)
        return
      }

      const currentCommand = terminalCommands[commandIndex]
      if (charIndex < currentCommand.length) {
        currentText += currentCommand[charIndex]
        setTerminalText(currentText)
        charIndex++
        setTimeout(animate, typingSpeed)
      } else {
        currentText += "\n"
        setTerminalText(currentText)
        commandIndex++
        charIndex = 0
        setTimeout(animate, commandPause)
      }
    }

    animate()
    return () => {
      isTyping = false
    }
  }, [terminalCommands])

  // Copy handler
  const handleCopy = useCallback(async () => {
    const textToCopy = content || commands.join('\n') || terminalText
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [content, commands, terminalText])

  // Typing + cursor blinking
  useEffect(() => {
    if (!typingAnimation) return // Skip typing animation if disabled
    
    const stopTyping = typeTerminal()
    const cursorInterval =
      cursorBlinkSpeed > 0
        ? setInterval(() => setShowCursor((prev) => !prev), cursorBlinkSpeed)
        : undefined

    return () => {
      stopTyping()
      if (cursorInterval) clearInterval(cursorInterval)
    }
  }, [typeTerminal, cursorBlinkSpeed, typingAnimation])
  
  // Cursor blinking for non-typing mode
  useEffect(() => {
    if (typingAnimation) return // Already handled above
    
    const cursorInterval =
      cursorBlinkSpeed > 0
        ? setInterval(() => setShowCursor((prev) => !prev), cursorBlinkSpeed)
        : undefined

    return () => {
      if (cursorInterval) clearInterval(cursorInterval)
    }
  }, [cursorBlinkSpeed, typingAnimation])

  // Auto-close
  useEffect(() => {
    if (finished && !isProcessing && autoCloseAfter > 0) {
      const timer = setTimeout(() => onClose?.(), autoCloseAfter)
      return () => clearTimeout(timer)
    }
  }, [finished, isProcessing, autoCloseAfter, onClose])

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [terminalText, isProcessing, currentInput])

  // Listen for typing
  useEffect(() => {
    if (!inputEnabled) return
   
    const handleKey = (e: KeyboardEvent) => {
       e.preventDefault()
      if (e.key === "Backspace") {
        setCurrentInput((prev) => prev.slice(0, -1))
      } else if (e.key === "Enter") {
        // Append command to terminal text with newline
        setTerminalText((prev) => prev + `> ${currentInput}\n`)
        if (currentInput.trim() !== "") {
        onCommand?.(currentInput.trim())
  }
        setCurrentInput("") // clear input
      } else if (e.key.length === 1) {
        setCurrentInput((prev) => prev + e.key)
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [inputEnabled, currentInput])

  return (
    <div className="bg-[var(--terminal-bg)] rounded-lg border border-[var(--vscode-border)] overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--terminal-title-bar)] px-4 py-2 flex items-center gap-2 border-b border-[var(--vscode-border)]">
        {/* Left side - Traffic lights + Icon + Title */}
        <div className="flex items-center gap-2 flex-1">
          <div className="flex gap-1.5">
            <div
              className="w-3 h-3 bg-[var(--vscode-error)] rounded-full cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onClose}
            ></div>
            <div className="w-3 h-3 bg-[var(--vscode-warning)] rounded-full"></div>
            <div className="w-3 h-3 bg-[var(--vscode-green)] rounded-full"></div>
          </div>
          <Terminal className="w-4 h-4 text-[var(--vscode-text-muted)] ml-2" />
          <span className="text-sm text-[var(--vscode-text-muted)]">{title}</span>
          {language && (
            <span className="text-xs font-mono text-[var(--vscode-text-muted)] uppercase tracking-wide ml-2 opacity-60">
              {language}
            </span>
          )}
        </div>
        
        {/* Right side - Copy button */}
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all duration-150 hover:bg-white/5"
            style={{ color: "var(--vscode-text-muted)" }}
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--vscode-green)]" />
                <span className="text-[var(--vscode-green)]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className={`p-4 font-mono text-sm overflow-y-auto ${height} text-[var(--terminal-text)] scrollbar-thin`}
      >
        <pre className="whitespace-pre-wrap">
          {/* Static content mode - no animation */}
          {!typingAnimation && content}
          
          {/* Typing animation mode */}
          {typingAnimation && terminalText}
          
          {isProcessing && (
            <div className="flex items-center gap-2 text-[#4ec9b0] mt-1">
              <div className="w-2 h-2 bg-[#4ec9b0] rounded-full animate-pulse" />
              <span>Processing...</span>
            </div>
          )}
          {/* Render the prompt + current input + cursor at the end */}
          {inputEnabled && (
            <>
              <span>&gt; {currentInput}</span>
              <span className="bg-[var(--terminal-bg)] text-[var(--terminal-text)]">
                {showCursor ? "█" : ""}
              </span>
            </>
          )}
          {!inputEnabled && !typingAnimation && cursorBlinkSpeed > 0 && showCursor && (
            <span className="bg-[var(--terminal-bg)] text-[var(--terminal-text)]">█</span>
          )}
          {!inputEnabled && typingAnimation && showCursor && (
            <span className="bg-[var(--terminal-bg)] text-[var(--terminal-text)]">█</span>
          )}
        </pre>
      </div>
    </div>
  )
})

TerminalWindow.displayName = 'TerminalWindow'
export default TerminalWindow
