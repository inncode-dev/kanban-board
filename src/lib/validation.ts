import type { Priority } from '../types'

export interface TaskFormValues {
  title: string
  description: string
  priority: Priority
}

// Only fields that can fail validation have an entry.
export type TaskFormErrors = Partial<Record<'title' | 'description', string>>

export const TITLE_MAX = 60
export const DESCRIPTION_MAX = 200

export function validateTaskForm(values: TaskFormValues): TaskFormErrors {
  const errors: TaskFormErrors = {}
  const title = values.title.trim()

  if (title.length === 0) errors.title = 'Title is required.'
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.'
  else if (title.length > TITLE_MAX) errors.title = `Title must be at most ${TITLE_MAX} characters.`

  if (values.description.length > DESCRIPTION_MAX) {
    errors.description = `Description must be at most ${DESCRIPTION_MAX} characters.`
  }

  return errors
}
