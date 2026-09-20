import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Code2, Copy, Download, FileCode } from 'lucide-react'
import { copyText, downloadPngFromSvg, downloadSvg } from '@/utils/qrcode'
import { Button } from '@/comps/ui/button'
import { ButtonGroup } from '@/comps/ui/button-group'
import type { ComponentType, SVGProps } from 'react'

// Flashes a check on the used button, then clears itself.
function useFlash(durationMs = 1600): [string, (id: string) => void] {
  const [flashedId, setFlashedId] = useState('')
  const timerRef = useRef<number | undefined>(undefined)
  useEffect(() => () => clearTimeout(timerRef.current), [])
  const flash = useCallback(
    (id: string) => {
      setFlashedId(id)
      clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setFlashedId(''), durationMs)
    },
    [durationMs]
  )
  return [flashedId, flash]
}

interface IconActionProps {
  id: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  flashedId: string
  disabled?: boolean
  onClick: () => Promise<void>
}

// One square export action with flash feedback.
function IconAction({ id, label, icon: Icon, flashedId, disabled, onClick }: IconActionProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="key-raised flex-1 rounded-md border-2 border-foreground bg-card"
    >
      {flashedId === id ? <Check aria-hidden /> : <Icon aria-hidden />}
    </Button>
  )
}

interface ExportProps {
  canExport: boolean
  fullSvg: () => string
  payloadText: string
}

// Download and copy actions; best-effort so failures no-op.
export function Export({ canExport, fullSvg, payloadText }: ExportProps) {
  const [flashedId, flash] = useFlash()

  const guarded = (id: string, action: () => Promise<unknown> | unknown) => async () => {
    if (!canExport) return
    try {
      await action()
      flash(id)
    } catch {
      /* Blocked download or clipboard just no-ops. */
    }
  }

  return (
    <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 lg:shrink">
      <Button size="lg" disabled={!canExport} onClick={guarded('png', () => downloadPngFromSvg(fullSvg()))} className="key-raised rounded-md border-2 border-foreground font-heading font-bold tracking-tight">
        {flashedId === 'png' ? <Check data-icon="inline-start" aria-hidden /> : <Download data-icon="inline-start" aria-hidden />}
        {flashedId === 'png' ? 'Saved' : 'Download PNG'}
      </Button>
      <ButtonGroup className="w-full">
        <IconAction id="svg" label="Download SVG" icon={FileCode} flashedId={flashedId} disabled={!canExport} onClick={guarded('svg', () => downloadSvg(fullSvg()))} />
        <IconAction id="text" label="Copy payload" icon={Copy} flashedId={flashedId} disabled={!canExport} onClick={guarded('text', () => copyText(payloadText))} />
        <IconAction id="code" label="Copy SVG markup" icon={Code2} flashedId={flashedId} disabled={!canExport} onClick={guarded('code', () => copyText(fullSvg()))} />
      </ButtonGroup>
    </div>
  )
}
