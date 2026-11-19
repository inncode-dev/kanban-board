export type ColumnId = 'todo' | 'in-progress' | 'done'

export type Priority = 'low' | 'medium' | 'high'

export type Theme = 'light' | 'dark'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: ColumnId
}

/**
 * Every way the board can change, as a discriminated union.
 * The `type` field lets TypeScript narrow `action` inside each `case`
 * of the reducer, so `action.payload` is always the right shape.
 */
export type BoardAction =
  | { type: 'task_added'; task: Task }
  | { type: 'task_moved'; id: string; to: ColumnId }
  | { type: 'task_renamed'; id: string; title: string }
  | { type: 'task_deleted'; id: string }
  | { type: 'board_reset' }
