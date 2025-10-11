import { slug as slugify } from 'github-slugger'

type Dict = Record<string, { en: string; zh: string }>

export const TAG_I18N: Dict = {
  javascript: { en: 'JavaScript', zh: 'JavaScript' },
  typescript: { en: 'TypeScript', zh: 'TypeScript' },
  react: { en: 'React', zh: 'React' },
  'next.js': { en: 'Next.js', zh: 'Next.js' },
  nextjs: { en: 'Next.js', zh: 'Next.js' },
  css: { en: 'CSS', zh: 'CSS' },
  'tailwind-css': { en: 'Tailwind CSS', zh: 'Tailwind CSS' },
  tailwind: { en: 'Tailwind CSS', zh: 'Tailwind CSS' },
  node: { en: 'Node.js', zh: 'Node.js' },
  performance: { en: 'Performance', zh: '性能' },
  i18n: { en: 'Internationalization', zh: '国际化' },
  algorithm: { en: 'Algorithm', zh: '算法' },
  blog: { en: 'Blog', zh: '博客' },
  // ...按需补充
}

export function getTagLabel(tag: string, locale: string) {
  const keyExact = tag
  const keyLower = tag.toLowerCase()
  const keySlug = slugify(tag)

  const entry =
    TAG_I18N[keyExact] ||
    TAG_I18N[keyLower] ||
    TAG_I18N[keySlug]

  const lang = locale?.startsWith('zh') ? 'zh' : 'en'
  return entry?.[lang] ?? tag
}
