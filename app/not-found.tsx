"use client"

import Link from "next/link"
import { Home, FileCode } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="text-center px-4 py-20">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[var(--vscode-blue)] mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-[var(--vscode-descriptionForeground)] mb-8 max-w-md mx-auto">
            Looks like this file doesn't exist in the repository. The page you're looking for might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--vscode-blue)] hover:bg-[var(--vscode-blue)]/80 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/#hero"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--vscode-sidebar)] hover:bg-[var(--vscode-sidebar-hover)] text-[var(--vscode-text)] border border-[var(--vscode-border)] rounded-lg transition-all duration-200 font-medium hover:border-[var(--vscode-blue)]"
          >
            <FileCode className="w-5 h-5" />
            <span>Go to Resume</span>
          </Link>
        </div>

        <div className="mt-12 text-sm text-[var(--vscode-descriptionForeground)]">
          <p>💡 Tip: Use the sidebar to navigate through the resume sections</p>
        </div>
      </div>
    </div>
  )
}

