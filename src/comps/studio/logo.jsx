import { useState } from 'react'
import { labelForPresetId, presetLogoEntries } from '../../utils/logos'

const maxBytes = 600_000

export function Logo({ fields, setField, hasUserLogo, hasPresetLogo, hasLogo, presetKey }) {
  const [big, setBig] = useState(false)
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-10 gap-1">
        <button
          type="button"
          onClick={() => setField('qrPresetLogo', '')}
          className={`qn-logo-pick ${!hasUserLogo && !hasPresetLogo ? 'qn-opt--on' : 'qn-opt--off'}`}
          aria-label="No preset logo"
          title="No preset logo"
          aria-pressed={!hasUserLogo && !hasPresetLogo}
        >
          <svg className="size-[1.25rem] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M7 7l10 10" strokeLinecap="round" />
          </svg>
        </button>
        {presetLogoEntries.map(({ id, url }) => {
          const label = labelForPresetId(id)
          const on = !hasUserLogo && presetKey === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setField('qrLogoDataUrl', '')
                setField('qrLogoUrl', '')
                setField('qrPresetLogo', id)
              }}
              className={`qn-logo-pick ${on ? 'qn-opt--on' : 'qn-opt--off'}`}
              aria-label={label}
              title={label}
              aria-pressed={on}
            >
              <img src={url} alt="" className="h-6 w-6 max-h-full max-w-full object-contain opacity-90" />
            </button>
          )
        })}
      </div>
      {hasLogo ? (
        <label className="grid gap-1">
          <span className="qn-heading">
            Logo size ({Math.round((Number(fields.qrLogoSize) || 0.28) * 100)}% of QR)
          </span>
          <input
            type="range"
            min={0.1}
            max={0.5}
            step={0.02}
            value={Number(fields.qrLogoSize) || 0.28}
            onChange={(e) => setField('qrLogoSize', parseFloat(e.target.value))}
            className="w-full accent-qn-cta"
          />
        </label>
      ) : null}
      <div className="grid grid-cols-1 gap-3">
        <label className="grid min-w-0 gap-1">
          <span className="qn-heading">Choose file</span>
          <input
            className={`qn-input cursor-pointer text-sm file:mr-2 file:rounded file:border-0 file:bg-[var(--color-qn-control-on-bg)] file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--color-qn-control-on-fg)] hover:file:brightness-110 active:file:brightness-95 sm:file:text-sm`}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp,.png,.jpg,.jpeg,.gif,.svg,.webp"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (!f) {
                setField('qrLogoDataUrl', '')
                return
              }
              if (f.size > maxBytes) {
                setField('qrLogoDataUrl', '')
                setBig(true)
                window.setTimeout(() => setBig(false), 4000)
                return
              }
              setBig(false)
              setField('qrPresetLogo', '')
              const r = new FileReader()
              r.onload = () => setField('qrLogoDataUrl', String(r.result || ''))
              r.onerror = () => setField('qrLogoDataUrl', '')
              r.readAsDataURL(f)
            }}
          />
        </label>
        <p className="text-[0.6875rem] text-qn-muted">Max file size about {Math.round(maxBytes / 1000)} KB.</p>
        {big ? (
          <p className="text-[0.6875rem] font-medium text-qn-danger" role="alert">
            That file is too large. Pick a smaller image.
          </p>
        ) : null}
        <label className="grid min-w-0 gap-1">
          <span className="qn-heading">Image URL (optional)</span>
          <input
            className="qn-input"
            value={fields.qrLogoUrl}
            onChange={(e) => {
              const v = e.target.value
              setField('qrLogoUrl', v)
              if (v.trim()) setField('qrPresetLogo', '')
            }}
            placeholder="https://…"
            disabled={!!String(fields.qrLogoDataUrl || '').trim()}
          />
        </label>
      </div>
      {hasUserLogo ? (
        <button
          type="button"
          className="inline-flex w-fit rounded-md border-2 border-qn-line bg-qn-panel px-3 py-1.5 text-xs font-semibold text-qn-ink hover:bg-qn-muted/10 sm:text-sm"
          onClick={() => {
            setField('qrLogoDataUrl', '')
            setField('qrLogoUrl', '')
            setField('qrPresetLogo', '')
          }}
        >
          Remove custom logo
        </button>
      ) : null}
    </div>
  )
}
