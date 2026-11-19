import { useId, useRef, useState, type FormEvent } from 'react'
import type { Priority } from '../types'
import { PRIORITIES } from '../lib/columns'
import { TITLE_MAX, validateTaskForm, type TaskFormErrors } from '../lib/validation'
import { useBoard } from '../hooks/useBoard'
import { Button } from './Button'

const fieldClasses =
  'w-full rounded-md border bg-paper px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-2 ' +
  'focus-visible:outline-offset-1 focus-visible:outline-accent dark:bg-night dark:placeholder:text-night-muted ' +
  'dark:focus-visible:outline-mint'

const labelClasses = 'font-mono text-xs uppercase tracking-wide text-muted dark:text-night-muted'

function borderFor(hasError: boolean) {
  return hasError ? 'border-red-600 dark:border-red-400' : 'border-line dark:border-night-line'
}

export function TaskForm() {
  const { dispatch } = useBoard()

  // Local state: form fields are only meaningful inside this component.
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [errors, setErrors] = useState<TaskFormErrors>({})

  // useId gives unique ids (stable across renders) to connect labels, inputs and error messages.
  const id = useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const priorityId = `${id}-priority`

  const titleRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateTaskForm({ title, description, priority })
    setErrors(nextErrors)

    if (nextErrors.title || nextErrors.description) {
      // Move focus to the first invalid field so keyboard and screen reader users land on the problem.
      if (nextErrors.title) titleRef.current?.focus()
      else descriptionRef.current?.focus()
      return
    }

    dispatch({
      type: 'task_added',
      task: {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'todo',
      },
    })
    setTitle('')
    setDescription('')
    setPriority('medium')
    titleRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="New task"
      className="grid gap-4 rounded-lg border border-line bg-surface p-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-start dark:border-night-line dark:bg-night-surface"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={titleId} className={labelClasses}>
          Title
        </label>
        <input
          ref={titleRef}
          id={titleId}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (errors.title) setErrors((current) => ({ ...current, title: undefined }))
          }}
          maxLength={TITLE_MAX + 20}
          placeholder="What needs to be done?"
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          className={`${fieldClasses} ${borderFor(Boolean(errors.title))}`}
        />
        {errors.title && (
          <p id={`${titleId}-error`} className="text-xs text-red-700 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={descriptionId} className={labelClasses}>
          Description <span className="normal-case">(optional)</span>
        </label>
        <textarea
          ref={descriptionRef}
          id={descriptionId}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value)
            if (errors.description) setErrors((current) => ({ ...current, description: undefined }))
          }}
          rows={1}
          placeholder="Add some detail"
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={errors.description ? `${descriptionId}-error` : undefined}
          className={`${fieldClasses} resize-none ${borderFor(Boolean(errors.description))}`}
        />
        {errors.description && (
          <p id={`${descriptionId}-error`} className="text-xs text-red-700 dark:text-red-400">
            {errors.description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={priorityId} className={labelClasses}>
          Priority
        </label>
        {/* appearance-none removes the native arrow, which sits flush against the border;
            our own chevron gets the same 12px gap as the text padding on the left. */}
        <div className="relative">
          <select
            id={priorityId}
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority)}
            className={`${fieldClasses} cursor-pointer appearance-none pr-9 ${borderFor(false)}`}
          >
            {PRIORITIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted dark:text-night-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </div>

      <Button type="submit" variant="primary" className="self-end py-2.5">
        Add task
      </Button>
    </form>
  )
}
