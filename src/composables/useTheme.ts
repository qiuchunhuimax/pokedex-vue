import { ref, watch } from 'vue'
import type { ThemeMode } from '../types'

const STORAGE_KEY = 'pokedex-theme'

export function useTheme() {
  const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? 'dark'
  const theme = ref<ThemeMode>(stored)

  watch(theme, (mode) => {
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem(STORAGE_KEY, mode)
  }, { immediate: true })

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
