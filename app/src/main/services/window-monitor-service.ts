import { desktopCapturer } from 'electron'
import type { WatchedWindow } from '../../shared/types'

function deriveAppName(title: string): string {
  const sep = title.lastIndexOf(' - ')
  return sep > 0 ? title.slice(sep + 3) : title
}

export async function listOpenWindows(): Promise<WatchedWindow[]> {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['window'],
      thumbnailSize: { width: 0, height: 0 },
    })

    return sources
      .filter(s => s.name.trim().length > 0)
      .map(s => ({
        id: s.id,
        sourceId: s.id,
        title: s.name,
        appName: deriveAppName(s.name),
        processName: '',
        isWatched: false,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      }))
  } catch {
    return []
  }
}
