export function Glyph({ kind }) {
  const common = 'size-5 shrink-0 text-current'
  switch (kind) {
    case 'link':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M10 13a5 5 0 0 1 7.07 0l1.41 1.41a5 5 0 0 1-7.07 7.07l-1.06 1.06M14 11a5 5 0 0 0-7.07 0L5.52 12.41a5 5 0 1 0 7.07 7.07l1.06-1.06" strokeLinecap="round" />
        </svg>
      )
    case 'text':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 7h16M4 12h10M4 17h14" strokeLinecap="round" />
        </svg>
      )
    case 'wifi':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M5 12.55a11 11 0 0 1 14.08 0M8.53 16.11a6 6 0 0 1 6.94 0M12 20h.01" strokeLinecap="round" />
        </svg>
      )
    case 'phone':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'email':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" strokeLinejoin="round" />
          <path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'sms':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" strokeLinejoin="round" />
        </svg>
      )
    case 'contact':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M6 19.5v-.5a6 6 0 0 1 12 0v.5" strokeLinecap="round" />
        </svg>
      )
    case 'location':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11z" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'event':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="2" strokeLinejoin="round" />
          <path d="M16 3v4M8 3v4M3 11h18" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}
