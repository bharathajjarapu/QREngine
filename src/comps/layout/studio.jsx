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
    <div className="qn-layout flex min-h-0 flex-1 flex-col px-4 pb-2 min-[1080px]:px-8 min-[1080px]:pb-3">
      <section
        className="w-full shrink-0 max-[1079px]:contents min-[1080px]:flex min-[1080px]:min-h-0 min-[1080px]:flex-col min-[1080px]:qn-studio min-[1080px]:overflow-hidden min-[1080px]:h-[clamp(22rem,calc(100dvh-10.25rem),40rem)] min-[1080px]:max-h-[clamp(22rem,calc(100dvh-10.25rem),40rem)] min-[1280px]:h-[clamp(24rem,calc(100dvh-9.5rem),46rem)] min-[1280px]:max-h-[clamp(24rem,calc(100dvh-9.5rem),46rem)]"
        aria-label="Studio"
      >
        <div className="flex min-h-0 w-full flex-1 flex-col gap-6 max-[1079px]:w-full max-[1079px]:gap-8 max-[1079px]:rounded-none max-[1079px]:border-0 max-[1079px]:bg-transparent overflow-visible rounded-xl border-2 border-solid border-qn-line/70 min-[1080px]:grid min-[1080px]:min-h-0 min-[1080px]:flex-1 min-[1080px]:grid-cols-[minmax(0,1.22fr)_minmax(0,0.88fr)] min-[1080px]:grid-rows-1 min-[1080px]:items-stretch min-[1080px]:gap-0 min-[1080px]:overflow-hidden min-[1080px]:bg-qn-surface">
          <div className="max-[1079px]:contents min-[1080px]:flex min-[1080px]:h-full min-[1080px]:min-h-0 min-[1080px]:min-w-0 min-[1080px]:flex-col min-[1080px]:bg-qn-surface">
            <div className="qn-studio-pane flex w-full min-w-0 flex-col gap-2 max-[1079px]:gap-3 max-[1079px]:overflow-visible max-[1079px]:p-0 min-[1080px]:min-h-0 min-[1080px]:flex-1 min-[1080px]:gap-2.5 min-[1080px]:overflow-y-auto min-[1080px]:p-6 [scrollbar-gutter:stable]">
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
            className="qn-studio-aside relative flex min-h-0 min-w-0 flex-col gap-4 max-[1079px]:gap-5 max-[1079px]:overflow-visible max-[1079px]:bg-transparent [scrollbar-gutter:stable] min-[1080px]:h-full min-[1080px]:gap-2 min-[1080px]:overflow-y-auto min-[1080px]:bg-qn-surface min-[1080px]:p-6 before:pointer-events-none before:content-[''] max-[1079px]:before:hidden min-[1080px]:before:absolute min-[1080px]:before:inset-y-0 min-[1080px]:before:left-0 min-[1080px]:before:w-[2px] min-[1080px]:before:bg-qn-line/70"
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
