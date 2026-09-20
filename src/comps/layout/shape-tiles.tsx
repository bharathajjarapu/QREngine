import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/comps/ui/toggle-group'
import type { CornerInner, CornerOuter, DotType } from '@/types'
import type { ReactNode } from 'react'

const VIEWBOX = 28
const GAP = 0.35
const CELL_STEP = (VIEWBOX - GAP * 4) / 5 + GAP

// Grid point for one module tile.
function cellRect(row: number, col: number) {
  const left = GAP + col * CELL_STEP
  const top = GAP + row * CELL_STEP
  const size = CELL_STEP - GAP
  return { left, top, size, midX: left + size / 2, midY: top + size / 2 }
}

// One module glyph in the given dot style.
function drawCell(type: string, row: number, col: number) {
  const { left, top, size, midX, midY } = cellRect(row, col)
  if (type === 'square') return <rect key={`${row}-${col}`} x={left} y={top} width={size} height={size} fill="currentColor" />
  if (type === 'rounded') return <rect key={`${row}-${col}`} x={left} y={top} width={size} height={size} rx={size * 0.32} ry={size * 0.32} fill="currentColor" />
  if (type === 'dots') return <circle key={`${row}-${col}`} cx={midX} cy={midY} r={size * 0.42} fill="currentColor" />
  if (type === 'diamond')
    return <polygon key={`${row}-${col}`} points={`${midX},${top + 0.08 * size} ${left + size - 0.08 * size},${midY} ${midX},${top + size - 0.08 * size} ${left + 0.08 * size},${midY}`} fill="currentColor" />
  if (type === 'classy') {
    const bar = size * 0.46
    return (
      <g key={`${row}-${col}`}>
        <rect x={midX - bar / 2} y={top + size * 0.08} width={bar} height={size * 0.84} rx={bar * 0.12} fill="currentColor" />
      </g>
    )
  }
  if (type === 'classy-rounded') {
    const bar = size * 0.46
    return <rect key={`${row}-${col}`} x={midX - bar / 2} y={top + size * 0.08} width={bar} height={size * 0.84} rx={bar * 0.45} fill="currentColor" />
  }
  if (type === 'extra-rounded') return <rect key={`${row}-${col}`} x={left} y={top} width={size} height={size} rx={size * 0.48} ry={size * 0.48} fill="currentColor" />
  if (type === 'vertical-line') return <rect key={`${row}-${col}`} x={midX - size * 0.18} y={top + size * 0.1} width={size * 0.36} height={size * 0.8} rx={size * 0.08} fill="currentColor" />
  if (type === 'horizontal-line') return <rect key={`${row}-${col}`} x={left + size * 0.1} y={midY - size * 0.18} width={size * 0.8} height={size * 0.36} rx={size * 0.08} fill="currentColor" />
  if (type === 'small-square') {
    const pad = size * 0.18
    return <rect key={`${row}-${col}`} x={left + pad} y={top + pad} width={size - 2 * pad} height={size - 2 * pad} fill="currentColor" />
  }
  if (type === 'tiny-square') {
    const pad = size * 0.28
    return <rect key={`${row}-${col}`} x={left + pad} y={top + pad} width={size - 2 * pad} height={size - 2 * pad} fill="currentColor" />
  }
  return <rect key={`${row}-${col}`} x={left} y={top} width={size} height={size} fill="currentColor" />
}

