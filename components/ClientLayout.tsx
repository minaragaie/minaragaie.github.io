"use client"

import { useState, useRef, useEffect } from "react"
import { StatusBarProvider } from "@/context/StatusBarContext"
import { AuthProvider } from "@/context/AuthContext"
import { TerminalFocusProvider } from "@/context/TerminalFocusContext"
import Sidebar from "./Sidebar"
import Header from "./Header"
import StatusBar from "./StatusBar"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Start closed by default
  const sidebarRef = useRef<HTMLDivElement>(null)

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

  return (
    <AuthProvider>
      <StatusBarProvider>
        <TerminalFocusProvider>
        <div className="h-screen flex bg-[var(--vscode-bg)] text-[var(--vscode-text)] transition-colors duration-300 overflow-hidden">
        {/* Fixed Sidebar */}
        <div ref={sidebarRef} className="h-full transition-all duration-300 ease-in-out flex-shrink-0">
          <Sidebar
            currentSection=""
            onSectionClick={() => {}}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Main Content Area */}
        <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'ml-0' : 'ml-0'
        }`}>
          {/* Fixed Header */}
          <Header />
          
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden main-scrollbar">
            {children}
          </main>

          {/* Fixed Status Bar */}
          <StatusBar />
        </div>
      </div>
        </TerminalFocusProvider>
      </StatusBarProvider>
    </AuthProvider>
  )
}
