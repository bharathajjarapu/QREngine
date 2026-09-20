import { optimizeSVG, svgToDataURI } from 'etiket'
import { qrcode } from 'etiket/qr'
import type { ErrorCorrectionLevel, QRCodeOptions, QRCodeSVGOptions } from 'etiket/qr'
import type { QrFields } from '@/types'

// Preview render width cap; full export uses the real size.
export const previewCap = 420

// Clamps a number into the given range.
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

// Coerces locale-comma decimals and falls back on garbage.
function toNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : fallback
}

// Validates a hex color, else the fallback.
function toHex(value: unknown, fallback: string): string {
  const text = String(value || '').trim()
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(text)) return text
  return fallback
}

// Builds a solid or gradient paint for modules or page.
function buildPaint(fields: QrFields, side: 'fg' | 'bg'): QRCodeSVGOptions['color'] {
  const isBg = side === 'bg'
  const rawBg = String(fields.qrBg || '').trim()
  if (isBg && (rawBg === 'transparent' || fields.qrBgStyle === 'transparent')) return 'transparent'
  const style = isBg ? String(fields.qrBgStyle || 'solid') : String(fields.qrFgStyle || 'solid')
  const first = toHex(isBg ? fields.qrBg : fields.qrFg, isBg ? '#ffffff' : '#111827')
  const second = toHex(isBg ? fields.qrBgColor2 : fields.qrFgColor2, first)
  const angle = clamp(toNumber(isBg ? fields.qrBgAngle : fields.qrFgAngle, isBg ? 135 : 45), 0, 360)
  if (style === 'linear') return { type: 'linear', rotation: angle, stops: [{ offset: 0, color: first }, { offset: 1, color: second }] }
  if (style === 'radial') return { type: 'radial', stops: [{ offset: 0, color: first }, { offset: 1, color: second }] }
  return first
}

// Assembles shared etiket options from style fields.
export function svgOptions(fields: QrFields, cap?: number): QRCodeSVGOptions & QRCodeOptions {
  let size = clamp(Math.round(toNumber(fields.qrSize, 320)), 64, 1024)
  if (cap != null && Number.isFinite(cap)) size = Math.min(size, clamp(Math.round(cap), 64, 1024))
  const margin = 4
  const dotSize = clamp(toNumber(fields.qrDotSize, 1), 0.1, 1)
  const color = buildPaint(fields, 'fg')
  const background = buildPaint(fields, 'bg')
  const fgFallback = typeof color === 'string' ? color : '#111827'
  const outerColor = toHex(fields.qrCornerOuterColor, fgFallback)
  const innerColor = toHex(fields.qrCornerInnerColor, fgFallback)
  const dataUrl = String(fields.qrLogoDataUrl || '').trim()
  const logoUrl = String(fields.qrLogoUrl || '').trim()
  const imageUrl = dataUrl || logoUrl || undefined
  const hasLogo = !!imageUrl
  const isUpi = fields.kind === 'upi'
  const ecLevel: ErrorCorrectionLevel = hasLogo ? 'H' : fields.qrEcLevel
  const corners = {
    topLeft: { outerShape: fields.qrCornerOuter, innerShape: fields.qrCornerInner, outerColor, innerColor },
    topRight: { outerShape: fields.qrCornerOuter, innerShape: fields.qrCornerInner, outerColor, innerColor },
    bottomLeft: { outerShape: fields.qrCornerOuter, innerShape: fields.qrCornerInner, outerColor, innerColor },
  }

  const opts: QRCodeSVGOptions & QRCodeOptions = {
    size,
    margin,
    ecLevel,
    shape: 'square',
    dotType: fields.qrDotType,
    dotSize,
    color,
    background,
    corners,
  }

  if (hasLogo) {
    const logoSize = clamp(toNumber(fields.qrLogoSize, isUpi ? 0.32 : 0.28), 0.1, 0.5)
    opts.logo = {
      imageUrl,
      size: logoSize,
      margin: isUpi ? 8 : 10,
      hideBackgroundDots: true,
      backgroundColor: typeof background === 'string' && background !== 'transparent' ? background : '#ffffff',
    }
  }

  return opts
}

// Renders styled SVG markup for the given payload.
export function toSvg(text: string, fields: QrFields, cap?: number): string {
  return optimizeSVG(qrcode(text, svgOptions(fields, cap)))
}

// Saves a blob via a temp anchor link.
function saveBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: name })
  link.click()
  URL.revokeObjectURL(url)
}

// Saves SVG markup as a file download.
export function downloadSvg(svgText: string, name = 'qr.svg'): void {
  saveBlob(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }), name)
}

// Renders SVG markup to PNG and saves it.
export async function downloadPngFromSvg(svgText: string, name = 'qr.png', scale = 2): Promise<void> {
  const uri = svgToDataURI(svgText)
  const img = new Image()
  img.decoding = 'async'
  img.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Could not load QR SVG for PNG export.'))
    img.src = uri
  })
  const width = img.naturalWidth || img.width
  const height = img.naturalHeight || img.height
  const factor = clamp(scale, 1, 4)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * factor)
  canvas.height = Math.round(height * factor)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not available.')
  if (factor !== 1) ctx.scale(factor, factor)
  ctx.drawImage(img, 0, 0, width, height)
  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((found) => resolve(found || new Blob()), 'image/png'))
  saveBlob(blob, name)
}

// Copies text via clipboard API with a legacy fallback.
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through */
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.left = '-9999px'
    document.body.appendChild(area)
    area.select()
    const done = document.execCommand('copy')
    document.body.removeChild(area)
    return done
  } catch {
    return false
  }
}
