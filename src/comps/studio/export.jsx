import { copyText, downloadPngFromSvg, downloadSvg } from '../../utils/qrcode'
import { IconCode, IconCopy, IconDownload, IconVectorSquare } from '../../config/icons'

function Tool({ label, disabled, onClick, children }) {
  return (
    <div className="group relative w-full md:inline-flex md:w-auto">
      <button
        type="button"
        className="peer inline-flex max-w-full max-md:w-full min-w-0 items-center justify-center gap-2 rounded-md border-0 text-center transition [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qn-ink/35 disabled:pointer-events-none disabled:opacity-40 qn-iconbtn-lg max-md:min-h-12 max-md:max-h-12 max-md:px-4 max-md:py-3 max-md:text-sm max-md:font-semibold max-md:text-qn-ink max-md:active:scale-[0.99] max-md:active:bg-[var(--color-qn-control-on-bg)] max-md:active:text-[var(--color-qn-control-on-fg)] max-md:active:shadow-[inset_0_1px_0_var(--color-qn-control-on-shine)] md:gap-0 md:p-0 md:active:scale-[0.98]"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={onClick}
      >
        <span className="md:hidden">{label}</span>
        <span className="hidden shrink-0 md:inline-flex" aria-hidden="true">
          {children}
        </span>
      </button>
      <span className="qn-tip max-md:hidden">{label}</span>
    </div>
  )
}

export function Export({ ready, getFull, payloadText }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center max-md:items-stretch">
      <div className="flex w-full max-w-full flex-col gap-2 pt-0.5 max-md:items-stretch md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-2.5">
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
