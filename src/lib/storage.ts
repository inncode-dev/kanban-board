// Thin wrappers around localStorage. Reading and writing can both throw
// (private mode, quota exceeded, corrupted JSON), and the app should keep
// working without persistence rather than crash.

export function readStorage<T>(key: string, fallback: T, isValid?: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (isValid && !isValid(parsed)) return fallback
    return parsed as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: the app still works, the data just won't survive a reload.
  }
}
