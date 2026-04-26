import { qrCornerInnerOptions, qrCornerOuterOptions, qrDotTypeOptions, qrEcOptions } from '../../config/constants'
import { QrCornerStrip, QrDotTypeStrip } from './tiles'

export function Shape({ fields, setField, qrExportPx, hasLogo, ecDisplay }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
        <div className="min-w-0 max-md:w-full md:w-auto md:shrink md:grow-[3] md:basis-0">
          <span className="qn-heading">Dot type</span>
          <QrDotTypeStrip value={fields.qrDotType} onChange={(v) => setField('qrDotType', v)} options={qrDotTypeOptions} />
        </div>
        <div className="min-w-0 max-md:w-full md:w-auto md:shrink md:grow md:basis-0">
          <span className="qn-heading">Outer corner</span>
          <QrCornerStrip role="outer" value={fields.qrCornerOuter} onChange={(v) => setField('qrCornerOuter', v)} options={qrCornerOuterOptions} />
        </div>
        <div className="min-w-0 max-md:w-full md:w-auto md:shrink md:grow md:basis-0">
          <span className="qn-heading">Inner corner</span>
          <QrCornerStrip role="inner" value={fields.qrCornerInner} onChange={(v) => setField('qrCornerInner', v)} options={qrCornerInnerOptions} />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
        <div className="min-w-0 max-md:w-full md:flex-1 md:basis-0">
          <span className="qn-heading">Error correction</span>
          <div className="mt-1 flex flex-wrap gap-1.5 sm:gap-2" role="group" aria-label="Error correction level">
            {qrEcOptions.map(([value, label]) => {
              const selected = ecDisplay === value
              const locked = hasLogo && value !== 'H'
              return (
                <button
                  key={value}
                  type="button"
                  disabled={locked}
                  aria-disabled={locked}
                  onClick={() => setField('qrEcLevel', value)}
                  className={`qn-opt qn-opt-ec ${selected ? 'qn-opt--on' : 'qn-opt--off'} ${locked ? 'qn-opt--locked' : ''}`}
                  aria-pressed={selected}
                >
                  <span className="text-center text-xs font-semibold leading-snug tracking-wide sm:text-sm">{label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="grid max-md:w-full shrink-0 grid-cols-2 gap-3 md:flex md:w-auto">
          <label className="grid min-w-0 gap-1 md:w-[6.75rem] md:shrink-0">
            <span className="qn-heading">Dot size</span>
            <input
              className={`qn-input font-mono text-sm`}
              type="number"
              step={0.05}
              min={0.1}
              max={1}
              value={fields.qrDotSize}
              onChange={(e) => setField('qrDotSize', e.target.value)}
            />
          </label>
          <label className="grid min-w-0 gap-1 md:w-[6.75rem] md:shrink-0">
            <span className="qn-heading">Export size</span>
            <input
              className={`qn-input font-mono text-sm`}
              type="number"
              min={64}
              max={1024}
              step={1}
              value={qrExportPx}
              onChange={(e) => {
                const n = Math.round(Number(e.target.value))
                if (!Number.isFinite(n)) return
                setField('qrSize', Math.min(1024, Math.max(64, n)))
              }}
              aria-label="Export square size in pixels"
            />
          </label>
        </div>
      </div>
      {hasLogo ? <p className="text-xs text-qn-muted sm:text-sm">Logo uses High correction for scan reliability.</p> : null}
    </div>
  )
}
