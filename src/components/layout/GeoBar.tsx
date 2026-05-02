'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MapPin, ChevronDown, ChevronRight, X } from 'lucide-react'
import {
  COUNTRIES,
  getStatesForCountry,
  getCitiesForState,
  getLocationLabel,
} from '@/lib/geo'

export function GeoBar() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen]       = useState(false)
  const [hover, setHover]     = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const country = searchParams.get('country')
  const state   = searchParams.get('state')
  const city    = searchParams.get('city')

  const label = getLocationLabel(country, state, city)

  const go = useCallback((c?: string, s?: string, ci?: string) => {
    setOpen(false)
    const params = new URLSearchParams()
    if (pathname.includes('community') && searchParams.get('category')) {
      params.set('category', searchParams.get('category')!)
    }
    if (c)  params.set('country', c)
    if (s)  params.set('state', s)
    if (ci) params.set('city', ci)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const activeCountry = hover ?? country ?? null
  const states  = activeCountry ? getStatesForCountry(activeCountry) : []
  const cities  = activeCountry && state
    ? getCitiesForState(activeCountry, state)
    : activeCountry
      ? getCitiesForState(activeCountry, states[0]?.stateName ?? '')
      : []

  const stateHover  = state ?? states[0]?.stateName ?? null

  return (
    <div style={{
      height: 44,
      background: 'rgba(250,250,247,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 8,
      position: 'relative',
      zIndex: 90,
    }}>
      <MapPin size={15} strokeWidth={1.5} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>Showing</span>

      <div ref={panelRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 10px',
            borderRadius: 9999,
            border: '1px solid var(--border)',
            background: open ? 'var(--primary)' : 'var(--surface)',
            fontSize: 13, fontWeight: 600,
            color: open ? 'white' : 'var(--fg-1)',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {label}
          <ChevronDown size={13} strokeWidth={2} style={{ opacity: 0.7 }} />
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            display: 'flex',
            minWidth: 560,
            overflow: 'hidden',
            animation: 'np-rise 180ms ease-out',
          }}>

            {/* Column 1: Countries */}
            <div style={{ width: 160, borderRight: '1px solid var(--border-subtle)', padding: '8px 0' }}>
              <div style={{ padding: '6px 14px', fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Country
              </div>
              <button
                onClick={() => go()}
                style={{
                  display: 'block', textAlign: 'left',
                  padding: '9px 14px', border: 'none',
                  background: !country && !hover ? 'var(--primary-50)' : 'transparent',
                  fontSize: 14, fontWeight: !country && !hover ? 700 : 400,
                  color: !country && !hover ? 'var(--primary)' : 'var(--fg-1)',
                  cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8,
                  margin: '0 4px', width: 'calc(100% - 8px)',
                }}
              >
                🌍 Everywhere
              </button>
              {COUNTRIES.map(c => (
                <button
                  key={c.name}
                  onClick={() => go(c.name)}
                  onMouseEnter={() => setHover(c.name)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: 'calc(100% - 8px)', margin: '0 4px',
                    padding: '9px 14px', border: 'none', borderRadius: 8,
                    background: (hover === c.name || (!hover && country === c.name)) ? 'var(--primary-50)' : 'transparent',
                    fontSize: 14,
                    fontWeight: (hover === c.name || (!hover && country === c.name)) ? 700 : 400,
                    color: (hover === c.name || (!hover && country === c.name)) ? 'var(--primary)' : 'var(--fg-1)',
                    cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <span>{c.flag} {c.name}</span>
                  <ChevronRight size={12} style={{ opacity: 0.4 }} />
                </button>
              ))}
            </div>

            {/* Column 2: States */}
            {activeCountry && (
              <div style={{ width: 180, borderRight: '1px solid var(--border-subtle)', padding: '8px 0' }}>
                <div style={{ padding: '6px 14px', fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  State / Province
                </div>
                <button
                  onClick={() => go(activeCountry)}
                  style={{
                    display: 'block', width: 'calc(100% - 8px)', margin: '0 4px',
                    textAlign: 'left', padding: '9px 14px', border: 'none', borderRadius: 8,
                    background: !state ? 'var(--primary-50)' : 'transparent',
                    fontSize: 13, fontWeight: !state ? 700 : 400,
                    color: !state ? 'var(--primary)' : 'var(--fg-3)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  All of {activeCountry}
                </button>
                {states.map(s => (
                  <button
                    key={s.stateName}
                    onClick={() => go(activeCountry, s.stateName)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: 'calc(100% - 8px)', margin: '0 4px',
                      padding: '9px 14px', border: 'none', borderRadius: 8,
                      background: state === s.stateName ? 'var(--primary-50)' : 'transparent',
                      fontSize: 13, fontWeight: state === s.stateName ? 700 : 400,
                      color: state === s.stateName ? 'var(--primary)' : 'var(--fg-1)',
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <span>{s.stateName}</span>
                    <ChevronRight size={12} style={{ opacity: 0.4 }} />
                  </button>
                ))}
              </div>
            )}

            {/* Column 3: Cities */}
            {activeCountry && stateHover && (
              <div style={{ flex: 1, padding: '8px 0' }}>
                <div style={{ padding: '6px 14px', fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  City
                </div>
                <button
                  onClick={() => go(activeCountry, stateHover)}
                  style={{
                    display: 'block', width: 'calc(100% - 8px)', margin: '0 4px',
                    textAlign: 'left', padding: '9px 14px', border: 'none', borderRadius: 8,
                    background: 'transparent',
                    fontSize: 13, fontWeight: 400,
                    color: 'var(--fg-3)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  All of {stateHover}
                </button>
                {getCitiesForState(activeCountry, stateHover).map(c => (
                  <button
                    key={c.city}
                    onClick={() => go(activeCountry, c.stateName, c.city)}
                    style={{
                      display: 'block', width: 'calc(100% - 8px)', margin: '0 4px',
                      textAlign: 'left', padding: '9px 14px', border: 'none', borderRadius: 8,
                      background: city === c.city ? 'var(--primary-50)' : 'transparent',
                      fontSize: 13, fontWeight: city === c.city ? 700 : 400,
                      color: city === c.city ? 'var(--primary)' : 'var(--fg-1)',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {c.city}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {(country || state || city) && (
        <button
          onClick={() => go()}
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 12, color: 'var(--fg-4)', background: 'none', border: 'none',
            cursor: 'pointer', padding: '2px 6px', borderRadius: 6,
          }}
        >
          <X size={12} /> Clear
        </button>
      )}

      <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--fg-4)' }} className="hidden md:block">
        {city ? 'City view' : state ? 'State view' : country ? 'Country view' : 'Global view'} · Select above to narrow
      </span>
    </div>
  )
}
