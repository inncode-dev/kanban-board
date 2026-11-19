import { useState } from 'react'
import type { ColumnId } from '../types'
import { COLUMNS, getColumnTitle } from '../lib/columns'
import { useBoard } from '../hooks/useBoard'
import { Column } from './Column'

export function Board() {
  const { tasks, dispatch } = useBoard()

  // Screen reader message: a moved card disappears from one column and appears in another,
  // so without this a keyboard user would get no feedback.
  const [announcement, setAnnouncement] = useState('')
  // Which card should receive focus after a keyboard move (the card remounts in the new column).
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null)

  const moveTask = (id: string, to: ColumnId, viaKeyboard: boolean) => {
    const task = tasks.find((item) => item.id === id)
    if (!task || task.status === to) return
    dispatch({ type: 'task_moved', id, to })
    setAnnouncement(`"${task.title}" moved to ${getColumnTitle(to)}.`)
    if (viaKeyboard) setFocusTaskId(id)
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={tasks.filter((task) => task.status === column.id)}
            focusTaskId={focusTaskId}
            onFocusHandled={() => setFocusTaskId(null)}
            onMove={moveTask}
          />
        ))}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  )
}
