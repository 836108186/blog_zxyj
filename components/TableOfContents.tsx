import Link from '@/components/Link'

export interface TocItem {
  value: string
  url: string
  depth: number
}

interface TableOfContentsProps {
  toc?: TocItem[]
  locale?: string
}

const depthIndent: Record<number, string> = {
  3: 'ml-4',
  4: 'ml-6',
  5: 'ml-8',
}

export default function TableOfContents({ toc, locale = 'en' }: TableOfContentsProps) {
  if (!toc || toc.length === 0) {
    return null
  }

  const title = locale === 'zh' ? '目录' : 'Table of contents'

  return (
    <nav aria-label={title} className="text-sm">
      <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">{title}</h2>
      <ul className="mt-4 space-y-2">
        {toc.map((heading) => {
          const indentClass = depthIndent[heading.depth] ?? ''
          return (
            <li key={heading.url} className={indentClass}>
              <Link
                href={heading.url}
                className="text-gray-700 transition-colors hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-400"
              >
                {heading.value}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
