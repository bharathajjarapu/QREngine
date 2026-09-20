import { useCallback, useMemo, useState } from 'react'
import { validateQRInput } from 'etiket'
import { Hero } from './comps/chrome/hero'
import { Studio } from './comps/layout/studio'
import type { StudioTab } from './comps/layout/studio'
import { initialFields } from './utils/constants'
import { useDebounced } from './hooks/use-debounced'
import { buildPayload } from './utils/payload'
import { previewCap, toSvg } from './utils/qrcode'
import type { EcLevel, QrFields } from './types'

// Root shell: owns fields, payload, and the preview/export pipeline.
export default function App() {
  const [fields, setFields] = useState<QrFields>(initialFields)
  const setField = useCallback(<K extends keyof QrFields>(key: K, value: QrFields[K]) => {
    setFields((state) => ({ ...state, [key]: value }))
  }, [])
  const [activeTab, setActiveTab] = useState<StudioTab>('content')

  const payload = useMemo(() => buildPayload(fields), [fields])
  const previewText = payload.ok ? payload.text : ''
  const debounced = useDebounced(previewText, 200)

  const hasLogo = !!(String(fields.qrLogoDataUrl || '').trim() || String(fields.qrLogoUrl || '').trim())
  const ecLevel: EcLevel = hasLogo ? 'H' : fields.qrEcLevel

  const validation = useMemo(() => {
    if (!payload.ok || !debounced) return { valid: true, error: '' }
    return validateQRInput(debounced, ecLevel)
  }, [payload.ok, debounced, ecLevel])

  const { svg, hasError } = useMemo(() => {
    if (!debounced) return { svg: '', hasError: false }
    try {
      return { svg: toSvg(debounced, fields, previewCap), hasError: false }
    } catch {
      return { svg: '', hasError: true }
    }
  }, [debounced, fields])

  const fullSvg = useCallback(() => toSvg(debounced, fields), [debounced, fields])
  const canExport = payload.ok && validation.valid && !!svg && !hasError
  const exportPx = Math.min(1024, Math.max(64, Math.round(Number(fields.qrSize) || 320)))
  const errorMessage = !payload.ok ? payload.msg : null
  const capMessage = payload.ok && !validation.valid ? (validation.error ?? null) : null

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden lg:h-dvh lg:overflow-hidden">
      <a
        href="#studio"
        className="sr-only rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
      >
        Skip to the studio
      </a>
      <main className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col overflow-hidden px-5 sm:px-6 lg:pb-4 xl:px-8">
        <Hero />
        <Studio
          fields={fields}
          setField={setField}
          setFields={setFields}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          capMessage={capMessage}
          hasLogo={hasLogo}
          exportPx={exportPx}
          ecLevelLabel={ecLevel}
          canExport={canExport}
          fullSvg={fullSvg}
          payloadText={payload.ok ? payload.text : ''}
          previewText={previewText}
          debouncedPreview={debounced}
          payload={payload}
          svg={svg}
          hasError={hasError}
          errorMessage={errorMessage}
        />
      </main>
    </div>
  )
}
