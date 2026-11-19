import { useId, useState, type DragEvent } from 'react'
import type { ColumnId, Task } from '../types'
import type { ColumnConfig } from '../lib/columns'
import { TaskCard } from './TaskCard'

interface ColumnProps {
  column: ColumnConfig
  tasks: Task[]
  focusTaskId: string | null
  onFocusHandled: () => void
  onMove: (id: string, to: ColumnId, viaKeyboard: boolean) => void
}

export function Column({ column, tasks, focusTaskId, onFocusHandled, onMove }: ColumnProps) {
  const headingId = useId()
  // Local state: only this column needs to know it is being hovered by a dragged card.
  const [isOver, setIsOver] = useState(false)

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    // Cancelling the default is what tells the browser "dropping here is allowed".
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    // dragleave also fires when the pointer enters a child element:
    // ignore it, or the highlight would flicker over every card.
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
    setIsOver(false)
  }

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    setIsOver(false)
    const id = event.dataTransfer.getData('text/plain')
    if (id) onMove(id, column.id, false)
  }

  return (
    <section
      aria-labelledby={headingId}
      onDragOver={handleDragOver}
      onDragEnter={() => setIsOver(true)}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex min-h-48 flex-col gap-3 rounded-lg border p-3 transition-colors ${
        isOver
          ? 'border-accent bg-mint/40 dark:border-mint dark:bg-mint/10'
          : 'border-line bg-surface dark:border-night-line dark:bg-night-surface'
      }`}
    >
      <h2
        id={headingId}
        className="flex items-center justify-between font-display text-sm font-bold uppercase tracking-wide"
      >
        {column.title}
        <span className="rounded-full border border-line px-2 py-0.5 font-mono text-xs font-normal text-muted dark:border-night-line dark:text-night-muted">
          {tasks.length}
        </span>
      </h2>

      {tasks.length === 0 ? (
        <p className="rounded-md border border-dashed border-line p-4 text-center text-sm text-muted dark:border-night-line dark:text-night-muted">
          No tasks here. Drag one in.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                shouldFocus={task.id === focusTaskId}
                onFocusHandled={onFocusHandled}
                onMove={onMove}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

