export interface Coords {
  lat: number
  lng: number
}

// Validates numeric coords against world bounds.
function validCoords(lat: number, lng: number): Coords | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null
  return { lat, lng }
}

// First `num, num` pair wins; a swapped `lng, lat` pair is accepted too.
function coordsFromString(raw: unknown): Coords | null {
  const match = String(raw || '').match(/(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)/)
  if (!match?.[1] || !match?.[2]) return null
  return validCoords(Number(match[1]), Number(match[2])) || validCoords(Number(match[2]), Number(match[1]))
}

// Decodes a share-link label to plain readable text.
function cleanLabel(raw: unknown): string {
  try {
    return decodeURIComponent(String(raw || '').replace(/\+/g, ' ')).replace(/[_\s]+/g, ' ').trim().slice(0, 80)
  } catch {
    return String(raw || '').replace(/\+/g, ' ').trim().slice(0, 80)
  }
}

// Place name from a share link: `?q=` text or a `/place/<name>/` segment.
function harvestLabel(page: URL, params: URLSearchParams): string {
  const query = params.get('q') || params.get('query')
  if (query && !coordsFromString(query)) {
    const label = cleanLabel(query)
    if (label) return label
  }
  const match = page.pathname.match(/\/(?:place|search)\/([^/@;]+)/i)
  if (match?.[1]) return cleanLabel(match[1])
  return ''
}

export interface MapCoords extends Coords {
  label: string
}

// Pulls coordinates out of a Google, Apple, or OSM share link.
export function parseMapLink(raw: unknown): MapCoords | null {
  const input = String(raw || '').trim()
  if (!input) return null
  if (/^geo:/i.test(input)) {
    const coords = coordsFromString(input.slice(4))
    return coords ? { ...coords, label: '' } : null
  }
  if (/^-?\d+(?:\.\d+)?\s*[,;]\s*-?\d+(?:\.\d+)?$/.test(input)) {
    const coords = coordsFromString(input)
    return coords ? { ...coords, label: '' } : null
  }
  let page: URL | null = null
  try {
    page = new URL(/^[a-z][a-z0-9+.-]*:/i.test(input) ? input : `https://${input}`)
  } catch {
    return null
  }
  const params = page.searchParams
  const label = harvestLabel(page, params)
  if (params.has('mlat') && params.has('mlon')) {
    const coords = validCoords(Number(params.get('mlat')), Number(params.get('mlon')))
    if (coords) return { ...coords, label }
  }
  for (const key of ['ll', 'sll', 'center', 'coordinate', 'q', 'query', 'destination']) {
    const found = params.get(key)
    if (!found) continue
    const coords = coordsFromString(found)
    if (coords) return { ...coords, label }
  }
  const at = page.href.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)(?:,|[/?#]|$)/)
  if (at?.[1] && at?.[2]) {
    const coords = validCoords(Number(at[1]), Number(at[2]))
    if (coords) return { ...coords, label }
  }
  const data = input.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/)
  if (data?.[1] && data?.[2]) {
    const coords = validCoords(Number(data[1]), Number(data[2]))
    if (coords) return { ...coords, label }
  }
  const hash = page.hash.match(/map=\d+\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/)
  if (hash?.[1] && hash?.[2]) {
    const coords = validCoords(Number(hash[1]), Number(hash[2]))
    if (coords) return { ...coords, label }
  }
  const segment = page.href.match(/\/(-?\d+\.\d+),(-?\d+\.\d+)(?:[/?#]|$)/)
  if (segment?.[1] && segment?.[2]) {
    const coords = coordsFromString(`${segment[1]},${segment[2]}`)
    if (coords) return { ...coords, label }
  }
  return null
}
