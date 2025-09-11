"use client"

import { useEffect, useState } from "react"
import { useStatusBar } from "@/context/StatusBarContext"
import AdminPage from "../admin/page"

interface SignInShortcutProps {
  shortcutKey?: string
}

export default function SignInShortcut({ shortcutKey = "A" }: SignInShortcutProps) {
  const { openTerminal, addCommand, setStatus } = useStatusBar()
  const [isAdmin, setIsAdmin] = useState(false)

  // Example: Replace with your real admin check
  useEffect(() => {
    const userIsAdmin = false // or fetch/check logic
    setIsAdmin(userIsAdmin)
  }, [])

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC")
      const modifierPressed = isMac ? e.metaKey : e.ctrlKey

      if (modifierPressed && e.shiftKey && e.key.toUpperCase() === shortcutKey.toUpperCase()) {
        e.preventDefault()

        // Update StatusBar and open terminal
        openTerminal()
        setStatus("Shortcut triggered: Opening terminal...")
        addCommand("🚀 Shortcut [Cmd+Shift+A] activated")
      }
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [shortcutKey, openTerminal, addCommand, setStatus])

  return (
    <div className="flex flex-col min-h-screen bg-[var(--vscode-bg)] text-[var(--vscode-text)]">
      <main className="flex-1 flex items-center justify-center">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <div className="flex-1 flex items-center justify-center px-4 md:px-8 bg-[var(--bg-primary)]">
            <div className="prose text-center">
              <h1>Sign in Shortcut</h1>
              <p>
                Press <kbd>Shift + Cmd + {shortcutKey.toUpperCase()}</kbd> to open the StatusBar terminal
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
