import type { CornerInner, CornerOuter, DotType, EcLevel, QrFields, QrKind } from '@/types'

// QR kind picker entries: [value, label].
export const kindOptions: [QrKind, string][] = [
  ['link', 'Link'],
  ['text', 'Text'],
  ['wifi', 'WiFi'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['sms', 'SMS'],
  ['contact', 'Contact'],
  ['mecard', 'MeCard'],
  ['location', 'Location'],
  ['event', 'Event'],
  ['whatsapp', 'WhatsApp'],
  ['upi', 'UPI'],
  ['crypto', 'Bitcoin'],
  ['zoom', 'Zoom'],
]

// WiFi auth choices: [value, label].
export const wifiAuthOptions: [QrFields['wifiEnc'], string][] = [
  ['WPA', 'WPA'],
  ['WPA2', 'WPA2'],
  ['WEP', 'WEP'],
  ['nopass', 'None'],
]

// Value is etiket EC letter; label is user-facing.
export const qrEcOptions: [EcLevel, string][] = [
  ['L', 'Low (~7%)'],
  ['M', 'Medium (~15%)'],
  ['Q', 'Quartile (~25%)'],
  ['H', 'High (~30%)'],
]

// Dot module shapes: [value, label].
export const qrDotTypeOptions: [DotType, string][] = [
  ['square', 'Square'],
  ['rounded', 'Rounded'],
  ['dots', 'Dots'],
  ['diamond', 'Diamond'],
  ['vertical-line', 'V line'],
  ['horizontal-line', 'H line'],
  ['small-square', 'Sm sq'],
]

// Finder-frame shapes: [value, label].
export const qrCornerOuterOptions: [CornerOuter, string][] = [
  ['square', 'Square'],
  ['dots', 'Dots'],
  ['classy', 'Classy'],
]

// Finder-core shapes: [value, label].
export const qrCornerInnerOptions: [CornerInner, string][] = [
  ['square', 'Square'],
  ['dots', 'Dots'],
  ['rounded', 'Rounded'],
]

// Defaults for every QR kind plus all style fields.
export const initialFields: QrFields = {
  kind: 'link',
  url: '',
  text: '',
  wifiSsid: '',
  wifiPass: '',
  wifiEnc: 'WPA',
  wifiHidden: false,
  phone: '',
  mailTo: '',
  mailSubject: '',
  mailBody: '',
  smsTo: '',
  smsBody: '',
  cardName: '',
  cardPhone: '',
  cardEmail: '',
  cardOrg: '',
  lat: '',
  lng: '',
  geoLabel: '',
  eventTitle: '',
  eventStart: '',
  eventEnd: '',
  eventPlace: '',
  eventNote: '',

  qrSize: 320,
  qrEcLevel: 'M',
  qrDotType: 'square',
  qrDotSize: 1,
  qrFg: '#111827',
  qrBg: '#ffffff',
  qrCornerOuter: 'square',
  qrCornerInner: 'square',
  qrCornerOuterColor: '#111827',
  qrCornerInnerColor: '#111827',
  qrLogoUrl: '',
  qrLogoDataUrl: '',
  qrLogoSize: 0.28,

  qrFgStyle: 'solid',
  qrFgColor2: '#4d4d4d',
  qrFgAngle: 45,

  qrBgStyle: 'solid',
  qrBgColor2: '#e5e7eb',
  qrBgAngle: 135,

  meCardName: '',
  meCardPhone: '',
  meCardEmail: '',
  meCardUrl: '',

  waPhone: '',
  waMessage: '',

  upiVpa: '',
  upiName: '',
  upiAmount: '',

  cryptoAddress: '',
  cryptoAmount: '',
  cryptoLabel: '',

  zoomId: '',
  zoomPwd: '',
}
