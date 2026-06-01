'use client'

import { useEffect } from 'react'

import { useThemeStore } from '@/stores/theme-store'

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

type ThemeProviderProps = {
  children: React.ReactNode
  initialIsDark: boolean
}

export function ThemeProvider({ children, initialIsDark }: ThemeProviderProps) {
  const { setTheme, isDark } = useThemeStore()

  // Hydrate the store from the server-rendered cookie value on mount
  useEffect(() => {
    setTheme(initialIsDark)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync .dark class on <html> and persist to cookie whenever isDark changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`
  }, [isDark])

  return <>{children}</>
}
