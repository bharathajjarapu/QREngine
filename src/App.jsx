import { useLayoutEffect, useMemo, useRef, useState, useCallback } from 'react'
import { validateQRInput } from 'etiket'
import { Footer } from './comps/chrome/footer'
import { Header } from './comps/chrome/header'
import { Hero } from './comps/chrome/hero'
import { Studio } from './comps/layout/studio'
import { initialFields } from './utils/constants'
import { useDebounced } from './hooks/debounce'
import { buildPayload } from './utils/payload'
import { presetSvgById } from './utils/logos'
import { previewCap, toSvg } from './utils/qrcode'

export default function App() {
  const [fields, setFields] = useState(initialFields)
  const setField = (key, val) => setFields((s) => ({ ...s, [key]: val }))
  const [mapZoom, setMapZoom] = useState(14)
  const first = useRef(false)
  const [intro, setIntro] = useState(false)
  const [open, setOpen] = useState('content')

  const toggle = (id) => setOpen((p) => (p === id ? 'content' : id))

  const payload = useMemo(() => buildPayload(fields), [fields])
  const previewIn = payload.ok ? payload.text : ''
  const debounced = useDebounced(previewIn, 200)

  const hasUser = !!(String(fields.qrLogoDataUrl || '').trim() || String(fields.qrLogoUrl || '').trim())
  const presetKey = String(fields.qrPresetLogo || '').trim().toLowerCase()
  const hasPreset = !!presetSvgById[presetKey]
  const hasLogo = hasUser || hasPreset
  const ec = hasLogo ? 'H' : fields.qrEcLevel

  const check = useMemo(() => {
    if (!payload.ok || !debounced) return { valid: true, error: '' }
    return validateQRInput(debounced, ec)
  }, [payload.ok, debounced, ec])

  const { qrSvg, qrErr } = useMemo(() => {
    if (!debounced) return { qrSvg: '', qrErr: false }
    try {
      return { qrSvg: toSvg(debounced, fields, previewCap), qrErr: false }
    } catch {
      return { qrSvg: '', qrErr: true }
    }
  }, [debounced, fields])

  const getFull = useCallback(() => toSvg(debounced, fields), [debounced, fields])

  const ready = payload.ok && check.valid && !!qrSvg && !qrErr
  const qrExportPx = Math.min(1024, Math.max(64, Math.round(Number(fields.qrSize) || 320)))
  const errMsg = !payload.ok ? payload.msg : null
  const qrCapMsg = payload.ok && !check.valid ? check.error : null

  useLayoutEffect(() => {
    if (ready && !first.current) {
      first.current = true
      setIntro(true)
    }
  }, [ready])

  return (
    <main className="page-grain flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden font-sans text-qn-ink">
      <Header />
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <Hero />
        <Studio
          fields={fields}
          setField={setField}
          setFields={setFields}
          mapZoom={mapZoom}
          setMapZoom={setMapZoom}
          open={open}
          toggle={toggle}
          qrCapMsg={qrCapMsg}
          hasUserLogo={hasUser}
          hasPresetLogo={hasPreset}
          hasLogo={hasLogo}
          presetKey={presetKey}
          qrExportPx={qrExportPx}
          ecDisplay={ec}
          ready={ready}
          getFull={getFull}
          payloadText={payload.ok ? payload.text : ''}
          previewIn={previewIn}
          debouncedPreview={debounced}
          payload={payload}
          qrSvg={qrSvg}
          qrErr={qrErr}
          qrIntro={intro}
          errMsg={errMsg}
        />
        <Footer />
      </div>
    </main>
  )
}
