'use client'
import siteMetadata from '@/data/siteMetadata'
import { getHeaderNavLinks } from '@/data/headerNavLinks'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import dynamic from 'next/dynamic'

import { useI18n } from '@/app/providers/I18nProvider'
import { getSiteMetadata } from '@/lib/site'

// 在 Header 中动态导入，禁用 SSR
const LocaleSwitch = dynamic(() => import('@/components/LocaleSwitch'))

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  const { locale } = useI18n()
  const navLinks = getHeaderNavLinks(locale)
  const localizedMetadata = getSiteMetadata(locale)

  return (
    <header className={headerClass}>
      <Link href="/" locale={locale} aria-label={localizedMetadata.headerTitle as string}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            {/* 仅当提供了 public 下的路径时才渲染图片，例如 '/logo.png' 或 '/logo.svg' */}
            {siteMetadata.logo ? (
              <Image
                src={siteMetadata.logo}
                alt={
                  typeof localizedMetadata.headerTitle === 'string'
                    ? localizedMetadata.headerTitle
                    : 'Logo'
                }
                width={32}
                height={32}
                priority
              />
            ) : null}
          </div>
          {typeof localizedMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {localizedMetadata.headerTitle}
            </div>
          ) : (
            localizedMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {navLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                locale={locale}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <LocaleSwitch />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
