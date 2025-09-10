"use client"

import { useEffect } from "react"

interface SignInShortcutProps {
  shortcutKey?: string // default: "T"
  onTrigger?: () => void
}


export default function SignInShortcut({ shortcutKey = "Y", onTrigger }: SignInShortcutProps) {
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC")
      const modifierPressed = isMac ? e.metaKey : e.ctrlKey

      if (modifierPressed && e.shiftKey && e.key.toUpperCase() === shortcutKey.toUpperCase()) {
        e.preventDefault()
        onTrigger?.()
      }
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [shortcutKey, onTrigger])

  return (
    <div className="flex-1 flex items-center justify-center px-4 md:px-8 bg-[var(--bg-primary)]">
      <div className="prose text-center">
        <h1>Sign in Shortcut</h1>
        <p>
          Press <kbd>Shift + Cmd + {shortcutKey.toUpperCase()}</kbd> to sign in
        </p>
      </div>
    </div>
  )
}
