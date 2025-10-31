"use client"

import { memo } from "react"

// Category header component (Raycast-style)
export const CategoryHeader = memo(function CategoryHeader({ category }: { category: string }) {
  return (
    <div className="px-4 py-2 text-xs font-semibold text-[var(--sidebar-text-muted)] uppercase tracking-wide bg-[var(--sidebar-bg)] sticky top-0 z-10 border-b border-[var(--sidebar-border)]/50">
      {category}
    </div>
  )
})

