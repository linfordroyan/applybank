import type { InsertMessage, InsertResultMessage } from '../shared/types'

function isEditable(el: Element | null): el is HTMLElement {
  if (!el) return false
  if (el instanceof HTMLInputElement) {
    const blocked = ['button', 'submit', 'checkbox', 'radio', 'file', 'hidden']
    return !blocked.includes(el.type)
  }
  if (el instanceof HTMLTextAreaElement) return true
  if (el instanceof HTMLElement && el.isContentEditable) return true
  return false
}

function insertIntoElement(el: HTMLElement, text: string): boolean {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const next = el.value.slice(0, start) + text + el.value.slice(end)
    el.value = next
    const caret = start + text.length
    el.setSelectionRange(caret, caret)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    return true
  }

  if (el.isContentEditable) {
    el.focus()
    const ok = document.execCommand('insertText', false, text)
    if (!ok) {
      el.textContent = `${el.textContent ?? ''}${text}`
    }
    el.dispatchEvent(new Event('input', { bubbles: true }))
    return true
  }

  return false
}

chrome.runtime.onMessage.addListener(
  (message: InsertMessage, _sender, sendResponse: (response: InsertResultMessage) => void) => {
    if (message?.type !== 'APPLYBANK_INSERT') return

    const active = document.activeElement
    if (!isEditable(active)) {
      sendResponse({
        type: 'APPLYBANK_INSERT_RESULT',
        ok: false,
        error: 'Focus an input or text area first',
      })
      return
    }

    const ok = insertIntoElement(active, message.body)
    sendResponse({
      type: 'APPLYBANK_INSERT_RESULT',
      ok,
      error: ok ? undefined : 'Could not insert into this field',
    })
  },
)
