/**
 * Preset QR center logos: every `*.svg` in `src/assets/` (stem = id).
 * File name is `logos.js` (one word); exports kept stable for imports.
 */

function stem(path) {
  const file = path.split('/').pop() ?? ''
  const base = file.replace(/\.svg$/i, '')
  const id = base.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase()
  return id || ''
}

/** @param {string} id */
export function labelForPresetId(id) {
  if (!id) return ''
  return id
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

const rawModules = import.meta.glob('../assets/*.svg', { eager: true, query: '?raw', import: 'default' })
const urlModules = import.meta.glob('../assets/*.svg', { eager: true, import: 'default' })

/** @type {{ id: string, raw: string, url: string }[]} */
export const presetLogoEntries = []

/** @type {Record<string, string>} */
export const presetSvgById = {}

for (const path of Object.keys(rawModules)) {
  const id = stem(path)
  if (!id) continue
  const raw = rawModules[path]
  const url = urlModules[path]
  if (typeof raw !== 'string' || typeof url !== 'string') continue
  presetSvgById[id] = raw
  presetLogoEntries.push({ id, raw, url })
}

presetLogoEntries.sort((a, b) => a.id.localeCompare(b.id))
