"use client"

import { GitBranch, Coffee, X } from "lucide-react"
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
    <div className="flex flex-col">
      <div className="bg-[#2d2d30] border-t border-[#3e3e42] px-4 py-3 flex items-center justify-between text-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#4ec9b0]" />
            <span className="text-[#d4d4d4] font-mono">main</span>
          </div>
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-[#dcb67a]" />
            <span className="text-[#d4d4d4] font-mono">{status}</span>
            {showCloseButton && (
              <button
                onClick={handleCloseStatus}
                className="ml-2 p-1 hover:bg-[#3e3e42] rounded transition-colors"
                title="Dismiss message"
              >
                <X className="w-3 h-3 text-[#d4d4d4] hover:text-white" />
              </button>
            )}
          </div>
        </div>
        <div className="text-[#d4d4d4] font-mono">© 2025 Mina Youaness</div>
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
