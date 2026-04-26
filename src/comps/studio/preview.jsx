export function Preview({ qrSvg, qrErr, qrIntro, busy, errMsg }) {
  return (
    <div className="flex w-full min-w-0 shrink-0 flex-col gap-1.5 md:gap-2 py-0" aria-live="polite">
      <div className="qn-frame flex aspect-square w-full min-h-0 min-w-0 flex-col items-center justify-center gap-2 text-center">
        {qrSvg ? (
          <div
            className={`flex size-full min-h-0 items-center justify-center [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-full [&>svg]:max-w-full ${qrIntro ? 'animate-qr-first' : ''}`}
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
        ) : qrErr ? (
          <span className="px-2 text-sm font-medium leading-snug text-qn-danger" role="alert">
            This content is too long or too complex for a scannable QR. Try shorter text, fewer fields, or a smaller event.
          </span>
        ) : busy ? (
          <span className="px-2 text-sm font-medium leading-snug text-qn-muted">Updating preview…</span>
        ) : (
          <span className="px-2 text-sm font-medium leading-snug text-qn-muted" aria-hidden>
            QR
          </span>
        )}
      </div>

      {errMsg ? (
        <p className="w-full min-w-0 text-center text-xs font-medium leading-snug text-qn-danger" role="status">
          {errMsg}
        </p>
      ) : null}
    </div>
  )
}
