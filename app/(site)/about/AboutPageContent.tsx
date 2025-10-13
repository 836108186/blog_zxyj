import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { Locale, getDocumentLocale } from '@/lib/i18n'
import { ABOUT_TITLES } from './metadata'

export default function AboutPageContent({ locale }: { locale: Locale }) {
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
    <AuthorLayout content={mainContent} title={ABOUT_TITLES[locale]}>
      <MDXLayoutRenderer code={author.body.code} />
    </AuthorLayout>
  )
}