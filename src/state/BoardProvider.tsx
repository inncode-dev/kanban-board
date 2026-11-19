import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Task } from '../types'
import { readStorage, writeStorage } from '../lib/storage'
import { isColumnId } from '../lib/columns'
import { createDemoTasks } from '../lib/demoTasks'
import { boardReducer, createInitialState } from './boardReducer'
import { BoardContext } from './boardContext'

const STORAGE_KEY = 'inncode-kanban:tasks'

// localStorage content is untrusted: check its shape before feeding it to the reducer.
function isTaskArray(value: unknown): value is Task[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        ['low', 'medium', 'high'].includes(item.priority) &&
        typeof item.status === 'string' &&
        isColumnId(item.status),
    )
  )
}

// Runs only once, on the first render (lazy initializer of useReducer).
function init(): ReturnType<typeof createInitialState> {
  return createInitialState(readStorage(STORAGE_KEY, createDemoTasks(), isTaskArray))
}

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, undefined, init)

  // Persistence is a side effect, so it lives in an effect and not in the reducer.
  useEffect(() => {
    writeStorage(STORAGE_KEY, state.tasks)
  }, [state.tasks])

  // Without useMemo a new object is created on every render, and every
  // component that calls useBoard() would re-render even if nothing changed.
  const value = useMemo(() => ({ tasks: state.tasks, dispatch }), [state.tasks])

  return <BoardContext value={value}>{children}</BoardContext>
}
