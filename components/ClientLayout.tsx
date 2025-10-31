"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { StatusBarProvider } from "@/context/StatusBarContext"
import { ExplorerProvider, useExplorer } from "@/context/ExplorerContext"
import { AuthProvider } from "@/context/AuthContext"
import { TerminalFocusProvider } from "@/context/TerminalFocusContext"
import Sidebar from "./Sidebar"
import Header from "./Header"
import StatusBar from "./StatusBar"
import SidePanel from "./SidePanel"

function LayoutInner({
  children,
  sidebarCollapsed,
  setSidebarCollapsed,
  handleSectionClick,
  sidebarRef,
}: {
  children: React.ReactNode
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  handleSectionClick: (sectionId: string) => void
  sidebarRef: React.RefObject<HTMLDivElement> | React.MutableRefObject<HTMLDivElement | null>
}) {
  const { isOpen: explorerIsOpen } = useExplorer()
  return (
    <div className="h-[100dvh] flex bg-[var(--vscode-bg)] text-[var(--vscode-text)] transition-colors duration-300 overflow-hidden">
      {/* Fixed Sidebar */}
      <div ref={sidebarRef} className="h-full transition-all duration-300 ease-in-out flex-shrink-0">
        <Sidebar
          currentSection=""
          onSectionClick={handleSectionClick}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out ${explorerIsOpen ? 'md:ml-[256px]' : ''}`}>
        {/* Fixed-in-layout Header (outside scroll area) */}
        <Header />

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden main-scrollbar pb-16 md:pb-0">
          {children}
        </main>

        {/* Sidebar Panel (overlay on mobile, docked on desktop) */}
        <SidePanel />

        {/* Fixed-in-layout Status Bar (outside scroll area) */}
        <StatusBar />
      </div>
    </div>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Start closed by default
  const sidebarRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarCollapsed(true)
      }
    }

    // Only add listener when sidebar is open
    if (!sidebarCollapsed) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarCollapsed])

  // Handle sidebar navigation
  const handleSectionClick = (sectionId: string) => {
    // If we're not on the main page, navigate to it first
    if (pathname !== '/') {
      router.push(`/#${sectionId}`)
      return
    }

    // If we're on the main page, scroll to the section
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Ensure global open-explorer opens the sidebar on mobile/any view
  useEffect(() => {
    const onOpenExplorer = () => {
      // Ensure open happens after any concurrent handlers
      if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        window.requestAnimationFrame(() => setSidebarCollapsed(false))
      } else {
        setSidebarCollapsed(false)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('open-explorer', onOpenExplorer as EventListener)
      ;(window as any).__openExplorer = () => {
        // Ensure SidePanel opens via context event, then adjust sidebar collapsed state
        const ev = new CustomEvent('open-explorer', { detail: { tab: 'explorer' } })
        window.dispatchEvent(ev)
        setSidebarCollapsed(false)
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('open-explorer', onOpenExplorer as EventListener)
        if ((window as any).__openExplorer) delete (window as any).__openExplorer
      }
    }
  }, [])

  return (
    <AuthProvider>
      <StatusBarProvider>
        <ExplorerProvider>
          <TerminalFocusProvider>
            <LayoutInner
              children={children}
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              handleSectionClick={handleSectionClick}
              sidebarRef={sidebarRef}
            />
          </TerminalFocusProvider>
        </ExplorerProvider>
      </StatusBarProvider>
    </AuthProvider>
  )
}
