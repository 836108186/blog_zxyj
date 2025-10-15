// components/JsonLd.tsx
'use client'

import React from 'react'

export default function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      // 注意：这里一定用 dangerouslySetInnerHTML，且做 JSON.stringify
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
