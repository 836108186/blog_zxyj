import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { Locale, getDocumentLocale, normalizeLocale, resolveLocaleParam } from '@/lib/i18n'

const ABOUT_TITLES: Record<Locale, string> = {
  en: 'About',
  zh: '关于',
}

export function createAboutMetadata(locale?: string | null) {
  const normalized = normalizeLocale(locale)
  return genPageMetadata({ title: ABOUT_TITLES[normalized], locale: normalized })
}

export const metadata = createAboutMetadata()

export default function Page(props?: { params?: { locale?: string } }) {
  const locale = resolveLocaleParam(props?.params)
  const author = (allAuthors.find(
    (p) => p.slug === 'default' && getDocumentLocale(p.lang) === locale
  ) ??
    allAuthors.find((p) => p.slug === 'default') ??
    allAuthors[0]) as Authors | undefined
  if (!author) {
    throw new Error('Author profile "default" is missing. Please add data/authors/zh/default.mdx.')
  }
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent} title={ABOUT_TITLES[locale]}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
