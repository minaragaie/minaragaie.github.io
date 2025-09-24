"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import AdminPage from "../admin/page"

interface SignInShortcutProps {
  shortcutKey?: string
}

export default function SignInShortcut({ shortcutKey = "A" }: SignInShortcutProps) {
  const { openAuthTerminal } = useAuth()
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

        // Open auth terminal instead of old terminal
        openAuthTerminal()
      }
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [shortcutKey, openAuthTerminal])

  return (
    <div className="flex flex-col min-h-screen bg-[var(--vscode-bg)] text-[var(--vscode-text)]">
      <main className="flex-1 flex items-center justify-center">
        {isAdmin ? (
          <AdminPage />
        ) : (
          <div className="flex-1 flex items-center justify-center px-4 md:px-8 bg-[var(--bg-primary)]">
            <div className="prose text-center">
              <h1>Authentication Required</h1>
              <p className="text-lg text-gray-300 mb-6">
                You need to authenticate to access the admin panel.
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Press <kbd className="px-2 py-1 bg-gray-700 rounded">Shift + Cmd + {shortcutKey.toUpperCase()}</kbd> to open the authentication terminal
              </p>
              <div className="text-xs text-gray-500">
                <p>Credentials:</p>
                <p>Username: <code className="text-green-400">mina</code></p>
                <p>Password: <code className="text-green-400">pass!100</code></p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
