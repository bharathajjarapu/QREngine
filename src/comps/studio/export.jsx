import { copyText, downloadPngFromSvg, downloadSvg } from '../../utils/qrcode'
import { IconCode, IconCopy, IconDownload, IconVectorSquare } from '../chrome/icons'

function Tool({ label, disabled, onClick, children }) {
  return (
    <div className="group relative w-full min-[1080px]:inline-flex min-[1080px]:w-auto">
      <button
        type="button"
        className="peer inline-flex max-w-full max-[1079px]:w-full min-w-0 items-center justify-center gap-2 rounded-md border-0 text-center transition [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qn-ink/35 disabled:pointer-events-none disabled:opacity-40 qn-iconbtn-lg max-[1079px]:min-h-12 max-[1079px]:max-h-12 max-[1079px]:px-4 max-[1079px]:py-3 max-[1079px]:text-sm max-[1079px]:font-semibold max-[1079px]:text-qn-ink max-[1079px]:active:scale-[0.99] max-[1079px]:active:bg-[var(--color-qn-control-on-bg)] max-[1079px]:active:text-[var(--color-qn-control-on-fg)] max-[1079px]:active:shadow-[inset_0_1px_0_var(--color-qn-control-on-shine)] min-[1080px]:gap-0 min-[1080px]:p-0 min-[1080px]:active:scale-[0.98]"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={onClick}
      >
        <span className="min-[1080px]:hidden">{label}</span>
        <span className="hidden shrink-0 min-[1080px]:inline-flex" aria-hidden="true">
          {children}
        </span>
      </button>
      <span className="qn-tip max-[1079px]:hidden">{label}</span>
    </div>
  )
}

export function Export({ ready, getFull, payloadText }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center max-[1079px]:items-stretch">
      <div className="flex w-full max-w-full flex-col gap-2 pt-0.5 max-[1079px]:items-stretch min-[1080px]:flex-row min-[1080px]:flex-wrap min-[1080px]:items-center min-[1080px]:justify-center min-[1080px]:gap-2.5">
        <Tool
          label="Download PNG"
          disabled={!ready}
          onClick={() => {
            if (!ready) return
            void (async () => {
              try {
                await downloadPngFromSvg(getFull())
              } catch {
                /* ignore */
              }
            })()
          }}
        >
          <IconDownload />
        </Tool>
        <Tool
          label="Download SVG"
          disabled={!ready}
          onClick={() => {
            if (!ready) return
            try {
              downloadSvg(getFull())
            } catch {
              /* ignore */
            }
          }}
        >
          <IconVectorSquare />
        </Tool>
        <Tool
          label="Copy Payload"
          disabled={!ready}
          onClick={() => {
            if (!ready) return
            void copyText(payloadText)
          }}
        >
          <IconCopy />
        </Tool>
        <Tool
          label="Copy SVG"
          disabled={!ready}
          onClick={() => {
            if (!ready) return
            void copyText(getFull())
          }}
        >
          <IconCode />
        </Tool>
      </div>
    </div>
  )
}
