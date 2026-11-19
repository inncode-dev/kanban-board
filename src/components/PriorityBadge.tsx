import type { Priority } from '../types'

// Color is never the only signal: the label is always printed too.
const styles: Record<Priority, string> = {
  low: 'bg-mint text-ink',
  medium: 'bg-line text-ink dark:bg-night-line dark:text-paper',
  high: 'bg-accent text-surface',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`rounded px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${styles[priority]}`}>
      {priority}
    </span>
  )
}
