import { useEffect, useRef, useState } from 'react'
import { MAP_DEFAULT, latToTileY, lonToTileX, searchPlaces, tileToLat, tileToLon, validLatLng } from '../lib/geo'
import { inputClass, labelClass } from '../ui/classes'

export function LocationMapPicker({ latStr, lngStr, onPick, zoom, onZoomChange }) {
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState('')
  const abortRef = useRef(null)

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const lat = latStr.trim() !== '' && !Number.isNaN(parseFloat(latStr)) ? parseFloat(latStr) : MAP_DEFAULT.lat
  const lng = lngStr.trim() !== '' && !Number.isNaN(parseFloat(lngStr)) ? parseFloat(lngStr) : MAP_DEFAULT.lng
  const pinPos = validLatLng(latStr, lngStr)

  const x = lonToTileX(lng, zoom)
  const y = latToTileY(lat, zoom)
  const tx0 = Math.floor(x - 0.5)
  const ty0 = Math.floor(y - 0.5)

  const tiles = [
    [tx0, ty0],
    [tx0 + 1, ty0],
    [tx0, ty0 + 1],
    [tx0 + 1, ty0 + 1],
  ]

  const pinLeft = pinPos ? `${((x - tx0) / 2) * 100}%` : null
  const pinTop = pinPos ? `${((y - ty0) / 2) * 100}%` : null

  const runSearch = async () => {
    setSearchErr('')
    setResults([])
    const q = searchText.trim()
    if (q.length < 2) return
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setSearching(true)
    try {
      const list = await searchPlaces(q, ac.signal)
      if (ac.signal.aborted) return
      setResults(list)
      if (!list.length) setSearchErr('No places found.')
    } catch (e) {
      if (e?.name === 'AbortError') return
      setSearchErr('Search unavailable. Try again.')
    } finally {
      if (!ac.signal.aborted) setSearching(false)
    }
  }

  const onMapPointer = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const cw = rect.width / 2
    const ch = rect.height / 2
    const col = Math.min(1, Math.max(0, Math.floor(px / cw)))
    const row = Math.min(1, Math.max(0, Math.floor(py / ch)))
    const u = (px - col * cw) / cw
    const v = (py - row * ch) / ch
    const xt = tx0 + col + u
    const yt = ty0 + row + v
    onPick(tileToLat(yt, zoom), tileToLon(xt, zoom))
  }

  return (
    <div className="grid gap-2">
      <p className="text-[0.6875rem] leading-snug text-qn-muted">Location mode loads map tiles and search from the network. QR encoding stays local.</p>
      <div className="grid gap-1">
        <span className={labelClass}>Find on map</span>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-1.5">
          <input
            className={inputClass}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void runSearch()
            }}
            placeholder="City, address, landmark"
            aria-label="Search place"
          />
          <button
            type="button"
            className="min-h-11 shrink-0 rounded-md bg-qn-panel px-4 py-2 text-[0.8125rem] font-semibold text-qn-ink shadow-[inset_0_0_0_1px_rgba(229,231,235,0.9),0_1px_0_rgba(17,24,39,0.03)] transition hover:bg-qn-ink/[0.03] hover:shadow-[inset_0_0_0_1px_rgba(107,114,128,0.45),0_1px_0_rgba(17,24,39,0.03)] active:scale-[0.98] disabled:opacity-40 sm:min-h-0 sm:py-1.5"
            disabled={searching || searchText.trim().length < 2}
            onClick={() => void runSearch()}
          >
            {searching ? '…' : 'Go'}
          </button>
        </div>
        {searchErr ? <p className="text-[0.6875rem] text-qn-danger">{searchErr}</p> : null}
        {results.length > 0 ? (
          <ul className="max-h-36 overflow-y-auto rounded-md bg-qn-panel text-[0.8125rem] shadow-[inset_0_0_0_1px_rgba(229,231,235,0.85),0_10px_30px_-22px_rgba(17,24,39,0.18)] [scrollbar-gutter:stable]">
            {results.map((r, i) => (
              <li key={`${r.lat}-${r.lng}-${i}`}>
                <button
                  type="button"
                  className="w-full px-2.5 py-2 text-left hover:bg-qn-ink/[0.04]"
                  onClick={() => {
                    onPick(r.lat, r.lng)
                    setResults([])
                    setSearchText('')
                    if (zoom < 13) onZoomChange(14)
                  }}
                >
                  <span className="text-qn-ink">{r.label}</span>
                  <span className="mt-0.5 block font-mono text-[0.625rem] text-qn-muted">
                    {r.lat.toFixed(5)}, {r.lng.toFixed(5)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-md bg-qn-panel shadow-[inset_0_0_0_1px_rgba(229,231,235,0.85),0_12px_34px_-24px_rgba(17,24,39,0.16)]">
        <div
          className="relative aspect-[16/11] w-full cursor-crosshair touch-manipulation outline-none [-webkit-tap-highlight-color:transparent]"
          onPointerDown={(e) => {
            if (e.button !== 0) return
            onMapPointer(e)
          }}
          role="region"
          aria-label="Map: tap or click to set coordinates. You can also edit latitude and longitude fields below."
        >
          <div className="grid h-full w-full grid-cols-2 grid-rows-2" aria-hidden>
            {tiles.map(([tx, ty], i) => (
              <img
                key={`${zoom}-${tx}-${ty}-${i}`}
                src={`https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`}
                alt=""
                width={256}
                height={256}
                decoding="async"
                draggable={false}
                className="pointer-events-none h-full w-full select-none object-cover"
              />
            ))}
          </div>
          {pinLeft != null && pinTop != null ? (
            <span
              className="pointer-events-none absolute z-[1] size-3 -translate-x-1/2 -translate-y-full rounded-[1px] border border-qn-ink bg-qn-map-pin shadow-[0_1px_0_rgba(17,24,39,0.25)]"
              style={{ left: pinLeft, top: pinTop }}
              aria-hidden
            />
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2 bg-qn-panel px-2 py-2 shadow-[inset_0_1px_0_rgba(229,231,235,0.75)] sm:py-1.5">
          <span className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-wide text-qn-muted sm:text-[0.625rem]">zoom {zoom}</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center rounded bg-qn-panel font-mono text-sm font-semibold uppercase text-qn-ink shadow-[inset_0_0_0_1px_rgba(229,231,235,0.9)] transition hover:bg-qn-ink/[0.04] active:scale-[0.97] disabled:opacity-40 sm:min-h-0 sm:min-w-0 sm:px-2.5 sm:py-0.5 sm:text-[0.625rem]"
              disabled={zoom <= 3}
              aria-label="Zoom out"
              onClick={(e) => {
                e.stopPropagation()
                onZoomChange(zoom - 1)
              }}
            >
              -
            </button>
            <button
              type="button"
              className="flex min-h-11 min-w-11 items-center justify-center rounded bg-qn-panel font-mono text-sm font-semibold uppercase text-qn-ink shadow-[inset_0_0_0_1px_rgba(229,231,235,0.9)] transition hover:bg-qn-ink/[0.04] active:scale-[0.97] disabled:opacity-40 sm:min-h-0 sm:min-w-0 sm:px-2.5 sm:py-0.5 sm:text-[0.625rem]"
              disabled={zoom >= 19}
              aria-label="Zoom in"
              onClick={(e) => {
                e.stopPropagation()
                onZoomChange(zoom + 1)
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <p className="text-[0.625rem] leading-snug text-qn-muted">
        Map data{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-qn-ink">
          OpenStreetMap
        </a>
        . Search{' '}
        <a href="https://photon.komoot.io" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-qn-ink">
          Photon
        </a>
        .
      </p>
    </div>
  )
}
