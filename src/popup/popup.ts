import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import '@fontsource/source-serif-4/600.css'
import '@fontsource/source-serif-4/700.css'
import './popup.css'

import {
  canAddSnippet,
  createSnippet,
  exportSnippetsJson,
  loadState,
  parseImportJson,
  saveSettings,
  saveSnippets,
} from '../shared/storage'
import {
  CATEGORY_LABELS,
  type Snippet,
  type SnippetCategory,
} from '../shared/types'

const searchInput = document.querySelector<HTMLInputElement>('#search')!
const categoryFilter = document.querySelector<HTMLSelectElement>('#category-filter')!
const categorySelect = document.querySelector<HTMLSelectElement>('#category')!
const snippetList = document.querySelector<HTMLUListElement>('#snippet-list')!
const form = document.querySelector<HTMLFormElement>('#snippet-form')!
const formTitle = document.querySelector<HTMLHeadingElement>('#form-title')!
const editIdInput = document.querySelector<HTMLInputElement>('#edit-id')!
const titleInput = document.querySelector<HTMLInputElement>('#title')!
const bodyInput = document.querySelector<HTMLTextAreaElement>('#body')!
const saveBtn = document.querySelector<HTMLButtonElement>('#save-btn')!
const cancelEditBtn = document.querySelector<HTMLButtonElement>('#cancel-edit')!
const limitNote = document.querySelector<HTMLParagraphElement>('#limit-note')!
const toast = document.querySelector<HTMLParagraphElement>('#toast')!
const exportBtn = document.querySelector<HTMLButtonElement>('#export-btn')!
const importInput = document.querySelector<HTMLInputElement>('#import-input')!

let snippets: Snippet[] = []
let settings = {
  freeLimit: 15,
  isPro: false,
  seeded: false,
}
let toastTimer = 0

function showToast(message: string): void {
  toast.hidden = false
  toast.textContent = message
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => {
    toast.hidden = true
  }, 2200)
}

function fillCategoryOptions(): void {
  const categories = Object.entries(CATEGORY_LABELS) as Array<
    [SnippetCategory, string]
  >

  categorySelect.innerHTML = categories
    .map(([value, label]) => `<option value="${value}">${label}</option>`)
    .join('')

  categoryFilter.innerHTML =
    `<option value="all">All categories</option>` +
    categories
      .map(([value, label]) => `<option value="${value}">${label}</option>`)
      .join('')
}

