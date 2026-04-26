import { Content } from '../studio/content'
import { Colors } from '../studio/colors'
import { Export } from '../studio/export'
import { Logo } from '../studio/logo'
import { Panel } from './panel'
import { Preview } from '../studio/preview'
import { Shape } from '../studio/shape'

export function Studio({
  fields,
  setField,
  setFields,
  mapZoom,
  setMapZoom,
  open,
  toggle,
  qrCapMsg,
  hasUserLogo,
  hasPresetLogo,
  hasLogo,
  presetKey,
  qrExportPx,
  ecDisplay,
  ready,
  getFull,
  payloadText,
  previewIn,
  debouncedPreview,
  payload,
  qrSvg,
  qrErr,
  qrIntro,
  errMsg,
}) {
  const busy = !!(payload.ok && previewIn && previewIn !== debouncedPreview)

  return (
    <div className="qn-layout flex min-h-0 flex-1 flex-col px-4 pb-2 md:px-8 md:pb-3">
      <section
        className="w-full shrink-0 max-md:contents md:flex md:min-h-0 md:flex-col md:qn-studio md:overflow-hidden md:h-[min(72dvh,40rem)] md:max-h-[min(72dvh,40rem)] lg:h-[min(78dvh,46rem)] lg:max-h-[min(78dvh,46rem)]"
        aria-label="Studio"
      >
        <div className="flex min-h-0 w-full flex-1 flex-col gap-6 max-md:w-full max-md:gap-8 max-md:rounded-none max-md:border-0 max-md:bg-transparent overflow-visible rounded-xl border-2 border-solid border-qn-line/70 md:grid md:min-h-0 md:flex-1 md:grid-cols-[minmax(0,1.22fr)_minmax(0,0.88fr)] md:grid-rows-1 md:items-stretch md:gap-0 md:overflow-hidden md:bg-qn-surface">
          <div className="max-md:contents md:flex md:h-full md:min-h-0 md:min-w-0 md:flex-col md:bg-qn-surface">
            <div className="flex w-full min-w-0 flex-col gap-2 max-md:gap-3 max-md:overflow-visible max-md:p-0 md:min-h-0 md:flex-1 md:gap-2.5 md:overflow-y-auto md:p-6 [scrollbar-gutter:stable]">
              <Panel title="QR" isOpen={open === 'content'} onToggle={() => toggle('content')}>
                <Content
                  fields={fields}
                  setField={setField}
                  mapZoom={mapZoom}
                  setMapZoom={setMapZoom}
                  qrCapMsg={qrCapMsg}
                />
              </Panel>

              <Panel title="Layout" isOpen={open === 'shape'} onToggle={() => toggle('shape')}>
                <Shape
                  fields={fields}
                  setField={setField}
                  qrExportPx={qrExportPx}
                  hasLogo={hasLogo}
                  ecDisplay={ecDisplay}
                />
              </Panel>

              <Panel title="Colors" isOpen={open === 'colors'} onToggle={() => toggle('colors')}>
                <Colors fields={fields} setField={setField} setFields={setFields} />
              </Panel>

              <Panel title="Logo Design" isOpen={open === 'logo'} onToggle={() => toggle('logo')}>
                <Logo
                  fields={fields}
                  setField={setField}
                  hasUserLogo={hasUserLogo}
                  hasPresetLogo={hasPresetLogo}
                  hasLogo={hasLogo}
                  presetKey={presetKey}
                />
              </Panel>
            </div>
          </div>

          <aside
            className="relative flex min-h-0 min-w-0 flex-col gap-4 max-md:gap-5 max-md:overflow-visible max-md:bg-transparent [scrollbar-gutter:stable] md:h-full md:gap-2 md:overflow-y-auto md:bg-qn-surface md:p-6 before:pointer-events-none before:content-[''] max-md:before:hidden md:before:absolute md:before:inset-y-0 md:before:left-0 md:before:w-[2px] md:before:bg-qn-line/70"
            aria-label="QR matrix and export"
          >
            <Preview qrSvg={qrSvg} qrErr={qrErr} qrIntro={qrIntro} busy={busy} errMsg={errMsg} />
            <Export ready={ready} getFull={getFull} payloadText={payloadText} />
          </aside>
        </div>
      </section>
    </div>
  )
}
