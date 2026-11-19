import { useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import type { ColumnId, Task } from '../types'
import { getAdjacentColumn, getColumnTitle } from '../lib/columns'
import { TITLE_MAX } from '../lib/validation'
import { useBoard } from '../hooks/useBoard'
import { Button } from './Button'
import { PriorityBadge } from './PriorityBadge'

interface TaskCardProps {
  task: Task
  shouldFocus: boolean
  onFocusHandled: () => void
  onMove: (id: string, to: ColumnId, viaKeyboard: boolean) => void
}

export function TaskCard({ task, shouldFocus, onFocusHandled, onMove }: TaskCardProps) {
  const { dispatch } = useBoard()

  // Local state: editing and dragging only matter to this one card.
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const [isDragging, setIsDragging] = useState(false)

  const cardRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Enter/Esc unmount the input, which can trigger a blur: this flag prevents a double save.
  const editFinished = useRef(false)

  const previous = getAdjacentColumn(task.status, -1)
  const next = getAdjacentColumn(task.status, 1)

  // After a keyboard move the card is a brand-new element in another column:
  // focus it so the keyboard user does not lose their place.
  useEffect(() => {
    if (shouldFocus) {
      cardRef.current?.focus()
      onFocusHandled()
    }
  }, [shouldFocus, onFocusHandled])

  // Focus the input as soon as it appears, with the whole title selected.
  useEffect(() => {
    if (isEditing) inputRef.current?.select()
  }, [isEditing])

  const startEditing = () => {
    editFinished.current = false
    setDraft(task.title)
    setIsEditing(true)
  }

  const finishEditing = (save: boolean) => {
    if (editFinished.current) return
    editFinished.current = true
    const title = draft.trim()
    // Ignore empty or too-short titles: keep the previous one instead of saving garbage.
    if (save && title.length >= 3 && title !== task.title) {
      dispatch({ type: 'task_renamed', id: task.id, title })
    }
    setIsEditing(false)
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') finishEditing(true)
    if (event.key === 'Escape') finishEditing(false)
  }

  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.setData('text/plain', task.id)
    event.dataTransfer.effectAllowed = 'move'
    setIsDragging(true)
  }

  return (
    <article
      ref={cardRef}
      tabIndex={-1}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      className={`flex flex-col gap-3 rounded-md border border-line bg-paper p-3 outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-night-line dark:bg-night dark:focus-visible:ring-mint ${
        isDragging ? 'opacity-40' : ''
      } ${isEditing ? '' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <input
            ref={inputRef}
            autoFocus
            value={draft}
            maxLength={TITLE_MAX}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={() => finishEditing(true)}
            aria-label={`Edit title of "${task.title}". Enter to save, Escape to cancel.`}
            className="w-full rounded border border-accent bg-surface px-2 py-1 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-accent dark:border-mint dark:bg-night-surface dark:focus-visible:outline-mint"
          />
        ) : (
          <h3
            onDoubleClick={startEditing}
            className="text-sm font-semibold leading-snug break-words"
            title="Double-click to edit"
          >
            {task.title}
          </h3>
        )}
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-sm break-words text-muted dark:text-night-muted">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <Button
            variant="secondary"
            className="px-2.5"
            disabled={!previous}
            onClick={() => previous && onMove(task.id, previous, true)}
            aria-label={previous ? `Move "${task.title}" to ${getColumnTitle(previous)}` : 'Already in the first column'}
          >
            <span aria-hidden="true">←</span>
          </Button>
          <Button
            variant="secondary"
            className="px-2.5"
            disabled={!next}
            onClick={() => next && onMove(task.id, next, true)}
            aria-label={next ? `Move "${task.title}" to ${getColumnTitle(next)}` : 'Already in the last column'}
          >
            <span aria-hidden="true">→</span>
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" onClick={startEditing} aria-label={`Edit title of "${task.title}"`}>
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => dispatch({ type: 'task_deleted', id: task.id })}
            aria-label={`Delete "${task.title}"`}
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  )
}
