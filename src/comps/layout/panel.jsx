export function Panel({ title, isOpen, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-md border-2 border-qn-line/75 bg-qn-panel">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex min-h-11 w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left transition [-webkit-tap-highlight-color:transparent] hover:bg-qn-muted/[0.06] md:min-h-0 md:px-3 md:py-2"
      >
        <span className="min-w-0 qn-accordion-title">{title}</span>
        <span className="w-4 shrink-0 text-center font-mono text-sm leading-none text-qn-muted tabular-nums" aria-hidden>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen ? <div className="border-t-2 border-qn-line/70 bg-qn-surface px-2.5 py-2.5 md:px-3 md:py-3">{children}</div> : null}
    </div>
  )
}
