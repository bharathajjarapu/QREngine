import { useCallback, useEffect, useState } from 'react'
import { IconGithub, IconMoon, IconSun } from './icons'
import { getResolvedTheme, THEME_STORAGE_KEY, toggleTheme } from '../../utils/theme'

export function Header() {
  const [theme, setTheme] = useState(() => getResolvedTheme())
  const onThemeClick = useCallback(() => {
    setTheme(toggleTheme())
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onOsChange = () => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) setTheme(getResolvedTheme())
    }
    mq.addEventListener('change', onOsChange)
    return () => mq.removeEventListener('change', onOsChange)
  }, [])

  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  const icon = theme === 'dark' ? <IconMoon /> : <IconSun />

  return (
    <header className="w-full shrink-0 px-3 pt-3 pb-3 sm:px-4 min-[1080px]:px-8 min-[1080px]:pt-3 min-[1080px]:pb-2 lg:px-8">
      <div className="flex w-full min-w-0 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center justify-start gap-3">
          <span
            className="grid size-9 shrink-0 grid-cols-3 grid-rows-3 gap-0.5 rounded-sm border border-qn-line bg-qn-panel p-1 sm:size-10"
            aria-hidden
          >
            {Array.from({ length: 9 }, (_, i) => (
              <span
                key={i}
                className={`rounded-[1px] ${[0, 2, 3, 4, 6, 8].includes(i) ? 'bg-qn-ink' : 'bg-qn-line'}`}
              />
            ))}
          </span>
          <span className="brand-wordmark min-w-0 truncate text-[1.65rem] leading-none font-semibold tracking-[-0.05em] text-qn-ink sm:text-[1.8rem] min-[1080px]:text-[1.95rem] lg:text-[2rem]">
            QREngine
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onThemeClick} className="qn-iconbtn-lg" aria-label={label} title={label}>
            {icon}
          </button>
          <a
            href="https://github.com/bharathajjarapu/QREngine"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-flex shrink-0 qn-iconbtn-lg"
            aria-label="GitHub repository"
            title="GitHub"
          >
            <IconGithub />
            <span className="qn-tip">GitHub Repo</span>
          </a>
        </div>
      </div>
    </header>
  )
}
