import { useId, useState } from 'react'
import { Link2 } from 'lucide-react'
import { kindIcons } from '@/utils/icons'
import { kindOptions, wifiAuthOptions } from '@/utils/constants'
import { parseMapLink } from '@/utils/geo'
import { Checkbox } from '@/comps/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldLegend } from '@/comps/ui/field'
import { Button } from '@/comps/ui/button'
import { Input } from '@/comps/ui/input'
import type { QrFields, SetField } from '@/types'
import type { ChangeEvent } from 'react'
import { AreaField, Choice, TextField } from './options'

const kindChoices = kindOptions.map(([value, label]) => [value, label, kindIcons[value]] as const)

// Capacity warning shown above the per-kind form.
function CapMessage({ message }: { message: string | null }) {
  return message ? (
    <p className="rounded-md border-2 border-destructive bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive shadow-brutal-sm" role="status" aria-live="polite">
      {message}
    </p>
  ) : null
}

interface HiddenNetworkProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

// WiFi hidden-network checkbox row.
function HiddenNetwork({ checked, onCheckedChange }: HiddenNetworkProps) {
  const id = useId()
  return (
    <Field orientation="horizontal">
      <Checkbox id={id} checked={checked} onCheckedChange={(state: boolean | 'indeterminate') => typeof state === 'boolean' && onCheckedChange(state)} />
      <FieldLabel htmlFor={id} className="font-normal text-muted-foreground">
        Hidden network
      </FieldLabel>
    </Field>
  )
}

interface LocationProps {
  fields: QrFields
  setField: SetField
}

// Map-link extractor plus manual lat/lng fields.
function Location({ fields, setField }: LocationProps) {
  const [mapLink, setMapLink] = useState('')
  const [linkError, setLinkError] = useState('')
  const linkId = useId()

  const extractCoords = () => {
    const coords = parseMapLink(mapLink)
    if (!coords) {
      const isShort = /maps\.app\.goo\.gl|goo\.gl\/maps/i.test(mapLink)
      setLinkError(
        isShort
          ? 'Short links hide the coordinates. Open it in Maps, then share the full link with @ or coordinates.'
          : 'No coordinates found. Paste a Google Maps, Apple Maps or OpenStreetMap link.'
      )
      return
    }
    setLinkError('')
    setMapLink('')
    setField('lat', String(coords.lat.toFixed(6)))
    setField('lng', String(coords.lng.toFixed(6)))
    if (coords.label && !String(fields.geoLabel || '').trim()) setField('geoLabel', coords.label)
  }

  return (
    <FieldGroup className="gap-4">
      <Field data-invalid={!!linkError || undefined}>
        <FieldLabel htmlFor={linkId}>Map link</FieldLabel>
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Link2 aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={linkId}
              type="url"
              inputMode="url"
              value={mapLink}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setMapLink(event.target.value)
                setLinkError('')
              }}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') extractCoords()
              }}
              placeholder="Paste a Google Maps, Apple Maps or OSM link…"
              spellCheck={false}
              autoComplete="off"
              aria-invalid={!!linkError || undefined}
              aria-describedby={linkError ? `${linkId}-error` : undefined}
              className="pr-3 pl-9"
            />
          </div>
          <Button
            type="button"
            onClick={extractCoords}
            disabled={mapLink.trim().length < 4}
            className="shrink-0 max-sm:h-11 max-sm:w-full sm:w-auto"
          >
            Get coords
          </Button>
        </div>
        {linkError ? <FieldError id={`${linkId}-error`}>{linkError}</FieldError> : null}
      </Field>
      <TextField label="Label" value={fields.geoLabel} onChange={(event) => setField('geoLabel', event.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Latitude"
          required
          className="font-mono tabular-nums"
          inputMode="decimal"
          spellCheck={false}
          value={fields.lat}
          onChange={(event) => setField('lat', event.target.value)}
        />
        <TextField
          label="Longitude"
          required
          className="font-mono tabular-nums"
          inputMode="decimal"
          spellCheck={false}
          value={fields.lng}
          onChange={(event) => setField('lng', event.target.value)}
        />
      </div>
    </FieldGroup>
  )
}

