import type { PackId, SnippetCategory } from './types'

export interface SeedSnippet {
  title: string
  body: string
  category: SnippetCategory
  pack: PackId
}

/** India-first defaults — edit these to your real answers */
export const INDIA_SEED: SeedSnippet[] = [
  {
    title: 'Current location',
    body: 'Bengaluru, Karnataka, India',
    category: 'basics',
    pack: 'india',
  },
  {
    title: 'Phone',
    body: '+91 XXXXXXXXXX',
    category: 'basics',
    pack: 'india',
  },
  {
    title: 'Notice period',
    body: '30 days (negotiable for the right role)',
    category: 'basics',
    pack: 'india',
  },
  {
    title: 'Current CTC',
    body: '₹XX LPA (fixed) + benefits',
    category: 'compensation',
    pack: 'india',
  },
  {
    title: 'Expected CTC',
    body:
      'Looking for ₹XX–XX LPA depending on role scope, team, and total compensation. Open to discussion.',
    category: 'compensation',
    pack: 'india',
  },
  {
    title: 'Work authorization (India)',
    body: 'Indian citizen. Fully authorized to work in India. No sponsorship required.',
    category: 'work-auth',
    pack: 'india',
  },
  {
    title: 'Relocation (India)',
    body:
      'Open to relocate to Bengaluru / Hyderabad / Pune for the right opportunity. Comfortable with hybrid or office-first.',
    category: 'work-auth',
    pack: 'india',
  },
  {
    title: 'Immediate joiner?',
    body: 'Currently serving notice / can join after notice period completion. Early release possible with discussion.',
    category: 'experience',
    pack: 'india',
  },
  {
    title: 'Primary stack',
    body:
      'Senior frontend engineer — deep Angular, strong React & Vue, TypeScript, Node.js. Comfortable owning UI architecture end-to-end.',
    category: 'experience',
    pack: 'india',
  },
  {
    title: 'Years of experience',
    body: '7+ years building production web applications',
    category: 'experience',
    pack: 'india',
  },
  {
    title: 'Why leaving',
    body:
      'Looking for a product-engineering role with stronger ownership, clearer customer impact, and room to mentor while still shipping.',
    category: 'narrative',
    pack: 'india',
  },
  {
    title: 'Why this company (template)',
    body:
      'I am excited about [Company] because [product/problem]. My experience with [stack/domain] maps well to how you build, and I want to help ship customer outcomes—not just UI tickets.',
    category: 'narrative',
    pack: 'india',
  },
]

/** Global / relocation secondary pack */
export const GLOBAL_SEED: SeedSnippet[] = [
  {
    title: 'Visa / sponsorship',
    body:
      'Based in India. Open to relocation. Will need visa sponsorship / work authorization support for [country]. Happy to discuss timeline.',
    category: 'global',
    pack: 'global',
  },
  {
    title: 'Timezone overlap',
    body:
      'Based in IST (UTC+5:30). Comfortable overlapping with APAC / early EU / late US hours for collaboration.',
    category: 'global',
    pack: 'global',
  },
  {
    title: 'Relocation timeline',
    body:
      'Can start remote immediately after offer formalities. Open to relocate within 2–3 months depending on visa processing.',
    category: 'global',
    pack: 'global',
  },
  {
    title: 'Salary expectation (global)',
    body:
      'Open to discuss total package for [location]. Benchmarking against local senior/lead frontend bands; flexible on base vs equity mix.',
    category: 'global',
    pack: 'global',
  },
]
