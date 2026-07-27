# ApplyBank

India-first Chrome extension for job application answers. Save CTC, notice period, visa, and common replies — insert into forms in one click. Global pack included for overseas/remote roles.

## Tech stack

- **Manifest V3** Chrome extension
- **TypeScript**
- **Vite** + `@crxjs/vite-plugin`
- **`chrome.storage.local`** (no backend)
- Content script for insert into focused inputs

## Develop

```bash
cd applybank
npm install
npm run dev
```

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `applybank/dist` folder (or the path Vite/CRX prints)
4. Pin **ApplyBank**, open a https job form, focus a field, click **Insert**

```bash
npm run build
```

Load `dist/` for a production build.

## Daily use (India first)

1. Edit the seeded India snippets (phone, CTC, notice period, etc.)
2. Use Global snippets when applying abroad
3. Add your own custom answers
4. Export JSON for backup; import on another machine

## Free vs Pro (planned)

- Free: India + Global starters + 15 custom snippets
- Pro (later via Gumroad): unlimited customs + more packs — no server required for v1

## Project layout

```text
src/
  popup/           # UI
  background/      # service worker
  content/         # insert into page fields
  shared/          # types, storage, seed packs
manifest.config.ts
vite.config.ts
```

## Shortcut

`Alt+Shift+A` opens the popup (configurable in Chrome).