const DOT_GRID = [
  [1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
]

// Mini QR grid rendered in the given dot style.
function DotTypeSvg({ type }: { type: string }) {
  const elements = []
  for (let row = 0; row < 5; row++) for (let col = 0; col < 5; col++) if (DOT_GRID[row]?.[col]) elements.push(drawCell(type, row, col))
  return (
    <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className="size-7 shrink-0" aria-hidden focusable="false">
      {elements}
    </svg>
  )
}

interface CornerSvgProps {
  role: 'outer' | 'inner'
  variant: string
}

// Finder-frame glyph for the given role and shape.
function CornerSvg({ role, variant }: CornerSvgProps) {
  const pad = 2
  const frame = VIEWBOX - 2 * pad
  const size = 'size-7 shrink-0'
  if (role === 'outer') {
    if (variant === 'square')
      return (
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className={size} aria-hidden focusable="false">
          <rect x={pad} y={pad} width={frame} height={frame} fill="none" stroke="currentColor" strokeWidth={frame * 0.22} />
        </svg>
      )
    if (variant === 'rounded')
      return (
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className={size} aria-hidden focusable="false">
          <rect x={pad} y={pad} width={frame} height={frame} rx={frame * 0.22} fill="none" stroke="currentColor" strokeWidth={frame * 0.2} />
        </svg>
      )
    if (variant === 'dots')
      return (
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className={size} aria-hidden focusable="false">
          <circle cx={VIEWBOX / 2} cy={VIEWBOX / 2} r={frame * 0.38} fill="none" stroke="currentColor" strokeWidth={frame * 0.14} strokeDasharray={`${frame * 0.12} ${frame * 0.1}`} />
        </svg>
      )
    if (variant === 'extra-rounded')
      return (
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className={size} aria-hidden focusable="false">
          <rect x={pad} y={pad} width={frame} height={frame} rx={frame * 0.38} fill="none" stroke="currentColor" strokeWidth={frame * 0.2} />
        </svg>
      )
    if (variant === 'classy')
      return (
        <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} className={size} aria-hidden focusable="false">
          <rect x={pad} y={pad} width={frame} height={frame} rx={frame * 0.12} fill="none" stroke="currentColor" strokeWidth={frame * 0.22} />
        </svg>
      )
  }
  if (variant === 'square') return <DotTypeSvg type="square" />
  if (variant === 'dots') return <DotTypeSvg type="dots" />
  return <DotTypeSvg type="rounded" />
}

interface StripProps<T extends string> {
  label: string
  value: T
  onChange: (picked: T) => void
  options: readonly (readonly [T, string])[]
  children: (picked: T) => ReactNode
}

// Picture radio grid; three options get three columns so labels fit.
function Strip<T extends string>({ label, value, onChange, options, children }: StripProps<T>) {
  const cols = options.length <= 3 ? 'grid-cols-3' : 'grid-cols-4 sm:grid-cols-7'
  return (
    <ToggleGroup
      role="radiogroup"
      aria-label={label}
      value={[value]}
      onValueChange={(selected: string[]) => {
        const first = selected[0]
        if (first) onChange(first as T)
      }}
      className={`grid w-full gap-2 ${cols}`}
    >
      {options.map(([choice, text]) => {
        const selected = value === choice
        return (
          <ToggleGroupItem
            key={choice}
            value={choice}
            role="radio"
            aria-checked={selected}
            aria-label={text}
            title={text}
            variant="outline"
            className={cn(
              'flex h-auto min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-md border-2 border-foreground bg-card px-1 py-2 text-[0.7rem] leading-tight font-semibold shadow-brutal-sm transition-all hover:-translate-y-px focus-visible:-translate-y-px active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
              selected && 'bg-accent text-accent-foreground'
            )}
          >
            {children(choice)}
            <span aria-hidden className="max-w-full truncate">
              {text}
            </span>
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}

interface DotStripProps {
  value: DotType
  onChange: (picked: DotType) => void
  options: readonly (readonly [DotType, string])[]
}

// Dot-shape picker strip.
export function QrDotTypeStrip({ value, onChange, options }: DotStripProps) {
  return (
    <Strip label="Dot shape" value={value} onChange={onChange} options={options}>
      {(picked) => <DotTypeSvg type={picked} />}
    </Strip>
  )
}

interface CornerStripProps<T extends CornerOuter | CornerInner> {
  role: 'outer' | 'inner'
  value: T
  onChange: (picked: T) => void
  options: readonly (readonly [T, string])[]
}

// Finder-shape picker strip for outer or inner frame.
export function QrCornerStrip<T extends CornerOuter | CornerInner>({ role, value, onChange, options }: CornerStripProps<T>) {
  return (
    <Strip
      label={role === 'outer' ? 'Outer finder shape' : 'Inner finder shape'}
      value={value}
      onChange={onChange}
      options={options}
    >
      {(picked) => <CornerSvg role={role} variant={picked} />}
    </Strip>
  )
}
