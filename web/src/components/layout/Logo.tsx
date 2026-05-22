import { useState } from 'react'

const LOGO_SRC = '/brand/claudia-logo.png'

const sizeClasses = {
  header: 'h-14 w-auto max-w-[220px]',
  footer: 'h-16 w-auto max-w-[240px]',
  gracias: 'mx-auto h-20 w-auto max-w-[280px]',
} as const

type LogoSize = keyof typeof sizeClasses

interface LogoProps {
  size?: LogoSize
  href?: string
  className?: string
}

export function Logo({ size = 'header', href = '#inicio', className = '' }: LogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <a
        href={href}
        className={`inline-block font-bold text-claudia-ink hover:text-claudia-turquoise ${className}`}
        aria-label="ClaudIA Educación Digital"
      >
        ClaudIA Educación Digital
      </a>
    )
  }

  return (
    <a href={href} className={`inline-flex shrink-0 ${className}`} aria-label="ClaudIA Educación Digital">
      <img
        src={LOGO_SRC}
        alt="ClaudIA Educación Digital"
        className={`object-contain ${sizeClasses[size]}`}
        onError={() => setFailed(true)}
      />
    </a>
  )
}
