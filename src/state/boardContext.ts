import { createContext, type Dispatch } from 'react'
import type { BoardAction, Task } from '../types'

export interface BoardContextValue {
  tasks: Task[]
  dispatch: Dispatch<BoardAction>
}

// `null` as default means "no provider above": useBoard turns that into a clear error.
export const BoardContext = createContext<BoardContextValue | null>(null)
