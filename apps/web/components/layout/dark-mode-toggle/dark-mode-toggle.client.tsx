'use client'

import { Moon, Sun } from 'lucide-react'

import { useThemeStore } from '@/stores/theme-store'

import { thumbVariants, trackVariants } from './dark-mode-toggle.variants'

export function DarkModeToggle() {
  const { isDark, toggle } = useThemeStore()

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
