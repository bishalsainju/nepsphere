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
  const [open, setOpen]             = useState(false)
  const [countryHover, setCountryHover] = useState<string | null>(null)
  const [stateHover,   setStateHover]   = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const country = searchParams.get('country')
  const state   = searchParams.get('state')
  const city    = searchParams.get('city')

  const label = getLocationLabel(country, state, city)

  const closePanel = useCallback(() => {
    setOpen(false)
    setCountryHover(null)
    setStateHover(null)
  }, [])

  const go = useCallback((c?: string, s?: string, ci?: string) => {
    closePanel()
    const params = new URLSearchParams()
    if (pathname.includes('community') && searchParams.get('category')) {
      params.set('category', searchParams.get('category')!)
    }
    if (c)  params.set('country', c)
    if (s)  params.set('state', s)
    if (ci) params.set('city', ci)
    router.push(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams, closePanel])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) closePanel()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, closePanel])

  // Reset state hover when country hover changes
  useEffect(() => { setStateHover(null) }, [countryHover])

  const activeCountry = countryHover ?? country ?? null
  const states        = activeCountry ? getStatesForCountry(activeCountry) : []

  // Cities: only show when explicitly hovering a state, or a state is already selected (and same country)
  const activeCityState = stateHover ?? (country === activeCountry ? state : null)
  const cities          = activeCountry && activeCityState
    ? getCitiesForState(activeCountry, activeCityState)
    : []

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
          <div className="np-geobar-panel" style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            display: 'flex',
            minWidth: activeCountry ? (activeCityState ? 560 : 380) : 200,
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
                onMouseEnter={() => setCountryHover(null)}
                style={{
                  display: 'block', textAlign: 'left',
                  padding: '9px 14px', border: 'none',
                  background: !country && !countryHover ? 'var(--primary-50)' : 'transparent',
                  fontSize: 14, fontWeight: !country && !countryHover ? 700 : 400,
                  color: !country && !countryHover ? 'var(--primary)' : 'var(--fg-1)',
                  cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8,
                  margin: '0 4px', width: 'calc(100% - 8px)',
                }}
              >
                🌍 Everywhere
              </button>
              {COUNTRIES.map(c => {
                const isActive = countryHover === c.name || (!countryHover && country === c.name)
                return (
                  <button
                    key={c.name}
                    onClick={() => go(c.name)}
                    onMouseEnter={() => setCountryHover(c.name)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: 'calc(100% - 8px)', margin: '0 4px',
                      padding: '9px 14px', border: 'none', borderRadius: 8,
                      background: isActive ? 'var(--primary-50)' : 'transparent',
                      fontSize: 14, fontWeight: isActive ? 700 : 400,
                      color: isActive ? 'var(--primary)' : 'var(--fg-1)',
                      cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    }}
                  >
                    <span>{c.flag} {c.name}</span>
                    <ChevronRight size={12} style={{ opacity: 0.4 }} />
                  </button>
                )
              })}
            </div>

            {/* Column 2: States */}
            {activeCountry && (
              <div style={{ width: 190, borderRight: activeCityState ? '1px solid var(--border-subtle)' : 'none', padding: '8px 0' }}>
                <div style={{ padding: '6px 14px', fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  State / Province
                </div>
                <button
                  onClick={() => go(activeCountry)}
                  onMouseEnter={() => setStateHover(null)}
                  style={{
                    display: 'block', width: 'calc(100% - 8px)', margin: '0 4px',
                    textAlign: 'left', padding: '9px 14px', border: 'none', borderRadius: 8,
                    background: !stateHover && (!state || countryHover) ? 'var(--primary-50)' : 'transparent',
                    fontSize: 13, fontWeight: !stateHover && (!state || countryHover) ? 700 : 400,
                    color: !stateHover && (!state || countryHover) ? 'var(--primary)' : 'var(--fg-3)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  All of {activeCountry}
                </button>
                {states.map(s => {
                  const isActive = stateHover === s.stateName || (!stateHover && !countryHover && state === s.stateName)
                  return (
                    <button
                      key={s.stateName}
                      onClick={() => go(activeCountry, s.stateName)}
                      onMouseEnter={() => setStateHover(s.stateName)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: 'calc(100% - 8px)', margin: '0 4px',
                        padding: '9px 14px', border: 'none', borderRadius: 8,
                        background: isActive ? 'var(--primary-50)' : 'transparent',
                        fontSize: 13, fontWeight: isActive ? 700 : 400,
                        color: isActive ? 'var(--primary)' : 'var(--fg-1)',
                        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                      }}
                    >
                      <span>{s.stateName}</span>
                      {getCitiesForState(activeCountry, s.stateName).length > 0 && (
                        <ChevronRight size={12} style={{ opacity: 0.4 }} />
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Column 3: Cities — only when a state is hovered or selected */}
            {activeCountry && activeCityState && cities.length > 0 && (
              <div style={{ flex: 1, padding: '8px 0', minWidth: 160 }}>
                <div style={{ padding: '6px 14px', fontSize: 11, fontWeight: 700, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  City
                </div>
                <button
                  onClick={() => go(activeCountry, activeCityState)}
                  style={{
                    display: 'block', width: 'calc(100% - 8px)', margin: '0 4px',
                    textAlign: 'left', padding: '9px 14px', border: 'none', borderRadius: 8,
                    background: state === activeCityState && !city ? 'var(--primary-50)' : 'transparent',
                    fontSize: 13, fontWeight: state === activeCityState && !city ? 700 : 400,
                    color: state === activeCityState && !city ? 'var(--primary)' : 'var(--fg-3)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  All of {activeCityState}
                </button>
                {cities.map(c => (
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
