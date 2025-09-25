"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, History, Eye, CheckCircle, Loader2 } from "lucide-react"
import { CommitHistory } from "./types"

interface VersionHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  commitHistory: CommitHistory[]
  currentCommitIndex: number
  isLoadingHistory: boolean
  onPreviewCommit: (commitSha: string) => void
  onRestoreCommit: (commitSha: string) => void
  onSetCurrentCommitIndex: (index: number) => void
}

export default function VersionHistoryModal({
  isOpen,
  onClose,
  commitHistory,
  currentCommitIndex,
  isLoadingHistory,
  onPreviewCommit,
  onRestoreCommit,
  onSetCurrentCommitIndex
}: VersionHistoryModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#30363d]">
          <h2 className="text-xl font-bold text-[#d4d4d4] flex items-center gap-2">
            <History className="w-5 h-5 text-[#007acc]" />
            Version History
          </h2>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30]"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#007acc]" />
              <span className="ml-2 text-[#d4d4d4]">Loading version history...</span>
            </div>
          ) : commitHistory.length === 0 ? (
            <div className="text-center py-8 text-[#8b949e]">
              No version history available
            </div>
          ) : (
            <div className="space-y-3">
              {commitHistory.map((commit, index) => (
                <div
                  key={commit.sha}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                    index === currentCommitIndex
                      ? 'border-[#007acc] bg-[#007acc]/10'
                      : 'border-[#30363d] hover:border-[#4ec9b0] hover:bg-[#21262d]'
                  }`}
                  onClick={() => {
                    onSetCurrentCommitIndex(index)
                    onPreviewCommit(commit.sha)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === currentCommitIndex ? 'bg-[#007acc]' : 'bg-[#4ec9b0]'
                        }`} />
                        <span className="text-sm font-mono text-[#8b949e]">
                          {commit.sha.substring(0, 7)}
                        </span>
                        {index === currentCommitIndex && (
                          <Badge className="bg-[#007acc] text-white text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-[#d4d4d4] text-sm mb-1">{commit.message}</p>
                      <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                        <span>by {commit.author}</span>
                        <span>{new Date(commit.date).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          onPreviewCommit(commit.sha)
                        }}
                        className="border-[#30363d] text-[#d4d4d4] hover:bg-[#2d2d30] hover:border-[#4ec9b0]"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      {index !== currentCommitIndex && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRestoreCommit(commit.sha)
                            onClose()
                          }}
                          className="bg-[#238636] hover:bg-[#2ea043] text-white"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
