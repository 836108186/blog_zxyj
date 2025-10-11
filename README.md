# XiaoYan Notes

A bilingual (中文 / English) blog built with the Next.js App Router. The site renders
localized navigation, article lists, and metadata for each language while sharing a
single content pipeline powered by Contentlayer and Tailwind CSS.

## Features

- Localized routing for `/zh/...` and `/en/...` URLs without duplicated page logic
- Automatic detection of the active language in navigation, pagination, and tag links
- MDX-based posts with KaTeX, syntax highlighting, and multiple layout options
- Centralized locale utilities for links, static params, and metadata generation
- Precomputed tag counts per language for fast sidebar and landing-page rendering

## Project structure

```
app/
├─ (site)/              # Canonical pages used for default locale (zh)
│  ├─ about/
│  ├─ blog/
│  ├─ tags/
│  └─ page.tsx          # Home feed shared by all locales
├─ [locale]/(site)/     # Locale wrappers that reuse the canonical pages
├─ layout.tsx           # Root layout and providers
├─ Main.tsx             # Home page client component
└─ providers/
```

Supporting directories:

- `components/` – UI primitives (navigation, localized links, theme switcher, etc.)
- `layouts/` – Blog/article layouts that accept localized data
- `data/` – Site metadata, navigation definitions, and blog sources (`data/blog/{zh,en}`)
- `lib/` – Shared helpers for locale handling and metadata resolution
- `scripts/build-tags.js` – Generates `app/tag-data.json` for locale-aware tag counts

## Internationalized routing

The `(site)` directory holds the actual page implementations. The `[locale]/(site)`
wrappers validate locale segments, pre-generate static params for `/zh` and `/en`, and
re-export the canonical components so every page only needs to be implemented once.

Locale utilities in `lib/i18n.ts` handle:

- Normalizing locale tokens from URLs and front matter
- Generating localized internal links
- Expanding static params for every supported locale

## Managing content

Blog posts live under language-specific folders:

```
data/
└─ blog/
   ├─ zh/    # Chinese articles
   └─ en/    # English articles
```

Every MDX file should provide front matter similar to:

```mdx
---
title: 欢迎来到小言集
lang: 'zh'
date: '2024-01-05'
tags:
  - blog
  - i18n
summary: '在这里，我会记录双语博客改造的思考与实践。'
---
```

Set `lang: 'zh'` or `lang: 'en'` to ensure the post appears under the correct locale.
After adding or editing posts, regenerate tag counts with:

```bash
yarn build:tags
```

The command updates `app/tag-data.json`, which powers localized tag statistics on the
home and tag listing pages.

## Development workflow

- `yarn dev` – Start the local development server (runs `build:tags` beforehand)
- `yarn lint` – Lint and auto-fix the project
- `yarn build` – Create a production build (requires network access for Google Fonts)

## Removed projects page

The original starter template exposed a `/projects` showcase backed by
`data/projectsData.ts`. The route and its data source have been removed to focus on the
blog experience. Navigation, the sitemap, and the command palette have all been updated
to reflect the streamlined structure.

## License

The project remains under the MIT license provided in `LICENSE`.
