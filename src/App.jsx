import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { LocationMapPicker } from './components/picker'
import {
  initialFields,
  options,
  qrCornerInnerOptions,
  qrCornerOuterOptions,
  qrDotTypeOptions,
  qrEcOptions,
  qrVariantOptions,
  qrVariantPresets,
  wifiEncOptions,
} from './constants'
import { validateQRInput } from 'etiket'
import { useDebounced } from './hooks/debounce'
import { buildPayload } from './lib/payload'
import { copyText, downloadPngFromSvg, downloadSvg, toSvg } from './lib/qrcode'
import { inputClass, labelClass } from './ui/classes'
import { IconCode, IconCopy, IconDownload, IconGithub, IconVectorSquare } from './icons'

const iconButtonClass =
  'relative inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-qn-panel text-qn-ink shadow-[inset_0_0_0_1px_rgba(229,231,235,0.9),inset_0_1px_0_rgba(255,255,255,0.65),0_1px_0_rgba(17,24,39,0.03)] transition hover:shadow-[inset_0_0_0_1px_rgba(107,114,128,0.45),inset_0_1px_0_rgba(255,255,255,0.65),0_1px_0_rgba(17,24,39,0.03)] hover:bg-qn-ink/[0.05] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40'
const headerGithubBtn = iconButtonClass.replace('size-9', 'size-10 sm:size-11')
const tip =
  'pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 w-max max-w-[min(calc(100vw-2rem),18rem)] -translate-x-1/2 rounded-md border border-qn-line bg-qn-panel px-2 py-1 text-left text-[10px] font-semibold tracking-wide text-qn-ink opacity-0 shadow-[0_8px_20px_-10px_rgba(17,24,39,0.25)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 peer-disabled:opacity-0 whitespace-normal'
const studioShell = 'rounded-xl border-2 border-qn-muted/25 bg-qn-panel shadow-[0_14px_48px_-28px_rgba(17,24,39,0.14)]'
const optTile =
  'flex flex-col items-center gap-1 rounded-md px-2 py-2 text-center transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qn-ink/35 active:scale-[0.98] min-h-[3rem] sm:min-h-[3.1rem] lg:min-h-0 lg:px-2.5 lg:py-2.5'
const optTileOn = 'border-2 border-qn-ink bg-qn-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
const optTileOff =
  'border-2 border-qn-line bg-qn-panel text-qn-muted hover:border-qn-muted/45 hover:bg-qn-muted/10 hover:text-qn-ink'

const gridKind =
  'grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 sm:gap-2 lg:gap-2'

/** QR style panel: main title vs subsection titles (clear hierarchy). */
const styleQrTitle = 'text-base font-bold uppercase tracking-[0.07em] text-qn-ink sm:text-lg'
const styleQrSection = 'text-xs font-bold uppercase tracking-[0.07em] text-qn-ink sm:text-[0.8125rem]'

/** Shared max width for header, hero, studio, footer (wider than max-w-7xl). */
const layoutMax = 'mx-auto w-full max-w-screen-2xl'

function IconToolButton({ label, disabled, onClick, children }) {
  return (
    <div className="group relative inline-flex">
      <button type="button" className={`peer ${iconButtonClass}`} aria-label={label} title={label} disabled={disabled} onClick={onClick}>
        {children}
      </button>
      <span className={tip}>{label}</span>
    </div>
  )
}

