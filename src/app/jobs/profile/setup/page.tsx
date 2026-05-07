'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Upload, FileText, X, ExternalLink } from 'lucide-react'
import { COUNTRIES, getStatesForCountry, getCitiesForState } from '@/lib/geo'

const WORK_AUTH = [
  'US Citizen', 'Permanent Resident', 'H-1B', 'OPT / EAD',
  'Need sponsorship', 'Other',
]

const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL',
  'Excel', 'Customer Service', 'Sales', 'Driving', 'Construction',
  'Cooking', 'Cleaning', 'Childcare', 'Translation (Nepali/English)',
]

const LANGUAGES = ['Nepali', 'English', 'Hindi', 'Maithili', 'Bhojpuri', 'Newari', 'Tamang', 'Spanish']

type Experience = {
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

type Education = {
  school: string
  degree: string
  field: string
  startYear: string
  endYear: string
}

const EMPTY_EXP: Experience = { role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
const EMPTY_EDU: Education  = { school: '', degree: '', field: '', startYear: '', endYear: '' }

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="np-card" style={{ padding: 22, marginBottom: 16 }}>
      <h2 style={{ margin: '0 0 4px', fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: 'var(--fg-1)' }}>
        {title}
      </h2>
      {hint && <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--fg-3)' }}>{hint}</p>}
      {!hint && <div style={{ marginBottom: 16 }} />}
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
      {children}
    </label>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
  outline: 'none', background: 'var(--surface)', color: 'var(--fg-1)', boxSizing: 'border-box',
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px', borderRadius: 9999, fontSize: 13, fontWeight: 600,
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

export default function JobProfileSetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo')

  const [loaded,    setLoaded]    = useState(false)
  const [notAuth,   setNotAuth]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  const [headline,     setHeadline]     = useState('')
  const [about,        setAbout]        = useState('')
  const [skillsInput,  setSkillsInput]  = useState('')
  const [skills,       setSkills]       = useState<string[]>([])
  const [languages,    setLanguages]    = useState<string[]>([])
  const [workAuth,     setWorkAuth]     = useState('')
  const [country,      setCountry]      = useState('USA')
  const [state,        setState]        = useState('Texas')
  const [city,         setCity]         = useState('Dallas')
  const [linkedinUrl,  setLinkedinUrl]  = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [experiences,  setExperiences]  = useState<Experience[]>([{ ...EMPTY_EXP }])
  const [education,    setEducation]    = useState<Education[]>([{ ...EMPTY_EDU }])

  const [resumeUrl,      setResumeUrl]      = useState<string | null>(null)
  const [resumeFile,     setResumeFile]     = useState<string | null>(null)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [resumeError,    setResumeError]    = useState('')

  useEffect(() => {
    fetch('/api/jobs/profile')
      .then(r => {
        if (r.status === 401) { setNotAuth(true); setLoaded(true); return null }
        return r.json()
      })
      .then(p => {
        if (p) {
          setHeadline(p.headline ?? '')
          setAbout(p.about ?? '')
          setSkills(p.skills ?? [])
          setLanguages(p.languages ?? [])
          setWorkAuth(p.workAuth ?? '')
          setCountry(p.country ?? 'USA')
          setState(p.state ?? 'Texas')
          setCity(p.city ?? 'Dallas')
          setLinkedinUrl(p.linkedinUrl ?? '')
          setPortfolioUrl(p.portfolioUrl ?? '')
          setResumeUrl(p.resumeUrl ?? null)
          setResumeFile(p.resumeFile ?? null)
          if (Array.isArray(p.experiences) && p.experiences.length) {
            setExperiences(p.experiences.map((e: any) => ({
              role:        e.role ?? '',
              company:     e.company ?? '',
              location:    e.location ?? '',
              startDate:   e.startDate ?? '',
              endDate:     e.endDate ?? '',
              current:     !!e.current,
              description: e.description ?? '',
            })))
          }
          if (Array.isArray(p.education) && p.education.length) {
            setEducation(p.education.map((e: any) => ({
              school:    e.school ?? '',
              degree:    e.degree ?? '',
              field:     e.field ?? '',
              startYear: e.startYear ?? '',
              endYear:   e.endYear ?? '',
            })))
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const states = getStatesForCountry(country)
  const cities = getCitiesForState(country, state)

  function addSkill(s: string) {
    const v = s.trim()
    if (!v || skills.includes(v)) return
    setSkills([...skills, v])
  }

  function removeSkill(s: string) { setSkills(skills.filter(x => x !== s)) }

  function toggleLang(l: string) {
    setLanguages(languages.includes(l) ? languages.filter(x => x !== l) : [...languages, l])
  }

  function updateExp(i: number, patch: Partial<Experience>) {
    setExperiences(exp => exp.map((e, idx) => idx === i ? { ...e, ...patch } : e))
  }
  function addExp()    { setExperiences([...experiences, { ...EMPTY_EXP }]) }
  function removeExp(i: number) { setExperiences(experiences.filter((_, idx) => idx !== i)) }

  function updateEdu(i: number, patch: Partial<Education>) {
    setEducation(edu => edu.map((e, idx) => idx === i ? { ...e, ...patch } : e))
  }
  function addEdu()    { setEducation([...education, { ...EMPTY_EDU }]) }
  function removeEdu(i: number) { setEducation(education.filter((_, idx) => idx !== i)) }

  async function uploadResume(file: File) {
    setResumeError('')
    setUploadingResume(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/jobs/profile/resume', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        setResumeError(data.error ?? 'Upload failed')
        return
      }
      setResumeUrl(data.url)
      setResumeFile(data.filename)
    } finally {
      setUploadingResume(false)
    }
  }

  async function removeResume() {
    setUploadingResume(true)
    try {
      await fetch('/api/jobs/profile/resume', { method: 'DELETE' })
      setResumeUrl(null)
      setResumeFile(null)
    } finally {
      setUploadingResume(false)
    }
  }

  async function save() {
    setError('')
    if (!headline.trim()) { setError('Headline is required'); return }
    if (!about.trim())    { setError('About is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/jobs/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline, about, skills, languages, workAuth,
          city, state, country, linkedinUrl, portfolioUrl,
          experiences, education,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save')
        return
      }
      router.push(returnTo || '/jobs')
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--fg-3)' }}>Loading…</div>
  if (notAuth) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', padding: 24, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Sign in to create a job profile</h1>
        <Link href={`/signin?callbackUrl=${encodeURIComponent('/jobs/profile/setup')}`} className="np-btn np-btn-primary lg">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="np-subpage" style={{ maxWidth: 760 }}>
      <Link href={returnTo || '/jobs'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 18 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back
      </Link>

      <h1 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--fg-1)' }}>
        Your job profile
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--fg-3)' }}>
        Employers see this when you apply. Fill in what's relevant — you can update anytime.
      </p>

      <Section title="Basics" hint="A clear headline and summary make a strong first impression.">
        <Label>Headline *</Label>
        <input
          style={{ ...inputStyle, marginBottom: 12 }}
          placeholder="e.g. Senior Frontend Engineer · React + TypeScript"
          value={headline}
          onChange={e => setHeadline(e.target.value)}
          maxLength={120}
        />
        <Label>About *</Label>
        <textarea
          style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
          placeholder="Two or three sentences about your experience and what you're looking for."
          value={about}
          onChange={e => setAbout(e.target.value)}
          maxLength={1000}
        />
      </Section>

      <Section title="Resume" hint="PDF or Word document, up to 5 MB.">
        {resumeUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <FileText size={20} style={{ color: 'var(--primary)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {resumeFile ?? 'Resume'}
              </div>
              <a href={resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                View <ExternalLink size={11} />
              </a>
            </div>
            <button
              type="button"
              onClick={removeResume}
              disabled={uploadingResume}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 9999, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--fg-3)', fontFamily: 'inherit' }}
            >
              <X size={12} style={{ display: 'inline', marginRight: 4 }} /> Remove
            </button>
          </div>
        ) : (
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '20px 16px', borderRadius: 12, border: '2px dashed var(--border)',
            cursor: 'pointer', color: 'var(--fg-3)', fontSize: 14, fontWeight: 600,
          }}>
            <Upload size={18} />
            {uploadingResume ? 'Uploading…' : 'Click to upload PDF or DOC'}
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) uploadResume(f)
              }}
            />
          </label>
        )}
        {resumeError && (
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#EF4444' }}>{resumeError}</p>
        )}
      </Section>

      <Section title="Skills">
        <Label>Add skills</Label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            style={inputStyle}
            placeholder="Type a skill and press Enter"
            value={skillsInput}
            onChange={e => setSkillsInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addSkill(skillsInput)
                setSkillsInput('')
              }
            }}
          />
          <button type="button" onClick={() => { addSkill(skillsInput); setSkillsInput('') }}
            style={{ padding: '0 18px', borderRadius: 10, background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Add
          </button>
        </div>
        {skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {skills.map(s => (
              <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 9999, background: 'var(--primary)', color: 'white', fontSize: 12, fontWeight: 600 }}>
                {s}
                <button type="button" onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', display: 'inline-flex', padding: 0 }}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div style={{ fontSize: 12, color: 'var(--fg-4)', marginBottom: 6 }}>Suggestions:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 12).map(s => (
            <button key={s} type="button" onClick={() => addSkill(s)}
              style={{ padding: '5px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: 'var(--surface)', border: '1px dashed var(--border)', color: 'var(--fg-3)', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              + {s}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Experience" hint="Most recent first. Skip if you're just starting out.">
        {experiences.map((e, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 10, position: 'relative' }}>
            {experiences.length > 1 && (
              <button type="button" onClick={() => removeExp(i)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-4)' }}>
                <Trash2 size={14} />
              </button>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <Label>Role</Label>
                <input style={inputStyle} placeholder="Software Engineer" value={e.role} onChange={ev => updateExp(i, { role: ev.target.value })} />
              </div>
              <div>
                <Label>Company</Label>
                <input style={inputStyle} placeholder="Acme Corp" value={e.company} onChange={ev => updateExp(i, { company: ev.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <Label>Location</Label>
                <input style={inputStyle} placeholder="Dallas, TX" value={e.location} onChange={ev => updateExp(i, { location: ev.target.value })} />
              </div>
              <div>
                <Label>Start</Label>
                <input style={inputStyle} placeholder="2022-03" value={e.startDate} onChange={ev => updateExp(i, { startDate: ev.target.value })} />
              </div>
              <div>
                <Label>End</Label>
                <input style={inputStyle} placeholder="2024-08" value={e.endDate} disabled={e.current} onChange={ev => updateExp(i, { endDate: ev.target.value })} />
              </div>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-2)', marginBottom: 10 }}>
              <input type="checkbox" checked={e.current} onChange={ev => updateExp(i, { current: ev.target.checked, endDate: ev.target.checked ? '' : e.endDate })} />
              I currently work here
            </label>
            <Label>What you did</Label>
            <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Optional — key responsibilities or accomplishments." value={e.description} onChange={ev => updateExp(i, { description: ev.target.value })} />
          </div>
        ))}
        <button type="button" onClick={addExp} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9999, border: '1.5px dashed var(--border)', background: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--fg-2)', fontFamily: 'inherit' }}>
          <Plus size={14} /> Add experience
        </button>
      </Section>

      <Section title="Education">
        {education.map((e, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 10, position: 'relative' }}>
            {education.length > 1 && (
              <button type="button" onClick={() => removeEdu(i)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-4)' }}>
                <Trash2 size={14} />
              </button>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <Label>School</Label>
                <input style={inputStyle} placeholder="University name" value={e.school} onChange={ev => updateEdu(i, { school: ev.target.value })} />
              </div>
              <div>
                <Label>Degree</Label>
                <input style={inputStyle} placeholder="Bachelor's" value={e.degree} onChange={ev => updateEdu(i, { degree: ev.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10 }}>
              <div>
                <Label>Field of study</Label>
                <input style={inputStyle} placeholder="Computer Science" value={e.field} onChange={ev => updateEdu(i, { field: ev.target.value })} />
              </div>
              <div>
                <Label>Start year</Label>
                <input style={inputStyle} placeholder="2018" value={e.startYear} onChange={ev => updateEdu(i, { startYear: ev.target.value })} />
              </div>
              <div>
                <Label>End year</Label>
                <input style={inputStyle} placeholder="2022" value={e.endYear} onChange={ev => updateEdu(i, { endYear: ev.target.value })} />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addEdu} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9999, border: '1.5px dashed var(--border)', background: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--fg-2)', fontFamily: 'inherit' }}>
          <Plus size={14} /> Add education
        </button>
      </Section>

      <Section title="Languages">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {LANGUAGES.map(l => (
            <Chip key={l} selected={languages.includes(l)} onClick={() => toggleLang(l)}>{l}</Chip>
          ))}
        </div>
      </Section>

      <Section title="Work authorization & location">
        <Label>Work authorization</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {WORK_AUTH.map(w => (
            <Chip key={w} selected={workAuth === w} onClick={() => setWorkAuth(workAuth === w ? '' : w)}>{w}</Chip>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div>
            <Label>Country</Label>
            <select style={inputStyle} value={country} onChange={e => { setCountry(e.target.value); setState(''); setCity('') }}>
              {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>State</Label>
            <select style={inputStyle} value={state} onChange={e => { setState(e.target.value); setCity('') }}>
              <option value="">Select…</option>
              {states.map(s => <option key={s.stateName} value={s.stateName}>{s.stateName}</option>)}
            </select>
          </div>
          <div>
            <Label>City</Label>
            <select style={inputStyle} value={city} onChange={e => setCity(e.target.value)}>
              <option value="">Select…</option>
              {cities.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Links">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <Label>LinkedIn</Label>
            <input style={inputStyle} placeholder="https://linkedin.com/in/…" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} />
          </div>
          <div>
            <Label>Portfolio / website</Label>
            <input style={inputStyle} placeholder="https://yourdomain.com" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} />
          </div>
        </div>
      </Section>

      {error && (
        <div style={{ padding: 12, borderRadius: 10, background: '#FEE2E2', color: '#991B1B', fontSize: 14, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Link href={returnTo || '/jobs'} style={{ padding: '10px 22px', borderRadius: 9999, border: '1px solid var(--border)', fontSize: 14, fontWeight: 600, color: 'var(--fg-2)', textDecoration: 'none' }}>
          Cancel
        </Link>
        <button
          onClick={save}
          disabled={saving}
          style={{ padding: '10px 28px', borderRadius: 9999, border: 'none', background: 'var(--primary)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </div>
  )
}
