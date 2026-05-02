import { Suspense } from 'react'
import { ConnectClient } from './ConnectClient'

export default function ConnectPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)' }}>Loading…</div>}>
      <ConnectClient />
    </Suspense>
  )
}
