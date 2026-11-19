import { useTheme } from '../hooks/useTheme'
import { Button } from './Button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <Button onClick={toggleTheme} aria-label={`Switch to ${next} theme`}>
      {theme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  )
}
