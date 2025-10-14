export type KeywordInput = string | string[] | null | undefined

const KEYWORD_SPLIT_REGEX = /[,，\n]/

function splitKeyword(value: string | null | undefined): string[] {
  if (!value) {
    return []
  }
  return value
    .split(KEYWORD_SPLIT_REGEX)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function addEntries(target: Set<string>, entries: (string | null | undefined)[] = []) {
  for (const entry of entries) {
    for (const keyword of splitKeyword(entry)) {
      target.add(keyword)
    }
  }
}

export function resolveKeywords(
  rawKeywords: KeywordInput,
  tags?: (string | null | undefined)[] | null,
  fallback?: string | (string | null | undefined)[] | null
): string[] {
  const normalized = new Set<string>()

  if (Array.isArray(rawKeywords)) {
    addEntries(normalized, rawKeywords)
  } else {
    addEntries(normalized, [rawKeywords ?? undefined])
  }

  if (tags) {
    addEntries(normalized, tags)
  }

  if (normalized.size === 0 && fallback) {
    addEntries(normalized, Array.isArray(fallback) ? fallback : [fallback])
  }

  return Array.from(normalized)
}
