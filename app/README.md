# DeskKeeper — Electron App

This directory will contain the DeskKeeper Electron + React desktop application.

## Status

Not yet built. See `ROADMAP.md` Phase 1.

## Planned Stack

- Electron
- React + TypeScript
- Vite (via electron-vite)
- Tailwind CSS
- electron-store

## Planned Structure

```
app/
├── package.json
├── electron.vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main/
│   │   ├── index.ts
│   │   ├── ipc/
│   │   ├── services/
│   │   └── utils/
│   ├── preload/
│   │   └── index.ts
│   ├── renderer/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── styles.css
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── lib/
│   └── shared/
│       ├── types.ts
│       ├── constants.ts
│       ├── detection-rules.ts
│       └── status.ts
└── assets/
    ├── icon.png
    └── logo.svg
```

## How to Run (once built)

```bash
npm install
npm run dev     # development with hot reload
npm run build   # production build
npm run package # create Windows installer
```

## Next Step

Use `prompts/02_BUILD_ELECTRON_APP_PROMPT.md` to build Phase 1.
