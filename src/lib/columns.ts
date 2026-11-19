import type { ColumnId, Priority } from '../types'

export interface ColumnConfig {
  id: ColumnId
  title: string
}

// Array order is the left-to-right order on screen, and it is also what
// the ← → buttons use to find the previous / next column.
export const COLUMNS: readonly ColumnConfig[] = [
  { id: 'todo', title: 'To do' },
  { id: 'in-progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
]

export const PRIORITIES: readonly { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export function getColumnTitle(id: ColumnId): string {
  return COLUMNS.find((column) => column.id === id)?.title ?? id
}

/** Returns the neighbouring column id, or null at the edges of the board. */
export function getAdjacentColumn(id: ColumnId, direction: -1 | 1): ColumnId | null {
  const index = COLUMNS.findIndex((column) => column.id === id)
  return COLUMNS[index + direction]?.id ?? null
}

export function isColumnId(value: string): value is ColumnId {
  return COLUMNS.some((column) => column.id === value)
}
