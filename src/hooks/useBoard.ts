import { useContext } from 'react'
import { BoardContext, type BoardContextValue } from '../state/boardContext'

export function useBoard(): BoardContextValue {
  const context = useContext(BoardContext)
  if (!context) throw new Error('useBoard must be used inside <BoardProvider>')
  return context
}
