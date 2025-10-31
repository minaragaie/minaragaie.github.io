"use client"

import { memo } from "react"
import { Search } from "lucide-react"
import { SearchResult } from "./types"
import { groupResultsByCategory } from "./grouping"
import { CategoryHeader } from "./CategoryHeader"
import { ResultRow } from "./ResultRow"

// Stable results list wrapper - isolates re-renders with category grouping
export const ResultList = memo(function ResultList({
  results,
  selectedIndex,
  onSelect,
}: {
  results: SearchResult[]
  selectedIndex: number
  onSelect: (result: SearchResult) => void
}) {
  // Empty state
  if (results.length === 0) {
    return (
      <div className="p-8 text-center text-[var(--sidebar-text-muted)]">
        <Search size={32} className="mx-auto mb-3 opacity-50" />
        <div className="text-sm">No results found</div>
        <div className="text-xs mt-1">Try searching for skills, companies, or certifications</div>
      </div>
    )
  }

  // Group results by category (Raycast-style)
  const grouped = groupResultsByCategory(results)

  return (
    <div className="max-h-96 overflow-y-auto scrollbar-thin">
      {grouped.map((group, groupIndex) => {
        // Calculate the starting index for results in this group
        // (previous groups' results only, headers don't count)
        let resultIndexOffset = 0
        for (let i = 0; i < groupIndex; i++) {
          resultIndexOffset += grouped[i].results.length
        }

        return (
          <div key={group.category}>
            <CategoryHeader category={group.category} />
            <div className="p-2">
              {group.results.map((result, resultIndexInGroup) => {
                // Global index = sum of all previous groups' results + current position
                // Headers are not selectable, so they don't affect the index
                const globalResultIndex = resultIndexOffset + resultIndexInGroup

                return (
                  <ResultRow
                    key={`${result.id}-${globalResultIndex}`}
                    result={result}
                    isSelected={globalResultIndex === selectedIndex}
                    onSelect={onSelect}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
})

