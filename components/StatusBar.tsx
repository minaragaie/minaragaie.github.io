"use client"

import { useState, useRef, useEffect } from "react"
import { GitBranch, Coffee, X, MessageCircle, LogIn } from "lucide-react"
import TerminalWindow from "./TerminalWindow"
import AuthTerminal from "./AuthTerminal"
import { useStatusBar } from "@/context/StatusBarContext"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function StatusBar() {
  const {
    status,
    setStatus,
    terminalOpen,
    closeTerminal,
    terminalCommands,
    addCommand,
  } = useStatusBar()
  
  const {
    showAuthTerminal,
    openAuthTerminal,
    closeAuthTerminal,
    login,
  } = useAuth()
  
  const router = useRouter()
  
  // State
  const [explorerOpen, setExplorerOpen] = useState(false)

  // Track explorer overlay open/close from Sidebar
  useEffect(() => {
    const onExplorerState = (e: Event) => {
      const ce = e as CustomEvent<{ open: boolean }>
      setExplorerOpen(!!ce.detail?.open)
    }
    window.addEventListener('explorer-state', onExplorerState as EventListener)
    return () => window.removeEventListener('explorer-state', onExplorerState as EventListener)
  }, [])

  

  const handleCloseStatus = () => {
    setStatus("Ready for next challenge")
  }

  const handleLogin = (username: string, password: string) => {
    return login(username, password)
  }


  const showCloseButton =
    status !== "Ready for next challenge" &&
    !status.includes("Ready") &&
    !status.includes("challenge")

  return (
    <div id="app-status-bar" className="flex flex-row items-stretch w-full">
      {/* Mobile Remote/Close button (hidden on desktop) */}
      <button
        onClick={() => {
          if (explorerOpen) {
            const ev = new Event('close-explorer')
            window.dispatchEvent(ev)
          } else if (typeof window !== 'undefined' && (window as any).__openExplorer) {
            ;(window as any).__openExplorer()
          } else {
            const ev = new CustomEvent('open-explorer', { detail: { tab: 'explorer' } })
            window.dispatchEvent(ev)
          }
        }}
        className={`md:hidden h-full w-10 rounded-[0px] text-white flex items-center justify-center border-l border-[#3e3e42] shadow-none transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-white/12 ${
          explorerOpen ? 'bg-[#0f7a4d] hover:bg-[#0c6b43]' : 'bg-[#16825d] hover:bg-[#12905e] active:bg-[#0f7a4d]'
        }`}
        aria-label={explorerOpen ? 'Close Explorer' : 'Open a Remote Window'}
        aria-expanded={explorerOpen}
        title={explorerOpen ? 'Close Explorer' : 'Open a Remote Window'}
      >
        {explorerOpen ? (
          // Close icon (X)
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-95">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        ) : (
          // VS Code Remote style glyph: ><
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-95">
            <path d="M8 5 3 12l5 7"/>
            <path d="M16 5l5 7-5 7"/>
          </svg>
        )}
      </button>
      
      <div className="flex-1 min-w-0 bg-[#2d2d30] border-t border-[#3e3e42] px-2.5 py-1.5 md:px-4 md:py-3 flex items-center justify-between text-xs md:text-sm">
        
        <div className="relative flex items-center gap-2 md:gap-4">
          
          
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#4ec9b0]" />
            <span className="text-[#d4d4d4] font-mono">main</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Coffee className="w-4 h-4 text-[#dcb67a]" />
            <span className="text-[#d4d4d4] font-mono truncate max-w-[42vw] sm:max-w-none">{status}</span>
            {showCloseButton && (
              <button
                onClick={handleCloseStatus}
                className="ml-1 md:ml-2 p-1 hover:bg-[#3e3e42] rounded transition-colors"
                title="Dismiss message"
              >
                <X className="w-3 h-3 text-[#d4d4d4] hover:text-white" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-4">
          <button
            onClick={openAuthTerminal}
            className="flex items-center justify-center gap-1 sm:gap-2 px-1.5 py-0.5 md:px-3 bg-[#28a745] hover:bg-[#28a745]/80 text-white rounded-[3px] transition-colors font-mono text-xs md:text-sm min-h-[32px] min-w-[32px]"
            title="Sign In to Admin Panel"
            aria-label="Sign In to Admin Panel"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).__openExplorer) {
                ;(window as any).__openExplorer()
              } else {
                const ev = new CustomEvent('open-explorer', { detail: { tab: 'explorer' } })
                window.dispatchEvent(ev)
              }
            }}
            className="flex items-center justify-center gap-1 sm:gap-2 px-1.5 py-0.5 md:px-3 bg-[#007acc] hover:bg-[#007acc]/80 text-white rounded-[3px] transition-colors font-mono text-xs md:text-sm min-h-[32px] min-w-[32px]"
            title="Open AI Assistant"
            aria-label="Open AI Assistant"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">AI Chat</span>
          </button>
          <div className="hidden sm:block text-[#d4d4d4] font-mono">© 2025 Mina Youaness</div>
        </div>
      </div>

      {terminalOpen && (
        <div className="w-full z-50 transition-all duration-300">
          <TerminalWindow
            commands={terminalCommands}
            isProcessing={false}
            onClose={closeTerminal}
            cursorBlinkSpeed={400}
            height="h-64"
            title="Shortcut Terminal"
            autoCloseAfter={0}
            inputEnabled={true}
            onCommand={(cmd: string) => addCommand(cmd)}
          />
        </div>
      )}

      {showAuthTerminal && (
        <div className="w-full z-50 transition-all duration-300">
          <AuthTerminal
            onLogin={handleLogin}
            onClose={closeAuthTerminal}
          />
        </div>
      )}

      
    </div>
  )
}
