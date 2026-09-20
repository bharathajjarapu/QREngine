import type { Theme } from '@/types'

export const THEME_STORAGE_KEY = 'qn-theme'

// Syncs html dark/light classes from storage or OS; call before paint.
export function initTheme(): void {
  const htmlEl = document.documentElement
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  const dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  htmlEl.classList.toggle('dark', dark)
  htmlEl.classList.toggle('light', !dark)
}

// Effective appearance: explicit html class, else OS preference.
export function resolveTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  const htmlEl = document.documentElement
  if (htmlEl.classList.contains('dark')) return 'dark'
  if (htmlEl.classList.contains('light')) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// OS reduced-motion guard for the theme crossfade.
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Toggles light/dark and persists the choice.
export function toggleTheme(): Theme {
  const nextTheme: Theme = resolveTheme() === 'dark' ? 'light' : 'dark'
  const apply = () => {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    initTheme()
  }
  if (typeof document !== 'undefined' && document.startViewTransition && !prefersReducedMotion()) {
    document.startViewTransition(apply)
  } else {
    apply()
  }
  return nextTheme
}