// Per-kind form bodies, keyed to kindOptions.
function KindFields({ fields, setField }: { fields: QrFields; setField: SetField }) {
  const setterFor = <K extends keyof QrFields>(key: K) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setField(key, event.target.value as QrFields[K])

  switch (fields.kind) {
    case 'link':
      return (
        <TextField
          label="URL"
          required
          type="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="https://example.com"
          value={fields.url}
          onChange={setterFor('url')}
        />
      )
    case 'text':
      return <AreaField label="Text" required placeholder="Anything you want to encode…" value={fields.text} onChange={setterFor('text')} />
    case 'wifi':
      return (
        <>
          <TextField label="Network name" required autoComplete="off" spellCheck={false} placeholder="SSID" value={fields.wifiSsid} onChange={setterFor('wifiSsid')} />
          <FieldSet>
            <FieldLegend variant="label">Security</FieldLegend>
            <Choice label="Security" value={fields.wifiEnc} onChange={(picked) => setField('wifiEnc', picked)} options={wifiAuthOptions} itemClassName="flex-1" />
          </FieldSet>
          {fields.wifiEnc !== 'nopass' ? (
            <TextField label="Password" required type="password" autoComplete="off" value={fields.wifiPass} onChange={setterFor('wifiPass')} />
          ) : null}
          <HiddenNetwork checked={fields.wifiHidden} onCheckedChange={(picked) => setField('wifiHidden', picked)} />
        </>
      )
    case 'phone':
      return <TextField label="Phone" required type="tel" autoComplete="tel" placeholder="+1 312 555 0194" value={fields.phone} onChange={setterFor('phone')} />
    case 'email':
      return (
        <>
          <TextField label="To" required type="email" autoComplete="email" spellCheck={false} placeholder="you@example.com" value={fields.mailTo} onChange={setterFor('mailTo')} />
          <TextField label="Subject" value={fields.mailSubject} onChange={setterFor('mailSubject')} />
          <AreaField label="Body" value={fields.mailBody} onChange={setterFor('mailBody')} />
        </>
      )
    case 'sms':
      return (
        <>
          <TextField label="Number" required type="tel" autoComplete="tel" value={fields.smsTo} onChange={setterFor('smsTo')} />
          <AreaField label="Message" value={fields.smsBody} onChange={setterFor('smsBody')} />
        </>
      )
    case 'contact':
      return (
        <>
          <TextField label="Name" required autoComplete="name" value={fields.cardName} onChange={setterFor('cardName')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Phone" type="tel" autoComplete="tel" value={fields.cardPhone} onChange={setterFor('cardPhone')} />
            <TextField label="Email" type="email" autoComplete="email" spellCheck={false} value={fields.cardEmail} onChange={setterFor('cardEmail')} />
          </div>
          <TextField label="Organization" autoComplete="organization" value={fields.cardOrg} onChange={setterFor('cardOrg')} />
        </>
      )
    case 'mecard':
      return (
        <>
          <TextField label="Name" required autoComplete="name" value={fields.meCardName} onChange={setterFor('meCardName')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Phone" type="tel" autoComplete="tel" value={fields.meCardPhone} onChange={setterFor('meCardPhone')} />
            <TextField label="Email" type="email" autoComplete="email" spellCheck={false} value={fields.meCardEmail} onChange={setterFor('meCardEmail')} />
          </div>
          <TextField label="Website" type="url" spellCheck={false} placeholder="https://…" value={fields.meCardUrl} onChange={setterFor('meCardUrl')} />
        </>
      )
    case 'location':
      return <Location fields={fields} setField={setField} />
    case 'event':
      return (
        <>
          <TextField label="Title" required value={fields.eventTitle} onChange={setterFor('eventTitle')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Starts" required type="datetime-local" value={fields.eventStart} onChange={setterFor('eventStart')} />
            <TextField label="Ends" type="datetime-local" value={fields.eventEnd} onChange={setterFor('eventEnd')} />
          </div>
          <TextField label="Location" value={fields.eventPlace} onChange={setterFor('eventPlace')} />
          <AreaField label="Notes" value={fields.eventNote} onChange={setterFor('eventNote')} />
        </>
      )
    case 'whatsapp':
      return (
        <>
          <TextField
            label="Number"
            required
            className="font-mono tabular-nums"
            inputMode="numeric"
            spellCheck={false}
            placeholder="15551234567"
            description="Country code first."
            value={fields.waPhone}
            onChange={setterFor('waPhone')}
          />
          <AreaField label="Prefilled message" value={fields.waMessage} onChange={setterFor('waMessage')} />
        </>
      )
    case 'upi':
      return (
        <>
          <TextField
            label="UPI ID"
            required
            className="font-mono"
            autoComplete="off"
            spellCheck={false}
            placeholder="merchant@okaxis"
            value={fields.upiVpa}
            onChange={setterFor('upiVpa')}
          />
          <TextField label="Payee name" value={fields.upiName} onChange={setterFor('upiName')} />
          <TextField
            label="Amount"
            className="font-mono tabular-nums"
            inputMode="decimal"
            value={fields.upiAmount}
            onChange={setterFor('upiAmount')}
          />
        </>
      )
    case 'crypto':
      return (
        <>
          <TextField label="Bitcoin address" required className="font-mono" autoComplete="off" spellCheck={false} value={fields.cryptoAddress} onChange={setterFor('cryptoAddress')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Amount" className="font-mono tabular-nums" inputMode="decimal" placeholder="0.001" value={fields.cryptoAmount} onChange={setterFor('cryptoAmount')} />
            <TextField label="Label" value={fields.cryptoLabel} onChange={setterFor('cryptoLabel')} />
          </div>
        </>
      )
    case 'zoom':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Meeting ID"
            required
            className="font-mono tabular-nums"
            inputMode="numeric"
            spellCheck={false}
            placeholder="123 456 7890"
            value={fields.zoomId}
            onChange={setterFor('zoomId')}
          />
          <TextField label="Passcode" autoComplete="off" value={fields.zoomPwd} onChange={setterFor('zoomPwd')} />
        </div>
      )
    default:
      return null
  }
}

interface ContentProps {
  fields: QrFields
  setField: SetField
  capMessage: string | null
}

// Content panel: QR type picker plus the per-kind form.
export function Content({ fields, setField, capMessage }: ContentProps) {
  return (
    <FieldGroup className="gap-6">
      <FieldSet aria-describedby={capMessage ? 'qr-type-cap' : undefined}>
        <FieldLegend variant="label">QR type</FieldLegend>
        <Choice
          label="QR type"
          value={fields.kind}
          onChange={(picked) => setField('kind', picked)}
          options={kindChoices}
          className="grid grid-cols-3 gap-2 sm:grid-cols-5 xl:grid-cols-7"
          itemClassName="h-auto min-h-12 flex-col gap-1.5 border-2 px-1 py-2.5 text-xs font-semibold"
        />
      </FieldSet>

      <FieldDescription id="qr-type-cap" className="sr-only">
        Capacity warnings appear here when the payload exceeds the selected error-correction level.
      </FieldDescription>
      {capMessage ? <CapMessage message={capMessage} /> : null}

      <FieldGroup className="gap-4">
        <KindFields fields={fields} setField={setField} />
      </FieldGroup>
    </FieldGroup>
  )
}
