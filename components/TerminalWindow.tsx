"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Terminal } from "lucide-react"

interface TerminalWindowProps {
  title?: string
  commands: string[]
  height?: string
  cursorBlinkSpeed?: number
  isProcessing?: boolean
  autoCloseAfter?: number
  onClose?: () => void
}

export default function TerminalWindow({
  title = "Terminal",
  commands,
  height = "h-64",
  cursorBlinkSpeed = 400,
  isProcessing = false,
  autoCloseAfter = 5000,
  onClose,
}: TerminalWindowProps) {
  const [terminalText, setTerminalText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [finished, setFinished] = useState(false)
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

  // Typing effect + cursor blinking
  useEffect(() => {
    const stopTyping = typeTerminal()
    const cursorInterval =
      cursorBlinkSpeed > 0
        ? setInterval(() => setShowCursor((prev) => !prev), cursorBlinkSpeed)
        : undefined

    return () => {
      stopTyping()
      if (cursorInterval) clearInterval(cursorInterval)
    }
  }, [typeTerminal, cursorBlinkSpeed])

  // Auto-close logic
  useEffect(() => {
    if (finished && !isProcessing && autoCloseAfter > 0) {
      const timer = setTimeout(() => onClose?.(), autoCloseAfter)
      return () => clearTimeout(timer)
    }
  }, [finished, isProcessing, autoCloseAfter, onClose])

  // Auto-scroll to bottom whenever terminalText changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [terminalText, isProcessing])

  return (
    <div className="bg-[var(--terminal-bg)] rounded-lg border border-[var(--vscode-border)] overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-[var(--terminal-title-bar)] px-4 py-2 flex items-center gap-2 border-b border-[var(--vscode-border)]">
        <Terminal className="w-4 h-4 text-[var(--vscode-text-muted)]" />
        <span className="text-sm text-[var(--vscode-text-muted)]">{title}</span>
        <div className="ml-auto flex gap-1">
          <div className="w-3 h-3 bg-[var(--vscode-error)] rounded-full"></div>
          <div className="w-3 h-3 bg-[var(--vscode-warning)] rounded-full"></div>
          <div className="w-3 h-3 bg-[var(--vscode-green)] rounded-full"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={containerRef}
        className={`p-4 font-mono text-sm overflow-y-auto ${height} text-[var(--terminal-text)]`}
      >
        <pre className="whitespace-pre-wrap">
          {terminalText}
          {isProcessing && (
            <div className="flex items-center gap-2 text-[#4ec9b0] mt-1">
              <div className="w-2 h-2 bg-[#4ec9b0] rounded-full animate-pulse" />
              <span>Processing...</span>
            </div>
          )}
          {showCursor && cursorBlinkSpeed > 0 && (
            <span className="bg-[var(--terminal-bg)] text-[var(--terminal-text)]">█</span>
          )}
        </pre>
      </div>
    </div>
  )
}
