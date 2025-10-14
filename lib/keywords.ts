export type KeywordInput = string | string[] | null | undefined

type KeywordEntry = string | number | boolean | null | undefined | KeywordEntry[]

const KEYWORD_SPLIT_REGEX = /[,，\n]/

function splitKeyword(value: string): string[] {
  return value
    .split(KEYWORD_SPLIT_REGEX)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function addEntries(
  target: Set<string>,
  entries: KeywordEntry | KeywordEntry[] | null | undefined
) {
  if (entries == null) {
    return
  }

  const list = Array.isArray(entries) ? entries : [entries]
  for (const entry of list) {
    if (entry == null) {
      continue
    }

    if (Array.isArray(entry)) {
      addEntries(target, entry)
      continue
    }

    if (typeof entry === 'string') {
      for (const keyword of splitKeyword(entry)) {
        target.add(keyword)
      }
      continue
    }

    addEntries(target, String(entry))
  }
}

export function resolveKeywords(
  rawKeywords: KeywordInput,
  tags?: (string | null | undefined)[] | null,
  fallback?: string | (string | null | undefined)[] | null
): string[] {
  const normalized = new Set<string>()

  addEntries(normalized, rawKeywords)

  if (tags) {
    addEntries(normalized, tags)
  }

  if (normalized.size === 0 && fallback) {
    addEntries(normalized, fallback)
  }

  return Array.from(normalized)
}
