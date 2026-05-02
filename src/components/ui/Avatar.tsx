type Intent = 'friendship' | 'dating' | 'marriage' | 'default'

const GRADIENTS: Record<Intent, string> = {
  friendship: 'linear-gradient(135deg, #3B82F6, #7B92D0)',
  dating:     'linear-gradient(135deg, #DC2626, #F59E0B)',
  marriage:   'linear-gradient(135deg, #F59E0B, #FBBF24)',
  default:    'linear-gradient(135deg, #1E3A8A, #4A66B5)',
}

export function Avatar({
  name = 'NS',
  size = 32,
  intent = 'default',
  src,
}: {
  name?: string
  size?: number
  intent?: Intent
  src?: string
}) {
  const initials = name.split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: GRADIENTS[intent],
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: size * 0.38,
      flexShrink: 0,
      fontFamily: 'var(--font-display)',
    }}>
      {initials}
    </div>
  )
}
