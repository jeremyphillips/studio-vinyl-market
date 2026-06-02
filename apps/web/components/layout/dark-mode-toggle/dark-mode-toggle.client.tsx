'use client'

import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'


import { thumbVariants, trackVariants } from './dark-mode-toggle.variants'

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

type DarkModeToggleProps = {
  initialIsDark: boolean
}

export function DarkModeToggle({ initialIsDark }: DarkModeToggleProps) {
  const [isDark, setIsDark] = useState(initialIsDark)

  function toggle() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    document.cookie = `theme=${next ? 'dark' : 'light'}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`
  }

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      className={trackVariants({ checked: isDark })}
    >
      <span className={thumbVariants({ checked: isDark })}>
        {isDark ? (
          <Moon className="h-3 w-3" aria-hidden />
        ) : (
          <Sun className="h-3 w-3" aria-hidden />
        )}
      </span>
    </button>
  )
}
