import { useId } from 'react'
import type { ChangeEvent } from 'react'
import { Ruler } from 'lucide-react'
import { qrCornerInnerOptions, qrCornerOuterOptions, qrDotTypeOptions, qrEcOptions } from '@/utils/constants'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/comps/ui/field'
import { Input } from '@/comps/ui/input'
import { Slider } from '@/comps/ui/slider'
import type { QrFields, SetField } from '@/types'
import { QrCornerStrip, QrDotTypeStrip } from '../layout/shape-tiles'
import { Choice } from './options'

interface SliderFieldProps {
  label: string
  readout: string
  hint?: string
  value: number
  min: number
  max: number
  step: number
  onValueChange: (value: number) => void
}

// Labeled slider with a value readout and optional hint.
function SliderField({ label, readout, hint, ...props }: SliderFieldProps) {
  const id = useId()
  return (
    <Field>
      <FieldLabel htmlFor={id} className="justify-between">
        {label}
        <span className="font-mono text-xs tabular-nums text-muted-foreground">{readout}</span>
      </FieldLabel>
      <Slider id={id} aria-label={label} aria-describedby={hint ? `${id}-hint` : undefined} className="py-2.5" {...props} />
      {hint ? <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription> : null}
    </Field>
  )
}

interface ShapeProps {
  fields: QrFields
  setField: SetField
  exportPx: number
  hasLogo: boolean
  ecLevelLabel: QrFields['qrEcLevel']
}

// Shape panel: dot style, finders, size, and error correction.
export function Shape({ fields, setField, exportPx, hasLogo, ecLevelLabel }: ShapeProps) {
  const sizeId = useId()
  const dotSize = Number(fields.qrDotSize) || 1

  return (
    <FieldGroup className="gap-6">
      <FieldSet>
        <FieldLegend variant="label">Dot style</FieldLegend>
        <QrDotTypeStrip value={fields.qrDotType} onChange={(picked) => setField('qrDotType', picked)} options={qrDotTypeOptions} />
      </FieldSet>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldSet>
          <FieldLegend variant="label">Outer finder</FieldLegend>
          <QrCornerStrip role="outer" value={fields.qrCornerOuter} onChange={(picked) => setField('qrCornerOuter', picked)} options={qrCornerOuterOptions} />
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Inner finder</FieldLegend>
          <QrCornerStrip role="inner" value={fields.qrCornerInner} onChange={(picked) => setField('qrCornerInner', picked)} options={qrCornerInnerOptions} />
        </FieldSet>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SliderField
          label="Dot size"
          readout={`${Math.round(dotSize * 100)}%`}
          value={dotSize}
          min={0.1}
          max={1}
          step={0.05}
          onValueChange={(picked) => setField('qrDotSize', picked)}
        />
        <Field>
          <FieldLabel htmlFor={sizeId}>Export size</FieldLabel>
          <div className="relative">
            <Input
              id={sizeId}
              type="number"
              min={64}
              max={1024}
              step={1}
              inputMode="numeric"
              aria-describedby={`${sizeId}-hint`}
              className="pr-11 font-mono tabular-nums"
              value={exportPx}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const parsed = Math.round(Number(event.target.value))
                if (Number.isFinite(parsed)) setField('qrSize', Math.min(1024, Math.max(64, parsed)))
              }}
            />
            <Ruler aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <FieldDescription id={`${sizeId}-hint`}>64 to 1024 pixels.</FieldDescription>
        </Field>
      </div>

      <FieldSet aria-describedby="ec-hint">
        <FieldLegend variant="label">Error correction</FieldLegend>
        <Choice
          label="Error correction level"
          value={ecLevelLabel}
          onChange={(picked) => setField('qrEcLevel', picked)}
          options={qrEcOptions}
          disabledValues={hasLogo ? ['L', 'M', 'Q'] : undefined}
          itemClassName="min-h-12 flex-1 flex-col px-2 py-2"
        />
        <FieldDescription id="ec-hint">
          {hasLogo
            ? 'Locked to High with a logo.'
            : 'Higher survives more damage.'}
        </FieldDescription>
      </FieldSet>
    </FieldGroup>
  )
}
