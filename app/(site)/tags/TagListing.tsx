'use client'

import { slug } from 'github-slugger'

import { useI18n } from '@/app/providers/I18nProvider'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { getTagLabel } from '@/data/tagsI18n'
import tagData from 'app/tag-data.json'

export default function TagListing() {
  const { locale, t } = useI18n()
  const localeTagCounts = (tagData as Record<string, Record<string, number>>)[locale] || {}
  const sortedTags = Object.keys(localeTagCounts).sort(
    (a, b) => localeTagCounts[b] - localeTagCounts[a]
  )

  return (
    <div className="flex flex-col items-start justify-start divide-y divide-gray-200 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0 dark:divide-gray-700">
      <div className="space-x-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14 dark:text-gray-100">
          {t('tags')}
        </h1>
      </div>
      <div className="flex max-w-lg flex-wrap">
        {sortedTags.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">{t('noTags')}</p>
        )}
        {sortedTags.map((tagName) => {
          const label = getTagLabel(tagName, locale)
          return (
            <div key={tagName} className="mt-2 mr-5 mb-2">
              <Tag text={label} slugText={tagName} locale={locale} />
              <Link
                href={`/tags/${slug(tagName)}`}
                locale={locale}
                className="-ml-2 text-sm font-semibold text-gray-600 uppercase dark:text-gray-300"
                aria-label={t('viewTagged', { tag: label })}
              >
                {` (${localeTagCounts[tagName]})`}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
