// Abstraction layer for visible-text capture from a watched window.
//
// On Windows we read a window's accessible text via UI Automation (local, no
// screenshots) — dialogs, status bars, notifications, labels the title can't
// show. Some apps gate their content behind screen-reader mode (VS Code /
// Antigravity integrated terminals & editors); for those, an opt-in OCR path
// screenshots the window and reads it with the built-in Windows OCR engine
// (local, the temp image is deleted immediately, never uploaded). The window
// title is always folded in as a low-noise baseline, and is the only source on
// non-Windows platforms or when capture yields nothing.

import { spawn } from 'child_process'

export interface CaptureResult {
  visibleText: string | undefined
}

export interface CaptureOptions {
  // Allow the heavier OCR path. Off unless the user enables it (it screenshots
  // the window), and it only actually runs when UIA was gated/empty.
  ocr?: boolean
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

// Run a PowerShell script with the match title passed via env (DK_MATCH) so it
// never touches the command line — no quoting, no injection. Returns raw stdout,
// or '' on error/timeout. The script is base64'd as UTF-16LE for -EncodedCommand.
function runPowerShell(script: string, match: string, timeoutMs: number): Promise<string> {
  return new Promise(resolve => {
    const encoded = Buffer.from(script, 'utf16le').toString('base64')
    const ps = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', encoded], {
      env: { ...process.env, DK_MATCH: match },
      windowsHide: true,
    })

    let out = ''
    const done = (value: string): void => {
      clearTimeout(timer)
      resolve(value)
    }
    const timer = setTimeout(() => {
      ps.kill()
      done('')
    }, timeoutMs)

    ps.stdout.on('data', chunk => { out += chunk.toString('utf8') })
    ps.on('error', () => done(''))
    ps.on('close', () => done(out))
  })
}

