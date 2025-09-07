"use client"

import { GitBranch, Coffee, X } from "lucide-react"

interface StatusBarProps {
  status?: string
  isVisible?: boolean
  onStatusChange?: (status: string) => void
  sidebarCollapsed?: boolean
}

export default function StatusBar({
  status = "Ready for next challenge",
  isVisible = true,
  onStatusChange,
  sidebarCollapsed = false,
}: StatusBarProps) {
  if (!isVisible) return null

  const handleCloseStatus = () => {
    onStatusChange?.("Ready for next challenge")
  }

  const showCloseButton =
    status !== "Ready for next challenge" && !status.includes("Ready") && !status.includes("challenge")


  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#2d2d30] border-t border-[#3e3e42] px-4 py-3 flex items-center justify-between text-sm z-50`}
    >
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
  )
}
