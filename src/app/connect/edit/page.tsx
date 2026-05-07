'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Save } from 'lucide-react'
import { COUNTRIES, getStatesForCountry, getCitiesForState } from '@/lib/geo'

const INTENTS = [
  { id: 'FRIENDSHIP', label: 'Friendship', emoji: '🤝', desc: 'Make Nepali friends nearby' },
  { id: 'DATING',     label: 'Dating',     emoji: '💕', desc: 'Meet someone special' },
  { id: 'MARRIAGE',   label: 'Marriage',   emoji: '💍', desc: 'Find a life partner' },
]

const GENDERS = [
  { id: 'MALE',       label: 'Man' },
  { id: 'FEMALE',     label: 'Woman' },
  { id: 'NON_BINARY', label: 'Non-binary' },
  { id: 'OTHER',      label: 'Other' },
]

const LOOKING_FOR = ['Men', 'Women', 'Non-binary people', 'Everyone']

const HEIGHTS = [
  'Under 5\'0"','5\'0"','5\'1"','5\'2"','5\'3"','5\'4"','5\'5"','5\'6"',
  '5\'7"','5\'8"','5\'9"','5\'10"','5\'11"','6\'0"','Over 6\'0"',
]

const RELIGIONS = ['Hindu', 'Buddhist', 'Kirat', 'Christian', 'Muslim', 'Secular', 'Prefer not to say']

const NEPAL_HOMETOWNS = [
  'Kathmandu', 'Pokhara', 'Lalitpur (Patan)', 'Bhaktapur', 'Biratnagar',
  'Chitwan', 'Butwal', 'Dharan', 'Hetauda', 'Janakpur', 'Nepalgunj',
  'Birgunj', 'Dhangadhi', 'Tulsipur', 'Outside Nepal',
]

const EDUCATIONS = ["High School", "Some College", "Bachelor's", "Master's", "PhD", "Trade / Vocational", "Other"]

const DRINKING  = ['Never', 'Socially', 'Regularly']
const SMOKING   = ['Never', 'Occasionally', 'Regularly']
const DIETARY   = ['Vegetarian', 'Vegan', 'Non-vegetarian', 'Halal', 'No preference']
const LANGUAGES = ['Nepali', 'Hindi', 'English', 'Maithili', 'Bhojpuri', 'Newari', 'Tamang', 'Gurung', 'Rai', 'Limbu']

const INTENT_COLORS: Record<string, string> = {
  FRIENDSHIP: '#3B82F6', DATING: '#E31C5F', MARRIAGE: '#0E9F6E',
}

const PREF_GENDERS = [
  { id: '',       label: 'Everyone' },
  { id: 'MALE',   label: 'Men' },
  { id: 'FEMALE', label: 'Women' },
]

const EMPTY_FORM = {
  intents: [] as string[], gender: '', lookingFor: [] as string[],
  age: '', height: '', bio: '',
  country: 'USA', state: 'Texas', city: 'Dallas',
  hometown: '', religion: '', caste: '',
  occupation: '', education: '', dietary: '', drinking: '', smoking: '',
  language: [] as string[],
  prefGender: '', prefMinAge: 18, prefMaxAge: 60,
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
      {children}
    </div>
  )
}

function ChipBtn({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 9999, fontSize: 13, fontWeight: 600,
        border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
        background: selected ? 'var(--primary)' : 'var(--surface)',
        color: selected ? 'white' : 'var(--fg-2)',
        cursor: 'pointer', fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  )
}

function ChoiceBtn({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '11px 16px', borderRadius: 12, textAlign: 'left',
        border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
        background: selected ? 'var(--primary-50, #EFF6FF)' : 'var(--surface)',
        cursor: 'pointer', fontFamily: 'inherit', color: 'var(--fg-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontWeight: 600, fontSize: 14, width: '100%',
      }}
    >
      {children}
      {selected && <Check size={15} strokeWidth={2.5} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
    </button>
  )
}

function Divider() {
  return <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '28px 0' }} />
}

