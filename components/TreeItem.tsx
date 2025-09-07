"use client"

import type React from "react"

import type { LucideIcon } from "lucide-react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { slugify } from "@/lib/utils"

interface TreeItemProps {
  id: string
  name: string
  icon: LucideIcon
  color: string
  isActive?: boolean
  onClick: (id: string) => void
  className?: string
  showActiveIndicator?: boolean
  children?: React.ReactNode
  isExpanded?: boolean
  onToggleExpand?: (id: string) => void
}

export default function TreeItem({
  id,
  name,
  icon: Icon,
  color,
  isActive = false,
  onClick,
  className = "",
  showActiveIndicator = true,
  children,
  isExpanded = false,
  onToggleExpand,
}: TreeItemProps) {
  const handleClick = () => {
    onClick(slugify(id))
  }

  const handleCollapseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleExpand) {
      onToggleExpand(id)
    }
  }

  const isDirectory = !!children

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs rounded transition-colors text-left ${
          isActive ? "bg-[#094771] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white"
        } ${className}`}
      >
        {isDirectory && (
          <button
            onClick={handleCollapseClick}
            className="flex-shrink-0 hover:bg-[#3e3e42] rounded p-0.5 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={12} className="w-3 h-3" />
            ) : (
              <ChevronRight size={12} className="w-3 h-3" />
            )}
          </button>
        )}
        <Icon size={14} className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
        <span>{name}</span>
        {isActive && showActiveIndicator && <div className="ml-auto w-1 h-1 bg-white rounded-full"></div>}
      </button>
      {isDirectory && isExpanded && children && <div className="ml-4">{children}</div>}
    </div>
  )
}
