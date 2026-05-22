import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline'

const styles: Record<Variant, string> = {
  primary: 'bg-claudia-coral text-white hover:opacity-90 shadow-soft',
  secondary: 'bg-claudia-amber text-claudia-ink hover:opacity-90',
  outline: 'border-2 border-claudia-coral text-claudia-coral bg-white/90 hover:bg-claudia-blush',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
