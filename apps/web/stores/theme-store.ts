import { create } from 'zustand'

type ThemeStore = {
  isDark: boolean
  setTheme: (isDark: boolean) => void
  toggle: () => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDark: false,
  setTheme: (isDark) => set({ isDark }),
  toggle: () => set((state) => ({ isDark: !state.isDark })),
}))
