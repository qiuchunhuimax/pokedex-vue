import { ref, watch } from 'vue'

const STORAGE_KEY = 'pokedex-fontsize'
const MIN = 12
const MAX = 24
const BASE_REF = 16

const FS_BASES: Record<string, number> = {
  '--fs-body':         17,
  '--fs-title':        30,
  '--fs-subtitle':     14,
  '--fs-control':      15,
  '--fs-input':        16,
  '--fs-cell-num':     14,
  '--fs-cell-name':    14,
  '--fs-type-badge':   12,
  '--fs-detail-title': 24,
  '--fs-detail-body':  16,
  '--fs-detail-label': 13,
  '--sprite-size':     96,
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
