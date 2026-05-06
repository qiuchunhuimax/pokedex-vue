import { ref, watch } from 'vue'

const STORAGE_KEY = 'pokedex-fontsize'
const MIN = 12
const MAX = 24
const BASE_REF = 16

const FS_BASES: Record<string, number> = {
  '--fs-body':         16,
  '--fs-title':        28,
  '--fs-subtitle':     13,
  '--fs-control':      12,
  '--fs-input':        14,
  '--fs-cell-num':      9,
  '--fs-cell-name':     8,
  '--fs-type-badge':    7,
  '--fs-detail-title': 22,
  '--fs-detail-body':  14,
  '--fs-detail-label': 11,
}

export function useFontSize() {
  const stored = Number(localStorage.getItem(STORAGE_KEY)) || BASE_REF
  const fontSize = ref<number>(Math.min(MAX, Math.max(MIN, stored)))

  watch(fontSize, (size) => {
    const scale = size / BASE_REF
    const root = document.documentElement
    for (const [token, base] of Object.entries(FS_BASES)) {
      root.style.setProperty(token, `${Math.max(7, base * scale).toFixed(1)}px`)
    }
    localStorage.setItem(STORAGE_KEY, String(size))
  }, { immediate: true })

  return {
    fontSize,
    MIN,
    MAX,
    setFontSize(n: number) {
      fontSize.value = Math.min(MAX, Math.max(MIN, n))
    },
  }
}