function filteredSnippets(): Snippet[] {
  const query = searchInput.value.trim().toLowerCase()
  const category = categoryFilter.value

  return snippets
    .filter((s) => (category === 'all' ? true : s.category === category))
    .filter((s) => {
      if (!query) return true
      return (
        s.title.toLowerCase().includes(query) ||
        s.body.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

function updateLimitNote(): void {
  if (settings.isPro) {
    limitNote.hidden = true
    saveBtn.disabled = false
    return
  }

  const customCount = snippets.filter((s) => s.pack === 'custom').length
  const remaining = Math.max(settings.freeLimit - customCount, 0)
  limitNote.hidden = false
  limitNote.textContent = `Free plan: ${customCount}/${settings.freeLimit} custom snippets (${remaining} left). India + Global starters are free.`
  saveBtn.disabled = !editIdInput.value && !canAddSnippet(snippets, settings)
}

function resetForm(): void {
  editIdInput.value = ''
  titleInput.value = ''
  bodyInput.value = ''
  categorySelect.value = 'compensation'
  formTitle.textContent = 'Add snippet'
  cancelEditBtn.hidden = true
  updateLimitNote()
}

function startEdit(snippet: Snippet): void {
  editIdInput.value = snippet.id
  titleInput.value = snippet.title
  bodyInput.value = snippet.body
  categorySelect.value = snippet.category
  formTitle.textContent = 'Edit snippet'
  cancelEditBtn.hidden = false
  titleInput.focus()
  updateLimitNote()
}

function renderList(): void {
  const items = filteredSnippets()
  snippetList.innerHTML = items
    .map((snippet) => {
      const packClass =
        snippet.pack === 'india'
          ? ''
          : snippet.pack === 'global'
            ? 'global'
            : 'custom'
      const packLabel =
        snippet.pack === 'india'
          ? 'India'
          : snippet.pack === 'global'
            ? 'Global'
            : 'Custom'

      return `
        <li class="snippet" data-id="${snippet.id}">
          <div class="snippet-top">
            <h3>
              ${escapeHtml(snippet.title)}
              <span class="pack-pill ${packClass}">${packLabel}</span>
            </h3>
          </div>
          <div class="meta">${CATEGORY_LABELS[snippet.category]}</div>
          <p>${escapeHtml(snippet.body)}</p>
          <div class="row-actions">
            <button type="button" class="insert-btn" data-action="insert">Insert</button>
            <button type="button" class="edit-btn" data-action="edit">Edit</button>
            <button type="button" class="delete-btn" data-action="delete">Delete</button>
          </div>
        </li>
      `
    })
    .join('')
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function insertSnippet(body: string): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id) {
    showToast('No active tab found')
    return
  }

  try {
    const response = (await chrome.tabs.sendMessage(tab.id, {
      type: 'APPLYBANK_INSERT',
      body,
    })) as { ok?: boolean; error?: string } | undefined

    if (response?.ok) {
      showToast('Inserted into the focused field')
    } else {
      showToast(response?.error ?? 'Click a form field, then Insert')
    }
  } catch {
    showToast('Open a https job form, focus a field, then Insert')
  }
}

async function persist(): Promise<void> {
  await saveSnippets(snippets)
  updateLimitNote()
  renderList()
}

snippetList.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement
  const button = target.closest('button[data-action]') as HTMLButtonElement | null
  const row = target.closest<HTMLElement>('.snippet')
  if (!button || !row) return

  const id = row.dataset.id
  const snippet = snippets.find((s) => s.id === id)
  if (!snippet) return

  const action = button.dataset.action
  if (action === 'insert') {
    await insertSnippet(snippet.body)
  } else if (action === 'edit') {
    startEdit(snippet)
  } else if (action === 'delete') {
    snippets = snippets.filter((s) => s.id !== snippet.id)
    await persist()
    showToast('Snippet deleted')
  }
})

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const title = titleInput.value.trim()
  const body = bodyInput.value.trim()
  const category = categorySelect.value as SnippetCategory
  const editId = editIdInput.value

  if (!title || !body) return

  if (editId) {
    snippets = snippets.map((s) =>
      s.id === editId
        ? { ...s, title, body, category, updatedAt: Date.now() }
        : s,
    )
    showToast('Snippet updated')
  } else {
    if (!canAddSnippet(snippets, settings)) {
      showToast('Free limit reached (15). Delete one or upgrade later.')
      return
    }
    snippets = [
      createSnippet({ title, body, category, pack: 'custom' }),
      ...snippets,
    ]
    showToast('Snippet saved')
  }

  await persist()
  resetForm()
})

cancelEditBtn.addEventListener('click', () => resetForm())
searchInput.addEventListener('input', () => renderList())
categoryFilter.addEventListener('change', () => renderList())

exportBtn.addEventListener('click', () => {
  const blob = new Blob([exportSnippetsJson(snippets)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `applybank-snippets-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
  showToast('Exported snippets JSON')
})

importInput.addEventListener('change', async () => {
  const file = importInput.files?.[0]
  if (!file) return

  try {
    const raw = await file.text()
    const imported = parseImportJson(raw)
    if (!settings.isPro) {
      const customCount = snippets.filter((s) => s.pack === 'custom').length
      const room = Math.max(settings.freeLimit - customCount, 0)
      const accepted = imported.slice(0, room).map((s) => ({ ...s, pack: 'custom' as const }))
      if (imported.length > room) {
        showToast(`Import trimmed to ${room} snippets (free limit)`)
      } else {
        showToast(`Imported ${accepted.length} snippets`)
      }
      snippets = [...accepted, ...snippets]
    } else {
      snippets = [...imported, ...snippets]
      showToast(`Imported ${imported.length} snippets`)
    }
    await persist()
  } catch {
    showToast('Could not import that JSON file')
  } finally {
    importInput.value = ''
  }
})

async function init(): Promise<void> {
  fillCategoryOptions()
  const state = await loadState()
  snippets = state.snippets
  settings = state.settings
  // Ensure settings persist after first seed
  await saveSettings(settings)
  resetForm()
  renderList()
}

void init()
