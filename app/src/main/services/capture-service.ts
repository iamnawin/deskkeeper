// Abstraction layer for visible-text capture from a watched window.
// Returns undefined visibleText now (no capture capability yet).
// To add OCR or accessibility-API capture: replace the body of captureWindow only.

export interface CaptureResult {
  visibleText: string | undefined
}

export async function captureWindow(_windowId: string): Promise<CaptureResult> {
  return { visibleText: undefined }
}
