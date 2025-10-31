// Fuzzy matching function (Fuse.js style)
// Returns a score between 0-1 (higher = better match)
export function fuzzyMatch(pattern: string, text: string): number {
  if (!pattern) return 1
  if (!text) return 0

  const patternLower = pattern.toLowerCase()
  const textLower = text.toLowerCase()

  // Exact match gets highest score
  if (textLower === patternLower) return 1.0

  // Starts with pattern gets high score
  if (textLower.startsWith(patternLower)) return 0.95

  // Contains pattern gets medium-high score
  if (textLower.includes(patternLower)) return 0.8

  // Fuzzy matching: pattern characters appear in order
  let patternIndex = 0
  let consecutiveMatches = 0
  let maxConsecutive = 0
  let matchCount = 0

  for (let i = 0; i < textLower.length && patternIndex < patternLower.length; i++) {
    if (textLower[i] === patternLower[patternIndex]) {
      matchCount++
      consecutiveMatches++
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches)
      patternIndex++
    } else {
      consecutiveMatches = 0
    }
  }

  // All pattern characters found in order
  if (patternIndex === patternLower.length) {
    // Bonus for consecutive matches and high match ratio
    const matchRatio = matchCount / patternLower.length
    const consecutiveBonus = maxConsecutive / patternLower.length
    return 0.3 + (matchRatio * 0.3) + (consecutiveBonus * 0.2)
  }

  // Partial match: some characters found
  if (matchCount > 0) {
    return (matchCount / patternLower.length) * 0.2
  }

  return 0
}

// Multi-field fuzzy search (searches title, description, and other fields)
export function fuzzySearch(pattern: string, ...fields: (string | undefined)[]): number {
  if (!pattern || fields.length === 0) return 0

  const scores = fields
    .filter((f): f is string => typeof f === 'string' && f.length > 0)
    .map((field) => fuzzyMatch(pattern, field))

  // Return the highest score (best match across all fields)
  return scores.length > 0 ? Math.max(...scores) : 0
}

