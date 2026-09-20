import { useId } from 'react'
import { cn } from '@/lib/utils'
import { Field, FieldDescription, FieldLabel } from '@/comps/ui/field'
import { Input } from '@/comps/ui/input'
import { Textarea } from '@/comps/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/comps/ui/toggle-group'
import type { ComponentType, InputHTMLAttributes, SVGProps, TextareaHTMLAttributes } from 'react'

// Selected reads as a raised amber key: offset shadow plus travel on press.
const pressed =
  'aria-pressed:border-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground aria-pressed:shadow-brutal-sm hover:aria-pressed:bg-accent active:aria-pressed:translate-x-0.5 active:aria-pressed:translate-y-0.5 active:aria-pressed:shadow-none'

interface ChoiceProps<T extends string> {
  value: T
  onChange: (picked: T) => void
  options: readonly (readonly [T, string, ComponentType<SVGProps<SVGSVGElement>>?])[]
  label: string
  className?: string
  itemClassName?: string
  size?: 'sm' | 'default' | 'lg'
  disabledValues?: string[]
}

// Single-select radiogroup; ignores empty deselect to keep one checked.
export function Choice<T extends string>({ value, onChange, options, label, className, itemClassName, size = 'sm', disabledValues }: ChoiceProps<T>) {
  return (
    <ToggleGroup
      role="radiogroup"
      aria-label={label}
      value={[value]}
      onValueChange={(selected: string[]) => {
        const first = selected[0]
        if (first) onChange(first as T)
      }}
      className={cn('flex w-full flex-wrap', className)}
    >
      {options.map(([choice, text, Icon]) => (
        <ToggleGroupItem
          key={choice}
          value={choice}
          role="radio"
          aria-checked={value === choice}
          variant="outline"
          size={size}
          disabled={disabledValues?.includes(choice)}
          title={text}
          className={cn(pressed, 'min-h-11 min-w-11', itemClassName)}
        >
          {Icon ? <Icon aria-hidden /> : null}
          {text}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: string
}

// Labeled text input with optional description.
export function TextField({ label, description, required, className, id: inputId, ...props }: TextFieldProps) {
  const autoId = useId()
  const id = inputId || autoId
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden className="font-bold text-destructive">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only">(required)</span> : null}
      </FieldLabel>
      <Input id={id} required={required} aria-required={required || undefined} {...props} />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}

interface AreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  description?: string
}

// Labeled textarea with optional description.
export function AreaField({ label, description, required, className, id: inputId, ...props }: AreaFieldProps) {
  const autoId = useId()
  const id = inputId || autoId
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden className="font-bold text-destructive">
            *
          </span>
        ) : null}
        {required ? <span className="sr-only">(required)</span> : null}
      </FieldLabel>
      <Textarea id={id} required={required} aria-required={required || undefined} className="min-h-18 resize-none" {...props} />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
    </Field>
  )
}
