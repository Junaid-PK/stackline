import type { AtsAnalysis, ResumeData, WorkExperience } from './types'

const softwareKeywords = [
  'agile',
  'android',
  'angular',
  'api',
  'architecture',
  'aws',
  'azure',
  'c#',
  'c++',
  'ci/cd',
  'cloud',
  'css',
  'data pipelines',
  'distributed systems',
  'django',
  'docker',
  'dotnet',
  'elasticsearch',
  'express',
  'fastapi',
  'flask',
  'flutter',
  'gcp',
  'git',
  'golang',
  'graphql',
  'html',
  'ios',
  'java',
  'javascript',
  'jenkins',
  'kafka',
  'kotlin',
  'kubernetes',
  'machine learning',
  'mentoring',
  'microservices',
  'mongodb',
  'mysql',
  'next.js',
  'node.js',
  'observability',
  'openapi',
  'performance',
  'postgresql',
  'python',
  'react',
  'redis',
  'rest api',
  'ruby',
  'rust',
  'scala',
  'security',
  'spring',
  'sql',
  'system design',
  'terraform',
  'testing',
  'typescript',
  'vue',
]

const actionVerbs = [
  'architected',
  'automated',
  'built',
  'created',
  'cut',
  'delivered',
  'deployed',
  'designed',
  'developed',
  'drove',
  'eliminated',
  'implemented',
  'improved',
  'increased',
  'launched',
  'led',
  'mentored',
  'migrated',
  'modernized',
  'optimized',
  'reduced',
  'scaled',
  'shipped',
  'spearheaded',
  'streamlined',
]

export const splitLines = (value: string) =>
  value
    .split('\n')
    .map((line) => line.replace(/^[•*-]\s*/, '').trim())
    .filter(Boolean)

export const splitSkills = (value: string) =>
  value
    .split(/,|\n/)
    .map((skill) => skill.trim())
    .filter(Boolean)

export const formatDate = (value: string) => {
  if (!value) return ''
  const [year, month] = value.split('-')
  if (!month) return year
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)))
}

export const experienceDates = (experience: WorkExperience) => {
  const start = formatDate(experience.startDate)
  const end = experience.current ? 'Present' : formatDate(experience.endDate)
  return [start, end].filter(Boolean).join(' – ')
}

export const generateSummary = (data: ResumeData) => {
  const skills = splitSkills(data.skills).slice(0, 5)
  const years = data.experienceLevel === '8+' ? '8+ years' : `${data.experienceLevel} years`
  const recent = data.experiences.find((item) => item.title || item.company)
  const focus = skills.length
    ? `Expertise in ${skills.slice(0, -1).join(', ')}${skills.length > 1 ? `, and ${skills.at(-1)}` : skills[0]}`
    : 'A record of building reliable, maintainable software'
  const context = recent?.company ? `, most recently at ${recent.company}` : ''

  return `${data.targetRole || 'Software Engineer'} with ${years} of experience delivering production software${context}. ${focus}, with measurable impact across performance, reliability, and team execution.`
}

const normalized = (value: string) => value.toLowerCase().replace(/\s+/g, ' ')

export const extractKeywords = (jobDescription: string) => {
  const text = normalized(jobDescription)
  const includesKeyword = (keyword: string) => {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const plural = keyword === 'api' || keyword.endsWith(' api') ? 's?' : ''
    return new RegExp(`(^|[^a-z0-9])${escaped}${plural}($|[^a-z0-9])`, 'i').test(text)
  }
  return softwareKeywords
    .filter(includesKeyword)
    .filter((keyword, index, list) => {
      if (keyword === 'api' && list.includes('rest api')) return false
      return list.indexOf(keyword) === index
    })
}

