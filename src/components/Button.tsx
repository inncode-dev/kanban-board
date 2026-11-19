import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-1 rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wide ' +
  'cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'dark:focus-visible:outline-mint disabled:cursor-not-allowed disabled:opacity-40'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-surface hover:bg-accent dark:bg-paper dark:text-ink dark:hover:bg-mint',
  secondary:
    'border border-line text-ink hover:border-ink dark:border-night-line dark:text-paper dark:hover:border-paper',
  ghost: 'text-muted hover:text-ink dark:text-night-muted dark:hover:text-paper',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'secondary', className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props} />
}
