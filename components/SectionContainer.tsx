import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 sm:px-6 xl:max-w-6xl xl:px-14 2xl:max-w-7xl 2xl:px-20">
      {children}
    </section>
  )
}
