import Link from './Link'
import { slug } from 'github-slugger'

type TagProps = {
  text: string
  slugText?: string
  locale?: string
}

const Tag = ({ text, slugText, locale }: TagProps) => {
  return (
    <Link
      href={`/tags/${slug(slugText ?? text)}`}
      locale={locale}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
    >
      {text}
    </Link>
  )
}

export default Tag
