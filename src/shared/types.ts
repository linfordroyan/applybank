export type PackId = 'india' | 'global' | 'custom'

export type SnippetCategory =
  | 'basics'
  | 'compensation'
  | 'work-auth'
  | 'experience'
  | 'narrative'
  | 'global'

export interface Snippet {
  id: string
  title: string
  body: string
  category: SnippetCategory
  pack: PackId
  createdAt: number
  updatedAt: number
}

export interface AppSettings {
  freeLimit: number
  isPro: boolean
  seeded: boolean
}

export interface AppState {
  snippets: Snippet[]
  settings: AppSettings
}

export type InsertMessage = {
  type: 'APPLYBANK_INSERT'
  body: string
}

export type InsertResultMessage = {
  type: 'APPLYBANK_INSERT_RESULT'
  ok: boolean
  error?: string
}

export const CATEGORY_LABELS: Record<SnippetCategory, string> = {
  basics: 'Basics',
  compensation: 'Compensation',
  'work-auth': 'Work auth',
  experience: 'Experience',
  narrative: 'Narrative',
  global: 'Global',
}

export const DEFAULT_SETTINGS: AppSettings = {
  freeLimit: 15,
  isPro: false,
  seeded: false,
}
