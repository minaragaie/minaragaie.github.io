export interface CommandPaletteProps {
  onNavigate: (sectionId: string) => void
  onClose: () => void
}

export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  icon: any
  color: string
  type: "navigation" | "content" | "command" | "project"
  link?: string
  score?: number // Fuzzy match score (0-1, higher is better)
}

export interface GroupedResults {
  category: string
  results: SearchResult[]
}

export interface IndexedData {
  skillsCategories: Array<[string, string[]]>
  technologies: string[]
  experience: any[]
  certifications: any[]
  projects: any[]
}

