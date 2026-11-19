import { useEffect } from 'react'
import type { Theme } from '../types'
import { useLocalStorage } from './useLocalStorage'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('inncode-kanban:theme', getSystemTheme(), isTheme)

  // Tailwind's `dark:` variant looks for a `dark` class on <html>:
  // keeping the DOM in sync with React state is a side effect, hence useEffect.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
