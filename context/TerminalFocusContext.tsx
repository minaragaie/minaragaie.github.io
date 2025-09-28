"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

type TerminalType = 'auth' | 'chat' | null

interface TerminalFocusContextType {
  activeTerminal: TerminalType
  setActiveTerminal: (terminal: TerminalType) => void
}

const TerminalFocusContext = createContext<TerminalFocusContextType | undefined>(undefined)

export function TerminalFocusProvider({ children }: { children: ReactNode }) {
  const [activeTerminal, setActiveTerminal] = useState<TerminalType>(null)

  return (
    <TerminalFocusContext.Provider value={{ activeTerminal, setActiveTerminal }}>
      {children}
    </TerminalFocusContext.Provider>
  )
}

export function useTerminalFocus() {
  const context = useContext(TerminalFocusContext)
  if (context === undefined) {
    throw new Error('useTerminalFocus must be used within a TerminalFocusProvider')
  }
  return context
}
