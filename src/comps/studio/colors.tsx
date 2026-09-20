import { useId } from 'react'
import type { ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/comps/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/comps/ui/input-group'
import { Slider } from '@/comps/ui/slider'
import type { QrFields, SetField, SetFields } from '@/types'
import { Choice } from './options'

const FOREGROUND_STYLES = [
  ['solid', 'Solid'],
  ['linear', 'Linear'],
  ['radial', 'Radial'],
] as const

const BACKGROUND_STYLES = [...FOREGROUND_STYLES, ['transparent', 'None']] as const

interface SwatchHexProps {
  value: string
  fallback: string
  onChange: (value: string) => void
  label: string
  className?: string
}

// Hex field with the native picker riding along as the swatch.
function SwatchHex({ value, fallback, onChange, label, className }: SwatchHexProps) {
  const id = useId()
  return (
    <InputGroup className={cn('max-w-52', className)}>
      <InputGroupAddon align="inline-start" className="pl-1.5">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={isHexColor(value) ? value : fallback}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          className="size-5 cursor-pointer appearance-none rounded-sm border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-border"
        />
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        aria-label={label}
        className="font-mono uppercase"
        spellCheck={false}
        autoComplete="off"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
    </InputGroup>
  )
}

// Six-digit hex check for picker fallback.
function isHexColor(value: unknown): boolean {
  return /^#[0-9a-f]{6}$/i.test(String(value))
}

interface ColorPairProps {
  start: string
  end: string
  fallbackStart: string
  fallbackEnd: string
  onStart: (value: string) => void
  onEnd: (value: string) => void
  label: string
}

// Start/end swatches for a two-stop gradient.
function ColorPair({ start, end, fallbackStart, fallbackEnd, onStart, onEnd, label }: ColorPairProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <SwatchHex value={start} fallback={fallbackStart} onChange={onStart} label={`${label} start`} />
      <SwatchHex value={end} fallback={fallbackEnd} onChange={onEnd} label={`${label} end`} />
    </div>
  )
}

interface AngleFieldProps {
  value: number | string
  onChange: (value: number) => void
}

// Gradient angle slider with degree readout.
function AngleField({ value, onChange }: AngleFieldProps) {
  const id = useId()
  const degrees = Number(value) || 0
  return (
    <Field className="max-w-md">
      <FieldLabel htmlFor={id} className="justify-between">
        Angle
        <span className="font-mono text-xs tabular-nums text-muted-foreground">{degrees}°</span>
      </FieldLabel>
      <Slider id={id} aria-label="Gradient angle" className="max-w-md py-1.5" value={degrees} min={0} max={360} step={1} onValueChange={onChange} />
    </Field>
  )
}

interface SectionProps {
  fields: QrFields
  setField: SetField
}

// Foreground fill style plus its colors.
function Foreground({ fields, setField }: SectionProps) {
  const style = fields.qrFgStyle
  return (
    <FieldSet>
      <FieldLegend variant="label">Foreground</FieldLegend>
      <Choice label="Foreground fill" value={style} onChange={(picked) => setField('qrFgStyle', picked)} options={FOREGROUND_STYLES} itemClassName="flex-1" />
      {style === 'solid' ? (
        <SwatchHex value={fields.qrFg} fallback="#111827" onChange={(picked) => setField('qrFg', picked)} label="Foreground" />
      ) : (
        <ColorPair
          label="Foreground"
          start={fields.qrFg}
          end={fields.qrFgColor2}
          fallbackStart="#111827"
          fallbackEnd="#4d4d4d"
          onStart={(picked) => setField('qrFg', picked)}
          onEnd={(picked) => setField('qrFgColor2', picked)}
        />
      )}
      {style === 'linear' ? <AngleField value={fields.qrFgAngle} onChange={(picked) => setField('qrFgAngle', picked)} /> : null}
    </FieldSet>
  )
}

interface BackgroundProps extends SectionProps {
  setFields: SetFields
}

// Background fill style plus its colors; None maps to transparent.
function Background({ fields, setField, setFields }: BackgroundProps) {
  const isTransparent = fields.qrBg === 'transparent'
  const style = isTransparent ? 'transparent' : fields.qrBgStyle
  const setStyle = (nextStyle: QrFields['qrBgStyle'] | 'transparent') => {
    if (nextStyle === 'transparent') setField('qrBg', 'transparent')
    else setFields((state) => ({ ...state, qrBgStyle: nextStyle, qrBg: state.qrBg === 'transparent' ? '#ffffff' : state.qrBg }))
  }

  return (
    <FieldSet>
      <FieldLegend variant="label">Background</FieldLegend>
      <Choice label="Background fill" value={style} onChange={(picked) => setStyle(picked)} options={BACKGROUND_STYLES} itemClassName="flex-1" />
      {isTransparent ? null : style === 'solid' ? (
        <SwatchHex value={fields.qrBg} fallback="#ffffff" onChange={(picked) => setField('qrBg', picked)} label="Background" />
      ) : (
        <ColorPair
          label="Background"
          start={fields.qrBg}
          end={fields.qrBgColor2}
          fallbackStart="#ffffff"
          fallbackEnd="#e5e7eb"
          onStart={(picked) => setField('qrBg', picked)}
          onEnd={(picked) => setField('qrBgColor2', picked)}
        />
      )}
      {!isTransparent && style === 'linear' ? <AngleField value={fields.qrBgAngle} onChange={(picked) => setField('qrBgAngle', picked)} /> : null}
    </FieldSet>
  )
}

interface ColorsProps extends BackgroundProps {}

// Color panel: foreground, background, and finder patterns.
export function Colors({ fields, setField, setFields }: ColorsProps) {
  return (
    <FieldGroup className="gap-6">
      <Foreground fields={fields} setField={setField} />
      <Background fields={fields} setField={setField} setFields={setFields} />
      <FieldSet>
        <FieldLegend variant="label">Finder patterns</FieldLegend>
        <div className="flex flex-wrap gap-3">
          <Field className="w-52">
            <FieldLabel className="text-muted-foreground">Outer</FieldLabel>
            <SwatchHex value={fields.qrCornerOuterColor} fallback="#111827" onChange={(picked) => setField('qrCornerOuterColor', picked)} label="Outer finder color" />
          </Field>
          <Field className="w-52">
            <FieldLabel className="text-muted-foreground">Inner</FieldLabel>
            <SwatchHex value={fields.qrCornerInnerColor} fallback="#111827" onChange={(picked) => setField('qrCornerInnerColor', picked)} label="Inner finder color" />
          </Field>
        </div>
      </FieldSet>
    </FieldGroup>
  )
}
