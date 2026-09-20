import type { QrFields } from '@/types'

export interface StylePreset {
  id: string
  label: string
  patch: Partial<QrFields>
}

// Curated style presets: partial field patches applied by setFields.
export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'classic',
    label: 'Classic',
    patch: {
      qrFg: '#111827',
      qrFgStyle: 'solid',
      qrBg: '#ffffff',
      qrBgStyle: 'solid',
      qrDotType: 'square',
      qrDotSize: 1,
      qrCornerOuter: 'square',
      qrCornerInner: 'square',
      qrCornerOuterColor: '#111827',
      qrCornerInnerColor: '#111827',
    },
  },
  {
    id: 'soft',
    label: 'Soft dots',
    patch: {
      qrFg: '#111827',
      qrFgStyle: 'solid',
      qrBg: '#ffffff',
      qrBgStyle: 'solid',
      qrDotType: 'dots',
      qrDotSize: 1,
      qrCornerOuter: 'dots',
      qrCornerInner: 'dots',
      qrCornerOuterColor: '#111827',
      qrCornerInnerColor: '#111827',
    },
  },
  {
    id: 'rounded',
    label: 'Rounded',
    patch: {
      qrFg: '#1e293b',
      qrFgStyle: 'solid',
      qrBg: '#f8fafc',
      qrBgStyle: 'solid',
      qrDotType: 'rounded',
      qrDotSize: 0.95,
      qrCornerOuter: 'dots',
      qrCornerInner: 'rounded',
      qrCornerOuterColor: '#1e293b',
      qrCornerInnerColor: '#1e293b',
    },
  },
  {
    id: 'diamond',
    label: 'Diamond',
    patch: {
      qrFg: '#111827',
      qrFgStyle: 'solid',
      qrBg: '#ffffff',
      qrBgStyle: 'solid',
      qrDotType: 'diamond',
      qrDotSize: 1,
      qrCornerOuter: 'square',
      qrCornerInner: 'square',
      qrCornerOuterColor: '#111827',
      qrCornerInnerColor: '#111827',
    },
  },
  {
    id: 'lines',
    label: 'Lines',
    patch: {
      qrFg: '#111827',
      qrFgStyle: 'solid',
      qrBg: '#ffffff',
      qrBgStyle: 'solid',
      qrDotType: 'horizontal-line',
      qrDotSize: 1,
      qrCornerOuter: 'square',
      qrCornerInner: 'square',
      qrCornerOuterColor: '#111827',
      qrCornerInnerColor: '#111827',
    },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    patch: {
      qrFg: '#0c4a6e',
      qrFgStyle: 'solid',
      qrBg: '#f0f9ff',
      qrBgStyle: 'solid',
      qrDotType: 'rounded',
      qrDotSize: 0.95,
      qrCornerOuter: 'dots',
      qrCornerInner: 'dots',
      qrCornerOuterColor: '#0284c7',
      qrCornerInnerColor: '#0284c7',
    },
  },
]

const DOT_TYPES = ['square', 'rounded', 'dots', 'diamond', 'vertical-line', 'horizontal-line', 'small-square'] as const
const FINDER_OUTER = ['square', 'dots', 'classy'] as const
const FINDER_INNER = ['square', 'dots', 'rounded'] as const

const INK_COLORS = ['#111827', '#000000', '#1e293b', '#0c4a6e', '#7c2d12', '#4c1d95', '#14532d', '#831843']
const PAPER_COLORS = ['#ffffff', '#f8fafc', '#fef3c7', '#f0f9ff', '#fffbeb', '#faf5ff', '#f0fdf4', '#fff1f2']

// Random item from a readonly list.
function pickRandom<T>(items: readonly T[]): T {
  const found = items[Math.floor(Math.random() * items.length)]
  if (found === undefined) throw new Error('Empty preset list.')
  return found
}

// Random but tasteful: dark-on-light ink/paper, matching finders, occasional gradient.
export function randomStyle(): Partial<QrFields> {
  const foreground = pickRandom(INK_COLORS)
  const background = pickRandom(PAPER_COLORS)
  const gradient = Math.random() < 0.3
  return {
    qrFg: foreground,
    qrFgStyle: gradient ? 'linear' : 'solid',
    qrFgColor2: gradient ? pickRandom(INK_COLORS) : foreground,
    qrFgAngle: pickRandom([0, 45, 90, 135, 180, 225, 270, 315]),
    qrBg: background,
    qrBgStyle: 'solid',
    qrBgColor2: background,
    qrDotType: pickRandom(DOT_TYPES),
    qrDotSize: pickRandom([0.85, 0.9, 0.95, 1]),
    qrCornerOuter: pickRandom(FINDER_OUTER),
    qrCornerInner: pickRandom(FINDER_INNER),
    qrCornerOuterColor: foreground,
    qrCornerInnerColor: foreground,
  }
}
