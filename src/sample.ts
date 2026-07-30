import type { ResumeData } from './types'

export const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `stackline-${Date.now()}-${Math.random().toString(36).slice(2)}`

export const emptyExperience = (): ResumeData['experiences'][number] => ({
  id: createId(),
  company: '',
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  achievements: '',
})

export const initialData: ResumeData = {
  targetRole: 'Senior Software Engineer',
  experienceLevel: '5',
  jobDescription: '',
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  summary: '',
  skills: '',
  experiences: [emptyExperience()],
  education: {
    school: '',
    degree: '',
    field: '',
    graduationYear: '',
  },
}

export const sampleData: ResumeData = {
  targetRole: 'Senior Backend Engineer',
  experienceLevel: '6',
  jobDescription:
    'We are hiring a Senior Backend Engineer with experience in TypeScript, Node.js, PostgreSQL, AWS, Kubernetes, REST APIs, distributed systems, observability, CI/CD, mentoring, and system design.',
  fullName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 415 555 0142',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexmorgan',
  github: 'github.com/alexmorgan',
  summary:
    'Senior Backend Engineer with 6 years of experience building reliable distributed systems and high-volume APIs. Deep expertise in TypeScript, Node.js, PostgreSQL, AWS, and Kubernetes, with a record of improving platform performance and mentoring engineers.',
  skills:
    'TypeScript, Node.js, PostgreSQL, AWS, Kubernetes, REST APIs, Distributed Systems, System Design, Docker, Redis, Kafka, CI/CD, Observability, Terraform',
  experiences: [
    {
      id: createId(),
      company: 'Northstar Labs, Inc.',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2023-03',
      endDate: '',
      current: true,
      achievements:
        'Led the redesign of a TypeScript and Node.js payments API, reducing p95 latency by 42% across 18 million monthly requests.\nBuilt event-driven services with Kafka, PostgreSQL, and Redis, improving payment reconciliation accuracy from 97.8% to 99.95%.\nDeployed services on AWS and Kubernetes with Terraform and CI/CD, cutting release lead time from two days to 35 minutes.\nMentored four engineers and introduced design reviews that reduced production incidents by 31%.',
    },
    {
      id: createId(),
      company: 'Atlas Commerce Co.',
      title: 'Software Engineer',
      location: 'Oakland, CA',
      startDate: '2020-01',
      endDate: '2023-02',
      current: false,
      achievements:
        'Developed 12 REST APIs for checkout and order management using Node.js and PostgreSQL, supporting 3x traffic growth.\nImplemented OpenTelemetry dashboards and alerting, reducing mean time to recovery by 38%.\nAutomated integration tests and deployment checks, increasing release frequency from weekly to daily.',
    },
  ],
  education: {
    school: 'University of California, Davis',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    graduationYear: '2019',
  },
}
