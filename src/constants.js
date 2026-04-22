export const options = [
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

export const wifiEncOptions = [
  ['WPA', 'WPA'],
  ['WPA2', 'WPA2'],
  ['WEP', 'WEP'],
  ['nopass', 'None'],
]

/** Preset keys → merged into QR style fields when chosen (see App). */
export const qrVariantPresets = {
  classic: { qrDotType: 'square', qrCornerOuter: 'square', qrCornerInner: 'square' },
  rounded: { qrDotType: 'rounded', qrCornerOuter: 'rounded', qrCornerInner: 'rounded' },
  dots: { qrDotType: 'dots', qrCornerOuter: 'dots', qrCornerInner: 'dots' },
  classy: { qrDotType: 'classy', qrCornerOuter: 'classy', qrCornerInner: 'square' },
}

export const qrVariantOptions = [
  ['classic', 'Classic'],
  ['rounded', 'Rounded'],
  ['dots', 'Dots'],
  ['classy', 'Classy'],
  ['custom', 'Custom'],
]

/** Value is etiket EC letter; label is user-facing. */
export const qrEcOptions = [
  ['L', 'Low (~7%)'],
  ['M', 'Medium (~15%)'],
  ['Q', 'Quartile (~25%)'],
  ['H', 'High (~30%)'],
]

export const qrDotTypeOptions = [
  ['square', 'Square'],
  ['rounded', 'Rounded'],
  ['dots', 'Dots'],
  ['diamond', 'Diamond'],
  ['classy', 'Classy'],
  ['classy-rounded', 'Classy R.'],
  ['extra-rounded', 'Extra R.'],
  ['vertical-line', 'V line'],
  ['horizontal-line', 'H line'],
  ['small-square', 'Sm sq'],
  ['tiny-square', 'Tiny sq'],
]

export const qrCornerOuterOptions = [
  ['square', 'Square'],
  ['rounded', 'Rounded'],
  ['dots', 'Dots'],
  ['extra-rounded', 'Extra R.'],
  ['classy', 'Classy'],
]

export const qrCornerInnerOptions = [
  ['square', 'Square'],
  ['dots', 'Dots'],
  ['rounded', 'Rounded'],
]

export const initialFields = {
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
  qrMargin: 4,
  qrEcLevel: 'M',
  qrVariant: 'classic',
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
  /** Logo size as fraction of QR (etiket 0.1–0.5). */
  qrLogoSize: 0.28,

  /** solid | linear | radial */
  qrFgStyle: 'solid',
  qrFgColor2: '#6366f1',
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
  /** When true, show bundled UPI mark unless a custom logo is set. */
  upiUseDefaultLogo: true,

  cryptoAddress: '',
  cryptoAmount: '',
  cryptoLabel: '',

  zoomId: '',
  zoomPwd: '',
}
