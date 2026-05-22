# Prompt: Testing and Packaging

Prepare DeskKeeper for local MVP testing and Windows distribution.

## Testing Requirements

1. Add unit tests for `detection-engine.ts`
   - Test each rule category with matching keywords
   - Test UNKNOWN fallback for no-match input
   - Test confidence calculation
   - Test priority ordering (FAILED > WAITING > COMPLETED > RUNNING > IDLE)

2. Add unit tests for `task-state-engine.ts`
   - Test valid state transitions
   - Test snooze expiry logic
   - Test terminal states (DONE, IGNORED)

3. Add lint script (`npm run lint`)

4. Add type check script (`npm run typecheck`)

5. Add build script (`npm run build`)

## Packaging Requirements

1. Configure Electron Builder for Windows
2. Target: NSIS installer (.exe) for Windows
3. App icon: placeholder `assets/icon.png` (512x512)
4. App name: DeskKeeper
5. App ID: `ai.deskkeeper.app`
6. Output: `dist/` folder

## Scripts to Add

```json
{
  "dev": "electron-vite dev",
  "build": "electron-vite build",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src",
  "package": "electron-builder --win",
  "test": "vitest"
}
```

## Local Development Documentation

Update `app/README.md`:
- Prerequisites (Node.js 18+, npm)
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Package: `npm run package`
- Known limitations
- Windows permissions notes
- How to inspect local storage

## After Implementation

Explain:
1. Test results
2. Package output location
3. Known issues
4. Next steps for distribution
