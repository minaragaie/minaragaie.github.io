"use client"

import { useState } from "react"
import { StatusBarProvider } from "@/context/StatusBarContext"
import Sidebar from "./Sidebar"
import Header from "./Header"
import StatusBar from "./StatusBar"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  return (
    <StatusBarProvider>
      <div className="flex flex-col min-h-screen bg-[var(--vscode-bg)] text-[var(--vscode-text)] transition-colors duration-300">
        <div className="main-container w-full flex flex-row overflow-x-hidden">
          {/* Sidebar Drawer */}
          <Sidebar
            currentSection=""
            onSectionClick={() => {}}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>

        {/* No props here anymore */}
        <StatusBar />
      </div>
    </StatusBarProvider>
  )
}