// Reads a window's accessible text. Prefers the aggregate Document text; falls
// back to concatenating Text-element names for apps without a Document control.
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
$out=$out -replace '[\r\n\t]',' ' -replace '\s+',' '
if($out.Length -gt 2000){ $out=$out.Substring(0,2000) }
[Console]::Out.Write($out.Trim())
`

// Screenshots the window (PrintWindow flag 2 = PW_RENDERFULLCONTENT, needed for
// GPU/Electron surfaces) and OCRs it with Windows.Media.Ocr. The temp PNG is
// deleted before exit so no image of the screen lingers on disk.
const OCR_SCRIPT = `
$ErrorActionPreference='SilentlyContinue'
$ProgressPreference='SilentlyContinue'
$m=$env:DK_MATCH
Add-Type @"
using System;using System.Runtime.InteropServices;using System.Text;
public class W{
 public delegate bool E(IntPtr h,IntPtr l);
 [DllImport("user32.dll")]public static extern bool EnumWindows(E cb,IntPtr l);
 [DllImport("user32.dll")]public static extern int GetWindowText(IntPtr h,StringBuilder s,int n);
 [DllImport("user32.dll")]public static extern bool IsWindowVisible(IntPtr h);
 [DllImport("user32.dll")]public static extern bool GetWindowRect(IntPtr h,out R r);
 [DllImport("user32.dll")]public static extern bool PrintWindow(IntPtr h,IntPtr hdc,uint f);
 public struct R{public int L,T,Rr,B;}
}
"@
$script:hwnd=[IntPtr]::Zero
$cb=[W+E]{ param($h,$l) if(-not [W]::IsWindowVisible($h)){return $true} $sb=New-Object Text.StringBuilder 512;[void][W]::GetWindowText($h,$sb,512); if($sb.ToString() -like "*$m*"){$script:hwnd=$h;return $false} return $true }
[void][W]::EnumWindows($cb,[IntPtr]::Zero)
if($script:hwnd -eq [IntPtr]::Zero){ exit 0 }
$r=New-Object W+R;[void][W]::GetWindowRect($script:hwnd,[ref]$r)
$w=$r.Rr-$r.L;$h=$r.B-$r.T
if($w -le 0 -or $h -le 0){ exit 0 }
Add-Type -AssemblyName System.Drawing
$bmp=New-Object Drawing.Bitmap $w,$h
$g=[Drawing.Graphics]::FromImage($bmp);$hdc=$g.GetHdc()
[void][W]::PrintWindow($script:hwnd,$hdc,2)
$g.ReleaseHdc($hdc);$g.Dispose()
$png=Join-Path $env:TEMP ('dk-ocr-'+[guid]::NewGuid().ToString('N')+'.png')
$bmp.Save($png,[Drawing.Imaging.ImageFormat]::Png);$bmp.Dispose()
try{
 Add-Type -AssemblyName System.Runtime.WindowsRuntime
 $asTask=([System.WindowsRuntimeSystemExtensions].GetMethods()|Where-Object{$_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation\`1'})[0]
 function Await($op,$rt){ $mm=$asTask.MakeGenericMethod($rt); $tk=$mm.Invoke($null,@($op)); $tk.Wait(-1)|Out-Null; $tk.Result }
 [Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]|Out-Null
 [Windows.Graphics.Imaging.BitmapDecoder,Windows.Foundation,ContentType=WindowsRuntime]|Out-Null
 [Windows.Storage.StorageFile,Windows.Foundation,ContentType=WindowsRuntime]|Out-Null
 [Windows.Storage.FileAccessMode,Windows.Foundation,ContentType=WindowsRuntime]|Out-Null
 $file=Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($png)) ([Windows.Storage.StorageFile])
 $stream=Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
 $decoder=Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
 $bitmap=Await ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
 $engine=[Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
 if($engine){ $res=Await ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult]); $out=($res.Text -replace '\s+',' ').Trim(); if($out.Length -gt 2000){$out=$out.Substring(0,2000)}; [Console]::Out.Write($out) }
 $stream.Dispose()
}catch{}
Remove-Item $png -Force -ErrorAction SilentlyContinue
`

// A slow capture must not pile up across polling ticks for the same window.
const uiaInFlight = new Set<string>()
const ocrInFlight = new Set<string>()

async function captureViaUia(match: string): Promise<string | undefined> {
  if (uiaInFlight.has(match)) return undefined
  uiaInFlight.add(match)
  try {
    const raw = await runPowerShell(UIA_SCRIPT, match, 4000)
    // U+FFFC (object-replacement) marks every icon/glyph in the accessible tree.
    const cleaned = raw.replace(/￼/g, ' ').replace(/\s+/g, ' ').trim()
    return cleaned.length > 0 ? cleaned : undefined
  } finally {
    uiaInFlight.delete(match)
  }
}

async function captureViaOcr(match: string): Promise<string | undefined> {
  if (ocrInFlight.has(match)) return undefined
  ocrInFlight.add(match)
  try {
    const raw = await runPowerShell(OCR_SCRIPT, match, 9000)
    const cleaned = raw.replace(/\s+/g, ' ').trim()
    return cleaned.length > 0 ? cleaned : undefined
  } finally {
    ocrInFlight.delete(match)
  }
}

// True when UIA returned nothing or hit an app's screen-reader gate — the only
// cases where the heavier OCR path can add anything.
function uiaWasBlocked(uiaText: string | undefined): boolean {
  return !uiaText || /screen reader|accessibility mode/i.test(uiaText)
}

export async function captureWindow(
  _windowId: string,
  title?: string,
  options: CaptureOptions = {},
): Promise<CaptureResult> {
  const titleText = title ? parseTitle(title) : undefined

  if (process.platform !== 'win32' || !title) {
    return { visibleText: titleText }
  }

  const uiaText = await captureViaUia(title)
  const ocrText = options.ocr && uiaWasBlocked(uiaText) ? await captureViaOcr(title) : undefined

  // Title first (highest-signal, lowest-noise), then accessible text, then OCR.
  const combined = [titleText, uiaText, ocrText].filter(Boolean).join(' ').trim()
  return { visibleText: combined.length > 0 ? combined : undefined }
}
