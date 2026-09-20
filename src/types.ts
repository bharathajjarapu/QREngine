// Shared QR studio types; single source for fields, payloads, and themes.
export type QrKind =
  | 'link' | 'text' | 'wifi' | 'phone' | 'email' | 'sms'
  | 'contact' | 'mecard' | 'location' | 'event'
  | 'whatsapp' | 'upi' | 'crypto' | 'zoom'

export type EcLevel = 'L' | 'M' | 'Q' | 'H'
export type FillStyle = 'solid' | 'linear' | 'radial'
export type BgStyle = FillStyle | 'transparent'
export type DotType = 'square' | 'rounded' | 'dots' | 'diamond' | 'vertical-line' | 'horizontal-line' | 'small-square'
export type CornerOuter = 'square' | 'dots' | 'classy'
export type CornerInner = 'square' | 'dots' | 'rounded'
export type Theme = 'light' | 'dark'

export interface QrFields {
  kind: QrKind
  url: string
  text: string
  wifiSsid: string
  wifiPass: string
  wifiEnc: 'WPA' | 'WPA2' | 'WEP' | 'nopass'
  wifiHidden: boolean
  phone: string
  mailTo: string
  mailSubject: string
  mailBody: string
  smsTo: string
  smsBody: string
  cardName: string
  cardPhone: string
  cardEmail: string
  cardOrg: string
  lat: string
  lng: string
  geoLabel: string
  eventTitle: string
  eventStart: string
  eventEnd: string
  eventPlace: string
  eventNote: string
  qrSize: number
  qrEcLevel: EcLevel
  qrDotType: DotType
  qrDotSize: number
  qrFg: string
  qrBg: string
  qrCornerOuter: CornerOuter
  qrCornerInner: CornerInner
  qrCornerOuterColor: string
  qrCornerInnerColor: string
  qrLogoUrl: string
  qrLogoDataUrl: string
  qrLogoSize: number
  qrFgStyle: FillStyle
  qrFgColor2: string
  qrFgAngle: number
  qrBgStyle: BgStyle
  qrBgColor2: string
  qrBgAngle: number
  meCardName: string
  meCardPhone: string
  meCardEmail: string
  meCardUrl: string
  waPhone: string
  waMessage: string
  upiVpa: string
  upiName: string
  upiAmount: string
  cryptoAddress: string
  cryptoAmount: string
  cryptoLabel: string
  zoomId: string
  zoomPwd: string
}

// Typed single-field setter for form inputs.
export type SetField = <K extends keyof QrFields>(key: K, value: QrFields[K]) => void
export type SetFields = React.Dispatch<React.SetStateAction<QrFields>>

// Discriminated payload result: ok carries text, failure carries msg.
export type PayloadResult = { ok: true; text: string } | { ok: false; text: string; msg: string }
