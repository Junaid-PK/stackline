import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Code2,
  Download,
  FileText,
  GitBranch,
  Link,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  X,
  Zap,
} from 'lucide-react'
import './App.css'
import { emptyExperience, initialData, sampleData } from './sample'
import {
  analyzeResume,
  experienceDates,
  generateSummary,
  splitLines,
  splitSkills,
} from './resume'
import type { ResumeData, WorkExperience } from './types'

const roles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Full-Stack Engineer',
  'Mobile Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Data Engineer',
  'Machine Learning Engineer',
  'Security Engineer',
  'Staff Software Engineer',
  'Engineering Manager',
]

const steps = ['Target', 'Profile', 'Experience', 'Finalize']
const inputId = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
const downloadDocx = async (data: ResumeData) =>
  (await import('./exportResume')).downloadDocx(data)
const downloadPdf = async (data: ResumeData) =>
  (await import('./exportResume')).downloadPdf(data)

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  hint,
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  hint?: string
  required?: boolean
}) {
  const id = inputId(label)
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
      />
      {hint && <small>{hint}</small>}
    </div>
  )
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 5,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  rows?: number
}) {
  const id = inputId(label)
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
      {hint && <small>{hint}</small>}
    </div>
  )
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="landing">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Stackline home">
          <span className="brand-mark">
            <Code2 size={19} strokeWidth={2.4} />
          </span>
          <span>Stackline</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#method">Method</a>
          <a href="#standards">ATS standards</a>
          <button className="button button-small button-dark" onClick={onStart}>
            Build my resume
            <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              Built for software careers · 3–8+ years
            </div>
            <h1>
              Your experience,
              <br />
              <span>compiled for hiring.</span>
            </h1>
            <p className="hero-lede">
              Turn your software career into a focused, measurable resume that parses
              cleanly, matches the job, and reads like a senior engineer wrote it.
            </p>
            <div className="hero-actions">
              <button className="button button-primary button-large" onClick={onStart}>
                Start building
                <ArrowRight size={18} />
              </button>
              <button
                className="text-button"
                onClick={() => document.querySelector('#method')?.scrollIntoView()}
              >
                See how it works
                <ChevronDown size={16} />
              </button>
            </div>
            <div className="trust-row" aria-label="Product guarantees">
              <span><Check size={15} /> No sign-up</span>
              <span><Check size={15} /> Private in your browser</span>
              <span><Check size={15} /> PDF + DOCX</span>
            </div>
          </div>

          <div className="compiler-card" aria-label="ATS compile check example">
            <div className="compiler-topbar">
              <div>
                <span className="window-dot coral" />
                <span className="window-dot amber" />
                <span className="window-dot green" />
              </div>
              <span>resume.ats</span>
              <span className="compiler-status">
                <CheckCircle2 size={14} /> Ready
              </span>
            </div>
            <div className="compiler-body">
              <div className="compile-heading">
                <div>
                  <span>ATS READINESS</span>
                  <strong>Passed all checks</strong>
                </div>
                <div className="score-orbit">
                  <span>94</span>
                  <small>/ 100</small>
                </div>
              </div>
              <div className="compile-list">
                {[
                  ['parse.structure', 'Single-column text'],
                  ['match.keywords', '12 skills in context'],
                  ['prove.impact', '7 quantified results'],
                  ['export.format', 'Readable PDF + DOCX'],
                ].map(([key, label]) => (
                  <div className="compile-row" key={key}>
                    <CheckCircle2 size={17} />
                    <code>{key}</code>
                    <span>{label}</span>
                    <b>PASS</b>
                  </div>
                ))}
              </div>
              <div className="compile-footer">
                <Zap size={16} />
                <span>
                  <strong>Senior Backend Engineer</strong>
                  <small>matched to job description</small>
                </span>
                <span className="match-pill">86% match</span>
              </div>
            </div>
          </div>
        </section>

        <section className="principles-strip" id="standards">
          <p>Designed around guidance from ATS platforms and leading career centers</p>
          <div>
            <span>Single column</span>
            <span>Standard headings</span>
            <span>Reverse chronological</span>
            <span>Impact-first bullets</span>
          </div>
        </section>

        <section className="method-section" id="method">
          <div className="section-heading">
            <span>THE METHOD</span>
            <h2>Four passes. One resume that holds up.</h2>
            <p>Every choice is tuned for experienced software candidates—not generic job hunting.</p>
          </div>
          <div className="method-grid">
            {[
              { n: '01', icon: Target, title: 'Aim at the role', text: 'Choose your software specialty and paste the job description.' },
              { n: '02', icon: Code2, title: 'Show your stack', text: 'Add the technologies you have actually used in production.' },
              { n: '03', icon: Zap, title: 'Prove the impact', text: 'Turn responsibilities into action, technical method, and result.' },
              { n: '04', icon: ShieldCheck, title: 'Pass the parser', text: 'Fix readiness checks and export a text-based PDF or DOCX.' },
            ].map(({ n, icon: Icon, title, text }) => (
              <article className="method-card" key={n}>
                <div className="method-number">{n}</div>
                <span className="method-icon"><Icon size={21} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span className="eyebrow">NO ACCOUNT. NO PAYWALL.</span>
            <h2>Make your next application count.</h2>
          </div>
          <button className="button button-primary button-large" onClick={onStart}>
            Build my resume
            <ArrowRight size={18} />
          </button>
        </section>
      </main>
      <footer className="site-footer">
        <a className="brand" href="#top">
          <span className="brand-mark"><Code2 size={18} /></span>
          <span>Stackline</span>
        </a>
        <p>ATS-focused resumes for experienced software professionals.</p>
        <span>Built with evidence, not guesswork.</span>
      </footer>
    </div>
  )
}

function ResumePreview({ data }: { data: ResumeData }) {
  const experiences = data.experiences.filter((item) => item.company || item.title)
  return (
    <article className="resume-paper" aria-label="Resume preview">
      <header className="resume-header">
        <h1>{data.fullName || 'Your Name'}</h1>
        <p>
          {[data.email, data.phone, data.location, data.linkedin, data.github]
            .filter(Boolean)
            .join('  |  ') || 'email@example.com  |  +1 555 000 0000  |  City, State'}
        </p>
      </header>
      <section>
        <h2>Professional Summary</h2>
        <p className={!data.summary ? 'placeholder-text' : ''}>
          {data.summary || 'Your focused professional summary will appear here. Include your role, years of experience, specialty, and strongest evidence.'}
        </p>
      </section>
      <section>
        <h2>Technical Skills</h2>
        <p className={!data.skills ? 'placeholder-text' : ''}>
          {splitSkills(data.skills).join(', ') || 'Languages, frameworks, cloud platforms, databases, and engineering practices'}
        </p>
      </section>
      <section>
        <h2>Professional Experience</h2>
        {experiences.length ? experiences.map((item) => (
          <div className="resume-role" key={item.id}>
            <div className="resume-role-heading">
              <strong>{item.title || 'Job Title'} | {item.company || 'Company'}</strong>
              <span>{experienceDates(item)}</span>
            </div>
            <div className="resume-role-meta">{item.location}</div>
            <ul>
              {splitLines(item.achievements).map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </div>
        )) : <p className="placeholder-text">Your work experience and achievements will appear here.</p>}
      </section>
      {(data.education.school || data.education.degree) && (
        <section>
          <h2>Education</h2>
          <div className="resume-role-heading">
            <strong>{[data.education.degree, data.education.field].filter(Boolean).join(' in ')}</strong>
            <span>{data.education.graduationYear}</span>
          </div>
          <p>{data.education.school}</p>
        </section>
      )}
    </article>
  )
}

function ExperienceEditor({
  experience,
  index,
  update,
  remove,
  canRemove,
}: {
  experience: WorkExperience
  index: number
  update: (patch: Partial<WorkExperience>) => void
  remove: () => void
  canRemove: boolean
}) {
  const [open, setOpen] = useState(true)
  return (
    <article className="experience-editor">
      <button className="experience-editor-heading" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="experience-icon"><BriefcaseBusiness size={18} /></span>
        <span>
          <strong>{experience.title || `Experience ${index + 1}`}</strong>
          <small>{experience.company || 'Add company and role details'}</small>
        </span>
        <ChevronDown size={18} className={open ? 'rotate' : ''} />
      </button>
      {open && (
        <div className="experience-editor-body">
          <div className="field-grid two">
            <Field label={`Job title ${index + 1}`} value={experience.title} onChange={(title) => update({ title })} placeholder="Senior Software Engineer" required />
            <Field label={`Company ${index + 1}`} value={experience.company} onChange={(company) => update({ company })} placeholder="Acme, Inc." required />
          </div>
          <div className="field-grid three">
            <Field label={`Location ${index + 1}`} value={experience.location} onChange={(location) => update({ location })} placeholder="Austin, TX" />
            <Field label={`Start date ${index + 1}`} value={experience.startDate} onChange={(startDate) => update({ startDate })} type="month" required />
            <Field label={`End date ${index + 1}`} value={experience.endDate} onChange={(endDate) => update({ endDate })} type="month" />
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={experience.current}
              onChange={(event) => update({ current: event.target.checked, endDate: event.target.checked ? '' : experience.endDate })}
            />
            <span>This is my current role</span>
          </label>
          <TextAreaField
            label={`Achievement bullets ${index + 1}`}
            value={experience.achievements}
            onChange={(achievements) => update({ achievements })}
            rows={7}
            placeholder={'Led the migration of 14 services to Kubernetes, reducing infrastructure cost by 28%.\nBuilt a TypeScript API serving 4M requests per day with 99.99% availability.'}
            hint="One bullet per line. Start with an action, name the technology or method, then show the result."
          />
          {canRemove && <button className="danger-button" onClick={remove}><Trash2 size={15} />Remove this role</button>}
        </div>
      )}
    </article>
  )
}

function ScorePanel({ analysis, compact = false }: { analysis: ReturnType<typeof analyzeResume>; compact?: boolean }) {
  return (
    <div className={`score-panel ${compact ? 'compact' : ''}`}>
      <div className="score-panel-heading">
        <div className="score-ring" style={{ '--score': analysis.score } as React.CSSProperties}>
          <strong>{analysis.score}</strong><small>/100</small>
        </div>
        <div>
          <span>ATS READINESS</span>
          <h3>{analysis.score >= 85 ? 'Ready to ship' : analysis.score >= 60 ? 'Nearly there' : 'Keep building'}</h3>
        </div>
      </div>
      {!compact && (
        <div className="check-list">
          {analysis.checks.map((check) => (
            <div className={check.passed ? 'check-item passed' : 'check-item'} key={check.id}>
              {check.passed ? <CheckCircle2 size={17} /> : <Circle size={17} />}
              <span><strong>{check.label}</strong><small>{check.detail}</small></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Builder({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('stackline-resume')
    try { return saved ? JSON.parse(saved) as ResumeData : initialData } catch { return initialData }
  })
  const [step, setStep] = useState(0)
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const closePreviewRef = useRef<HTMLButtonElement>(null)
  const analysis = useMemo(() => analyzeResume(data), [data])

  useEffect(() => {
    localStorage.setItem('stackline-resume', JSON.stringify(data))
  }, [data])
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])
  useEffect(() => {
    if (showMobilePreview) closePreviewRef.current?.focus()
  }, [showMobilePreview])

  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) =>
    setData((current) => ({ ...current, [key]: value }))
  const updateExperience = (id: string, patch: Partial<WorkExperience>) =>
    update('experiences', data.experiences.map((item) => item.id === id ? { ...item, ...patch } : item))
  const loadSample = () => { setData(sampleData); setStep(3) }

  return (
    <div className="builder-shell">
      <header className="builder-header" inert={showMobilePreview ? true : undefined}>
        <button className="brand brand-button" onClick={onBack} aria-label="Back to Stackline home">
          <span className="brand-mark"><Code2 size={18} /></span><span>Stackline</span>
        </button>
        <div className="save-state"><CheckCircle2 size={15} />Saved in this browser</div>
        <div className="builder-header-actions">
          <button className="button button-quiet button-small" onClick={loadSample}><Sparkles size={15} /> Load example</button>
          <button className="menu-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Open menu">{mobileNav ? <X /> : <Menu />}</button>
        </div>
      </header>

      <div className="builder-layout">
        <aside className={`builder-sidebar ${mobileNav ? 'mobile-open' : ''}`} inert={showMobilePreview ? true : undefined}>
          <div className="sidebar-intro"><span>BUILD PROGRESS</span><strong>Resume workspace</strong></div>
          <nav aria-label="Resume builder steps">
            {steps.map((label, id) => (
              <button
                key={label}
                className={`${step === id ? 'active' : ''} ${step > id ? 'complete' : ''}`}
                onClick={() => { setStep(id); setMobileNav(false) }}
              >
                <span>{step > id ? <Check size={14} /> : id + 1}</span>{label}
              </button>
            ))}
          </nav>
          <ScorePanel analysis={analysis} compact />
          <div className="privacy-note"><ShieldCheck size={18} /><span><strong>Your data stays private</strong><small>Everything runs in your browser.</small></span></div>
        </aside>

        <main className="builder-main" ref={mainRef} inert={showMobilePreview ? true : undefined}>
          <div className="mobile-stepbar"><span>Step {step + 1} of {steps.length}</span><strong>{steps[step]}</strong><button onClick={() => setShowMobilePreview(true)}>Preview</button></div>
          <div className="form-container">
            {step === 0 && (
              <section className="form-step">
                <div className="form-heading"><span>01 · TARGET</span><h1>What are you applying for?</h1><p>Stackline is calibrated for software professionals with at least three years of experience.</p></div>
                <div className="notice-card"><Target size={20} /><span><strong>Tailoring is the highest-leverage step.</strong><small>Use the real job title and paste the posting. We only surface terms already supported by your experience.</small></span></div>
                <div className="field">
                  <label htmlFor="target-role">Target software role</label>
                  <div className="select-wrap">
                    <select id="target-role" value={data.targetRole} onChange={(event) => update('targetRole', event.target.value)}>
                      {roles.map((role) => <option key={role}>{role}</option>)}
                    </select><ChevronDown size={17} />
                  </div>
                </div>
                <div className="field">
                  <label id="experience-level-label">Years of software experience</label>
                  <div className="experience-levels" role="group" aria-labelledby="experience-level-label">
                    {(['3', '4', '5', '6', '7', '8+'] as const).map((years) => (
                      <button key={years} className={data.experienceLevel === years ? 'selected' : ''} onClick={() => update('experienceLevel', years)} aria-pressed={data.experienceLevel === years}>
                        <strong>{years}</strong><small>years</small>
                      </button>
                    ))}
                  </div>
                </div>
                <TextAreaField label="Job description" value={data.jobDescription} onChange={(value) => update('jobDescription', value)} rows={11} placeholder="Paste the full job description here…" hint="We extract recognizable software skills locally. Nothing is uploaded." />
                {data.jobDescription && (
                  <div className="keyword-box">
                    <div><span>KEYWORD SIGNAL</span><strong>{analysis.matchedKeywords.length} matched · {analysis.missingKeywords.length} to review</strong></div>
                    <div className="keyword-list">{analysis.missingKeywords.slice(0, 8).map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                    <small>Only add a missing term if it truthfully reflects your experience.</small>
                  </div>
                )}
              </section>
            )}

            {step === 1 && (
              <section className="form-step">
                <div className="form-heading"><span>02 · PROFILE</span><h1>Set the technical headline.</h1><p>Give recruiters the essentials in seconds, then support them with a focused summary and stack.</p></div>
                <div className="field-grid two">
                  <Field label="Full name" value={data.fullName} onChange={(value) => update('fullName', value)} placeholder="Jordan Lee" required />
                  <Field label="Email" value={data.email} onChange={(value) => update('email', value)} placeholder="jordan@example.com" type="email" required />
                  <Field label="Phone" value={data.phone} onChange={(value) => update('phone', value)} placeholder="+1 555 000 0000" required />
                  <Field label="Location" value={data.location} onChange={(value) => update('location', value)} placeholder="Seattle, WA" required />
                  <Field label="LinkedIn" value={data.linkedin} onChange={(value) => update('linkedin', value)} placeholder="linkedin.com/in/jordanlee" />
                  <Field label="GitHub or portfolio" value={data.github} onChange={(value) => update('github', value)} placeholder="github.com/jordanlee" />
                </div>
                <div className="field with-action">
                  <TextAreaField label="Professional summary" value={data.summary} onChange={(value) => update('summary', value)} rows={5} placeholder="Senior Software Engineer with 6 years of experience…" hint={`${data.summary.trim() ? data.summary.trim().split(/\s+/).length : 0} words · Aim for 35–75.`} />
                  <button className="inline-action" onClick={() => update('summary', generateSummary(data))}><Sparkles size={15} />Draft from my details</button>
                </div>
                <TextAreaField label="Technical skills" value={data.skills} onChange={(value) => update('skills', value)} rows={5} placeholder="TypeScript, React, Node.js, PostgreSQL, AWS, Docker, Kubernetes, CI/CD" hint="Separate skills with commas. Prefer recognizable names over rating bars or vague categories." />
              </section>
            )}

            {step === 2 && (
              <section className="form-step">
                <div className="form-heading"><span>03 · EXPERIENCE</span><h1>Turn work into evidence.</h1><p>Lead with recent experience. Each bullet should make ownership, technical depth, and impact obvious.</p></div>
                <div className="bullet-formula"><span>THE BULLET FORMULA</span><div><strong>Action</strong><ArrowRight size={16} /><strong>technical method</strong><ArrowRight size={16} /><strong>measurable result</strong></div><p>“Optimized PostgreSQL queries and caching, reducing p95 API latency by 42%.”</p></div>
                <div className="experience-list">
                  {data.experiences.map((experience, index) => (
                    <ExperienceEditor
                      key={experience.id}
                      experience={experience}
                      index={index}
                      update={(patch) => updateExperience(experience.id, patch)}
                      remove={() => update('experiences', data.experiences.filter((item) => item.id !== experience.id))}
                      canRemove={data.experiences.length > 1}
                    />
                  ))}
                </div>
                <button className="add-button" onClick={() => update('experiences', [...data.experiences, emptyExperience()])}><Plus size={17} />Add another role</button>
                <div className="subsection-heading"><span>EDUCATION</span><p>Spell out the degree so ATS filters can recognize it.</p></div>
                <div className="field-grid two">
                  <Field label="School" value={data.education.school} onChange={(school) => update('education', { ...data.education, school })} placeholder="University of Washington" />
                  <Field label="Degree" value={data.education.degree} onChange={(degree) => update('education', { ...data.education, degree })} placeholder="Bachelor of Science" />
                  <Field label="Field of study" value={data.education.field} onChange={(field) => update('education', { ...data.education, field })} placeholder="Computer Science" />
                  <Field label="Graduation year" value={data.education.graduationYear} onChange={(graduationYear) => update('education', { ...data.education, graduationYear })} placeholder="2018" />
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="form-step finalize-step">
                <div className="form-heading"><span>04 · FINALIZE</span><h1>Run the final checks.</h1><p>Fix the highest-value gaps, then download the format requested in the job posting.</p></div>
                <ScorePanel analysis={analysis} />
                {analysis.missingKeywords.length > 0 && (
                  <div className="review-card">
                    <div className="review-card-heading"><Target size={19} /><span><strong>Job terms to review</strong><small>Use only the terms you can defend in an interview.</small></span></div>
                    <div className="keyword-list">{analysis.missingKeywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
                  </div>
                )}
                <div className="download-card">
                  <div><span>EXPORT</span><h2>Your ATS-safe resume</h2><p>Both files use real selectable text, one column, standard headings, and no parser-hostile graphics.</p></div>
                  <div className="download-actions">
                    <button className="download-option primary" onClick={() => downloadDocx(data)}><span className="file-icon"><FileText size={22} /></span><span><strong>Download DOCX</strong><small>Safest default for most ATS portals</small></span><Download size={18} /></button>
                    <button className="download-option" onClick={() => downloadPdf(data)}><span className="file-icon"><FileText size={22} /></span><span><strong>Download text PDF</strong><small>Use when the posting accepts PDF</small></span><Download size={18} /></button>
                  </div>
                </div>
                <div className="final-note"><ShieldCheck size={18} /><p><strong>One last human check:</strong> open the downloaded file, copy all text, and paste it into a plain-text editor. If the order is correct, the parser should see it correctly too.</p></div>
              </section>
            )}
          </div>

          <div className="builder-nav">
            <button className="button button-quiet" onClick={() => step > 0 ? setStep(step - 1) : onBack()}><ArrowLeft size={17} />{step > 0 ? 'Back' : 'Home'}</button>
            {step < steps.length - 1
              ? <button className="button button-primary" onClick={() => setStep(step + 1)}>Continue<ArrowRight size={17} /></button>
              : <button className="button button-primary" onClick={() => downloadDocx(data)}><Download size={17} />Download DOCX</button>}
          </div>
        </main>

        <aside
          className={`preview-pane ${showMobilePreview ? 'mobile-preview-open' : ''}`}
          role={showMobilePreview ? 'dialog' : undefined}
          aria-modal={showMobilePreview ? 'true' : undefined}
          aria-label={showMobilePreview ? 'Resume preview' : undefined}
        >
          <div className="preview-toolbar">
            <div><span>LIVE PREVIEW</span><small>A4 · ATS-safe</small></div>
            <button ref={closePreviewRef} className="close-preview" onClick={() => setShowMobilePreview(false)} aria-label="Close preview"><X size={20} /></button>
            <div className="preview-icons" aria-label="Contact fields included">
              {data.email && <Mail size={14} />}{data.phone && <Phone size={14} />}{data.location && <MapPin size={14} />}{data.linkedin && <Link size={14} />}{data.github && <GitBranch size={14} />}
            </div>
          </div>
          <div className="preview-scroll"><ResumePreview data={data} /></div>
        </aside>
      </div>
    </div>
  )
}

function App() {
  const [building, setBuilding] = useState(window.location.hash === '#build')
  const openBuilder = () => { window.location.hash = 'build'; setBuilding(true) }
  const closeBuilder = () => { history.pushState('', document.title, window.location.pathname); setBuilding(false) }
  return building ? <Builder onBack={closeBuilder} /> : <Landing onStart={openBuilder} />
}

export default App
