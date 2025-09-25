"use client"

import { Database, Zap, BarChart3 } from "lucide-react"
import { AdminStats } from "./types"

interface AdminFooterProps {
  stats: AdminStats
}

export default function AdminFooter({ stats }: AdminFooterProps) {
  return (
    <div className="sticky bottom-0 z-30 bg-[#0d1117] border-t border-[#30363d] shadow-2xl backdrop-blur-sm">
      <div className="px-2 sm:px-4 py-2">
        {/* Mobile Status Bar */}
        <div className="flex flex-col sm:hidden space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300">Ready</span>
            </div>
            <div className="text-xs text-gray-400">
              {stats.experienceCount} exp • {stats.skillCount} skills
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-[#4ec9b0]" />
              <span className="text-gray-400">Data Loaded</span>
            </div>
            <div className="text-gray-500">© 2025</div>
          </div>
        </div>

        {/* Desktop Status Bar */}
        <div className="hidden sm:flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Admin Panel Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#4ec9b0]" />
              <span className="text-gray-400">Resume Data Loaded</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#ffa657]" />
              <span className="text-gray-400">Auto-save: Disabled</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#4ec9b0]" />
              <span className="text-gray-400">Performance: Optimized</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-gray-400">
              {stats.experienceCount} experiences • {stats.skillCount} skills • {stats.educationCount} education
            </div>
            <div className="text-gray-500">
              © 2025 Mina Youaness Admin Panel
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
