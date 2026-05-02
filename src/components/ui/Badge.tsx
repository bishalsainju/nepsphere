export function Badge({ size = 16 }: { size?: number }) {
  return (
    <span title="Verified by Nepsphere" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#DC2626">
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
