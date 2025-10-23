import { NextResponse } from 'next/server'
import { getSitemapEntries } from '@/lib/sitemap'

export const dynamic = 'force-static'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const formatLastModified = (value: string | Date | undefined) => {
  if (!value) {
    return undefined
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return date.toISOString()
}

export function GET() {
  const entries = getSitemapEntries()

  const urls = entries
    .map(({ url, lastModified }) => {
      const parts = [`  <loc>${escapeXml(url)}</loc>`]
      const lastModValue = formatLastModified(lastModified)

      if (lastModValue) {
        parts.push(`  <lastmod>${lastModValue}</lastmod>`)
      }

      return `<url>\n${parts.join('\n')}\n</url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  })
}
