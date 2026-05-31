// Abstraction layer for visible-text capture from a watched window.
//
// On Windows we read the window's accessible text via UI Automation (local, no
// screenshots, privacy-safe). This catches dialogs, status bars, notifications
// and other on-screen state the title alone can't show. It does NOT read text
// an app deliberately gates behind screen-reader mode (e.g. VS Code/Antigravity
// integrated terminals) — that case is handled by OCR (next phase). The window
// title is always folded in as a low-noise baseline, and is the only source on
// non-Windows platforms or when UIA yields nothing.

import { spawn } from 'child_process'

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

// PowerShell that finds the top-level window matching $env:DK_MATCH and returns
// its accessible text. Passing the title via env (not the command line) avoids
// quoting and injection. Prefers the aggregate Document text; falls back to
// concatenating Text-element names for apps without a Document control.
const UIA_SCRIPT = `
$ErrorActionPreference='SilentlyContinue'
$ProgressPreference='SilentlyContinue'
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
$m=$env:DK_MATCH
$AE=[System.Windows.Automation.AutomationElement]
$TS=[System.Windows.Automation.TreeScope]
$CT=[System.Windows.Automation.ControlType]
$root=$AE::RootElement
$winCond=New-Object System.Windows.Automation.PropertyCondition($AE::ControlTypeProperty,$CT::Window)
$wins=$root.FindAll($TS::Children,$winCond)
$t=$null
foreach($w in $wins){ if($w.Current.Name -eq $m){ $t=$w; break } }
if($null -eq $t){ foreach($w in $wins){ if($w.Current.Name -and $w.Current.Name.Contains($m)){ $t=$w; break } } }
if($null -eq $t){ exit 0 }
$out=''
$docCond=New-Object System.Windows.Automation.PropertyCondition($AE::ControlTypeProperty,$CT::Document)
$doc=$t.FindFirst($TS::Descendants,$docCond)
if($doc){ try{ $tp=$doc.GetCurrentPattern([System.Windows.Automation.TextPattern]::Pattern); $out=$tp.DocumentRange.GetText(-1) }catch{} }
if(-not $out){
  $txtCond=New-Object System.Windows.Automation.PropertyCondition($AE::ControlTypeProperty,$CT::Text)
  $els=$t.FindAll($TS::Descendants,$txtCond)
  $sb=New-Object System.Text.StringBuilder
  foreach($e in $els){ [void]$sb.Append($e.Current.Name); [void]$sb.Append(' '); if($sb.Length -gt 4000){break} }
  $out=$sb.ToString()
}
$out=$out -replace '[￼\r\n\t]',' ' -replace '\s+',' '
if($out.Length -gt 2000){ $out=$out.Substring(0,2000) }
[Console]::Out.Write($out.Trim())
`

// Titles currently being captured — a slow UIA call must not pile up across
// polling ticks for the same window.
const inFlight = new Set<string>()

function captureViaUia(match: string): Promise<string | undefined> {
  if (inFlight.has(match)) return Promise.resolve(undefined)
  inFlight.add(match)

  return new Promise(resolve => {
    const encoded = Buffer.from(UIA_SCRIPT, 'utf16le').toString('base64')
    const ps = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encoded], {
      env: { ...process.env, DK_MATCH: match },
      windowsHide: true,
    })

    let out = ''
    const done = (value: string | undefined): void => {
      clearTimeout(timer)
      inFlight.delete(match)
      resolve(value)
    }
    const timer = setTimeout(() => {
      ps.kill()
      done(undefined)
    }, 4000)

    ps.stdout.on('data', chunk => { out += chunk.toString('utf8') })
    ps.on('error', () => done(undefined))
    ps.on('close', () => {
      // U+FFFC (object-replacement) marks every icon/glyph in the accessible
      // tree; strip it and collapse whitespace so detection sees clean tokens.
      const cleaned = out.replace(/￼/g, ' ').replace(/\s+/g, ' ').trim()
      done(cleaned.length > 0 ? cleaned : undefined)
    })
  })
}

export async function captureWindow(_windowId: string, title?: string): Promise<CaptureResult> {
  const titleText = title ? parseTitle(title) : undefined

  if (process.platform !== 'win32' || !title) {
    return { visibleText: titleText }
  }

  const uiaText = await captureViaUia(title)
  // Title first (highest-signal, lowest-noise), then accessible body text.
  const combined = [titleText, uiaText].filter(Boolean).join(' ').trim()
  return { visibleText: combined.length > 0 ? combined : undefined }
}
