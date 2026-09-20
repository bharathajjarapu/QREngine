import { useCallback, useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { GitHub } from '@/utils/icons'
import { resolveTheme, initTheme, THEME_STORAGE_KEY, toggleTheme } from '@/utils/theme'
import { Button } from '@/comps/ui/button'

// Alternating cells read as QR pixel art at 24px; denser turns to mush.
const MARK_CELLS = [1, 0, 1, 0, 1, 0, 1, 0, 1]

// Logo mark: tiny QR pixel grid.
function Mark() {
  return (
    <span className="grid size-7 shrink-0 grid-cols-3 grid-rows-3 gap-[2px] rounded-[4px] border-2 border-foreground bg-accent p-[3px] shadow-brutal-sm" aria-hidden>
      {MARK_CELLS.map((filled, index) => (
        <span key={index} className={filled ? 'rounded-[1px] bg-foreground' : 'rounded-[1px] bg-foreground/25'} />
      ))}
    </span>
  )
}

// Page header: wordmark, theme toggle, and hero copy.
export function Hero() {
  const [theme, setTheme] = useState(resolveTheme)
  const themeClick = useCallback(() => setTheme(toggleTheme()), [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return
      initTheme()
      setTheme(resolveTheme())
    }
    mediaQuery.addEventListener('change', onSystemChange)
    return () => mediaQuery.removeEventListener('change', onSystemChange)
  }, [])

  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <div className="shrink-0 animate-rise">
      <div className="flex items-center justify-between gap-4 pt-5 sm:pt-6">
        <span className="flex min-w-0 items-center gap-2.5">
          <Mark />
          <span className="truncate font-heading text-xl font-extrabold tracking-tight" translate="no">
            QREngine
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={themeClick} aria-label={themeLabel}>
            {theme === 'dark' ? <Moon aria-hidden /> : <Sun aria-hidden />}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<a href="https://github.com/bharathajjarapu/QREngine" target="_blank" rel="noreferrer" />}
            aria-label="View QREngine on GitHub"
          >
            <GitHub className="size-4" aria-hidden />
          </Button>
        </span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 pt-6 pb-6">
        <div className="min-w-0">
          <h1 className="font-heading text-balance text-4xl leading-[1.02] font-extrabold tracking-tight sm:text-5xl">
            Encode anything as a QR code.
          </h1>
        </div>
        <p className="stamp rotate-3 text-lg text-destructive">
          Runs in your browser
        </p>
      </div>
    </div>
  )
}
