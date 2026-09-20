import { useEffect, useId, useRef, useState } from 'react'
import { FileImage, Link2, Trash2, Upload } from 'lucide-react'
import { Button } from '@/comps/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/comps/ui/field'
import { Input } from '@/comps/ui/input'
import { Slider } from '@/comps/ui/slider'
import type { QrFields, SetField } from '@/types'
import type { ChangeEvent, DragEvent } from 'react'

const MAX_BYTES = 600_000
const MAX_KB = Math.round(MAX_BYTES / 1000)
const ACCEPTED_TYPES = 'image/png,image/jpeg,image/gif,image/svg+xml,image/webp'

interface LogoProps {
  fields: QrFields
  setField: SetField
  hasLogo: boolean
}

// Logo panel: file upload or URL plus size slider.
export function Logo({ fields, setField, hasLogo }: LogoProps) {
  const [isTooBig, setIsTooBig] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement | null>(null)
  const timerRef = useRef<number | undefined>(undefined)
  const fileId = useId()
  const urlId = useId()
  const sizeId = useId()

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const hasFile = !!String(fields.qrLogoDataUrl || '').trim()
  const logoPercent = Math.round((Number(fields.qrLogoSize) || 0.28) * 100)

  const onFile = (event: ChangeEvent<HTMLInputElement> | { target: { files?: File[] | null } }) => {
    const file = event.target.files?.[0]
    clearTimeout(timerRef.current)
    if (!file) {
      setIsTooBig(false)
      setFileName('')
      setField('qrLogoDataUrl', '')
      return
    }
    if (file.size > MAX_BYTES) {
      setIsTooBig(true)
      setFileName('')
      setField('qrLogoDataUrl', '')
      timerRef.current = window.setTimeout(() => setIsTooBig(false), 5000)
      return
    }
    setIsTooBig(false)
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setField('qrLogoDataUrl', String(reader.result || ''))
    reader.onerror = () => {
      setFileName('')
      setField('qrLogoDataUrl', '')
    }
    reader.readAsDataURL(file)
  }

  const clearLogo = () => {
    if (fileRef.current) fileRef.current.value = ''
    setIsTooBig(false)
    setFileName('')
    setField('qrLogoDataUrl', '')
    setField('qrLogoUrl', '')
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const file = event.dataTransfer?.files?.[0]
    if (!file) return
    if (fileRef.current) {
      const transfer = new DataTransfer()
      transfer.items.add(file)
      fileRef.current.files = transfer.files
    }
    onFile({ target: { files: [file] } })
  }

  return (
    <FieldGroup className="w-full min-w-0 gap-6">
      <Field data-invalid={isTooBig || undefined} className="min-w-0">
        <FieldLabel htmlFor={fileId}>Upload</FieldLabel>
        <label
          htmlFor={fileId}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
          className="flex min-h-28 w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md border-2 border-dashed border-foreground bg-card px-4 py-6 text-center shadow-brutal-sm transition-all hover:-translate-y-px focus-within:-translate-y-px focus-within:shadow-brutal has-focus-visible:-translate-y-px has-focus-visible:shadow-brutal"
        >
          <span className="grid size-10 place-items-center rounded-md border-2 border-foreground bg-accent text-accent-foreground shadow-brutal-sm" aria-hidden>
            {fileName ? <FileImage className="size-5" /> : <Upload className="size-5" />}
          </span>
          {fileName ? (
            <span className="w-full max-w-full truncate px-2 font-heading text-sm font-bold" aria-hidden>
              {fileName}
            </span>
          ) : (
            <span className="font-heading text-sm font-bold" aria-hidden>
              Drop an image or click to browse
            </span>
          )}
          <span className="text-xs text-muted-foreground" aria-hidden>
            PNG, JPG, GIF, WebP or SVG, up to {MAX_KB}&nbsp;KB
          </span>
          <Input
            id={fileId}
            ref={fileRef}
            type="file"
            accept={ACCEPTED_TYPES}
            aria-label="Logo image file"
            aria-invalid={isTooBig || undefined}
            onChange={onFile}
            className="sr-only"
          />
        </label>
        {isTooBig ? (
          <FieldError>That image is over {MAX_KB}&nbsp;KB. Pick a smaller one, or paste a URL instead.</FieldError>
        ) : null}
      </Field>

      <FieldSeparator>or</FieldSeparator>

      <Field data-disabled={hasFile || undefined}>
        <FieldLabel htmlFor={urlId}>Image URL</FieldLabel>
        <div className="relative">
          <Link2 aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={urlId}
            type="url"
            inputMode="url"
            spellCheck={false}
            autoComplete="off"
            placeholder="https://…"
            disabled={hasFile}
            value={fields.qrLogoUrl}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setField('qrLogoUrl', event.target.value)}
            className="pr-3 pl-9"
          />
        </div>
        <FieldDescription>
          {hasFile ? 'Remove the file for URL.' : 'Fetched locally, never uploaded.'}
        </FieldDescription>
      </Field>

      {hasLogo ? (
        <>
          <Field>
            <FieldLabel htmlFor={sizeId} className="justify-between">
              Logo size
              <span className="font-mono text-xs tabular-nums text-muted-foreground">{logoPercent}%</span>
            </FieldLabel>
            <Slider
              id={sizeId}
              aria-label="Logo size"
              className="py-1.5"
              value={Number(fields.qrLogoSize) || 0.28}
              min={0.1}
              max={0.5}
              step={0.02}
              onValueChange={(picked: number) => setField('qrLogoSize', picked)}
            />
            <FieldDescription>Keep the preview scannable.</FieldDescription>
          </Field>
          <Button variant="outline" size="sm" className="w-fit" onClick={clearLogo}>
            <Trash2 data-icon="inline-start" aria-hidden />
            Remove logo
          </Button>
        </>
      ) : (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Upload className="size-4" aria-hidden />
          <span>
            No logo yet. <span className="text-foreground">The QR renders clean.</span>
          </span>
        </p>
      )}
    </FieldGroup>
  )
}
