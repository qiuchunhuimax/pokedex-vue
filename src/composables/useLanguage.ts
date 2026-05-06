import { ref, watch } from 'vue'
import type { Language } from '../types'

const STORAGE_KEY = 'pokedex-lang'
const CYCLE: Language[] = ['en', 'zh', 'ja']

export function useLanguage() {
  const stored = (localStorage.getItem(STORAGE_KEY) as Language) ?? 'zh'
  const lang = ref<Language>(stored)

  watch(lang, (l) => localStorage.setItem(STORAGE_KEY, l))

  function cycleLanguage() {
    const idx = CYCLE.indexOf(lang.value)
    lang.value = CYCLE[(idx + 1) % CYCLE.length]
  }

  return { lang, cycleLanguage }
}
