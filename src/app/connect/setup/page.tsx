'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
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

function ChoiceBtn({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 16px', borderRadius: 12, textAlign: 'left',
        border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
        background: selected ? 'var(--primary-50, #EFF6FF)' : 'var(--surface)',
        cursor: 'pointer', fontFamily: 'inherit', color: 'var(--fg-1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontWeight: 600, fontSize: 14, width: '100%',
      }}
    >
      {children}
      {selected && <Check size={16} strokeWidth={2.5} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
    </button>
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

export default function ConnectSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [notSignedIn, setNotSignedIn] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    fetch('/api/connect/profile')
      .then(r => { if (r.status === 401) { setNotSignedIn(true); setLoaded(true) } return r.json() })
      .then(existing => {
        if (existing) {
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
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
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

  const steps = [
    {
      title: "What are you looking for?",
      subtitle: "Select all that apply — you can change this anytime",
      valid: form.intents.length > 0,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {INTENTS.map(i => {
            const selected = form.intents.includes(i.id)
            return (
              <button
                key={i.id}
                onClick={() => toggleArr('intents', i.id)}
                style={{
                  padding: '18px 20px', borderRadius: 16, textAlign: 'left',
                  border: `2.5px solid ${selected ? INTENT_COLORS[i.id] : 'var(--border)'}`,
                  background: selected ? INTENT_COLORS[i.id] + '12' : 'var(--surface)',
                  cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 16,
                }}
              >
                <span style={{ fontSize: 32 }}>{i.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg-1)' }}>{i.label}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>{i.desc}</div>
                </div>
                {selected && <Check size={20} strokeWidth={2.5} style={{ color: INTENT_COLORS[i.id], flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>
      ),
    },
    {
      title: "About you",
      subtitle: "Your gender and who you'd like to meet",
      valid: !!form.gender && form.lookingFor.length > 0,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>I am a…</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {GENDERS.map(g => (
                <ChoiceBtn key={g.id} selected={form.gender === g.id} onClick={() => set('gender', g.id)}>
                  {g.label}
                </ChoiceBtn>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>I'm interested in…</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LOOKING_FOR.map(lf => (
                <ChoiceBtn key={lf} selected={form.lookingFor.includes(lf)} onClick={() => toggleArr('lookingFor', lf)}>
                  {lf}
                </ChoiceBtn>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Age & height",
      subtitle: "Height is always optional",
      valid: !!form.age && parseInt(form.age) >= 18,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Age *</label>
            <input
              type="number" min={18} max={80} value={form.age}
              onChange={e => set('age', e.target.value)}
              placeholder="Your age"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 16, fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--surface)', color: 'var(--fg-1)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 8 }}>Height (optional)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {HEIGHTS.map(h => (
                <ChipBtn key={h} selected={form.height === h} onClick={() => set('height', form.height === h ? '' : h)}>
                  {h}
                </ChipBtn>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Your story",
      subtitle: "What should people know about you?",
      valid: form.bio.trim().length >= 10,
      content: (
        <div>
          <textarea
            value={form.bio}
            onChange={e => set('bio', e.target.value)}
            rows={7}
            placeholder="Tell people about yourself — your interests, lifestyle, what you're looking for…"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical', background: 'var(--surface)', color: 'var(--fg-1)', lineHeight: 1.6 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--fg-4)' }}>
            <span>Min 10 characters</span>
            <span>{form.bio.length} / 500</span>
          </div>
        </div>
      ),
    },
    {
      title: "Where do you live?",
      subtitle: "This is shown on your profile",
      valid: !!form.country && !!form.city,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 10 }}>Country</label>
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
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>State / Province</label>
              <select
                value={form.state}
                onChange={e => { set('state', e.target.value); set('city', getCitiesForState(form.country, e.target.value)[0]?.city ?? '') }}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--fg-1)' }}
              >
                {getStatesForCountry(form.country).map(s => (
                  <option key={s.stateName} value={s.stateName}>{s.stateName}</option>
                ))}
              </select>
            </div>
          )}
          {form.state && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>City</label>
              <select
                value={form.city}
                onChange={e => set('city', e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--fg-1)' }}
              >
                <option value="">— Any city in {form.state} —</option>
                {getCitiesForState(form.country, form.state).map(c => (
                  <option key={c.city} value={c.city}>{c.city}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Your roots",
      subtitle: "Where you're from and your background",
      valid: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 10 }}>🇳🇵 Hometown in Nepal</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {NEPAL_HOMETOWNS.map(h => (
                <ChipBtn key={h} selected={form.hometown === h} onClick={() => set('hometown', form.hometown === h ? '' : h)}>
                  {h}
                </ChipBtn>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 10 }}>Religion</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {RELIGIONS.map(r => (
                <ChipBtn key={r} selected={form.religion === r} onClick={() => set('religion', form.religion === r ? '' : r)}>
                  {r}
                </ChipBtn>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>Community / Caste (optional)</label>
            <input
              value={form.caste}
              onChange={e => set('caste', e.target.value)}
              placeholder="e.g. Brahmin, Chhetri, Magar, Rai, Newar…"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--surface)', color: 'var(--fg-1)' }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Lifestyle",
      subtitle: "Help people find a compatible match",
      valid: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', display: 'block', marginBottom: 6 }}>Occupation (optional)</label>
            <input
              value={form.occupation}
              onChange={e => set('occupation', e.target.value)}
              placeholder="e.g. Software Engineer, Nurse, Student…"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box', background: 'var(--surface)', color: 'var(--fg-1)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Education</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {EDUCATIONS.map(e => (
                <ChipBtn key={e} selected={form.education === e} onClick={() => set('education', form.education === e ? '' : e)}>
                  {e}
                </ChipBtn>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Drinking</label>
              {DRINKING.map(d => (
                <ChipBtn key={d} selected={form.drinking === d} onClick={() => set('drinking', form.drinking === d ? '' : d)}>
                  {d}
                </ChipBtn>
              ))}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Smoking</label>
              {SMOKING.map(s => (
                <ChipBtn key={s} selected={form.smoking === s} onClick={() => set('smoking', form.smoking === s ? '' : s)}>
                  {s}
                </ChipBtn>
              ))}
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Diet</label>
              {DIETARY.map(d => (
                <ChipBtn key={d} selected={form.dietary === d} onClick={() => set('dietary', form.dietary === d ? '' : d)}>
                  {d}
                </ChipBtn>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 8 }}>Languages spoken</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {LANGUAGES.map(l => (
                <ChipBtn key={l} selected={form.language.includes(l)} onClick={() => toggleArr('language', l)}>
                  {l}
                </ChipBtn>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Who do you want to meet?",
      subtitle: "We'll use this to filter your matches automatically",
      valid: true,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Show me</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PREF_GENDERS.map(g => (
                <ChoiceBtn key={g.id} selected={form.prefGender === g.id} onClick={() => set('prefGender', g.id)}>
                  {g.label}
                </ChoiceBtn>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
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
      ),
    },
  ]

  const currentStep = steps[step]
  const isLast = step === steps.length - 1
  const progress = ((step + 1) / steps.length) * 100

  async function handleSubmit() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/connect/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          intents: form.intents,
          age: form.age ? parseInt(form.age) : null,
          prefGender: form.prefGender || null,
          prefMinAge: form.prefMinAge,
          prefMaxAge: form.prefMaxAge,
        }),
      })
      if (res.status === 401) { setNotSignedIn(true); return }
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Failed to save profile')
      router.push(`/connect/${data.userId}`)
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
        <p style={{ fontSize: 14, color: 'var(--fg-3)', marginBottom: 24 }}>You need to be signed in to create a Connect profile.</p>
        <Link href="/signin?callbackUrl=/connect/setup" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          Sign in with Google
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 24px 48px' }}>
      <Link href="/connect" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 28 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Connect
      </Link>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>
        {steps.map((_, i) => (
          <div
            key={i}
            onClick={() => i < step && setStep(i)}
            style={{
              flex: 1, height: 4, borderRadius: 9999,
              background: i <= step ? 'var(--primary)' : 'var(--border)',
              cursor: i < step ? 'pointer' : 'default',
              transition: 'background 200ms',
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: 12, color: 'var(--fg-4)', marginBottom: 28 }}>Step {step + 1} of {steps.length}</div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--fg-1)', margin: '0 0 4px' }}>
        {currentStep.title}
      </h1>
      {currentStep.subtitle && (
        <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: '0 0 24px' }}>{currentStep.subtitle}</p>
      )}

      {currentStep.content}

      {error && <p style={{ color: '#DC2626', fontSize: 13, marginTop: 14 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="np-btn np-btn-secondary" style={{ flex: 1 }}>
            Back
          </button>
        )}
        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={saving || !currentStep.valid}
            className="np-btn np-btn-primary"
            style={{ flex: 2, opacity: (saving || !currentStep.valid) ? 0.5 : 1 }}
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        ) : (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!currentStep.valid}
            className="np-btn np-btn-primary"
            style={{ flex: 2, opacity: !currentStep.valid ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            Continue <ArrowRight size={15} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  )
}
