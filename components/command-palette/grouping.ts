import { SearchResult, GroupedResults } from "./types"

// Group results by category (Raycast-style)
export function groupResultsByCategory(results: SearchResult[]): GroupedResults[] {
  const grouped = new Map<string, SearchResult[]>()

  results.forEach((result) => {
    const category = result.category
    if (!grouped.has(category)) {
      grouped.set(category, [])
    }
    grouped.get(category)!.push(result)
  })

  // Convert to array and sort by category order
  const categoryOrder = ['Command', 'Navigation', 'Projects', 'Skills', 'Technologies', 'Experience', 'Certifications']
  return Array.from(grouped.entries())
    .map(([category, results]) => ({ category, results }))
    .sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category)
      const bIndex = categoryOrder.indexOf(b.category)
      if (aIndex === -1 && bIndex === -1) return a.category.localeCompare(b.category)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
}

