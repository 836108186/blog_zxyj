const headerNavLinksMap = {
  en: [
    { href: '/', title: 'Home' },
    { href: '/blog', title: 'Blog' },
    { href: '/tags', title: 'Tags' },
    { href: '/about', title: 'About' },
  ],
  zh: [
    { href: '/', title: '首页' },
    { href: '/blog', title: '博客' },
    { href: '/tags', title: '标签' },
    { href: '/about', title: '关于' },
  ],
} as const

export type SupportedLocale = keyof typeof headerNavLinksMap

export function getHeaderNavLinks(locale?: string) {
  const key: SupportedLocale =
    locale && locale.toLowerCase().startsWith('zh') ? 'zh' : 'en'
  return headerNavLinksMap[key]
}

// 默认导出保持英文，兼容旧用法
export default headerNavLinksMap.en
