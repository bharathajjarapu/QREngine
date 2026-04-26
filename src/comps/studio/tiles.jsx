/** Small visual tiles for QR module / finder styles (replaces dropdowns). */

const VB = 28
const G = 0.35
const STEP = (VB - G * 4) / 5 + G

function cellXY(i, j) {
  const x = G + j * STEP
  const y = G + i * STEP
  const s = STEP - G
  return { x, y, s, cx: x + s / 2, cy: y + s / 2 }
}

function drawModule(type, i, j) {
  const { x, y, s, cx, cy } = cellXY(i, j)
  const k = type
  if (k === 'square') return <rect key={`${i}-${j}`} x={x} y={y} width={s} height={s} fill="currentColor" />
  if (k === 'rounded') return <rect key={`${i}-${j}`} x={x} y={y} width={s} height={s} rx={s * 0.32} ry={s * 0.32} fill="currentColor" />
  if (k === 'dots') return <circle key={`${i}-${j}`} cx={cx} cy={cy} r={s * 0.42} fill="currentColor" />
  if (k === 'diamond')
    return <polygon key={`${i}-${j}`} points={`${cx},${y + 0.08 * s} ${x + s - 0.08 * s},${cy} ${cx},${y + s - 0.08 * s} ${x + 0.08 * s},${cy}`} fill="currentColor" />
  if (k === 'classy') {
    const w = s * 0.46
    return (
      <g key={`${i}-${j}`}>
        <rect x={cx - w / 2} y={y + s * 0.08} width={w} height={s * 0.84} rx={w * 0.12} fill="currentColor" />
      </g>
    )
  }
  if (k === 'classy-rounded') {
    const w = s * 0.46
    return <rect key={`${i}-${j}`} x={cx - w / 2} y={y + s * 0.08} width={w} height={s * 0.84} rx={w * 0.45} fill="currentColor" />
  }
  if (k === 'extra-rounded') return <rect key={`${i}-${j}`} x={x} y={y} width={s} height={s} rx={s * 0.48} ry={s * 0.48} fill="currentColor" />
  if (k === 'vertical-line') return <rect key={`${i}-${j}`} x={cx - s * 0.18} y={y + s * 0.1} width={s * 0.36} height={s * 0.8} rx={s * 0.08} fill="currentColor" />
  if (k === 'horizontal-line') return <rect key={`${i}-${j}`} x={x + s * 0.1} y={cy - s * 0.18} width={s * 0.8} height={s * 0.36} rx={s * 0.08} fill="currentColor" />
  if (k === 'small-square') {
    const inset = s * 0.18
    return <rect key={`${i}-${j}`} x={x + inset} y={y + inset} width={s - 2 * inset} height={s - 2 * inset} fill="currentColor" />
  }
  if (k === 'tiny-square') {
    const inset = s * 0.28
    return <rect key={`${i}-${j}`} x={x + inset} y={y + inset} width={s - 2 * inset} height={s - 2 * inset} fill="currentColor" />
  }
  return <rect key={`${i}-${j}`} x={x} y={y} width={s} height={s} fill="currentColor" />
}

const DOT_GRID = [
  [1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
]

function DotTypeSvg({ type }) {
  const els = []
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (DOT_GRID[i][j]) els.push(drawModule(type, i, j))
    }
  }
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} className="size-8 shrink-0" aria-hidden>
      {els}
    </svg>
  )
}

/** Finder-ish frame: outer ring uses `outer`, center 3×3 uses `inner` (for combined preview we only need one role). */
function CornerSvg({ role, variant }) {
  const o = variant
  const pad = 2
  const outer = VB - 2 * pad

  if (role === 'outer') {
    if (o === 'square')
      return (
        <svg viewBox={`0 0 ${VB} ${VB}`} className="size-8 shrink-0" aria-hidden>
          <rect x={pad} y={pad} width={outer} height={outer} fill="none" stroke="currentColor" strokeWidth={outer * 0.22} />
        </svg>
      )
    if (o === 'rounded')
      return (
        <svg viewBox={`0 0 ${VB} ${VB}`} className="size-8 shrink-0" aria-hidden>
          <rect x={pad} y={pad} width={outer} height={outer} rx={outer * 0.22} fill="none" stroke="currentColor" strokeWidth={outer * 0.2} />
        </svg>
      )
    if (o === 'dots')
      return (
        <svg viewBox={`0 0 ${VB} ${VB}`} className="size-8 shrink-0" aria-hidden>
          <circle cx={VB / 2} cy={VB / 2} r={outer * 0.38} fill="none" stroke="currentColor" strokeWidth={outer * 0.14} strokeDasharray={`${outer * 0.12} ${outer * 0.1}`} />
        </svg>
      )
    if (o === 'extra-rounded')
      return (
        <svg viewBox={`0 0 ${VB} ${VB}`} className="size-8 shrink-0" aria-hidden>
          <rect x={pad} y={pad} width={outer} height={outer} rx={outer * 0.38} fill="none" stroke="currentColor" strokeWidth={outer * 0.2} />
        </svg>
      )
    if (o === 'classy')
      return (
        <svg viewBox={`0 0 ${VB} ${VB}`} className="size-8 shrink-0" aria-hidden>
          <rect x={pad} y={pad} width={outer} height={outer} rx={outer * 0.12} fill="none" stroke="currentColor" strokeWidth={outer * 0.22} />
        </svg>
      )
  }

  /* inner */
  if (o === 'square') return <DotTypeSvg type="square" />
  if (o === 'dots') return <DotTypeSvg type="dots" />
  return <DotTypeSvg type="rounded" />
}

const tileBase =
  'flex shrink-0 items-center justify-center rounded-md border p-1 transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qn-ink/35 active:scale-[0.97]'
const tileOff = 'border-qn-line/90 bg-qn-panel text-qn-ink hover:border-qn-muted/60 hover:bg-qn-muted/5'
const tileOn =
  'border-2 border-[var(--color-qn-control-on-border)] bg-[var(--color-qn-control-on-bg)] text-[var(--color-qn-control-on-fg)] shadow-[inset_0_1px_0_var(--color-qn-control-on-shine)]'

export function QrDotTypeStrip({ value, onChange, options }) {
  return (
    <div className="mt-1 flex max-w-full gap-1 overflow-x-auto overflow-y-hidden pb-0.5 [scrollbar-gutter:stable]" role="listbox" aria-label="Dot type">
      {options.map(([v, label]) => {
        const selected = value === v
        return (
          <button
            key={v}
            type="button"
            role="option"
            aria-selected={selected}
            title={label}
            aria-label={label}
            onClick={() => onChange(v)}
            className={`${tileBase} ${selected ? tileOn : tileOff}`}
          >
            <DotTypeSvg type={v} />
          </button>
        )
      })}
    </div>
  )
}

export function QrCornerStrip({ role, value, onChange, options }) {
  const aria = role === 'outer' ? 'Outer finder shape' : 'Inner finder shape'
  return (
    <div className="mt-1 flex max-w-full gap-1 overflow-x-auto overflow-y-hidden pb-0.5 [scrollbar-gutter:stable]" role="listbox" aria-label={aria}>
      {options.map(([v, label]) => {
        const selected = value === v
        return (
          <button
            key={v}
            type="button"
            role="option"
            aria-selected={selected}
            title={label}
            aria-label={label}
            onClick={() => onChange(v)}
            className={`${tileBase} ${selected ? tileOn : tileOff}`}
          >
            <CornerSvg role={role} variant={v} />
          </button>
        )
      })}
    </div>
  )
}
