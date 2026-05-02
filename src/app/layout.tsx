import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import { TopNav } from '@/components/layout/TopNav'
import { GeoBar } from '@/components/layout/GeoBar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Nepsphere — Find help. Find rooms. Build real connections.',
  description: 'The trusted home base for Nepalis living abroad. Verified neighbors only.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="sticky top-0 z-50">
            <TopNav />
            <Suspense fallback={
              <div style={{ height: 48, background: 'rgba(250,250,247,0.95)', borderBottom: '1px solid var(--border-subtle)' }} />
            }>
              <GeoBar />
            </Suspense>
          </div>
          <main style={{ minHeight: 'calc(100vh - 104px)', background: 'var(--bg)', paddingBottom: 80 }}>
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
