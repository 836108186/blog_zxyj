// components/Callout.tsx
import type { ReactElement, ReactNode } from 'react'
import { Info, CheckCircle2, AlertTriangle, NotebookText, Sparkles } from 'lucide-react'

type CalloutType = 'info' | 'success' | 'warning' | 'note' | 'tldr'

const typeConfig: Record<
  CalloutType,
  {
    icon: ReactElement
    color: string
    border: string
    bg: string
    extra?: string
  }
> = {
  info: {
    icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    color: 'text-blue-900 dark:text-blue-100',
    border: 'border-l-4 border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
  },
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    color: 'text-emerald-900 dark:text-emerald-100',
    border: 'border-l-4 border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    color: 'text-amber-900 dark:text-amber-100',
    border: 'border-l-4 border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
  },
  note: {
    icon: <NotebookText className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />,
    color: 'text-zinc-800 dark:text-zinc-100',
    border: 'border-l-4 border-zinc-400 dark:border-zinc-600',
    bg: 'bg-zinc-50 dark:bg-zinc-900/40',
  },
  tldr: {
    icon: <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
    color: 'text-zinc-900 dark:text-zinc-100',
    border: 'border border-blue-200/50 dark:border-blue-800/40',
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/30',
    extra: 'shadow-sm ring-1 ring-blue-100/40 dark:ring-blue-800/30 backdrop-blur-sm',
  },
}

export default function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType
  title?: ReactNode
  children?: ReactNode
}) {
  const cfg = typeConfig[type]

  if (type === 'tldr') {
    return (
      <div
        className={`not-prose my-6 rounded-2xl p-6 ${cfg.bg} ${cfg.border} ${cfg.extra} ${cfg.color}`}
      >
        <div className="mb-3 flex items-center gap-3">
          {cfg.icon}
          <h3 className="text-lg font-semibold">{title ?? '快速答案（TL;DR）'}</h3>
        </div>
        <div className="prose-p:my-1 space-y-2 text-[15px] leading-relaxed">{children}</div>
      </div>
    )
  }

  return (
    <div
      className={`not-prose my-6 flex flex-col gap-2 rounded-xl p-4 shadow-sm ${cfg.bg} ${cfg.border} ${cfg.color}`}
    >
      <div className="flex items-center gap-2 font-semibold">
        {cfg.icon}
        <span>{title}</span>
      </div>
      <div className="prose-p:my-1 text-[15px] leading-relaxed">{children}</div>
    </div>
  )
}
