export type ExperienceLevel = '3' | '4' | '5' | '6' | '7' | '8+'

export interface WorkExperience {
  id: string
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  achievements: string
}

export interface Education {
  school: string
  degree: string
  field: string
  graduationYear: string
}

export interface ResumeData {
  targetRole: string
  experienceLevel: ExperienceLevel
  jobDescription: string
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  summary: string
  skills: string
  experiences: WorkExperience[]
  education: Education
}

export interface AtsCheck {
  id: string
  label: string
  detail: string
  passed: boolean
  weight: number
}

export interface AtsAnalysis {
  score: number
  checks: AtsCheck[]
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
}
