export const THEME_STORAGE_KEY = 'qn-theme'

/** Sync `html` classes from localStorage (call before paint and after user change). */
export function initTheme() {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'dark') root.classList.add('dark')
  else if (stored === 'light') root.classList.add('light')
}

/** Effective appearance: explicit class on `html`, else OS preference. */
export function getResolvedTheme() {
  if (typeof document === 'undefined') return 'light'
  const root = document.documentElement
  if (root.classList.contains('dark')) return 'dark'
  if (root.classList.contains('light')) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Toggle only between light and dark; always persists the choice. */
export function toggleTheme() {
  const next = getResolvedTheme() === 'dark' ? 'light' : 'dark'
  const apply = () => {
    localStorage.setItem(THEME_STORAGE_KEY, next)
    initTheme()
  }
  if (typeof document !== 'undefined' && document.startViewTransition && !prefersReducedMotion()) {
    document.startViewTransition(apply)
  } else {
    apply()
  }
  return next
}
