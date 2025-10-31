"use client"

import { memo, useCallback } from "react"
import { ChevronRight } from "lucide-react"
import { SearchResult } from "./types"

// Stable icon component - memoized to prevent re-renders
const IconWrapper = memo(function IconWrapper({ Icon, isSelected, color }: { Icon: any; isSelected: boolean; color: string }) {
  return <Icon size={16} className={isSelected ? "text-white" : ""} style={{ color: isSelected ? "#ffffff" : color }} />
})

// Optimized result row - only re-renders when props actually change
export const ResultRow = memo(function ResultRow({
  result,
  isSelected,
  onSelect,
}: {
  result: SearchResult
  isSelected: boolean
  onSelect: (result: SearchResult) => void
}) {
  const handleClick = useCallback(() => {
    onSelect(result)
  }, [result, onSelect])

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors ${
        isSelected
          ? "bg-[var(--vscode-blue)] text-white"
          : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)]"
      }`}
    >
      <IconWrapper Icon={result.icon} isSelected={isSelected} color={result.color} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{result.title}</div>
        <div
          className={`text-xs truncate ${
            isSelected ? "text-white/80" : "text-[var(--sidebar-text-muted)]"
          }`}
        >
          {result.description}
        </div>
      </div>
      <div
        className={`text-xs px-2 py-1 rounded ${
          isSelected
            ? "text-white bg-white/10 border border-white/15"
            : "text-[var(--sidebar-text-muted)] bg-[var(--sidebar-hover)]"
        }`}
      >
        {result.category}
      </div>
      <ChevronRight
        size={12}
        className={isSelected ? "text-white/70" : "text-[var(--sidebar-text-muted)]"}
      />
    </button>
  )
})

