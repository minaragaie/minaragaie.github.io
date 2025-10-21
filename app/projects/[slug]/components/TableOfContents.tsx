"use client"
import { useState } from "react"
import { ChevronUp } from "lucide-react"
import { HeadingNode } from "./useProjectScroll"
import { CollapsibleTOCItem } from "./CollapsibleTOC"

export interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headingTree: HeadingNode[]
  activeId: string
  onTOCClick: (e: React.MouseEvent, id: string) => void
}

export default function TableOfContents({
  headingTree,
  activeId,
  onTOCClick,
}: TableOfContentsProps) {
  const [tocOpen, setTocOpen] = useState(true)

  if (headingTree.length === 0) return null

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 h-full min-h-0">
      <div className="bg-[var(--projects-card-bg)] border border-[var(--projects-border)] rounded-lg overflow-hidden h-full flex flex-col min-h-0">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full p-3 flex items-center justify-between cursor-pointer select-none hover:opacity-80 transition-opacity duration-150"
          style={{
            color: "var(--projects-text-white)",
            borderBottom: tocOpen ? "1px solid var(--projects-border)" : "none",
          }}
        >
          <span className="font-semibold text-xs uppercase tracking-wide">Contents</span>
          <span className="transition-all duration-150">
            {tocOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-blue-400 rotate-180" />
            )}
          </span>
        </button>

        {tocOpen && (
          <nav className="p-2 flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {headingTree.map((node, index) => (
              <CollapsibleTOCItem
                key={node.id || `toc-root-${index}-${node.text?.slice(0, 10)}`}
                node={node}
                activeId={activeId}
                onTOCClick={onTOCClick}
              />
            ))}
          </nav>
        )}
      </div>
    </aside>
  )
}

