/**
 * Builds plain QR payload strings for `etiket/qr` `qrcode(text, opts)`.
 * The `etiket` package also exports `wifi`, `url`, `email`, etc. that return a full SVG string;
 * those are not used here because this app renders one pipeline: payload text + shared style options.
 */
/** Escape WIFI QR field values (semicolons, colons, backslashes, quotes). */
function escapeWifi(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/"/g, '\\"')
}

/** MeCard field escaping (semicolons and colons break the record). */
function escapeMecard(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:')
}

/** vCard 3.0 text escaping for structured values. */
function escapeVcard(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

/** iCalendar text escaping (RFC 5545). */
function escapeIcs(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

function digitsOnly(s) {
  return String(s || '').replace(/\D/g, '')
}

function isEmail(s) {
  const t = String(s || '').trim()
  return t.length > 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

function inRange(n, lo, hi) {
  const x = parseFloat(n)
  return !Number.isNaN(x) && x >= lo && x <= hi
}

function icsDateTime(s) {
  const t = String(s || '').trim()
  if (!t) return ''
  const m = t.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/)
  if (!m) return ''
  const sec = (m[6] || '00').padStart(2, '0')
  return `${m[1]}${m[2]}${m[3]}T${m[4]}${m[5]}${sec}`
}

/** @returns {{ text: string, ok: boolean, msg?: string }} */
export function buildPayload(fields) {
  const k = fields.kind

  if (k === 'link') {
    const u = String(fields.url || '').trim()
    if (!u) return { text: '', ok: false, msg: 'Enter a URL or domain.' }
    const href = /^https?:\/\//i.test(u) ? u : `https://${u}`
    try {
      new URL(href)
      return { text: href, ok: true }
    } catch {
      return { text: '', ok: false, msg: 'Use a valid URL (e.g. example.com).' }
    }
  }

  if (k === 'text') {
    const t = String(fields.text || '').trim()
    return t ? { text: t, ok: true } : { text: '', ok: false, msg: 'Enter some text to encode.' }
  }

  if (k === 'wifi') {
    const ssid = String(fields.wifiSsid || '').trim()
    if (!ssid) return { text: '', ok: false, msg: 'Enter a network name (SSID).' }
    const enc =
      fields.wifiEnc === 'nopass' ? 'nopass' : fields.wifiEnc === 'WEP' ? 'WEP' : fields.wifiEnc === 'WPA2' ? 'WPA2' : 'WPA'
    const password = enc === 'nopass' ? '' : String(fields.wifiPass || '')
    if (enc !== 'nopass' && !password.trim()) return { text: '', ok: false, msg: 'Add password or choose None.' }
    const hidden = fields.wifiHidden ? 'true' : 'false'
    return {
      text: `WIFI:T:${enc};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${hidden};;`,
      ok: true,
    }
  }

  if (k === 'phone') {
    const raw = String(fields.phone || '').trim()
    const d = digitsOnly(raw)
    if (!raw) return { text: '', ok: false, msg: 'Enter a phone number.' }
    if (d.length < 7) return { text: '', ok: false, msg: 'Enter at least 7 digits.' }
    const clean = raw.replace(/[^\d+]/g, '')
    const text = clean.startsWith('+') ? `tel:${clean}` : `tel:+${d}`
    return { text, ok: true }
  }

  if (k === 'email') {
    const to = String(fields.mailTo || '').trim()
    if (!to) return { text: '', ok: false, msg: 'Enter an email address.' }
    if (!isEmail(fields.mailTo)) return { text: '', ok: false, msg: 'Enter a valid email address.' }
    const m = String(fields.mailTo || '').trim()
    const q = new URLSearchParams()
    const sub = String(fields.mailSubject || '').trim()
    const body = String(fields.mailBody || '').trim()
    if (sub) q.set('subject', sub)
    if (body) q.set('body', body)
    const qs = q.toString()
    return { text: qs ? `mailto:${m}?${qs}` : `mailto:${m}`, ok: true }
  }

  if (k === 'sms') {
    const raw = String(fields.smsTo || '').trim()
    const d = digitsOnly(raw)
    if (!raw) return { text: '', ok: false, msg: 'Enter a phone number.' }
    if (d.length < 7) return { text: '', ok: false, msg: 'Enter at least 7 digits.' }
    const clean = raw.replace(/[^\d+]/g, '')
    const addr = clean.startsWith('+') ? clean : `+${d}`
    const msg = String(fields.smsBody || '').trim()
    const text = msg ? `sms:${addr}?body=${encodeURIComponent(msg)}` : `sms:${addr}`
    return { text, ok: true }
  }

  if (k === 'mecard') {
    const name = String(fields.meCardName || '').trim()
    const tel = String(fields.meCardPhone || '').trim()
    const em = String(fields.meCardEmail || '').trim()
    const url = String(fields.meCardUrl || '').trim()
    if (!name) return { text: '', ok: false, msg: 'Enter a display name for MeCard.' }
    if (!tel && !em && !url) {
      return { text: '', ok: false, msg: 'Add at least a phone, email, or URL for MeCard.' }
    }
    let t = 'MECARD:'
    t += `N:${escapeMecard(name)};`
    if (tel) t += `TEL:${escapeMecard(tel)};`
    if (em) t += `EMAIL:${escapeMecard(em)};`
    if (url) t += `URL:${escapeMecard(url)};`
    t += ';'
    return { text: t, ok: true }
  }

  if (k === 'contact') {
    const name = String(fields.cardName || '').trim()
    const tel = String(fields.cardPhone || '').trim()
    const em = String(fields.cardEmail || '').trim()
    const org = String(fields.cardOrg || '').trim()
    if (!name && !tel && !em) {
      if (org) return { text: '', ok: false, msg: 'Add at least a name, phone, or email (organization alone is not enough).' }
      return { text: '', ok: false, msg: 'Add at least a name, phone, or email.' }
    }
    const lines = ['BEGIN:VCARD', 'VERSION:3.0']
    if (name) lines.push(`FN:${escapeVcard(name.replace(/\n/g, ' '))}`)
    if (tel) lines.push(`TEL:${escapeVcard(tel)}`)
    if (em) lines.push(`EMAIL:${escapeVcard(em)}`)
    if (org) lines.push(`ORG:${escapeVcard(org.replace(/\n/g, ' '))}`)
    lines.push('END:VCARD')
    return { text: lines.join('\n'), ok: true }
  }

  if (k === 'location') {
    const latS = String(fields.lat ?? '').trim()
    const lngS = String(fields.lng ?? '').trim()
    if (!latS || !lngS) return { text: '', ok: false, msg: 'Enter latitude and longitude, or pick a point on the map.' }
    if (!inRange(fields.lat, -90, 90) || !inRange(fields.lng, -180, 180)) {
      return { text: '', ok: false, msg: 'Use latitude −90–90 and longitude −180–180.' }
    }
    const la = parseFloat(fields.lat)
    const lo = parseFloat(fields.lng)
    const lb = String(fields.geoLabel || '').trim()
    const text = lb ? `geo:${la},${lo}?q=${encodeURIComponent(lb)}` : `geo:${la},${lo}`
    return { text, ok: true }
  }

  if (k === 'whatsapp') {
    const raw = String(fields.waPhone || '').trim()
    const d = digitsOnly(raw)
    if (!raw) return { text: '', ok: false, msg: 'Enter a WhatsApp number (with country code).' }
    if (d.length < 10) return { text: '', ok: false, msg: 'Use full number with country code (no + in field ok).' }
    const msg = String(fields.waMessage || '').trim()
    const path = `https://wa.me/${d}`
    const text = msg ? `${path}?text=${encodeURIComponent(msg)}` : path
    return { text, ok: true }
  }

  if (k === 'upi') {
    const pa = String(fields.upiVpa || '').trim()
    const pn = String(fields.upiName || '').trim()
    const amRaw = String(fields.upiAmount || '').trim()
    if (!pa) return { text: '', ok: false, msg: 'Enter UPI ID (VPA), e.g. name@paytm.' }
    if (!/^[\w.\-]{1,128}@[\w.\-]{1,64}$/i.test(pa)) {
      return { text: '', ok: false, msg: 'UPI ID should look like username@bankhandle.' }
    }
    if (!pn) return { text: '', ok: false, msg: 'Enter payee name as it should appear in the app.' }
    if (amRaw && !/^\d+(\.\d{1,2})?$/.test(amRaw)) {
      return { text: '', ok: false, msg: 'Amount must be a number with up to 2 decimals (e.g. 100 or 50.25), or leave empty.' }
    }
    const q = new URLSearchParams()
    q.set('pa', pa)
    q.set('pn', pn)
    q.set('cu', 'INR')
    if (amRaw) q.set('am', amRaw)
    return { text: `upi://pay?${q.toString()}`, ok: true }
  }

  if (k === 'crypto') {
    const addr = String(fields.cryptoAddress || '').trim()
    if (!addr) return { text: '', ok: false, msg: 'Enter a Bitcoin address.' }
    const amount = String(fields.cryptoAmount || '').trim()
    const label = String(fields.cryptoLabel || '').trim()
    const q = new URLSearchParams()
    if (amount) q.set('amount', amount)
    if (label) q.set('label', label)
    const qs = q.toString()
    return { text: qs ? `bitcoin:${addr}?${qs}` : `bitcoin:${addr}`, ok: true }
  }

  if (k === 'zoom') {
    const id = digitsOnly(String(fields.zoomId || ''))
    if (!id || id.length < 9) return { text: '', ok: false, msg: 'Enter a Zoom meeting ID (9–11 digits).' }
    const pwd = String(fields.zoomPwd || '').trim()
    const base = `https://zoom.us/j/${id}`
    const text = pwd ? `${base}?pwd=${encodeURIComponent(pwd)}` : base
    return { text, ok: true }
  }

  if (k === 'event') {
    const title = String(fields.eventTitle || '').trim()
    const st = icsDateTime(fields.eventStart)
    if (!title && !fields.eventStart) return { text: '', ok: false, msg: 'Enter a title and start time.' }
    if (!title) return { text: '', ok: false, msg: 'Enter event title.' }
    if (!st) return { text: '', ok: false, msg: 'Pick start date and time.' }
    let en = icsDateTime(fields.eventEnd)
    if (!en) {
      const y = parseInt(st.slice(0, 4), 10)
      const mo = parseInt(st.slice(4, 6), 10) - 1
      const da = parseInt(st.slice(6, 8), 10)
      const hh = parseInt(st.slice(9, 11), 10)
      const mm = parseInt(st.slice(11, 13), 10)
      const ss = parseInt(st.slice(13, 15), 10) || 0
      const dt = new Date(y, mo, da, hh, mm + 60, ss)
      en =
        String(dt.getFullYear()) +
        String(dt.getMonth() + 1).padStart(2, '0') +
        String(dt.getDate()).padStart(2, '0') +
        'T' +
        String(dt.getHours()).padStart(2, '0') +
        String(dt.getMinutes()).padStart(2, '0') +
        String(dt.getSeconds()).padStart(2, '0')
    } else if (en <= st) {
      return { text: '', ok: false, msg: 'End time must be after start.' }
    }
    const place = String(fields.eventPlace || '').trim()
    const desc = String(fields.eventNote || '').trim()
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QR//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${escapeIcs(title.replace(/\n/g, ' '))}`,
      `DTSTART:${st}`,
      `DTEND:${en}`,
    ]
    if (place) lines.push(`LOCATION:${escapeIcs(place.replace(/\n/g, ' '))}`)
    if (desc) lines.push(`DESCRIPTION:${escapeIcs(desc.replace(/\n/g, ' '))}`)
    lines.push('END:VEVENT', 'END:VCALENDAR')
    return { text: lines.join('\n'), ok: true }
  }

  return { text: '', ok: false, msg: 'Unknown payload type.' }
}
