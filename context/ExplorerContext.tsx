"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type ExplorerContextValue = {
  isOpen: boolean
  activeTab: string
  openExplorer: (tab?: string) => void
  closeExplorer: () => void
}

const ExplorerContext = createContext<ExplorerContextValue | null>(null)

export function ExplorerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("explorer")

  const openExplorer = useCallback((tab?: string) => {
    if (tab) setActiveTab(tab)
    setIsOpen(true)
  }, [])

  const closeExplorer = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const openHandler = (e: Event) => {
      const ce = e as CustomEvent<{ tab?: string }>
      if (ce.detail?.tab) setActiveTab(ce.detail.tab)
      setIsOpen(true)
    }
    const closeHandler = () => setIsOpen(false)
    window.addEventListener("open-explorer", openHandler as EventListener)
    window.addEventListener("close-explorer", closeHandler as EventListener)
    return () => {
      window.removeEventListener("open-explorer", openHandler as EventListener)
      window.removeEventListener("close-explorer", closeHandler as EventListener)
    }
  }, [])

  // Broadcast open/close state so StatusBar can reflect aria-expanded on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ev = new CustomEvent('explorer-state', { detail: { open: isOpen } })
      window.dispatchEvent(ev)
    }
  }, [isOpen])

  // Ensure a valid tab is active whenever opening
  useEffect(() => {
    if (isOpen) {
      const valid = ["explorer", "search", "git", "extensions", "settings"]
      if (!valid.includes(activeTab)) setActiveTab("explorer")
    }
  }, [isOpen, activeTab])

  const value = useMemo<ExplorerContextValue>(() => ({ isOpen, activeTab, openExplorer, closeExplorer }), [isOpen, activeTab, openExplorer, closeExplorer])

  return <ExplorerContext.Provider value={value}>{children}</ExplorerContext.Provider>
}

export function useExplorer() {
  const ctx = useContext(ExplorerContext)
  if (!ctx) throw new Error("useExplorer must be used within ExplorerProvider")
  return ctx
}


