import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type AppState,
  type Snippet,
} from './types'
import { GLOBAL_SEED, INDIA_SEED } from './seed-packs'

const SNIPPETS_KEY = 'snippets'
const SETTINGS_KEY = 'settings'

function createId(): string {
  return crypto.randomUUID()
}

export function buildSeedSnippets(now = Date.now()): Snippet[] {
  return [...INDIA_SEED, ...GLOBAL_SEED].map((seed) => ({
    id: createId(),
    title: seed.title,
    body: seed.body,
    category: seed.category,
    pack: seed.pack,
    createdAt: now,
    updatedAt: now,
  }))
}

export async function loadState(): Promise<AppState> {
  const result = await chrome.storage.local.get([SNIPPETS_KEY, SETTINGS_KEY])
  const settings: AppSettings = {
    ...DEFAULT_SETTINGS,
    ...(result[SETTINGS_KEY] as AppSettings | undefined),
  }

  let snippets = (result[SNIPPETS_KEY] as Snippet[] | undefined) ?? []

  if (!settings.seeded) {
    snippets = buildSeedSnippets()
    settings.seeded = true
    await chrome.storage.local.set({
      [SNIPPETS_KEY]: snippets,
      [SETTINGS_KEY]: settings,
    })
  }

  return { snippets, settings }
}

export async function saveSnippets(snippets: Snippet[]): Promise<void> {
  await chrome.storage.local.set({ [SNIPPETS_KEY]: snippets })
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await chrome.storage.local.set({ [SETTINGS_KEY]: settings })
}

export function canAddSnippet(
  snippets: Snippet[],
  settings: AppSettings,
): boolean {
  if (settings.isPro) return true
  const customCount = snippets.filter((s) => s.pack === 'custom').length
  return customCount < settings.freeLimit
}

export function createSnippet(
  input: Pick<Snippet, 'title' | 'body' | 'category' | 'pack'>,
): Snippet {
  const now = Date.now()
  return {
    id: createId(),
    title: input.title.trim(),
    body: input.body.trim(),
    category: input.category,
    pack: input.pack,
    createdAt: now,
    updatedAt: now,
  }
}

export function exportSnippetsJson(snippets: Snippet[]): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      snippets: snippets.map(({ title, body, category, pack }) => ({
        title,
        body,
        category,
        pack,
      })),
    },
    null,
    2,
  )
}

export interface ImportPayload {
  snippets?: Array<{
    title?: string
    body?: string
    category?: Snippet['category']
    pack?: Snippet['pack']
  }>
}

export function parseImportJson(raw: string): Snippet[] {
  const parsed = JSON.parse(raw) as ImportPayload
  if (!parsed.snippets || !Array.isArray(parsed.snippets)) {
    throw new Error('Invalid file: missing snippets array')
  }

  const now = Date.now()
  return parsed.snippets
    .filter((s) => s.title?.trim() && s.body?.trim())
    .map((s) => ({
      id: createId(),
      title: s.title!.trim(),
      body: s.body!.trim(),
      category: s.category ?? 'basics',
      pack: s.pack ?? 'custom',
      createdAt: now,
      updatedAt: now,
    }))
}