export default function App() {
  const [fields, setFields] = useState(initialFields)
  const setField = (key, value) => setFields((s) => ({ ...s, [key]: value }))
  const [mapZoom, setMapZoom] = useState(14)
  const firstQrDone = useRef(false)
  const [qrIntro, setQrIntro] = useState(false)
  const [actionNote, setActionNote] = useState('')
  const noteTimer = useRef(null)

  const payload = useMemo(() => buildPayload(fields), [fields])
  const previewIn = payload.ok ? payload.text : ''
  const debouncedPreview = useDebounced(previewIn, 200)

  const hasUserLogo = !!(String(fields.qrLogoDataUrl || '').trim() || String(fields.qrLogoUrl || '').trim())
  const showUpiDefaultLogo =
    fields.kind === 'upi' && fields.upiUseDefaultLogo !== false && fields.upiUseDefaultLogo !== 'false'
  const hasBuiltInQrLogo =
    showUpiDefaultLogo || ['whatsapp', 'zoom', 'crypto'].includes(fields.kind)
  const hasLogo = hasUserLogo || hasBuiltInQrLogo
  const qrStyleAdvanced = fields.qrVariant === 'custom'
  const ecDisplay = hasLogo ? 'H' : fields.qrEcLevel
  const ecForValidate = ecDisplay
  const qrInputCheck = useMemo(() => {
    if (!payload.ok || !debouncedPreview) return { valid: true, error: '' }
    return validateQRInput(debouncedPreview, ecForValidate)
  }, [payload.ok, debouncedPreview, ecForValidate])

  const { qrSvg, qrErr } = useMemo(() => {
    if (!debouncedPreview) return { qrSvg: '', qrErr: false }
    try {
      return { qrSvg: toSvg(debouncedPreview, fields), qrErr: false }
    } catch {
      return { qrSvg: '', qrErr: true }
    }
  }, [debouncedPreview, fields])

  const ready = payload.ok && qrInputCheck.valid && !!qrSvg && !qrErr

  const errMsg = !payload.ok ? payload.msg : null
  const qrCapMsg = payload.ok && !qrInputCheck.valid ? qrInputCheck.error : null

  function applyQrVariant(key) {
    setFields((s) => {
      if (key === 'custom') return { ...s, qrVariant: 'custom' }
      const preset = qrVariantPresets[key]
      return preset ? { ...s, qrVariant: key, ...preset } : { ...s, qrVariant: key }
    })
  }

  function markQrCustom() {
    setFields((s) => (s.qrVariant === 'custom' ? s : { ...s, qrVariant: 'custom' }))
  }

  const previewFrameClass =
    'rounded-2xl border-2 border-qn-muted/40 bg-white p-2 shadow-none'

  useLayoutEffect(() => {
    if (ready && !firstQrDone.current) {
      firstQrDone.current = true
      setQrIntro(true)
    }
  }, [ready])

  function flashNote(msg) {
    setActionNote(msg)
    if (noteTimer.current) clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(() => setActionNote(''), 2200)
  }

  return (
    <main className="page-grain flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden font-sans text-qn-ink">
      <header className="w-full shrink-0 px-4 pt-4 pb-3 sm:px-5 md:px-6 md:pt-5 md:pb-3 lg:px-8">
        <div className="flex w-full min-w-0 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center justify-start gap-3">
            <span
              className="grid size-9 shrink-0 grid-cols-3 grid-rows-3 gap-0.5 rounded-sm border border-qn-line bg-qn-panel p-1 sm:size-10"
              aria-hidden
            >
              {Array.from({ length: 9 }, (_, i) => (
                <span
                  key={i}
                  className={`rounded-[1px] ${[0, 2, 3, 4, 6, 8].includes(i) ? 'bg-qn-ink' : 'bg-qn-line'}`}
                />
              ))}
            </span>
            <span className="brand-wordmark min-w-0 truncate text-[1.65rem] leading-none font-semibold tracking-[-0.05em] text-qn-ink sm:text-[1.8rem] md:text-[2rem]">
              QREngine
            </span>
          </div>
          <a
            href="https://github.com/bharathajjarapu/QR"
            target="_blank"
            rel="noreferrer"
            className={`group relative inline-flex shrink-0 ${headerGithubBtn}`}
            aria-label="GitHub repository"
            title="GitHub"
          >
            <IconGithub />
            <span className={tip}>Source on GitHub</span>
          </a>
        </div>
      </header>

      <div className="flex min-h-0 w-full flex-1 flex-col">
        <div className={`${layoutMax} shrink-0 px-4 pb-4 pt-2 md:px-8`}>
          <div className="mb-3 shrink-0 pb-1 md:mb-4 md:pb-2">
            <div className="min-w-0 text-center">
              <h1 className="mx-auto max-w-3xl text-balance text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                Encode Anything as QR
              </h1>
              <p className="mx-auto mt-2 max-w-xl text-[0.95rem] leading-relaxed text-qn-body md:text-[1.05rem]">
                QR encoding runs in your browser. Download or copy when the code is ready.
              </p>
            </div>
          </div>
        </div>

        <div className={`${layoutMax} flex min-h-0 flex-1 flex-col px-4 pb-4 md:px-8`}>
          <section
            className={`flex min-h-[min(52dvh,30rem)] w-full min-w-0 flex-1 flex-col overflow-hidden md:min-h-[min(72dvh,40rem)] lg:min-h-[min(78dvh,46rem)] ${studioShell}`}
            aria-label="Studio"
          >
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 rounded-xl bg-qn-surface md:grid-cols-[minmax(0,1.22fr)_minmax(0,0.88fr)] md:items-stretch">
            <div className="flex min-h-0 min-w-0 flex-col bg-qn-surface md:h-full">
              <div className="space-y-3 p-4 md:space-y-4 md:p-6 md:min-h-[min(76dvh,40rem)] md:max-h-[min(86dvh,52rem)] md:overflow-y-auto lg:min-h-[min(80dvh,44rem)] lg:max-h-[min(90dvh,56rem)] [scrollbar-gutter:stable]">
                <div className="grid gap-2">
                  <span className={labelClass}>QR type</span>
                  <div className={gridKind}>
                    {options.map(([value, label]) => {
                      const selected = fields.kind === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setField('kind', value)}
                          className={`${optTile} ${selected ? optTileOn : optTileOff}`}
                          aria-pressed={selected}
                        >
                          <span className="text-xs font-semibold leading-none tracking-wide sm:text-sm">{label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {errMsg ? (
                  <p className="rounded-md bg-qn-danger-bg px-3 py-2 text-sm font-medium text-qn-danger" role="status">
                    {errMsg}
                  </p>
                ) : null}
                {qrCapMsg ? (
                  <p className="rounded-md bg-qn-danger-bg px-3 py-2 text-sm font-medium text-qn-danger" role="status">
                    {qrCapMsg}
                  </p>
                ) : null}

                {fields.kind === 'link' && (
                  <label className="grid gap-1">
                    <span className={labelClass}>URL</span>
                    <input className={inputClass} value={fields.url} onChange={(e) => setField('url', e.target.value)} placeholder="https://example.com" />
                  </label>
                )}

                {fields.kind === 'text' && (
                  <label className="grid gap-1">
                    <span className={labelClass}>Text</span>
                    <textarea className={`${inputClass} min-h-[7.5rem] resize-y sm:min-h-[8.5rem]`} value={fields.text} onChange={(e) => setField('text', e.target.value)} />
                  </label>
                )}

                {fields.kind === 'wifi' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>SSID</span>
                      <input className={inputClass} value={fields.wifiSsid} onChange={(e) => setField('wifiSsid', e.target.value)} />
                    </label>
                    <div className="grid gap-1">
                      <span className={labelClass}>Security</span>
                      <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                        {wifiEncOptions.map(([value, label]) => {
                          const selected = fields.wifiEnc === value
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setField('wifiEnc', value)}
                              className={`${optTile} py-1.5 ${selected ? optTileOn : optTileOff}`}
                              aria-pressed={selected}
                            >
                              <span className="font-mono text-xs font-semibold leading-none sm:text-sm">{label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    {fields.wifiEnc !== 'nopass' && (
                      <label className="grid gap-1">
                        <span className={labelClass}>Password</span>
                        <input className={inputClass} type="password" value={fields.wifiPass} onChange={(e) => setField('wifiPass', e.target.value)} />
                      </label>
                    )}
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md py-0.5 text-sm text-qn-body [-webkit-tap-highlight-color:transparent]">
                      <input
                        type="checkbox"
                        checked={fields.wifiHidden}
                        onChange={(e) => setField('wifiHidden', e.target.checked)}
                        className="size-5 shrink-0 rounded text-qn-cta shadow-[inset_0_0_0_1px_rgba(229,231,235,0.95)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qn-ink/45 focus:ring-0"
                      />
                      Hidden network
                    </label>
                  </>
                )}

                {fields.kind === 'phone' && (
                  <label className="grid gap-1">
                    <span className={labelClass}>Phone</span>
                    <input
                      className={inputClass}
                      value={fields.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      placeholder="+1 312 555 0194"
                      inputMode="tel"
                    />
                  </label>
                )}

                {fields.kind === 'email' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>Email</span>
                      <input className={inputClass} type="email" value={fields.mailTo} onChange={(e) => setField('mailTo', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Subject</span>
                      <input className={inputClass} value={fields.mailSubject} onChange={(e) => setField('mailSubject', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Body</span>
                      <textarea className={`${inputClass} min-h-[72px] resize-y`} value={fields.mailBody} onChange={(e) => setField('mailBody', e.target.value)} />
                    </label>
                  </>
                )}

                {fields.kind === 'sms' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>Number</span>
                      <input className={inputClass} value={fields.smsTo} onChange={(e) => setField('smsTo', e.target.value)} inputMode="tel" />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Message</span>
                      <textarea className={`${inputClass} min-h-[72px] resize-y`} value={fields.smsBody} onChange={(e) => setField('smsBody', e.target.value)} />
                    </label>
                  </>
                )}

                {fields.kind === 'contact' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>Name</span>
                      <input className={inputClass} value={fields.cardName} onChange={(e) => setField('cardName', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Phone</span>
                      <input className={inputClass} value={fields.cardPhone} onChange={(e) => setField('cardPhone', e.target.value)} inputMode="tel" />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Email</span>
                      <input className={inputClass} type="email" value={fields.cardEmail} onChange={(e) => setField('cardEmail', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Organization</span>
                      <input className={inputClass} value={fields.cardOrg} onChange={(e) => setField('cardOrg', e.target.value)} />
                    </label>
                  </>
                )}

                {fields.kind === 'mecard' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>Name</span>
                      <input className={inputClass} value={fields.meCardName} onChange={(e) => setField('meCardName', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Phone</span>
                      <input className={inputClass} value={fields.meCardPhone} onChange={(e) => setField('meCardPhone', e.target.value)} inputMode="tel" />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Email</span>
                      <input className={inputClass} type="email" value={fields.meCardEmail} onChange={(e) => setField('meCardEmail', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>URL (optional)</span>
                      <input className={inputClass} value={fields.meCardUrl} onChange={(e) => setField('meCardUrl', e.target.value)} placeholder="https://…" />
                    </label>
                  </>
                )}

                {fields.kind === 'location' && (
                  <>
                    <LocationMapPicker
                      latStr={fields.lat}
                      lngStr={fields.lng}
                      zoom={mapZoom}
                      onZoomChange={setMapZoom}
                      onPick={(la, lo) => {
                        setField('lat', la.toFixed(6))
                        setField('lng', lo.toFixed(6))
                      }}
                    />
                    <label className="grid gap-1">
                      <span className={labelClass}>Latitude</span>
                      <input className={`${inputClass} font-mono text-sm`} value={fields.lat} onChange={(e) => setField('lat', e.target.value)} inputMode="decimal" />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Longitude</span>
                      <input className={`${inputClass} font-mono text-sm`} value={fields.lng} onChange={(e) => setField('lng', e.target.value)} inputMode="decimal" />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Label (optional)</span>
                      <input className={inputClass} value={fields.geoLabel} onChange={(e) => setField('geoLabel', e.target.value)} />
                    </label>
                  </>
                )}

                {fields.kind === 'event' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>Title</span>
                      <input className={inputClass} value={fields.eventTitle} onChange={(e) => setField('eventTitle', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Start</span>
                      <input className={inputClass} type="datetime-local" value={fields.eventStart} onChange={(e) => setField('eventStart', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>End (optional)</span>
                      <input className={inputClass} type="datetime-local" value={fields.eventEnd} onChange={(e) => setField('eventEnd', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Location</span>
                      <input className={inputClass} value={fields.eventPlace} onChange={(e) => setField('eventPlace', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Notes</span>
                      <textarea className={`${inputClass} min-h-[64px] resize-y`} value={fields.eventNote} onChange={(e) => setField('eventNote', e.target.value)} />
                    </label>
                  </>
                )}

                {fields.kind === 'whatsapp' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>Number</span>
                      <input
                        className={`${inputClass} font-mono text-sm`}
                        value={fields.waPhone}
                        onChange={(e) => setField('waPhone', e.target.value)}
                        placeholder="15551234567 (country + number)"
                        inputMode="numeric"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Prefilled message (optional)</span>
                      <textarea className={`${inputClass} min-h-[64px] resize-y`} value={fields.waMessage} onChange={(e) => setField('waMessage', e.target.value)} />
                    </label>
                  </>
                )}

                {fields.kind === 'upi' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>UPI ID (VPA)</span>
                      <input
                        className={`${inputClass} font-mono text-sm`}
                        value={fields.upiVpa}
                        onChange={(e) => setField('upiVpa', e.target.value)}
                        placeholder="merchant@okaxis"
                        autoComplete="off"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Payee name</span>
                      <input className={inputClass} value={fields.upiName} onChange={(e) => setField('upiName', e.target.value)} placeholder="Shown in payment app" />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Amount (optional)</span>
                      <input
                        className={inputClass}
                        value={fields.upiAmount}
                        onChange={(e) => setField('upiAmount', e.target.value)}
                        placeholder="Leave empty to let payer enter amount"
                        inputMode="decimal"
                      />
                    </label>
                    <label className="mt-1 flex min-h-10 cursor-pointer items-center gap-2 text-sm font-medium text-qn-body [-webkit-tap-highlight-color:transparent]">
                      <input
                        type="checkbox"
                        checked={showUpiDefaultLogo}
                        onChange={(e) => setField('upiUseDefaultLogo', e.target.checked)}
                        className="size-4 shrink-0 rounded text-qn-cta shadow-[inset_0_0_0_1px_rgba(229,231,235,0.95)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qn-ink/45 focus:ring-0"
                      />
                      Use default UPI logo (<span className="font-mono">public/upi.svg</span>)
                    </label>
                    <p className="text-xs leading-snug text-qn-muted sm:text-sm">
                      Payload: <span className="font-mono">upi://pay?pa=…&amp;pn=…&amp;cu=INR</span>
                      {hasUserLogo ? ' — custom image logo is used when set.' : showUpiDefaultLogo ? ' — wide default mark in center when enabled.' : ' — no center logo.'}
                    </p>
                  </>
                )}

                {fields.kind === 'crypto' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>Bitcoin address</span>
                      <input className={`${inputClass} font-mono text-sm`} value={fields.cryptoAddress} onChange={(e) => setField('cryptoAddress', e.target.value)} />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Amount (optional)</span>
                      <input className={inputClass} value={fields.cryptoAmount} onChange={(e) => setField('cryptoAmount', e.target.value)} placeholder="0.001" inputMode="decimal" />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Label (optional)</span>
                      <input className={inputClass} value={fields.cryptoLabel} onChange={(e) => setField('cryptoLabel', e.target.value)} />
                    </label>
                  </>
                )}

                {fields.kind === 'zoom' && (
                  <>
                    <label className="grid gap-1">
                      <span className={labelClass}>Meeting ID</span>
                      <input
                        className={`${inputClass} font-mono text-sm`}
                        value={fields.zoomId}
                        onChange={(e) => setField('zoomId', e.target.value)}
                        placeholder="123 456 7890"
                        inputMode="numeric"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Passcode (optional)</span>
                      <input className={inputClass} value={fields.zoomPwd} onChange={(e) => setField('zoomPwd', e.target.value)} />
                    </label>
                  </>
                )}

                <div className="border-t border-qn-line/80 pt-3">
                  <div className="mb-2 grid gap-1">
                    <span className={styleQrTitle}>QR style</span>
                    <div className="grid grid-cols-3 gap-1 sm:grid-cols-5">
                      {qrVariantOptions.map(([value, label]) => {
                        const selected = fields.qrVariant === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => applyQrVariant(value)}
                            className={`${optTile} py-1.5 ${selected ? optTileOn : optTileOff}`}
                            aria-pressed={selected}
                          >
                            <span className="text-xs font-semibold leading-none tracking-wide sm:text-sm">{label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {qrStyleAdvanced ? (
                    <div className="mt-3 border-t border-qn-line/60 pt-3">
                      <span className={styleQrSection}>Layout & look</span>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <label className="grid gap-1">
                          <span className={labelClass}>Size (px)</span>
                          <input
                            className={`${inputClass} font-mono text-sm`}
                            type="number"
                            min={64}
                            max={1024}
                            value={fields.qrSize}
                            onChange={(e) => setField('qrSize', e.target.value)}
                          />
                        </label>
                        <label className="grid gap-1">
                          <span className={labelClass}>Margin (modules)</span>
                          <input
                            className={`${inputClass} font-mono text-sm`}
                            type="number"
                            min={0}
                            max={16}
                            value={fields.qrMargin}
                            onChange={(e) => setField('qrMargin', e.target.value)}
                          />
                        </label>
                        <label className="grid gap-1">
                          <span className={labelClass}>Dot size</span>
                          <input
                            className={`${inputClass} font-mono text-sm`}
                            type="number"
                            step={0.05}
                            min={0.1}
                            max={1}
                            value={fields.qrDotSize}
                            onChange={(e) => {
                              markQrCustom()
                              setField('qrDotSize', e.target.value)
                            }}
                          />
                        </label>
                        <label className="grid gap-1">
                          <span className={labelClass}>Dot type</span>
                          <select
                            className={inputClass}
                            value={fields.qrDotType}
                            onChange={(e) => {
                              markQrCustom()
                              setField('qrDotType', e.target.value)
                            }}
                          >
                            {qrDotTypeOptions.map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {qrStyleAdvanced ? (
                    <div className="mt-3 border-t border-qn-line/60 pt-3">
                      <span className={styleQrSection}>Error correction</span>
                      <div className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-4">
                        {qrEcOptions.map(([value, label]) => {
                          const selected = ecDisplay === value
                          const disabled = hasLogo && value !== 'H'
                          return (
                            <button
                              key={value}
                              type="button"
                              disabled={disabled}
                              onClick={() => setField('qrEcLevel', value)}
                              className={`${optTile} min-h-[3.35rem] py-2 sm:min-h-[3.1rem] ${selected ? optTileOn : optTileOff}`}
                              aria-pressed={selected}
                            >
                              <span className="text-center text-xs font-semibold leading-tight tracking-wide sm:text-sm">{label}</span>
                            </button>
                          )
                        })}
                      </div>
                      {hasLogo ? <p className="mt-1 text-xs text-qn-muted sm:text-sm">Logo uses High correction for scan reliability.</p> : null}
                    </div>
                  ) : null}

                  <div className="mt-3 border-t border-qn-line/60 pt-3">
                    <div className="mt-2 grid grid-cols-1 gap-4">
                      <div className="min-w-0 grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-qn-muted sm:text-sm">Foreground Color</span>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          <label className="grid gap-1">
                            <span className={labelClass}>Fill</span>
                            <select className={inputClass} value={fields.qrFgStyle} onChange={(e) => setField('qrFgStyle', e.target.value)}>
                              <option value="solid">Solid</option>
                              <option value="linear">Linear gradient</option>
                              <option value="radial">Radial gradient</option>
                            </select>
                          </label>
                          <label className="grid gap-1">
                            <span className="text-xs font-semibold text-qn-muted sm:text-sm">Color A</span>
                            <span className="flex min-w-0 items-center gap-2">
                              <input
                                type="color"
                                className="size-10 shrink-0 cursor-pointer rounded-md border-2 border-qn-muted/30 bg-qn-panel p-0.5 shadow-none"
                                value={/^#[0-9a-f]{6}$/i.test(String(fields.qrFg)) ? fields.qrFg : '#111827'}
                                onChange={(e) => setField('qrFg', e.target.value)}
                                aria-label="Foreground color A"
                              />
                              <input className={`${inputClass} min-w-0 font-mono text-sm`} value={fields.qrFg} onChange={(e) => setField('qrFg', e.target.value)} />
                            </span>
                          </label>
                          {fields.qrFgStyle !== 'solid' ? (
                            <label className="grid gap-1">
                              <span className="text-xs font-semibold text-qn-muted sm:text-sm">Color B</span>
                              <span className="flex min-w-0 items-center gap-2">
                                <input
                                  type="color"
                                  className="size-10 shrink-0 cursor-pointer rounded-md border-2 border-qn-muted/30 bg-qn-panel p-0.5"
                                  value={/^#[0-9a-f]{6}$/i.test(String(fields.qrFgColor2)) ? fields.qrFgColor2 : '#6366f1'}
                                  onChange={(e) => setField('qrFgColor2', e.target.value)}
                                  aria-label="Foreground color B"
                                />
                                <input className={`${inputClass} min-w-0 font-mono text-sm`} value={fields.qrFgColor2} onChange={(e) => setField('qrFgColor2', e.target.value)} />
                              </span>
                            </label>
                          ) : null}
                        </div>
                        {fields.qrFgStyle === 'linear' ? (
                          <label className="grid gap-1">
                            <span className={labelClass}>Gradient angle (°)</span>
                            <input
                              className={`${inputClass} font-mono text-sm`}
                              type="number"
                              min={0}
                              max={360}
                              value={fields.qrFgAngle}
                              onChange={(e) => setField('qrFgAngle', e.target.value)}
                            />
                          </label>
                        ) : null}
                      </div>
                      <div className="min-w-0 grid gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-qn-muted sm:text-sm">Background Color</span>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          <label className="grid gap-1">
                            <span className={labelClass}>Fill</span>
                            <select
                              className={inputClass}
                              value={fields.qrBg === 'transparent' ? 'transparent' : fields.qrBgStyle}
                              onChange={(e) => {
                                const next = e.target.value
                                setFields((s) => ({
                                  ...s,
                                  qrBgStyle: next,
                                  qrBg: next === 'transparent' ? 'transparent' : s.qrBg === 'transparent' ? '#ffffff' : s.qrBg,
                                }))
                              }}
                            >
                              <option value="solid">Solid</option>
                              <option value="linear">Linear gradient</option>
                              <option value="radial">Radial gradient</option>
                              <option value="transparent">Transparent</option>
                            </select>
                          </label>
                          {fields.qrBgStyle !== 'transparent' && fields.qrBg !== 'transparent' ? (
                          <>
                              <label className="grid gap-1">
                                <span className="text-xs font-semibold text-qn-muted sm:text-sm">Color A</span>
                                <span className="flex min-w-0 items-center gap-2">
                                  <input
                                    type="color"
                                    className="size-10 shrink-0 cursor-pointer rounded-md border-2 border-qn-muted/30 bg-qn-panel p-0.5 shadow-none"
                                    value={/^#[0-9a-f]{6}$/i.test(String(fields.qrBg)) ? fields.qrBg : '#ffffff'}
                                    onChange={(e) => setField('qrBg', e.target.value)}
                                    aria-label="Background color A"
                                  />
                                  <input className={`${inputClass} min-w-0 font-mono text-sm`} value={fields.qrBg} onChange={(e) => setField('qrBg', e.target.value)} />
                                </span>
                              </label>
                              {fields.qrBgStyle !== 'solid' ? (
                                <label className="grid gap-1">
                                  <span className="text-xs font-semibold text-qn-muted sm:text-sm">Color B</span>
                                  <span className="flex min-w-0 items-center gap-2">
                                    <input
                                      type="color"
                                      className="size-10 shrink-0 cursor-pointer rounded-md border-2 border-qn-muted/30 bg-qn-panel p-0.5"
                                      value={/^#[0-9a-f]{6}$/i.test(String(fields.qrBgColor2)) ? fields.qrBgColor2 : '#e5e7eb'}
                                      onChange={(e) => setField('qrBgColor2', e.target.value)}
                                      aria-label="Background color B"
                                    />
                                    <input className={`${inputClass} min-w-0 font-mono text-sm`} value={fields.qrBgColor2} onChange={(e) => setField('qrBgColor2', e.target.value)} />
                                  </span>
                                </label>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                        {fields.qrBgStyle === 'linear' && fields.qrBg !== 'transparent' ? (
                          <label className="grid gap-1">
                            <span className={labelClass}>Gradient angle (°)</span>
                            <input
                              className={`${inputClass} font-mono text-sm`}
                              type="number"
                              min={0}
                              max={360}
                              value={fields.qrBgAngle}
                              onChange={(e) => setField('qrBgAngle', e.target.value)}
                            />
                          </label>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {qrStyleAdvanced ? (
                    <div className="mt-3 border-t border-qn-line/60 pt-3">
                      <span className={styleQrSection}>Corners</span>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="grid gap-1">
                          <span className="text-xs font-semibold text-qn-muted sm:text-sm">Outer shape</span>
                          <select
                            className={inputClass}
                            value={fields.qrCornerOuter}
                            onChange={(e) => {
                              markQrCustom()
                              setField('qrCornerOuter', e.target.value)
                            }}
                          >
                            {qrCornerOuterOptions.map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-1">
                          <span className="text-xs font-semibold text-qn-muted sm:text-sm">Inner shape</span>
                          <select
                            className={inputClass}
                            value={fields.qrCornerInner}
                            onChange={(e) => {
                              markQrCustom()
                              setField('qrCornerInner', e.target.value)
                            }}
                          >
                            {qrCornerInnerOptions.map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <label className="grid gap-1">
                          <span className="text-xs font-semibold text-qn-muted sm:text-sm">Outer color</span>
                          <span className="flex items-center gap-2">
                            <input
                              type="color"
                              className="size-10 shrink-0 cursor-pointer rounded-md border-2 border-qn-muted/30 bg-qn-panel p-0.5"
                              value={/^#[0-9a-f]{6}$/i.test(String(fields.qrCornerOuterColor)) ? fields.qrCornerOuterColor : '#111827'}
                              onChange={(e) => setField('qrCornerOuterColor', e.target.value)}
                              aria-label="Corner outer color"
                            />
                            <input
                              className={`${inputClass} font-mono text-sm`}
                              value={fields.qrCornerOuterColor}
                              onChange={(e) => setField('qrCornerOuterColor', e.target.value)}
                            />
                          </span>
                        </label>
                        <label className="grid gap-1">
                          <span className="text-xs font-semibold text-qn-muted sm:text-sm">Inner color</span>
                          <span className="flex items-center gap-2">
                            <input
                              type="color"
                              className="size-10 shrink-0 cursor-pointer rounded-md border-2 border-qn-muted/30 bg-qn-panel p-0.5"
                              value={/^#[0-9a-f]{6}$/i.test(String(fields.qrCornerInnerColor)) ? fields.qrCornerInnerColor : '#111827'}
                              onChange={(e) => setField('qrCornerInnerColor', e.target.value)}
                              aria-label="Corner inner color"
                            />
                            <input
                              className={`${inputClass} font-mono text-sm`}
                              value={fields.qrCornerInnerColor}
                              onChange={(e) => setField('qrCornerInnerColor', e.target.value)}
                            />
                          </span>
                        </label>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 border-t border-qn-line/60 pt-3">
                    <span className={styleQrSection}>Logo</span>
                    {hasLogo ? (
                      <label className="mt-2 grid gap-1">
                        <span className={labelClass}>
                          Logo size ({Math.round((Number(fields.qrLogoSize) || 0.28) * 100)}% of QR)
                          {fields.kind === 'upi' && hasUserLogo ? ' — custom' : ''}
                          {fields.kind === 'upi' && !hasUserLogo && showUpiDefaultLogo ? ' — default UPI' : ''}
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
                    <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
                      <label className="grid min-w-0 gap-1">
                        <span className="text-xs font-semibold text-qn-muted sm:text-sm">Choose file</span>
                        <input
                          className={`${inputClass} cursor-pointer text-sm file:mr-2 file:rounded file:border-0 file:bg-qn-cta file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-qn-cta-hover sm:file:text-sm`}
                          type="file"
                          accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp,.png,.jpg,.jpeg,.gif,.svg,.webp"
                          onChange={(e) => {
                            const f = e.target.files?.[0]
                            if (!f) {
                              setField('qrLogoDataUrl', '')
                              return
                            }
                            const r = new FileReader()
                            r.onload = () => setField('qrLogoDataUrl', String(r.result || ''))
                            r.onerror = () => setField('qrLogoDataUrl', '')
                            r.readAsDataURL(f)
                          }}
                        />
                      </label>
                      <label className="grid min-w-0 gap-1">
                        <span className="text-xs font-semibold text-qn-muted sm:text-sm">Image URL (optional)</span>
                        <input
                          className={inputClass}
                          value={fields.qrLogoUrl}
                          onChange={(e) => setField('qrLogoUrl', e.target.value)}
                          placeholder="https://…"
                          disabled={!!String(fields.qrLogoDataUrl || '').trim()}
                        />
                      </label>
                    </div>
                    {hasUserLogo ? (
                      <button
                        type="button"
                        className="mt-2 inline-flex w-fit rounded-md border-2 border-qn-line bg-qn-panel px-3 py-1.5 text-xs font-semibold text-qn-ink hover:bg-qn-muted/10 sm:text-sm"
                        onClick={() => {
                          setField('qrLogoDataUrl', '')
                          setField('qrLogoUrl', '')
                        }}
                      >
                        Remove custom logo
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <aside
              className="relative flex h-full min-h-0 min-w-0 flex-col bg-qn-surface before:pointer-events-none before:content-[''] max-md:before:absolute max-md:before:inset-x-0 max-md:before:top-0 max-md:before:h-[2px] max-md:before:bg-qn-line/70 md:before:absolute md:before:inset-y-0 md:before:left-0 md:before:w-[2px] md:before:bg-qn-line/70"
              aria-label="QR matrix and export"
            >
              <div className="flex h-full flex-col gap-4 p-4 md:gap-5 md:p-6 md:min-h-[min(76dvh,40rem)] md:justify-center lg:min-h-[min(80dvh,44rem)]">
                <div className="flex shrink-0 flex-col items-center gap-2 py-0" aria-live="polite">
                  <div
                    className={`flex aspect-square w-full max-w-[min(92vw,300px)] min-h-0 flex-col items-center justify-center gap-1 text-center sm:max-w-[360px] lg:max-w-[min(100%,28rem)] xl:max-w-[32rem] ${previewFrameClass}`}
                  >
                    {qrSvg ? (
                      <div
                        className={`flex size-full min-h-0 items-center justify-center [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:max-w-full ${qrIntro ? 'animate-qr-first' : ''}`}
                        dangerouslySetInnerHTML={{ __html: qrSvg }}
                      />
                    ) : qrErr ? (
                      <span className="px-2 text-sm font-medium leading-snug text-qn-danger" role="alert">
                        Could not build a QR code for this content. Try shorter text, fewer fields, or a smaller calendar entry.
                      </span>
                    ) : (
                      <span className="px-2 text-sm font-medium leading-snug text-qn-muted" aria-hidden>
                        QR
                      </span>
                    )}
                  </div>
                </div>

                {actionNote ? (
                  <p className="shrink-0 text-center text-sm font-medium text-qn-ink" role="status">
                    {actionNote}
                  </p>
                ) : null}

                <div className="flex shrink-0 flex-wrap items-center justify-center gap-2.5 pt-0.5 [&_button]:!h-12 [&_button]:!min-h-12 [&_button]:!w-12 [&_button]:!min-w-12">
                  <IconToolButton
                    label="Download SVG"
                    disabled={!ready}
                    onClick={() => {
                      if (!ready) return
                      try {
                        downloadSvg(qrSvg)
                        flashNote('SVG download started.')
                      } catch {
                        flashNote('Could not download SVG.')
                      }
                    }}
                  >
                    <IconVectorSquare />
                  </IconToolButton>
                  <IconToolButton
                    label="Download PNG"
                    disabled={!ready}
                    onClick={() => {
                      if (!ready) return
                      void (async () => {
                        try {
                          await downloadPngFromSvg(qrSvg)
                          flashNote('PNG download started.')
                        } catch {
                          flashNote('Could not download PNG.')
                        }
                      })()
                    }}
                  >
                    <IconDownload />
                  </IconToolButton>
                  <IconToolButton
                    label="Copy encoded text"
                    disabled={!ready}
                    onClick={() => {
                      if (!ready) return
                      void copyText(payload.text).then((ok) => flashNote(ok ? 'Encoded text copied.' : 'Copy failed.'))
                    }}
                  >
                    <IconCopy />
                  </IconToolButton>
                  <IconToolButton
                    label="Copy SVG markup"
                    disabled={!ready}
                    onClick={() => {
                      if (!ready) return
                      void copyText(qrSvg).then((ok) => flashNote(ok ? 'SVG copied.' : 'Copy failed.'))
                    }}
                  >
                    <IconCode />
                  </IconToolButton>
                </div>
              </div>
            </aside>
          </div>
          </section>
        </div>

        <footer className={`${layoutMax} mt-auto shrink-0 flex flex-col gap-2 px-4 pt-5 pb-4 md:px-8`}>
          <p className="text-center text-[1rem] font-medium text-qn-muted">
            Developed with ❤️ & 💻 by <a href="https://github.com/bharathajjarapu" target="_blank" rel="noreferrer" className="text-qn-ink hover:underline">Bharath</a>
          </p>
        </footer>
      </div>
    </main>
  )
}
