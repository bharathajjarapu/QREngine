import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Glyph } from './components/glyph'
import { LocationMapPicker } from './components/picker'
import { initialFields, options, wifiEncOptions } from './constants'
import { useDebounced } from './hooks/debounce'
import { buildPayload } from './lib/payload'
import { copyText, downloadPng, downloadSvg, toSvg } from './lib/qrcode'
import { inputClass, labelClass } from './ui/classes'
import { IconCode, IconCopy, IconDownload, IconGithub, IconVectorSquare } from './icons'

const iconButtonClass =
  'relative inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-qn-panel text-qn-ink shadow-[inset_0_0_0_1px_rgba(229,231,235,0.9),inset_0_1px_0_rgba(255,255,255,0.65),0_1px_0_rgba(17,24,39,0.03)] transition hover:shadow-[inset_0_0_0_1px_rgba(107,114,128,0.45),inset_0_1px_0_rgba(255,255,255,0.65),0_1px_0_rgba(17,24,39,0.03)] hover:bg-qn-ink/[0.05] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40'
const headerGithubBtn = iconButtonClass.replace('size-9', 'size-10 sm:size-11')
const tip =
  'pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 w-max max-w-[min(calc(100vw-2rem),18rem)] -translate-x-1/2 rounded-md border border-qn-line bg-qn-panel px-2 py-1 text-left text-[10px] font-semibold tracking-wide text-qn-ink opacity-0 shadow-[0_8px_20px_-10px_rgba(17,24,39,0.25)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 peer-disabled:opacity-0 whitespace-normal'
const studioShell = 'rounded-lg border-2 border-qn-muted/25 bg-qn-panel'
const optTile =
  'flex flex-col items-center gap-1 rounded-md px-1.5 py-1.5 text-center transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qn-ink/35 active:scale-[0.98] min-h-[2.75rem] lg:min-h-0 lg:px-2 lg:py-2'
const optTileOn = 'border-2 border-qn-ink bg-qn-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
const optTileOff =
  'border-2 border-qn-line bg-qn-panel text-qn-muted hover:border-qn-muted/45 hover:bg-qn-muted/10 hover:text-qn-ink'

const gridKind = 'grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 lg:gap-1.5'

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

  const { qrSvg, qrErr } = useMemo(() => {
    if (!debouncedPreview) return { qrSvg: '', qrErr: false }
    try {
      return { qrSvg: toSvg(debouncedPreview), qrErr: false }
    } catch {
      return { qrSvg: '', qrErr: true }
    }
  }, [debouncedPreview])

  const ready = payload.ok && !!qrSvg && !qrErr

  const errMsg = !payload.ok ? payload.msg : null

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

        <div className={`${layoutMax} px-4 pb-4 md:px-8`}>
          <section className={`flex w-full min-w-0 flex-col overflow-hidden ${studioShell}`} aria-label="Studio">
          <div className="grid grid-cols-1 gap-0 rounded-lg bg-qn-surface md:grid-cols-2 md:items-stretch">
            <div className="flex min-h-0 flex-col bg-qn-surface md:h-full">
              <div className="space-y-2.5 p-3 md:space-y-3 md:p-4 md:min-h-[min(68dvh,36rem)] md:max-h-[min(68dvh,36rem)] md:overflow-y-auto lg:min-h-[min(74dvh,42rem)] lg:max-h-[min(74dvh,42rem)] [scrollbar-gutter:stable]">
                <div className="grid gap-1.5">
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
                          <Glyph kind={value} />
                          <span className="text-[0.6875rem] font-semibold leading-none tracking-wide md:text-[0.625rem]">{label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {errMsg ? (
                  <p className="rounded-md bg-qn-danger-bg px-2 py-1.5 text-[0.75rem] font-medium text-qn-danger" role="status">
                    {errMsg}
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
                    <textarea className={`${inputClass} min-h-[96px] resize-y`} value={fields.text} onChange={(e) => setField('text', e.target.value)} />
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
                              <span className="font-mono text-[0.625rem] font-semibold leading-none">{label}</span>
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
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md py-0.5 text-[0.75rem] text-qn-body [-webkit-tap-highlight-color:transparent]">
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
                      <input className={`${inputClass} font-mono text-[0.8125rem]`} value={fields.lat} onChange={(e) => setField('lat', e.target.value)} inputMode="decimal" />
                    </label>
                    <label className="grid gap-1">
                      <span className={labelClass}>Longitude</span>
                      <input className={`${inputClass} font-mono text-[0.8125rem]`} value={fields.lng} onChange={(e) => setField('lng', e.target.value)} inputMode="decimal" />
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
              </div>
            </div>

            <aside
              className="relative flex h-full min-h-0 flex-col bg-qn-surface before:pointer-events-none before:content-[''] max-md:before:absolute max-md:before:inset-x-0 max-md:before:top-0 max-md:before:h-[2px] max-md:before:bg-qn-line/70 md:before:absolute md:before:inset-y-0 md:before:left-0 md:before:w-[2px] md:before:bg-qn-line/70"
              aria-label="QR matrix and export"
            >
              <div className="flex h-full flex-col gap-3 p-3 md:p-4 md:min-h-[min(68dvh,36rem)] md:justify-center lg:min-h-[min(74dvh,42rem)]">
                <div className="flex shrink-0 flex-col items-center gap-2 py-0" aria-live="polite">
                  <div className="flex aspect-square w-full max-w-[260px] min-h-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-qn-muted/40 bg-white p-2 text-center shadow-none sm:max-w-[300px] lg:max-w-[min(100%,24rem)] xl:max-w-[26rem]">
                    {qrSvg ? (
                      <div
                        className={`flex size-full min-h-0 items-center justify-center [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:max-w-full ${qrIntro ? 'animate-qr-first' : ''}`}
                        dangerouslySetInnerHTML={{ __html: qrSvg }}
                      />
                    ) : qrErr ? (
                      <span className="px-2 text-[0.75rem] font-medium leading-snug text-qn-danger" role="alert">
                        Could not build a QR code for this content. Try shorter text, fewer fields, or a smaller calendar entry.
                      </span>
                    ) : (
                      <span className="px-2 text-[0.75rem] font-medium leading-snug text-qn-muted" aria-hidden>
                        QR
                      </span>
                    )}
                  </div>
                </div>

                {actionNote ? (
                  <p className="shrink-0 text-center text-[0.6875rem] font-medium text-qn-ink" role="status">
                    {actionNote}
                  </p>
                ) : null}

                <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 pt-0.5 [&_button]:!h-11 [&_button]:!min-h-11 [&_button]:!w-11 [&_button]:!min-w-11">
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
                          await downloadPng(payload.text)
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
