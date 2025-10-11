'use client'
/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { AnchorHTMLAttributes } from 'react'

import { localizePath, normalizeLocale } from '@/lib/i18n'

type CustomLinkProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { locale?: string | null }

const CustomLink = ({ href, locale, ...rest }: CustomLinkProps) => {
  const normalizedLocale = locale ? normalizeLocale(locale) : undefined
  let finalHref: typeof href = href

  if (typeof href === 'string' && normalizedLocale && href.startsWith('/')) {
    finalHref = localizePath(href, normalizedLocale)
  }

  const isInternalLink = typeof finalHref === 'string' && finalHref.startsWith('/')
  const isAnchorLink = typeof finalHref === 'string' && finalHref.startsWith('#')

  if (isInternalLink) {
    return <Link className="break-words" href={finalHref} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={finalHref} {...rest} />
  }

  return (
    <a
      className="break-words"
      target="_blank"
      rel="noopener noreferrer"
      href={typeof finalHref === 'string' ? finalHref : undefined}
      {...rest}
    />
  )
}

export default CustomLink
