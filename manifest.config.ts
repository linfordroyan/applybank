import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'ApplyBank — Job Answer Bank',
  short_name: 'ApplyBank',
  version: '1.0.0',
  description:
    'India-first job application answers. Save CTC, notice period, and common replies — paste in one click. Global packs included.',
  icons: {
    '16': 'icons/icon16.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png',
  },
  action: {
    default_popup: 'src/popup/popup.html',
    default_title: 'ApplyBank',
    default_icon: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    },
  },
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  permissions: ['storage', 'activeTab'],
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/content/content.ts'],
      run_at: 'document_idle',
    },
  ],
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Alt+Shift+A',
        mac: 'Alt+Shift+A',
      },
      description: 'Open ApplyBank',
    },
  },
})
