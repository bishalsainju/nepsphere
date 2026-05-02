'use client'
import { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  type = 'button',
  style,
  className,
}: {
  children: ReactNode
  variant?: Variant
  size?: Size
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
  className?: string
}) {
  const sizeClass = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`np-btn np-btn-${variant} ${sizeClass} ${className ?? ''}`.trim()}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
    >
      {children}
    </button>
  )
}
