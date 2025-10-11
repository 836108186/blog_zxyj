export const SUPPORTED_LOCALES = ['zh', 'en'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'zh'

function resolveLocaleToken(input?: string | null): Locale | null {
  if (!input) return null
  const lower = input.toLowerCase()
  if (lower.startsWith('zh')) return 'zh'
  if (lower === 'en' || lower.startsWith('en-')) return 'en'
  return null
}

export function isLocale(input?: string | null): input is Locale {
  return resolveLocaleToken(input) !== null
}

export function normalizeLocale(input?: string | null, fallback: Locale = DEFAULT_LOCALE): Locale {
  return resolveLocaleToken(input) ?? fallback
}

export function resolveLocaleParam(
  params?: { locale?: string | null } | null,
  fallback: Locale = DEFAULT_LOCALE
): Locale {
  return normalizeLocale(params?.locale, fallback)
}

export function getDocumentLocale(input?: string | null): Locale {
  return normalizeLocale(input, 'en')
}

export function getLocaleFromPath(pathname?: string | null): Locale {
  if (!pathname) return DEFAULT_LOCALE
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return DEFAULT_LOCALE
  const explicit = resolveLocaleToken(segments[0])
  return explicit ?? DEFAULT_LOCALE
}

export function stripLocaleFromPath(pathname?: string | null): string {
  if (!pathname) return '/'
  const ensured = pathname.startsWith('/') ? pathname : `/${pathname}`
  const segments = ensured.split('/').filter(Boolean)
  if (segments.length === 0) return '/'
  const [first, ...rest] = segments
  if (resolveLocaleToken(first)) {
    return rest.length ? `/${rest.join('/')}` : '/'
  }
  return ensured
}

export function localizePath(path: string, locale: Locale): string {
  const ensured = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) {
    return stripLocaleFromPath(ensured)
  }
  const withoutLocale = stripLocaleFromPath(ensured)
  if (withoutLocale === '/') {
    return `/${locale}`
  }
  return `/${locale}${withoutLocale}`
}

export async function expandStaticParamsForLocales<T extends Record<string, unknown>>(
  builder: (locale: Locale) => T[] | Promise<T[]>
): Promise<Array<T & { locale: Locale }>> {
  const results: Array<T & { locale: Locale }> = []
  for (const locale of SUPPORTED_LOCALES) {
    const entries = await builder(locale)
    for (const params of entries) {
      results.push({ ...params, locale })
    }
  }
  return results
}
