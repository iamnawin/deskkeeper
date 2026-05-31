// Generates all DeskKeeper icons from the single source SVG.
// Run from app/:  node scripts/gen-icons.mjs
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = join(here, '..', '..')
const SVG = join(repo, 'brand', 'deskkeeper-logo.svg')
const svg = readFileSync(SVG)

const render = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()

const extIcons = join(repo, 'extension', 'icons')
const appBuild = join(repo, 'app', 'build')
const brand = join(repo, 'brand')
;[extIcons, appBuild].forEach((d) => mkdirSync(d, { recursive: true }))

// Chrome extension icons
for (const size of [16, 32, 48, 128]) {
  writeFileSync(join(extIcons, `icon-${size}.png`), await render(size))
}

// Desktop app icons (electron-builder buildResources picks these up)
writeFileSync(join(appBuild, 'icon.png'), await render(1024)) // linux + mac source
writeFileSync(join(appBuild, 'icon.ico'), await pngToIco([await render(256)])) // windows nsis

// README / brand asset
writeFileSync(join(brand, 'deskkeeper-logo.png'), await render(512))

console.log('icons generated: extension/icons, app/build, brand/deskkeeper-logo.png')
