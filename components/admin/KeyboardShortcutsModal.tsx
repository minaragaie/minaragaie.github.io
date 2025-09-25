"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Keyboard } from "lucide-react"

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-2xl bg-[#161b22] border-[#30363d] shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-[#0d1117] to-[#161b22] border-b border-[#30363d]">
          <CardTitle className="text-[#d4d4d4] flex items-center gap-2 text-lg sm:text-xl">
            <Keyboard className="w-4 h-4 sm:w-5 sm:h-5 text-[#d2a8ff]" />
            Keyboard Shortcuts
          </CardTitle>
          <CardDescription className="text-[#8b949e] text-sm">
            Available keyboard shortcuts for faster navigation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-[#d4d4d4] mb-3">General</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Save changes</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Search content</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+F</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Toggle preview</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+P</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Export resume</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+E</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Undo (Previous Version)</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+Z</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Redo (Next Version)</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+Y</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Version History</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">Ctrl+H</kbd>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-[#d4d4d4] mb-3">Navigation</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Personal Info</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">1</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Experience</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">2</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Skills</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">3</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Education</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">4</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Certifications</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">5</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Projects</span>
                  <kbd className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs">6</kbd>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#30363d]">
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-[#007acc] to-[#4ec9b0] hover:from-[#4ec9b0] hover:to-[#007acc] text-white"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
