import { ImageIcon, Palette, QrCode, Shapes } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/comps/ui/tabs'
import { Colors } from '../studio/colors'
import { Content } from '../studio/content'
import { Export } from '../studio/export'
import { StylePresets } from '../studio/presets'
import { Logo } from '../studio/logo'
import { Preview } from '../studio/preview'
import { Shape } from '../studio/shape'
import type { ComponentType, SVGProps } from 'react'
import type { EcLevel, PayloadResult, QrFields, SetField, SetFields } from '@/types'

const STUDIO_TABS: [string, string, ComponentType<SVGProps<SVGSVGElement>>][] = [
  ['content', 'Type', QrCode],
  ['shape', 'Shape', Shapes],
  ['colors', 'Color', Palette],
  ['logo', 'Logo', ImageIcon],
]

const panelClass = 'animate-panel'

export type StudioTab = 'content' | 'shape' | 'colors' | 'logo'

interface StudioProps {
  fields: QrFields
  setField: SetField
  setFields: SetFields
  activeTab: StudioTab
  setActiveTab: (tab: StudioTab) => void
  capMessage: string | null
  hasLogo: boolean
  exportPx: number
  ecLevelLabel: EcLevel
  canExport: boolean
  fullSvg: () => string
  payloadText: string
  previewText: string
  debouncedPreview: string
  payload: PayloadResult
  svg: string
  hasError: boolean
  errorMessage: string | null
}

// Studio shell: tabbed form on the left, live preview on the right.
export function Studio({
  fields,
  setField,
  setFields,
  activeTab,
  setActiveTab,
  capMessage,
  hasLogo,
  exportPx,
  ecLevelLabel,
  canExport,
  fullSvg,
  payloadText,
  previewText,
  debouncedPreview,
  payload,
  svg,
  hasError,
  errorMessage,
}: StudioProps) {
  const isStale = !!(payload.ok && previewText && previewText !== debouncedPreview)

  return (
    <section
      id="studio"
      aria-label="QR studio"
      tabIndex={-1}
      className="paper-card mb-6 grid min-h-0 scroll-mt-20 overflow-hidden rounded-lg border-2 border-foreground bg-card outline-none lg:mb-4 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_28rem]"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 min-w-0 flex-col gap-0">
        <div className="shrink-0 px-3 pt-3 sm:px-4">
          <TabsList
            variant="line"
            aria-label="Studio sections"
            className="grid h-auto min-h-11 w-full min-w-0 grid-cols-4 items-stretch justify-start gap-1 rounded-none bg-transparent p-0 font-heading sm:gap-2"
          >
            {STUDIO_TABS.map(([value, label, Icon]) => (
              <TabsTrigger key={value} value={value} className="w-full min-w-0 flex-1 gap-1 px-1 sm:gap-1.5 sm:px-2">
                <Icon aria-hidden />
                <span className="truncate">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 pt-4 sm:p-6 sm:pt-5 [scrollbar-gutter:stable]">
          <TabsContent value="content" className={panelClass}>
            <Content fields={fields} setField={setField} capMessage={capMessage} />
          </TabsContent>
          <TabsContent value="shape" className={panelClass}>
            <Shape fields={fields} setField={setField} exportPx={exportPx} hasLogo={hasLogo} ecLevelLabel={ecLevelLabel} />
          </TabsContent>
          <TabsContent value="colors" className={panelClass}>
            <Colors fields={fields} setField={setField} setFields={setFields} />
          </TabsContent>
          <TabsContent value="logo" className={panelClass}>
            <Logo fields={fields} setField={setField} hasLogo={hasLogo} />
          </TabsContent>
        </div>
      </Tabs>

      <aside aria-label="Preview and export" className="flex min-w-0 flex-col gap-5 overflow-hidden border-t-2 border-foreground bg-secondary/40 p-5 sm:p-6 lg:min-h-0 lg:max-h-full lg:justify-center lg:border-t-0 lg:border-l-2 lg:p-8">
        <Preview svg={svg} hasError={hasError} isStale={isStale} errorMessage={errorMessage} />
        <StylePresets setFields={setFields} />
        <Export canExport={canExport} fullSvg={fullSvg} payloadText={payloadText} />
      </aside>
    </section>
  )
}
