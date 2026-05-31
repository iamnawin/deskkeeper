# DeskKeeper — Troubleshooting

---

## Desktop App

### App opens but the dashboard is empty

**Cause**: No watched windows added yet, or demo data not loaded.

**Fix**: 
- Go to **Watched Windows** → click any available window → click **Watch**
  (or use **Watch All** to watch every listed window at once)
- Or go to **Settings → Demo → Load demo data** to see sample task cards

---

### "No windows available" on the Watched Windows page

**Cause**: `desktopCapturer.getSources()` returned nothing — common on Windows with strict privacy settings.

**Fix**:
- Make sure at least one other app window is open
- On Windows 11: Settings → Privacy & Security → Screen and microphone → ensure DeskKeeper is allowed
- Refresh the list using the Refresh button

---

### Settings changes don't persist after restart

**Cause**: The app writes settings to your user data directory. If that directory is read-only, changes won't save.

**Fix**: Check `%APPDATA%\deskkeeper\deskkeeper-storage.json` on Windows. If the file is missing after first run, the data directory may not be writable.

---

### Notifications not appearing

**Cause**: Notifications are disabled or the OS is blocking them.

**Fix**:
1. Go to **Settings → Notifications** — ensure "Enable notifications" is on
2. On Windows: Settings → System → Notifications → ensure DeskKeeper is allowed
3. Make sure monitoring is not paused and private mode is off

---

### Build fails: `electron-vite build` error

**Cause**: Missing dependencies.

**Fix**:
```bash
cd app
rm -rf node_modules
npm install
npm run build
```

---

### `npm run package` fails on Windows

**Cause**: electron-builder requires the app to be built first, and may need admin rights on some systems.

**Fix**:
```bash
cd app
npm run build          # compile first
npm run package        # then package
```

If it still fails, run the terminal as Administrator.

---

## Chrome Extension

### Extension popup shows red dot (not connected)

**Cause**: The desktop app is not running, or the HTTP bridge on port 7420 is blocked.

**Fix**:
1. Launch the desktop app: `cd app && npm run dev`
2. Check that nothing else is using port 7420: `netstat -an | findstr 7420`

---

### Extension loaded but no task cards appear from browser tabs

**Cause**: The content script only runs on regular web pages, not chrome:// URLs.

**Fix**:
1. Open any regular webpage (not a new tab page or settings)
2. Interact with the page — the content script sends a signal on load and activity
3. Check the desktop app Dashboard — a tab card should appear under "Watched Windows"

---

### Extension fails to load: "Manifest file is missing or unreadable"

**Cause**: You loaded the wrong folder in Chrome — the extension source, not the built dist.

**Fix**: In Chrome → Extensions → Load unpacked, select `extension/dist/` (not `extension/`)

---

### Recurring false "Chrome failed" / "Task failed" notifications

**Cause** (fixed in v0.1.1): older builds keyword-matched the page-body text the
content script sends. Words like "error" and "failed" appear on normal pages, so
a `FAILED` card was created and re-notified every cooldown window.

**Fix**:
1. Update to v0.1.1 or later — the bridge now uses the content script's
   structured DOM signal (`detectedState`) and never keyword-scans page text.
2. If a stale false card persists, go to **Settings → Data → Clear all local
   data** to remove it (settings and detection rules are preserved).

---

### Extension not sending signals

**Cause**: Chrome's content security policy on some pages blocks extension injection.

**Expected behavior**: The extension silently skips pages where it's blocked (banking sites, internal Chrome pages, etc.).

---

## AI Classifier

### AI detection not working

**Expected**: AI classifier is disabled by default.

**To enable**:
1. Set `ANTHROPIC_API_KEY` environment variable before launching the app
2. Go to **Settings → AI** → enable "Use AI for ambiguous detection"
3. The classifier only runs when rule-based detection confidence is below 50%

---

## General

### How do I reset everything?

Go to **Settings → Data → Clear all local data**. This removes watched windows, task cards, and notification history. Settings and detection rules are preserved.

### Where is local data stored?

- **Windows**: `%APPDATA%\deskkeeper\deskkeeper-storage.json`
- **Mac**: `~/Library/Application Support/deskkeeper/deskkeeper-storage.json`
- **Linux**: `~/.config/deskkeeper/deskkeeper-storage.json`
