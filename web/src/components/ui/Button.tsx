import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline'

const styles: Record<Variant, string> = {
  primary:
    'bg-claudia-cta text-white hover:opacity-95 shadow-soft hover:shadow-md',
  secondary: 'bg-claudia-amber text-claudia-navy hover:opacity-90',
  outline:
    'border-2 border-claudia-lavender text-claudia-navy bg-white/90 hover:bg-claudia-blush',
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
