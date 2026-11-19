import { useBoard } from '../hooks/useBoard'

export function ProgressBar() {
  const { tasks } = useBoard()
  const done = tasks.filter((task) => task.status === 'done').length
  const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100)

  return (
    <section aria-label="Progress" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between font-mono text-xs uppercase tracking-wide text-muted dark:text-night-muted">
        <span>Progress</span>
        <span>
          {done} / {tasks.length} done · {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Completed tasks"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2 overflow-hidden rounded-full bg-line dark:bg-night-line"
      >
        <div className="h-full rounded-full bg-accent dark:bg-mint" style={{ width: `${percent}%` }} />
      </div>
    </section>
  )
}
