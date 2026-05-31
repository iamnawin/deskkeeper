// Abstraction layer for visible-text capture from a watched window.
//
// There is no OCR or accessibility-API capture yet. As a pragmatic bridge, we
// derive a text proxy from the window title so the detection engine has content
// to match instead of nothing. To add real capture (OCR, UI Automation), replace
// the body of captureWindow only — the structured-text contract stays the same.

export interface CaptureResult {
  visibleText: string | undefined
}

// Window titles pack the meaningful parts (document, app, state) behind separators
// like " — ", " - ", " · ", " | ". Flatten them into one space-joined string so
// the keyword engine sees clean, matchable tokens.
export function parseTitle(title: string): string | undefined {
  const cleaned = title
    .split(/[—–·|]|\s-\s/)
    .map(segment => segment.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return cleaned.length > 0 ? cleaned : undefined
}

export async function captureWindow(_windowId: string, title?: string): Promise<CaptureResult> {
  return { visibleText: title ? parseTitle(title) : undefined }
}
