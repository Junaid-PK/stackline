import { afterEach, describe, expect, it, vi } from 'vitest'
import { createId, sampleData } from './sample'
import {
  analyzeResume,
  extractKeywords,
  generateSummary,
  getPlainTextResume,
  splitLines,
} from './resume'

describe('resume rules', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('creates unique IDs without assuming a secure browser context', () => {
    vi.stubGlobal('crypto', {})
    const first = createId()
    const second = createId()
    expect(first).toBeTruthy()
    expect(second).not.toBe(first)
  })

  it('extracts recognizable software keywords from a job description', () => {
    expect(
      extractKeywords('Build REST APIs with TypeScript, Node.js, PostgreSQL, and AWS.'),
    ).toEqual(['aws', 'node.js', 'postgresql', 'rest api', 'typescript'])
  })

  it('normalizes achievement bullets from pasted lists', () => {
    expect(splitLines('• Built an API\n- Reduced latency 40%\n\n* Led migration')).toEqual([
      'Built an API',
      'Reduced latency 40%',
      'Led migration',
    ])
  })

  it('gives the complete software resume example a full readiness score', () => {
    const analysis = analyzeResume(sampleData)
    expect(analysis.score).toBe(100)
    expect(analysis.missingKeywords).toEqual([])
  })

  it('creates a summary that reflects role and experience level', () => {
    const summary = generateSummary(sampleData)
    expect(summary).toContain('Senior Backend Engineer')
    expect(summary).toContain('6 years')
    expect(summary).toContain('TypeScript')
  })

  it('keeps resume sections in ATS-readable order', () => {
    const text = getPlainTextResume(sampleData)
    expect(text.indexOf('PROFESSIONAL SUMMARY')).toBeLessThan(
      text.indexOf('TECHNICAL SKILLS'),
    )
    expect(text.indexOf('TECHNICAL SKILLS')).toBeLessThan(
      text.indexOf('PROFESSIONAL EXPERIENCE'),
    )
    expect(text).toContain('Northstar Labs, Inc.')
    expect(text).toContain('42%')
  })
})
