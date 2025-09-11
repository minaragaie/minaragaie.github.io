// context/StatusBarContext.tsx
"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface StatusBarContextProps {
  status: string
  setStatus: (status: string) => void
  terminalOpen: boolean
  openTerminal: () => void
  closeTerminal: () => void
  terminalCommands: string[]
  addCommand: (cmd: string) => void
}

const StatusBarContext = createContext<StatusBarContextProps | undefined>(undefined)

export const StatusBarProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState("Ready for next challenge")
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [terminalCommands, setTerminalCommands] = useState<string[]>([])

  const openTerminal = () => setTerminalOpen(true)
  const closeTerminal = () => setTerminalOpen(false)

  const addCommand = (cmd: string) =>
    setTerminalCommands((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${cmd}`])

  return (
    <StatusBarContext.Provider
      value={{
        status,
        setStatus,
        terminalOpen,
        openTerminal,
        closeTerminal,
        terminalCommands,
        addCommand,
      }}
    >
      {children}
    </StatusBarContext.Provider>
  )
}

export const useStatusBar = () => {
  const ctx = useContext(StatusBarContext)
  if (!ctx) throw new Error("useStatusBar must be used within StatusBarProvider")
  return ctx
}
