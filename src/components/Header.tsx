import { useState } from 'react'
import { useBoard } from '../hooks/useBoard'
import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const { dispatch } = useBoard()
  // Local UI state: only this component cares whether the reset is awaiting confirmation.
  const [confirmingReset, setConfirmingReset] = useState(false)

  const handleReset = () => {
    dispatch({ type: 'board_reset' })
    setConfirmingReset(false)
  }

  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-night-line">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted dark:text-night-muted">
          InnCode Lab · Project 01
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-none sm:text-5xl">
          Kanban Board
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {confirmingReset ? (
          <>
            <span role="alert" className="font-mono text-xs text-muted dark:text-night-muted">
              Replace all tasks with demo data?
            </span>
            <Button variant="primary" onClick={handleReset}>
              Yes, reset
            </Button>
            <Button onClick={() => setConfirmingReset(false)}>Cancel</Button>
          </>
        ) : (
          <Button onClick={() => setConfirmingReset(true)}>Reset board</Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
