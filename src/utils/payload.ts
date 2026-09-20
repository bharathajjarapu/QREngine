import type { PayloadResult, QrFields } from '@/types'

// Builds plain QR payload strings for the shared style pipeline.
function escapeWifi(value: unknown): string {
  return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/"/g, '\\"')
}

// MeCard field escaping (semicolons and colons break the record).
function escapeMecard(value: unknown): string {
  return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:')
}

// vCard 3.0 text escaping for structured values.
function escapeVcard(value: unknown): string {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

// iCalendar text escaping (RFC 5545).
function escapeIcs(value: unknown): string {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

// Digits only, for phone-like fields.
function digitsOnly(value: unknown): string {
  return String(value || '').replace(/\D/g, '')
}

// Minimal email sanity check.
function isEmail(value: unknown): boolean {
  const text = String(value || '').trim()
  return text.length > 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
}

interface Phone {
  raw: string
  digits: string
  clean: string
}

// Normalized phone triplet: raw input, digits, and tel-safe form.
function phone(value: unknown): Phone {
  const raw = String(value || '').trim()
  const digits = digitsOnly(raw)
  const clean = raw.replace(/[^\d+]/g, '')
  return { raw, digits, clean }
}

// tel: link from a normalized phone; null when too short.
function telLink(found: Phone, min = 7): string | null {
  if (!found.raw) return null
  if (found.digits.length < min) return null
  return found.clean.startsWith('+') ? `tel:${found.clean}` : `tel:+${found.digits}`
}

// Numeric range check for coordinate strings.
function inRange(value: unknown, min: number, max: number): boolean {
  const parsed = parseFloat(String(value))
  return !Number.isNaN(parsed) && parsed >= min && parsed <= max
}

// datetime-local input to compact iCalendar timestamp.
function icsDateTime(value: unknown): string {
  const text = String(value || '').trim()
  if (!text) return ''
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/)
  if (!match) return ''
  const sec = (match[6] || '00').padStart(2, '0')
  return `${match[1]}${match[2]}${match[3]}T${match[4]}${match[5]}${sec}`
}

// One builder per QR kind; returns text plus ok/msg for the form.
export function buildPayload(fields: QrFields): PayloadResult {
  const kind = fields.kind

  if (kind === 'link') {
    const raw = String(fields.url || '').trim()
    if (!raw) return { text: '', ok: false, msg: 'Enter a URL or domain.' }
    const href = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    try {
      new URL(href)
      return { text: href, ok: true }
    } catch {
      return { text: '', ok: false, msg: 'Use a valid URL (e.g. example.com).' }
    }
  }

  if (kind === 'text') {
    const text = String(fields.text || '').trim()
    return text ? { text, ok: true } : { text: '', ok: false, msg: 'Enter some text to encode.' }
  }

  if (kind === 'wifi') {
    const ssid = String(fields.wifiSsid || '').trim()
    if (!ssid) return { text: '', ok: false, msg: 'Enter a network name (SSID).' }
    const encoding =
      fields.wifiEnc === 'nopass' ? 'nopass' : fields.wifiEnc === 'WEP' ? 'WEP' : fields.wifiEnc === 'WPA2' ? 'WPA2' : 'WPA'
    const password = encoding === 'nopass' ? '' : String(fields.wifiPass || '')
    if (encoding !== 'nopass' && !password.trim()) return { text: '', ok: false, msg: 'Add password or choose None.' }
    const hidden = fields.wifiHidden ? 'true' : 'false'
    return {
      text: `WIFI:T:${encoding};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${hidden};;`,
      ok: true,
    }
  }

  if (kind === 'phone') {
    const found = phone(fields.phone)
    if (!found.raw) return { text: '', ok: false, msg: 'Enter a phone number.' }
    const text = telLink(found)
    if (!text) return { text: '', ok: false, msg: 'Enter at least 7 digits.' }
    return { text, ok: true }
  }

  if (kind === 'email') {
    const to = String(fields.mailTo || '').trim()
    if (!to) return { text: '', ok: false, msg: 'Enter an email address.' }
    if (!isEmail(fields.mailTo)) return { text: '', ok: false, msg: 'Enter a valid email address.' }
    const params = new URLSearchParams()
    const subject = String(fields.mailSubject || '').trim()
    const body = String(fields.mailBody || '').trim()
    if (subject) params.set('subject', subject)
    if (body) params.set('body', body)
    const query = params.toString()
    return { text: query ? `mailto:${to}?${query}` : `mailto:${to}`, ok: true }
  }

  if (kind === 'sms') {
    const found = phone(fields.smsTo)
    if (!found.raw) return { text: '', ok: false, msg: 'Enter a phone number.' }
    if (found.digits.length < 7) return { text: '', ok: false, msg: 'Enter at least 7 digits.' }
    const addr = found.clean.startsWith('+') ? found.clean : `+${found.digits}`
    const message = String(fields.smsBody || '').trim()
    const text = message ? `sms:${addr}?body=${encodeURIComponent(message)}` : `sms:${addr}`
    return { text, ok: true }
  }

  if (kind === 'mecard') {
    const name = String(fields.meCardName || '').trim()
    const tel = String(fields.meCardPhone || '').trim()
    const email = String(fields.meCardEmail || '').trim()
    const site = String(fields.meCardUrl || '').trim()
    if (!name) return { text: '', ok: false, msg: 'Enter a display name for MeCard.' }
    if (!tel && !email && !site) {
      return { text: '', ok: false, msg: 'Add at least a phone, email, or URL for MeCard.' }
    }
    let text = 'MECARD:'
    text += `N:${escapeMecard(name)};`
    if (tel) text += `TEL:${escapeMecard(tel)};`
    if (email) text += `EMAIL:${escapeMecard(email)};`
    if (site) text += `URL:${escapeMecard(site)};`
    text += ';'
    return { text, ok: true }
  }

  if (kind === 'contact') {
    const name = String(fields.cardName || '').trim()
    const tel = String(fields.cardPhone || '').trim()
    const email = String(fields.cardEmail || '').trim()
    const org = String(fields.cardOrg || '').trim()
    if (!name && !tel && !email) {
      if (org) return { text: '', ok: false, msg: 'Add at least a name, phone, or email (organization alone is not enough).' }
      return { text: '', ok: false, msg: 'Add at least a name, phone, or email.' }
    }
    const lines = ['BEGIN:VCARD', 'VERSION:3.0']
    if (name) lines.push(`FN:${escapeVcard(name.replace(/\n/g, ' '))}`)
    if (tel) lines.push(`TEL:${escapeVcard(tel)}`)
    if (email) lines.push(`EMAIL:${escapeVcard(email)}`)
    if (org) lines.push(`ORG:${escapeVcard(org.replace(/\n/g, ' '))}`)
    lines.push('END:VCARD')
    return { text: lines.join('\n'), ok: true }
  }

  if (kind === 'location') {
    const latRaw = String(fields.lat ?? '').trim()
    const lngRaw = String(fields.lng ?? '').trim()
    if (!latRaw || !lngRaw) return { text: '', ok: false, msg: 'Paste a map link above, or enter latitude and longitude.' }
    if (!inRange(fields.lat, -90, 90) || !inRange(fields.lng, -180, 180)) {
      return { text: '', ok: false, msg: 'Use latitude −90–90 and longitude −180–180.' }
    }
    const lat = parseFloat(fields.lat)
    const lng = parseFloat(fields.lng)
    const label = String(fields.geoLabel || '').trim()
    const text = label ? `geo:${lat},${lng}?q=${encodeURIComponent(label)}` : `geo:${lat},${lng}`
    return { text, ok: true }
  }

  if (kind === 'whatsapp') {
    const raw = String(fields.waPhone || '').trim()
    const digits = digitsOnly(raw)
    if (!raw) return { text: '', ok: false, msg: 'Enter a WhatsApp number (with country code).' }
    if (digits.length < 10) return { text: '', ok: false, msg: 'Use full number with country code (no + in field ok).' }
    const message = String(fields.waMessage || '').trim()
    const path = `https://wa.me/${digits}`
    const text = message ? `${path}?text=${encodeURIComponent(message)}` : path
    return { text, ok: true }
  }

  if (kind === 'upi') {
    const vpa = String(fields.upiVpa || '').trim()
    const name = String(fields.upiName || '').trim()
    const amountRaw = String(fields.upiAmount || '').trim()
    if (!vpa) return { text: '', ok: false, msg: 'Enter UPI ID (VPA), e.g. name@paytm.' }
    if (!/^[\w.\-]{1,128}@[\w.\-]{1,64}$/i.test(vpa)) {
      return { text: '', ok: false, msg: 'UPI ID should look like username@bankhandle.' }
    }
    if (!name) return { text: '', ok: false, msg: 'Enter payee name as it should appear in the app.' }
    if (amountRaw && !/^\d+(\.\d{1,2})?$/.test(amountRaw)) {
      return { text: '', ok: false, msg: 'Amount must be a number with up to 2 decimals (e.g. 100 or 50.25), or leave empty.' }
    }
    const params = new URLSearchParams()
    params.set('pa', vpa)
    params.set('pn', name)
    params.set('cu', 'INR')
    if (amountRaw) params.set('am', amountRaw)
    return { text: `upi://pay?${params.toString()}`, ok: true }
  }

  if (kind === 'crypto') {
    const addr = String(fields.cryptoAddress || '').trim()
    if (!addr) return { text: '', ok: false, msg: 'Enter a Bitcoin address.' }
    const amount = String(fields.cryptoAmount || '').trim()
    const label = String(fields.cryptoLabel || '').trim()
    const params = new URLSearchParams()
    if (amount) params.set('amount', amount)
    if (label) params.set('label', label)
    const query = params.toString()
    return { text: query ? `bitcoin:${addr}?${query}` : `bitcoin:${addr}`, ok: true }
  }

  if (kind === 'zoom') {
    const id = digitsOnly(String(fields.zoomId || ''))
    if (!id || id.length < 9) return { text: '', ok: false, msg: 'Enter a Zoom meeting ID (9–11 digits).' }
    const pwd = String(fields.zoomPwd || '').trim()
    const base = `https://zoom.us/j/${id}`
    const text = pwd ? `${base}?pwd=${encodeURIComponent(pwd)}` : base
    return { text, ok: true }
  }

  if (kind === 'event') {
    const title = String(fields.eventTitle || '').trim()
    const start = icsDateTime(fields.eventStart)
    if (!title && !fields.eventStart) return { text: '', ok: false, msg: 'Enter a title and start time.' }
    if (!title) return { text: '', ok: false, msg: 'Enter event title.' }
    if (!start) return { text: '', ok: false, msg: 'Pick start date and time.' }
    let end = icsDateTime(fields.eventEnd)
    if (!end) {
      const year = parseInt(start.slice(0, 4), 10)
      const month = parseInt(start.slice(4, 6), 10) - 1
      const day = parseInt(start.slice(6, 8), 10)
      const hour = parseInt(start.slice(9, 11), 10)
      const minute = parseInt(start.slice(11, 13), 10)
      const second = parseInt(start.slice(13, 15), 10) || 0
      const date = new Date(year, month, day, hour, minute + 60, second)
      end =
        String(date.getFullYear()) +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0') +
        'T' +
        String(date.getHours()).padStart(2, '0') +
        String(date.getMinutes()).padStart(2, '0') +
        String(date.getSeconds()).padStart(2, '0')
    } else if (end <= start) {
      return { text: '', ok: false, msg: 'End time must be after start.' }
    }
    const place = String(fields.eventPlace || '').trim()
    const note = String(fields.eventNote || '').trim()
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QR//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${escapeIcs(title.replace(/\n/g, ' '))}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
    ]
    if (place) lines.push(`LOCATION:${escapeIcs(place.replace(/\n/g, ' '))}`)
    if (note) lines.push(`DESCRIPTION:${escapeIcs(note.replace(/\n/g, ' '))}`)
    lines.push('END:VEVENT', 'END:VCALENDAR')
    return { text: lines.join('\n'), ok: true }
  }

  return { text: '', ok: false, msg: 'Unknown payload type.' }
}
