export const MAP_DEFAULT = { lat: 51.5074, lng: -0.1278 }

export function lonToTileX(lon, z) {
  return ((lon + 180) / 360) * Math.pow(2, z)
}

export function latToTileY(lat, z) {
  const rad = (lat * Math.PI) / 180
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * Math.pow(2, z)
}

export function tileToLon(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180
}

export function tileToLat(y, z) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z)
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}

export function validLatLng(latStr, lngStr) {
  const la = parseFloat(latStr)
  const lo = parseFloat(lngStr)
  if (Number.isNaN(la) || Number.isNaN(lo)) return null
  if (la < -90 || la > 90 || lo < -180 || lo > 180) return null
  return { lat: la, lng: lo }
}

export async function searchPlaces(query, signal) {
  const q = String(query || '').trim()
  if (q.length < 2) return []
  const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8`, { signal })
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()
  const feats = Array.isArray(data.features) ? data.features : []
  return feats
    .map((f) => {
      const [lng, lat] = f.geometry?.coordinates || []
      const p = f.properties || {}
      const parts = [p.name, p.street, p.city, p.country].filter(Boolean)
      const label = parts.length ? [...new Set(parts)].slice(0, 3).join(', ') : q
      return { lat, lng, label }
    })
    .filter((x) => Number.isFinite(x.lat) && Number.isFinite(x.lng))
}
