import { lazy, Suspense } from 'react'
import { options, wifiEncOptions } from '../../utils/constants'

const Map = lazy(() => import('../layout/map.jsx'))

export function Content({ fields, setField, mapZoom, setMapZoom, qrCapMsg }) {
  return (
    <>
      <div className="grid gap-2">
        <span className="qn-heading">QR type</span>
        <div className="qn-grid-kind">
          {options.map(([value, label]) => {
            const on = fields.kind === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setField('kind', value)}
                className={`qn-opt ${on ? 'qn-opt--on' : 'qn-opt--off'}`}
                aria-pressed={on}
              >
                <span className="text-xs font-semibold leading-none tracking-wide sm:text-sm">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {qrCapMsg ? (
          <p className="rounded-md bg-qn-danger-bg px-3 py-2 text-sm font-medium text-qn-danger" role="status">
            {qrCapMsg}
          </p>
        ) : null}

        {fields.kind === 'link' && (
          <label className="grid gap-1">
            <span className="qn-heading">URL</span>
            <input className="qn-input" value={fields.url} onChange={(e) => setField('url', e.target.value)} placeholder="https://example.com" />
          </label>
        )}

        {fields.kind === 'text' && (
          <label className="grid gap-1">
            <span className="qn-heading">Text</span>
            <textarea className={`qn-input min-h-[7.5rem] resize-y sm:min-h-[8.5rem]`} value={fields.text} onChange={(e) => setField('text', e.target.value)} />
          </label>
        )}

        {fields.kind === 'wifi' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">SSID</span>
              <input className="qn-input" value={fields.wifiSsid} onChange={(e) => setField('wifiSsid', e.target.value)} />
            </label>
            <div className="grid gap-1">
              <span className="qn-heading">Security</span>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                {wifiEncOptions.map(([value, label]) => {
                  const on = fields.wifiEnc === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setField('wifiEnc', value)}
                      className={`qn-opt py-1.5 ${on ? 'qn-opt--on' : 'qn-opt--off'}`}
                      aria-pressed={on}
                    >
                      <span className="font-mono text-xs font-semibold leading-none sm:text-sm">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            {fields.wifiEnc !== 'nopass' && (
              <label className="grid gap-1">
                <span className="qn-heading">Password</span>
                <input className="qn-input" type="password" value={fields.wifiPass} onChange={(e) => setField('wifiPass', e.target.value)} />
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
            <span className="qn-heading">Phone</span>
            <input
              className="qn-input"
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
              <span className="qn-heading">Email</span>
              <input className="qn-input" type="email" value={fields.mailTo} onChange={(e) => setField('mailTo', e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Subject</span>
              <input className="qn-input" value={fields.mailSubject} onChange={(e) => setField('mailSubject', e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Body</span>
              <textarea className={`qn-input min-h-[72px] resize-y`} value={fields.mailBody} onChange={(e) => setField('mailBody', e.target.value)} />
            </label>
          </>
        )}

        {fields.kind === 'sms' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">Number</span>
              <input className="qn-input" value={fields.smsTo} onChange={(e) => setField('smsTo', e.target.value)} inputMode="tel" />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Message</span>
              <textarea className={`qn-input min-h-[72px] resize-y`} value={fields.smsBody} onChange={(e) => setField('smsBody', e.target.value)} />
            </label>
          </>
        )}

        {fields.kind === 'contact' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">Name</span>
              <input className="qn-input" value={fields.cardName} onChange={(e) => setField('cardName', e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Phone</span>
              <input className="qn-input" value={fields.cardPhone} onChange={(e) => setField('cardPhone', e.target.value)} inputMode="tel" />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Email</span>
              <input className="qn-input" type="email" value={fields.cardEmail} onChange={(e) => setField('cardEmail', e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Organization</span>
              <input className="qn-input" value={fields.cardOrg} onChange={(e) => setField('cardOrg', e.target.value)} />
            </label>
          </>
        )}

        {fields.kind === 'mecard' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">Name</span>
              <input className="qn-input" value={fields.meCardName} onChange={(e) => setField('meCardName', e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Phone</span>
              <input className="qn-input" value={fields.meCardPhone} onChange={(e) => setField('meCardPhone', e.target.value)} inputMode="tel" />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Email</span>
              <input className="qn-input" type="email" value={fields.meCardEmail} onChange={(e) => setField('meCardEmail', e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">URL (optional)</span>
              <input className="qn-input" value={fields.meCardUrl} onChange={(e) => setField('meCardUrl', e.target.value)} placeholder="https://…" />
            </label>
          </>
        )}

        {fields.kind === 'location' && (
          <div className="grid gap-3 md:grid-cols-2 md:items-start">
            <div className="min-w-0">
              <Suspense fallback={<p className="text-sm text-qn-muted">Loading map…</p>}>
                <Map
                  latStr={fields.lat}
                  lngStr={fields.lng}
                  zoom={mapZoom}
                  onZoomChange={setMapZoom}
                  onPick={(la, lo) => {
                    setField('lat', la.toFixed(6))
                    setField('lng', lo.toFixed(6))
                  }}
                />
              </Suspense>
            </div>
            <div className="grid min-w-0 gap-2">
              <label className="grid gap-1">
                <span className="qn-heading">Label</span>
                <input className="qn-input" value={fields.geoLabel} onChange={(e) => setField('geoLabel', e.target.value)} />
              </label>
              <label className="grid gap-1">
                <span className="qn-heading">Latitude</span>
                <input className={`qn-input font-mono text-sm`} value={fields.lat} onChange={(e) => setField('lat', e.target.value)} inputMode="decimal" />
              </label>
              <label className="grid gap-1">
                <span className="qn-heading">Longitude</span>
                <input className={`qn-input font-mono text-sm`} value={fields.lng} onChange={(e) => setField('lng', e.target.value)} inputMode="decimal" />
              </label>
            </div>
          </div>
        )}

        {fields.kind === 'event' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">Title</span>
              <input className="qn-input" value={fields.eventTitle} onChange={(e) => setField('eventTitle', e.target.value)} />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="grid min-w-0 gap-1">
                <span className="qn-heading">Start</span>
                <input className="qn-input" type="datetime-local" value={fields.eventStart} onChange={(e) => setField('eventStart', e.target.value)} />
              </label>
              <label className="grid min-w-0 gap-1">
                <span className="qn-heading">End (optional)</span>
                <input className="qn-input" type="datetime-local" value={fields.eventEnd} onChange={(e) => setField('eventEnd', e.target.value)} />
              </label>
            </div>
            <label className="grid gap-1">
              <span className="qn-heading">Location</span>
              <input className="qn-input" value={fields.eventPlace} onChange={(e) => setField('eventPlace', e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Notes</span>
              <textarea className={`qn-input min-h-[64px] resize-y`} value={fields.eventNote} onChange={(e) => setField('eventNote', e.target.value)} />
            </label>
          </>
        )}

        {fields.kind === 'whatsapp' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">Number</span>
              <input
                className={`qn-input font-mono text-sm`}
                value={fields.waPhone}
                onChange={(e) => setField('waPhone', e.target.value)}
                placeholder="e.g. 15551234567 (country code + number)"
                inputMode="numeric"
              />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Prefilled message (optional)</span>
              <textarea className={`qn-input min-h-[64px] resize-y`} value={fields.waMessage} onChange={(e) => setField('waMessage', e.target.value)} />
            </label>
          </>
        )}

        {fields.kind === 'upi' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">UPI ID (VPA)</span>
              <input
                className={`qn-input font-mono text-sm`}
                value={fields.upiVpa}
                onChange={(e) => setField('upiVpa', e.target.value)}
                placeholder="merchant@okaxis"
                autoComplete="off"
              />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Payee name</span>
              <input className="qn-input" value={fields.upiName} onChange={(e) => setField('upiName', e.target.value)} placeholder="Shown in payment app" />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Amount (optional)</span>
              <input
                className="qn-input"
                value={fields.upiAmount}
                onChange={(e) => setField('upiAmount', e.target.value)}
                placeholder="Leave empty to let payer enter amount"
                inputMode="decimal"
              />
            </label>
          </>
        )}

        {fields.kind === 'crypto' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">Bitcoin address</span>
              <input className={`qn-input font-mono text-sm`} value={fields.cryptoAddress} onChange={(e) => setField('cryptoAddress', e.target.value)} />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Amount (optional)</span>
              <input className="qn-input" value={fields.cryptoAmount} onChange={(e) => setField('cryptoAmount', e.target.value)} placeholder="0.001" inputMode="decimal" />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Label (optional)</span>
              <input className="qn-input" value={fields.cryptoLabel} onChange={(e) => setField('cryptoLabel', e.target.value)} />
            </label>
          </>
        )}

        {fields.kind === 'zoom' && (
          <>
            <label className="grid gap-1">
              <span className="qn-heading">Meeting ID</span>
              <input
                className={`qn-input font-mono text-sm`}
                value={fields.zoomId}
                onChange={(e) => setField('zoomId', e.target.value)}
                placeholder="123 456 7890"
                inputMode="numeric"
              />
            </label>
            <label className="grid gap-1">
              <span className="qn-heading">Passcode (optional)</span>
              <input className="qn-input" value={fields.zoomPwd} onChange={(e) => setField('zoomPwd', e.target.value)} />
            </label>
          </>
        )}
      </div>
    </>
  )
}
