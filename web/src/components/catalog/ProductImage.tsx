import { useState } from 'react'
import { nivelGradient } from '../../theme/colors'

interface ProductImageProps {
  src?: string | null
  alt: string
  nivel?: string
  /** Clases del marco (proporción, alto, fondo). */
  frameClassName?: string
  /** Clases extra del <img> (por defecto: contain centrado). */
  imgClassName?: string
  iconClassName?: string
}

const defaultFrame = 'h-full w-full'
const defaultImg = 'max-h-full max-w-full object-contain object-center'

const frameBg =
  'bg-gradient-to-br from-white via-claudia-cream/90 to-claudia-warm/70'

export function ProductImage({
  src,
  alt,
  nivel,
  frameClassName = defaultFrame,
  imgClassName = defaultImg,
  iconClassName = 'text-5xl opacity-80',
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed
  const gradient = nivel
    ? (nivelGradient[nivel] ?? 'from-claudia-blush/40 to-white')
    : 'from-claudia-blush/40 to-white'

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden ${frameBg} bg-gradient-to-br ${gradient} ${frameClassName}`}
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
    <div
      className={`flex items-center justify-center overflow-hidden ${frameBg} ${frameClassName}`}
    >
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
