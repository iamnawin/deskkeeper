# Non-Functional Requirements

## Privacy

- All detection processing is local by default.
- No screenshots or window content transmitted to external servers without explicit user consent.
- No passwords, form field values, or sensitive input captured.
- User must explicitly opt in to any cloud AI feature.
- Private mode must completely halt all monitoring activity.

## Performance

- App must launch in under 3 seconds on modern hardware.
- Window list refresh must not block the UI thread.
- Detection engine must process a single window input in under 100ms.
- App must not consume more than 2% CPU during idle monitoring.
- Memory footprint must stay under 200MB in normal operation.
- No perceptible UI lag during normal interaction.

## Reliability

- App must not crash on window close/open events.
- App must recover gracefully if a watched window is closed.
- Detection engine must return `UNKNOWN` on unexpected input — never throw.
- Local storage must not corrupt on app crash.
- Notification service must not fire duplicate notifications even if app restarts mid-cycle.

## Local-First

- All core features must work without internet connectivity.
- No cloud dependency for window listing, detection, storage, or notifications.
- AI features are strictly optional and must degrade gracefully when disabled.

## Security

- No remote code execution.
- electron-store data must not contain unencrypted credentials.
- Preload script must use `contextIsolation: true` and `nodeIntegration: false`.
- IPC surface must be minimal and explicitly typed.
- No auto-update mechanism that bypasses user confirmation in MVP.

## Usability

- A new user must be able to watch their first window within 2 minutes of first launch.
- Task card states must be immediately understandable without documentation.
- Dashboard must convey "what needs my attention" at a glance.
- Private mode must be reachable from the main dashboard in one click.

## Extensibility

- Detection rules must be configurable without code changes (data-driven rules file).
- Service layer must be modular — each service can be replaced independently.
- Storage abstraction must allow migration from electron-store to SQLite later.
- OCR and AI classifier are designed as optional, pluggable layers.
