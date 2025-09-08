"use client"

import { useState, useEffect } from "react"
import TerminalWindow from "./TerminalWindow"

interface ShortcutTerminalProps {
  shortcutKey?: string // default: "T"
  commands?: string[]
}

export default function ShortcutTerminal({
  shortcutKey = "T",
  commands = [],
}: ShortcutTerminalProps) {
  const [showTerminal, setShowTerminal] = useState(false)
  const [inputEnabled, setInputEnabled] = useState(false)

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const modifierPressed = isMac ? e.metaKey : e.ctrlKey

      if (modifierPressed && e.shiftKey && e.key.toUpperCase() === shortcutKey.toUpperCase()) {
        e.preventDefault()
        setShowTerminal(true)
        setInputEnabled(true)
      }
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [shortcutKey])

  const handleClose = () => {
    setShowTerminal(false)
    setInputEnabled(false)
  }

  return (
    <>
      {showTerminal && (
        <div className=" w-full z-50 transition-all duration-300">
          <TerminalWindow
            commands={commands}
            isProcessing={false}
            onClose={handleClose}   // Parent controls closing
            cursorBlinkSpeed={400}
            height="h-64"
            title="Shortcut Terminal"
            autoCloseAfter={0}
            inputEnabled={inputEnabled} // Pass inputEnabled to allow typing
          />
        </div>
      )}
    </>
  )
}
