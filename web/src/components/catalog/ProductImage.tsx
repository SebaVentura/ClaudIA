import { useState } from 'react'
import { nivelGradient } from '../../theme/colors'

interface ProductImageProps {
  src?: string | null
  alt: string
  nivel?: string
  className?: string
  iconClassName?: string
}

export function ProductImage({
  src,
  alt,
  nivel,
  className = 'h-full w-full object-cover',
  iconClassName = 'text-5xl opacity-80',
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed
  const gradient = nivel ? nivelGradient[nivel] ?? 'from-claudia-blush to-white' : 'from-claudia-blush to-white'

  if (showFallback) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
        role="img"
        aria-label={alt}
      >
        <span className={iconClassName} aria-hidden>
          📖
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  )
}
