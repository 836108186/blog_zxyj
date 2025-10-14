import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 sm:px-6 xl:max-w-[96rem] xl:px-12 2xl:max-w-[104rem] 2xl:px-16">
      {children}
    </section>
  )
}
