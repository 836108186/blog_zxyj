// components/JsonLd.tsx
'use client'

import type { FC } from 'react'

type JsonLdProps = {
  data: Record<string, unknown>
}

const JsonLd: FC<JsonLdProps> = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
)

export default JsonLd
