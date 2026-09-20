import { Dices } from 'lucide-react'
import { Button } from '@/comps/ui/button'
import { STYLE_PRESETS, randomStyle } from '@/utils/presets'
import type { QrFields, SetFields } from '@/types'

// Glyph preview for one curated style preset.
function PresetIcon({ presetId }: { presetId: string }) {
  if (presetId === 'classic')
    return (
      <svg viewBox="0 0 28 28" className="size-8 shrink-0" aria-hidden focusable="false">
        <rect x="1" y="1" width="26" height="26" rx="4" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="4" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="17" y="4" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="4" y="17" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="6" y="6" width="3" height="3" fill="#111827" />
        <rect x="19" y="6" width="3" height="3" fill="#111827" />
        <rect x="6" y="19" width="3" height="3" fill="#111827" />
        <rect x="14" y="14" width="3" height="3" fill="#111827" />
        <rect x="18" y="14" width="3" height="3" fill="#111827" />
        <rect x="14" y="18" width="3" height="3" fill="#111827" />
        <rect x="18" y="18" width="3" height="3" fill="#111827" />
        <rect x="21" y="21" width="3" height="3" fill="#111827" />
      </svg>
    )
  if (presetId === 'soft')
    return (
      <svg viewBox="0 0 28 28" className="size-8 shrink-0" aria-hidden focusable="false">
        <rect x="1" y="1" width="26" height="26" rx="4" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="17" y="4" width="7" height="7" rx="1.5" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="4" y="17" width="7" height="7" rx="1.5" fill="none" stroke="#111827" strokeWidth="2" />
        <circle cx="6.5" cy="6.5" r="1.6" fill="#111827" />
        <circle cx="21.5" cy="6.5" r="1.6" fill="#111827" />
        <circle cx="6.5" cy="21.5" r="1.6" fill="#111827" />
        <circle cx="14.5" cy="14.5" r="1.5" fill="#111827" />
        <circle cx="18.5" cy="14.5" r="1.5" fill="#111827" />
        <circle cx="14.5" cy="18.5" r="1.5" fill="#111827" />
        <circle cx="18.5" cy="18.5" r="1.5" fill="#111827" />
        <circle cx="21.5" cy="21.5" r="1.5" fill="#111827" />
      </svg>
    )
  if (presetId === 'rounded')
    return (
      <svg viewBox="0 0 28 28" className="size-8 shrink-0" aria-hidden focusable="false">
        <rect x="1" y="1" width="26" height="26" rx="4" fill="#f8fafc" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="4" width="7" height="7" rx="2.5" fill="none" stroke="#1e293b" strokeWidth="2" />
        <rect x="17" y="4" width="7" height="7" rx="2.5" fill="none" stroke="#1e293b" strokeWidth="2" />
        <rect x="4" y="17" width="7" height="7" rx="2.5" fill="none" stroke="#1e293b" strokeWidth="2" />
        <rect x="5.4" y="5.4" width="4.2" height="4.2" rx="1.4" fill="#1e293b" />
        <rect x="18.4" y="5.4" width="4.2" height="4.2" rx="1.4" fill="#1e293b" />
        <rect x="5.4" y="18.4" width="4.2" height="4.2" rx="1.4" fill="#1e293b" />
        <rect x="13.5" y="13.5" width="3.4" height="3.4" rx="1.2" fill="#1e293b" />
        <rect x="18" y="13.5" width="3.4" height="3.4" rx="1.2" fill="#1e293b" />
        <rect x="13.5" y="18" width="3.4" height="3.4" rx="1.2" fill="#1e293b" />
        <rect x="18" y="18" width="3.4" height="3.4" rx="1.2" fill="#1e293b" />
        <rect x="21.5" y="21" width="2.6" height="2.6" rx="1" fill="#1e293b" />
      </svg>
    )
  if (presetId === 'diamond')
    return (
      <svg viewBox="0 0 28 28" className="size-8 shrink-0" aria-hidden focusable="false">
        <rect x="1" y="1" width="26" height="26" rx="4" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="4" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="17" y="4" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="4" y="17" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="6" y="6" width="3" height="3" fill="#111827" />
        <rect x="19" y="6" width="3" height="3" fill="#111827" />
        <rect x="6" y="19" width="3" height="3" fill="#111827" />
        <polygon points="14,14.2 16,16.2 14,18.2 12,16.2" fill="#111827" />
        <polygon points="19,14.2 21,16.2 19,18.2 17,16.2" fill="#111827" />
        <polygon points="14,18.2 16,20.2 14,22.2 12,20.2" fill="#111827" />
        <polygon points="19,18.2 21,20.2 19,22.2 17,20.2" fill="#111827" />
        <polygon points="22.5,21 23.8,22.3 22.5,23.6 21.2,22.3" fill="#111827" />
      </svg>
    )
  if (presetId === 'lines')
    return (
      <svg viewBox="0 0 28 28" className="size-8 shrink-0" aria-hidden focusable="false">
        <rect x="1" y="1" width="26" height="26" rx="4" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
        <rect x="4" y="4" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="17" y="4" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="4" y="17" width="7" height="7" fill="none" stroke="#111827" strokeWidth="2" />
        <rect x="6" y="6" width="3" height="3" fill="#111827" />
        <rect x="19" y="6" width="3" height="3" fill="#111827" />
        <rect x="6" y="19" width="3" height="3" fill="#111827" />
        <rect x="13.5" y="14" width="4" height="1.6" rx="0.8" fill="#111827" />
        <rect x="18.5" y="14" width="4" height="1.6" rx="0.8" fill="#111827" />
        <rect x="13.5" y="17.5" width="4" height="1.6" rx="0.8" fill="#111827" />
        <rect x="18.5" y="17.5" width="4" height="1.6" rx="0.8" fill="#111827" />
        <rect x="21" y="21" width="3" height="1.6" rx="0.8" fill="#111827" />
      </svg>
    )
  if (presetId === 'ocean')
    return (
      <svg viewBox="0 0 28 28" className="size-8 shrink-0" aria-hidden focusable="false">
        <rect x="1" y="1" width="26" height="26" rx="4" fill="#f0f9ff" stroke="currentColor" strokeWidth="2" />
        <circle cx="7.5" cy="7.5" r="3.2" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="1.6 1.2" />
        <circle cx="20.5" cy="7.5" r="3.2" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="1.6 1.2" />
        <circle cx="7.5" cy="20.5" r="3.2" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="1.6 1.2" />
        <circle cx="7.5" cy="7.5" r="1.4" fill="#0c4a6e" />
        <circle cx="20.5" cy="7.5" r="1.4" fill="#0c4a6e" />
        <circle cx="7.5" cy="20.5" r="1.4" fill="#0c4a6e" />
        <rect x="13.5" y="13.5" width="3.4" height="3.4" rx="1.2" fill="#0c4a6e" />
        <rect x="18" y="13.5" width="3.4" height="3.4" rx="1.2" fill="#0c4a6e" />
        <rect x="13.5" y="18" width="3.4" height="3.4" rx="1.2" fill="#0c4a6e" />
        <rect x="18" y="18" width="3.4" height="3.4" rx="1.2" fill="#0c4a6e" />
        <rect x="21.5" y="21" width="2.6" height="2.6" rx="1" fill="#0c4a6e" />
      </svg>
    )
  return null
}

// Curated style grid plus randomize; patches merge into fields.
export function StylePresets({ setFields }: { setFields: SetFields }) {
  const applyStyle = (stylePatch: Partial<QrFields>) => setFields((state) => ({ ...state, ...stylePatch }))

  return (
    <section aria-label="Style presets" className="flex w-full min-w-0 shrink-0 flex-col gap-2 lg:min-h-0 lg:shrink">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-sm font-bold tracking-tight">Presets</h2>
        <Button variant="outline" size="sm" onClick={() => applyStyle(randomStyle())} className="h-8 border-2 text-xs">
          <Dices data-icon="inline-start" aria-hidden />
          Randomize
        </Button>
      </div>
      <div className="grid w-full grid-cols-6 gap-1.5">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyStyle(preset.patch)}
            aria-label={`Apply ${preset.label} style`}
            title={preset.label}
            className="flex aspect-square w-full min-w-11 cursor-pointer items-center justify-center rounded-md border-2 border-foreground bg-card shadow-brutal-sm transition-all hover:-translate-y-px hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring"
          >
            <PresetIcon presetId={preset.id} />
          </button>
        ))}
      </div>
    </section>
  )
}