export const analyzeResume = (data: ResumeData): AtsAnalysis => {
  const bullets = data.experiences.flatMap((item) => splitLines(item.achievements))
  const skills = splitSkills(data.skills)
  const resumeText = normalized(
    [
      data.targetRole,
      data.summary,
      data.skills,
      ...data.experiences.flatMap((item) => [
        item.title,
        item.company,
        item.achievements,
      ]),
      data.education.degree,
      data.education.field,
    ].join(' '),
  )
  const jdKeywords = extractKeywords(data.jobDescription)
  const matchedKeywords = jdKeywords.filter((keyword) => resumeText.includes(keyword))
  const missingKeywords = jdKeywords.filter((keyword) => !resumeText.includes(keyword))
  const quantifiedBullets = bullets.filter((bullet) =>
    /(?:\d|%|\$|million|thousand|x\b|hours?|days?|weeks?)/i.test(bullet),
  )
  const strongBullets = bullets.filter((bullet) =>
    actionVerbs.some((verb) => normalized(bullet).startsWith(verb)),
  )
  const hasCompleteExperience = data.experiences.some(
    (item) => item.company && item.title && item.startDate && (item.current || item.endDate),
  )
  const keywordCoverage = jdKeywords.length
    ? matchedKeywords.length / jdKeywords.length
    : 0

  const checks = [
    {
      id: 'contact',
      label: 'Contact details',
      detail: 'Name, email, phone, and location are in the document body.',
      passed: Boolean(data.fullName && data.email && data.phone && data.location),
      weight: 15,
    },
    {
      id: 'target',
      label: 'Target role',
      detail: 'A full software job title makes the target explicit.',
      passed: data.targetRole.trim().split(/\s+/).length >= 2,
      weight: 10,
    },
    {
      id: 'summary',
      label: 'Focused summary',
      detail: 'Use 35–75 words covering level, specialty, and evidence.',
      passed: data.summary.trim().split(/\s+/).length >= 25,
      weight: 10,
    },
    {
      id: 'skills',
      label: 'Technical skills',
      detail: 'Eight or more relevant, recognizable skills are listed.',
      passed: skills.length >= 8,
      weight: 10,
    },
    {
      id: 'experience',
      label: 'Complete experience',
      detail: 'Roles include company, full title, dates, and achievements.',
      passed: hasCompleteExperience && bullets.length >= 4,
      weight: 15,
    },
    {
      id: 'impact',
      label: 'Measurable impact',
      detail: 'At least half of achievement bullets show scale or results.',
      passed: bullets.length >= 4 && quantifiedBullets.length / bullets.length >= 0.5,
      weight: 15,
    },
    {
      id: 'verbs',
      label: 'Strong action verbs',
      detail: 'Most bullets begin with a direct, specific action.',
      passed: bullets.length >= 4 && strongBullets.length / bullets.length >= 0.6,
      weight: 10,
    },
    {
      id: 'keywords',
      label: 'Job keyword match',
      detail: data.jobDescription
        ? 'Relevant job-posting terms appear naturally in context.'
        : 'Paste a job description to check keyword alignment.',
      passed: jdKeywords.length > 0 && keywordCoverage >= 0.65,
      weight: 15,
    },
  ]

  const score = checks.reduce((total, check) => total + (check.passed ? check.weight : 0), 0)
  const suggestions = checks.filter((check) => !check.passed).map((check) => check.detail)

  return { score, checks, matchedKeywords, missingKeywords, suggestions }
}

export const getPlainTextResume = (data: ResumeData) => {
  const lines = [
    data.fullName,
    [data.email, data.phone, data.location, data.linkedin, data.github]
      .filter(Boolean)
      .join(' | '),
    '',
    'PROFESSIONAL SUMMARY',
    data.summary,
    '',
    'TECHNICAL SKILLS',
    splitSkills(data.skills).join(', '),
    '',
    'PROFESSIONAL EXPERIENCE',
  ]

  data.experiences
    .filter((item) => item.company || item.title)
    .forEach((item) => {
      lines.push(
        '',
        `${item.title} | ${item.company}`,
        [item.location, experienceDates(item)].filter(Boolean).join(' | '),
        ...splitLines(item.achievements).map((bullet) => `• ${bullet}`),
      )
    })

  if (data.education.school || data.education.degree) {
    lines.push(
      '',
      'EDUCATION',
      [data.education.degree, data.education.field].filter(Boolean).join(' in '),
      [data.education.school, data.education.graduationYear].filter(Boolean).join(' | '),
    )
  }

  return lines.filter((line, index) => !(line === '' && lines[index - 1] === '')).join('\n')
}
