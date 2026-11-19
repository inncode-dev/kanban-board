import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { readStorage, writeStorage } from '../lib/storage'

/**
 * Like useState, but the value survives page reloads.
 * The generic <T> keeps the stored value typed: useLocalStorage<Theme>(...)
 * returns a Theme, not `unknown`.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid?: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  // Passing a function makes React read localStorage once, not on every render.
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue, isValid))

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue]
}