export default function ConnectEditPage() {
  const router = useRouter()
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [notSignedIn, setNotSignedIn] = useState(false)

  useEffect(() => {
    fetch('/api/connect/profile')
      .then(r => {
        if (r.status === 401) { setNotSignedIn(true); setLoaded(true); return null }
        return r.json()
      })
      .then(existing => {
        if (!existing) { router.replace('/connect/setup'); return }
        setForm({
          intents:    Array.isArray(existing.intents) ? existing.intents : (existing.intent ? [existing.intent] : []),
          gender:     existing.gender     ?? '',
          lookingFor: existing.lookingFor ?? [],
          age:        existing.age ? String(existing.age) : '',
          height:     existing.height     ?? '',
          bio:        existing.bio        ?? '',
          country:    existing.country    ?? 'USA',
          state:      existing.state      ?? 'Texas',
          city:       existing.city       ?? 'Dallas',
          hometown:   existing.hometown   ?? '',
          religion:   existing.religion   ?? '',
          caste:      existing.caste      ?? '',
          occupation: existing.occupation ?? '',
          education:  existing.education  ?? '',
          dietary:    existing.dietary    ?? '',
          drinking:   existing.drinking   ?? '',
          smoking:    existing.smoking    ?? '',
          language:   existing.language   ?? [],
          prefGender: existing.prefGender ?? '',
          prefMinAge: existing.prefMinAge ?? 18,
          prefMaxAge: existing.prefMaxAge ?? 60,
        })
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  function set(key: string, value: any) { setForm(f => ({ ...f, [key]: value })) }

  function toggleArr(key: 'intents' | 'lookingFor' | 'language', val: string) {
    setForm(f => ({
      ...f,
      [key]: (f[key] as string[]).includes(val)
        ? (f[key] as string[]).filter(x => x !== val)
        : [...(f[key] as string[]), val],
    }))
  }

  async function handleSave() {
    if (form.intents.length === 0 || !form.bio?.trim()) {
      setError('Select at least one intent and fill in your bio')
      return
    }
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/connect/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: form.age ? parseInt(form.age) : null,
          prefGender: form.prefGender || null,
          prefMinAge: form.prefMinAge,
          prefMaxAge: form.prefMaxAge,
        }),
      })
      if (res.status === 401) { setNotSignedIn(true); return }
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Failed to save profile')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return null

  if (notSignedIn) {
    return (
      <div style={{ maxWidth: 420, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--fg-1)', marginBottom: 8 }}>Sign in to continue</h2>
        <p style={{ fontSize: 14, color: 'var(--fg-3)', marginBottom: 24 }}>You need to be signed in to edit your Connect profile.</p>
        <Link href="/signin?callbackUrl=/connect/edit" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          Sign in with Google
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Link href="/profile?tab=connect" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 24 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to profile
      </Link>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)', margin: '0 0 4px' }}>
        Edit Connect profile
      </h1>
      <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: '0 0 32px' }}>Changes are saved immediately when you click Save.</p>

      {/* ── Intent ── */}
      <SectionHeader>What are you looking for? (select all that apply)</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {INTENTS.map(i => {
          const selected = form.intents.includes(i.id)
          return (
            <button
              key={i.id}
              onClick={() => toggleArr('intents', i.id)}
              style={{
                padding: '14px 18px', borderRadius: 14, textAlign: 'left',
                border: `2px solid ${selected ? INTENT_COLORS[i.id] : 'var(--border)'}`,
                background: selected ? INTENT_COLORS[i.id] + '12' : 'var(--surface)',
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <span style={{ fontSize: 26 }}>{i.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)' }}>{i.label}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 1 }}>{i.desc}</div>
              </div>
              {selected && <Check size={18} strokeWidth={2.5} style={{ color: INTENT_COLORS[i.id], flexShrink: 0 }} />}
            </button>
          )
        })}
      </div>

      <Divider />

      {/* ── Gender & looking for ── */}
      <SectionHeader>About you</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 10 }}>I am a…</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {GENDERS.map(g => (
              <ChoiceBtn key={g.id} selected={form.gender === g.id} onClick={() => set('gender', g.id)}>
                {g.label}
              </ChoiceBtn>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 10 }}>I'm interested in…</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOOKING_FOR.map(lf => (
              <ChoiceBtn key={lf} selected={form.lookingFor.includes(lf)} onClick={() => toggleArr('lookingFor', lf)}>
                {lf}
              </ChoiceBtn>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Age & height ── */}
      <SectionHeader>Age & height</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Age *</label>
          <input
            type="number" min={18} max={80} value={form.age}
            onChange={e => set('age', e.target.value)}
            placeholder="Your age"
            style={{ width: 140, padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--fg-1)' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>Height (optional)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {HEIGHTS.map(h => (
              <ChipBtn key={h} selected={form.height === h} onClick={() => set('height', form.height === h ? '' : h)}>
                {h}
              </ChipBtn>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Bio ── */}
      <SectionHeader>Your story</SectionHeader>
      <textarea
        value={form.bio}
        onChange={e => set('bio', e.target.value)}
        rows={6}
        placeholder="Tell people about yourself — your interests, lifestyle, what you're looking for…"
        style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', background: 'var(--surface)', color: 'var(--fg-1)', lineHeight: 1.6 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--fg-4)' }}>
        <span>Min 10 characters</span>
        <span>{form.bio.length} / 500</span>
      </div>

      <Divider />

      {/* ── Location ── */}
      <SectionHeader>Where do you live?</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Country</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {COUNTRIES.map(c => (
              <ChipBtn
                key={c.name}
                selected={form.country === c.name}
                onClick={() => {
                  const firstState = getStatesForCountry(c.name)[0]
                  const firstCity  = firstState ? getCitiesForState(c.name, firstState.stateName)[0] : null
                  set('country', c.name)
                  set('state',   firstState?.stateName ?? '')
                  set('city',    firstCity?.city ?? '')
                }}
              >
                {c.flag} {c.name}
              </ChipBtn>
            ))}
          </div>
        </div>
        {form.country && (
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>State / Province</label>
            <select
              value={form.state}
              onChange={e => { set('state', e.target.value); set('city', getCitiesForState(form.country, e.target.value)[0]?.city ?? '') }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--fg-1)' }}
            >
              {getStatesForCountry(form.country).map(s => (
                <option key={s.stateName} value={s.stateName}>{s.stateName}</option>
              ))}
            </select>
          </div>
        )}
        {form.state && (
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>City</label>
            <select
              value={form.city}
              onChange={e => set('city', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--fg-1)' }}
            >
              <option value="">— Any city in {form.state} —</option>
              {getCitiesForState(form.country, form.state).map(c => (
                <option key={c.city} value={c.city}>{c.city}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Divider />

      {/* ── Roots ── */}
      <SectionHeader>Your roots</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>🇳🇵 Hometown in Nepal</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {NEPAL_HOMETOWNS.map(h => (
              <ChipBtn key={h} selected={form.hometown === h} onClick={() => set('hometown', form.hometown === h ? '' : h)}>
                {h}
              </ChipBtn>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>Religion</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {RELIGIONS.map(r => (
              <ChipBtn key={r} selected={form.religion === r} onClick={() => set('religion', form.religion === r ? '' : r)}>
                {r}
              </ChipBtn>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Community / Caste (optional)</label>
          <input
            value={form.caste}
            onChange={e => set('caste', e.target.value)}
            placeholder="e.g. Brahmin, Chhetri, Magar, Rai, Newar…"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--surface)', color: 'var(--fg-1)' }}
          />
        </div>
      </div>

      <Divider />

      {/* ── Lifestyle ── */}
      <SectionHeader>Lifestyle</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Occupation (optional)</label>
          <input
            value={form.occupation}
            onChange={e => set('occupation', e.target.value)}
            placeholder="e.g. Software Engineer, Nurse, Student…"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--surface)', color: 'var(--fg-1)' }}
          />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>Education</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {EDUCATIONS.map(e => (
              <ChipBtn key={e} selected={form.education === e} onClick={() => set('education', form.education === e ? '' : e)}>
                {e}
              </ChipBtn>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>Drinking</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DRINKING.map(d => (
                <ChipBtn key={d} selected={form.drinking === d} onClick={() => set('drinking', form.drinking === d ? '' : d)}>
                  {d}
                </ChipBtn>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>Smoking</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SMOKING.map(s => (
                <ChipBtn key={s} selected={form.smoking === s} onClick={() => set('smoking', form.smoking === s ? '' : s)}>
                  {s}
                </ChipBtn>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>Diet</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DIETARY.map(d => (
                <ChipBtn key={d} selected={form.dietary === d} onClick={() => set('dietary', form.dietary === d ? '' : d)}>
                  {d}
                </ChipBtn>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 10 }}>Languages spoken</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {LANGUAGES.map(l => (
              <ChipBtn key={l} selected={form.language.includes(l)} onClick={() => toggleArr('language', l)}>
                {l}
              </ChipBtn>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Preferences ── */}
      <SectionHeader>Who do you want to meet?</SectionHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 10 }}>Show me</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PREF_GENDERS.map(g => (
              <ChoiceBtn key={g.id} selected={form.prefGender === g.id} onClick={() => set('prefGender', g.id)}>
                {g.label}
              </ChoiceBtn>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-2)', marginBottom: 14 }}>
            Age range: {form.prefMinAge}–{form.prefMaxAge}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--fg-3)', width: 28 }}>Min</span>
              <input
                type="range" min={18} max={70} value={form.prefMinAge}
                onChange={e => set('prefMinAge', Math.min(+e.target.value, form.prefMaxAge - 1))}
                style={{ flex: 1, accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, width: 28, color: 'var(--fg-1)' }}>{form.prefMinAge}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--fg-3)', width: 28 }}>Max</span>
              <input
                type="range" min={19} max={80} value={form.prefMaxAge}
                onChange={e => set('prefMaxAge', Math.max(+e.target.value, form.prefMinAge + 1))}
                style={{ flex: 1, accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, width: 28, color: 'var(--fg-1)' }}>{form.prefMaxAge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Save bar ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '14px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 50 }}>
        {error && <span style={{ fontSize: 13, color: '#DC2626' }}>{error}</span>}
        {saved && <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 600 }}>Saved!</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="np-btn np-btn-primary"
          style={{ minWidth: 160, opacity: saving ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}
        >
          <Save size={15} strokeWidth={2} />
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
