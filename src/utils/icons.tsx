import type { ComponentType, SVGProps } from 'react'
import {
  Bitcoin,
  CalendarDays,
  Contact,
  IdCard,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Type,
  Wifi,
} from 'lucide-react'
import type { QrKind } from '@/types'

// Brand glyphs lucide doesn't ship; monochrome so they inherit currentColor.
function WhatsApp(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...svgProps}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
    </svg>
  )
}

// UPI mark cropped from official artwork; geometry stays exact.
function UpiIcon(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="688 -4 164 232" fill="currentColor" {...svgProps}>
      <polygon points="793.05 0.4 849.04 111.77 731.3 223.14" />
      <polygon points="753.71 0.4 809.7 111.77 691.87 223.14" opacity="0.5" />
    </svg>
  )
}

// Zoom mark; monochrome like the rest.
function Zoom(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...svgProps}>
      <path d="M3 8.25A2.25 2.25 0 0 1 5.25 6h6.5A2.25 2.25 0 0 1 14 8.25v7.5A2.25 2.25 0 0 1 11.75 18h-6.5A2.25 2.25 0 0 1 3 15.75zM20.4 7.2a1 1 0 0 1 1.6.8v8a1 1 0 0 1-1.6.8L15.5 13.2v-2.4z" />
    </svg>
  )
}

// GitHub mark for the header link.
export function GitHub(svgProps: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...svgProps}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  )
}

// Icon component per QR kind, keyed to kindOptions.
export const kindIcons: Record<QrKind, ComponentType<SVGProps<SVGSVGElement>>> = {
  link: LinkIcon,
  text: Type,
  wifi: Wifi,
  phone: Phone,
  email: Mail,
  sms: MessageSquare,
  contact: Contact,
  mecard: IdCard,
  location: MapPin,
  event: CalendarDays,
  whatsapp: WhatsApp,
  upi: UpiIcon,
  crypto: Bitcoin,
  zoom: Zoom,
}
