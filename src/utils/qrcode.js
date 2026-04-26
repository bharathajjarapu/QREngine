import { optimizeSVG, svgToDataURI } from 'etiket'
import { qrcode } from 'etiket/qr'
import { presetSvgById } from './logos'

/** Max edge length for on-screen preview (export still uses `fields.qrSize`). */
export const previewCap = 420

/** Default wide slot for any preset asset SVG (`src/assets/*.svg`). */
const PRESET_LOGO_LAYOUT = { imageWidth: 2.4, imageHeight: 1 }

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n))
}

function num(v, fallback) {
  const x = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'))
  return Number.isFinite(x) ? x : fallback
}

function hexOk(s, fallback) {
  const t = String(s || '').trim()
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) return t
  return fallback
}

/** @param {'fg'|'bg'} which */
function buildColorPaint(fields, which) {
  const isBg = which === 'bg'
  const bgRaw = String(fields.qrBg || '').trim()
  if (isBg && (bgRaw === 'transparent' || fields.qrBgStyle === 'transparent')) return 'transparent'

  const style = isBg ? String(fields.qrBgStyle || 'solid') : String(fields.qrFgStyle || 'solid')
  const c1 = hexOk(isBg ? fields.qrBg : fields.qrFg, isBg ? '#ffffff' : '#111827')
  const c2 = hexOk(isBg ? fields.qrBgColor2 : fields.qrFgColor2, c1)
  const angle = clamp(num(isBg ? fields.qrBgAngle : fields.qrFgAngle, isBg ? 135 : 45), 0, 360)

  if (style === 'linear') {
    return {
      type: 'linear',
      rotation: angle,
      stops: [
        { offset: 0, color: c1 },
        { offset: 1, color: c2 },
      ],
    }
  }
  if (style === 'radial') {
    return {
      type: 'radial',
      stops: [
        { offset: 0, color: c1 },
        { offset: 1, color: c2 },
      ],
    }
  }
  return c1
}

/** Normalize hex for corner colors (gradients not supported in UI here). */
function colorOrFallback(s, fallback) {
  return hexOk(s, fallback)
}

function logoBgPad(background) {
  return typeof background === 'string' && background !== 'transparent' ? background : '#ffffff'
}

/** Center `logo.svg` in QR (wide slot by default). */
function builtInSvgLogo(svg, background, fields, { sizeFallback = 0.28, imageWidth = 2.5, imageHeight = 1 }) {
  const logoSize = clamp(num(fields.qrLogoSize, sizeFallback), 0.1, 0.45)
  return {
    svg,
    size: logoSize,
    margin: 8,
    hideBackgroundDots: true,
    backgroundColor: logoBgPad(background),
    imageWidth,
    imageHeight,
  }
}

/**
 * Maps app `fields` slice to etiket `qrcode()` options (SVG).
 * @param {Record<string, unknown>} fields
 * @param {number} [cap] optional max edge px (preview); omit for full export size
 */
export function buildQrSvgOptions(fields, cap) {
  let size = clamp(Math.round(num(fields.qrSize, 320)), 64, 1024)
  if (cap != null && Number.isFinite(cap)) size = Math.min(size, clamp(Math.round(cap), 64, 1024))
  const margin = clamp(Math.round(num(fields.qrMargin, 4)), 0, 16)
  const dotSize = clamp(num(fields.qrDotSize, 1), 0.1, 1)
  const color = buildColorPaint(fields, 'fg')
  const background = buildColorPaint(fields, 'bg')

  const fgFallback = typeof color === 'string' ? color : '#111827'
  const outerC = colorOrFallback(fields.qrCornerOuterColor, fgFallback)
  const innerC = colorOrFallback(fields.qrCornerInnerColor, fgFallback)

  const isUpi = fields.kind === 'upi'
  const dataUrl = String(fields.qrLogoDataUrl || '').trim()
  const logoUrl = String(fields.qrLogoUrl || '').trim()
  const imageUrl = dataUrl || logoUrl || undefined
  const hasUserLogo = !!imageUrl
  const presetKey = String(fields.qrPresetLogo || '').trim().toLowerCase()
  const presetSvg = presetSvgById[presetKey]
  const hasPresetLogo = !!presetSvg
  const hasLogo = hasUserLogo || hasPresetLogo

  const ecLevel = hasLogo ? 'H' : String(fields.qrEcLevel || 'M').toUpperCase()
  const dotType = fields.qrDotType || 'square'

  const outerShape = fields.qrCornerOuter || 'square'
  const innerShape = fields.qrCornerInner || 'square'

  const cornerBlock = {
    outerShape,
    innerShape,
    outerColor: outerC,
    innerColor: innerC,
  }

  const opts = {
    size,
    margin,
    ecLevel,
    shape: 'square',
    dotType,
    dotSize,
    color,
    background,
    corners: {
      topLeft: { ...cornerBlock },
      topRight: { ...cornerBlock },
      bottomLeft: { ...cornerBlock },
    },
  }

  if (hasUserLogo) {
    const logoSize = clamp(num(fields.qrLogoSize, isUpi ? 0.32 : 0.28), 0.1, 0.5)
    opts.logo = {
      imageUrl,
      size: logoSize,
      margin: isUpi ? 8 : 10,
      hideBackgroundDots: true,
      backgroundColor:
        typeof background === 'string' && background !== 'transparent' ? background : '#ffffff',
    }
  } else if (hasPresetLogo) {
    opts.logo = builtInSvgLogo(presetSvg, background, fields, {
      sizeFallback: 0.28,
      imageWidth: PRESET_LOGO_LAYOUT.imageWidth,
      imageHeight: PRESET_LOGO_LAYOUT.imageHeight,
    })
  }

  return opts
}

/** @param {number} [cap] pass `previewCap` for UI; omit for downloads */
export function toSvg(text, fields, cap) {
  const opts = buildQrSvgOptions(fields || {}, cap)
  return optimizeSVG(qrcode(text, opts))
}

export function downloadSvg(svgText, name = 'qr.svg') {
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Rasterize styled SVG to PNG (matches preview; no extra deps).
 * @param {string} svgText
 * @param {string} [name]
 * @param {number} [scale] devicePixelRatio multiplier for sharper output
 */
export async function downloadPngFromSvg(svgText, name = 'qr.png', scale = 2) {
  const uri = svgToDataURI(svgText)
  const img = new Image()
  img.decoding = 'async'
  img.crossOrigin = 'anonymous'
  await new Promise((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Could not load QR SVG for PNG export.'))
    img.src = uri
  })
  const w = img.naturalWidth || img.width
  const h = img.naturalHeight || img.height
  const s = clamp(scale, 1, 4)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * s)
  canvas.height = Math.round(h * s)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not available.')
  if (s !== 1) ctx.scale(s, s)
  ctx.drawImage(img, 0, 0, w, h)
  const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b || new Blob()), 'image/png'))
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

/** @deprecated Use downloadPngFromSvg with styled SVG for parity with preview. */
export async function downloadPng(text, name = 'qr.png') {
  const { qrcodePNG } = await import('etiket/png')
  const pngOpts = { margin: 4, moduleSize: 12, ecLevel: 'M', color: '#111827', background: '#ffffff' }
  const blob = new Blob([qrcodePNG(text, pngOpts)], { type: 'image/png' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

/** Copy text; works in more contexts than clipboard API alone. */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
