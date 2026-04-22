import { qrcode } from 'etiket/qr'

const svgOpts = { margin: 4, ecLevel: 'M', color: '#141414', background: '#ffffff' }
const pngOpts = { margin: 4, moduleSize: 12, ecLevel: 'M', color: '#141414', background: '#ffffff' }

export function toSvg(text) {
  return qrcode(text, svgOpts)
}

export function downloadSvg(svgText, name = 'qr.svg') {
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

export async function downloadPng(text, name = 'qr.png') {
  const { qrcodePNG } = await import('etiket/png')
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
