<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <div>
          <h1 class="app-title">{{ ui.title }}</h1>
          <p class="app-subtitle">{{ ui.subtitle }}</p>
        </div>
      </div>
    </header>

    <main class="app-main">
      <Controls />
      <div class="content-row">
        <div class="grid-scroll">
          <PokemonGrid />
        </div>
        <DetailPanel />
      </div>
    </main>

    <footer class="app-footer">
      Pokémon data © Nintendo / Game Freak &nbsp;·&nbsp; Sprites via PokéAPI
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import Controls    from './components/Controls.vue'
import PokemonGrid from './components/PokemonGrid.vue'
import DetailPanel from './components/DetailPanel.vue'

import { useTheme }    from './composables/useTheme'
import { useLanguage } from './composables/useLanguage'
import { useFontSize } from './composables/useFontSize'

import { POKEMON } from './data/pokemon'
import { TRANSLATIONS } from './i18n/translations'

import {
  LANG_KEY, THEME_KEY, FONTSIZE_KEY,
  SEARCH_KEY, ACTIVE_TYPE_KEY, SELECTED_KEY, VISIBLE_IDS_KEY,
  TOGGLE_THEME_KEY, CYCLE_LANG_KEY,
  SET_ACTIVE_TYPE_KEY, SET_SELECTED_KEY, SET_SEARCH_KEY, SET_FONTSIZE_KEY,
} from './types'
import type { Pokemon, PokemonType } from './types'

// ── composables ───────────────────────────────────────────────────────────
const { theme, toggleTheme }      = useTheme()
const { lang, cycleLanguage }     = useLanguage()
const { fontSize, setFontSize }   = useFontSize()

// ── local state ───────────────────────────────────────────────────────────
const search       = ref('')
const activeType   = ref<PokemonType | null>(null)
const selected     = ref<Pokemon | null>(null)

// ── derived ───────────────────────────────────────────────────────────────
const visibleIds = computed(() => {
  const q = search.value.trim().toLowerCase()
  return new Set(
    POKEMON
      .filter(p => {
        if (activeType.value && !p.types.includes(activeType.value)) return false
        if (!q) return true
        return (
          p.nameEn.toLowerCase().includes(q) ||
          p.nameZh.includes(q) ||
          p.nameJa.includes(q) ||
          String(p.id).includes(q)
        )
      })
      .map(p => p.id)
  )
})

const ui = computed(() => TRANSLATIONS[lang.value])

// ── provide ───────────────────────────────────────────────────────────────
provide(LANG_KEY,          lang)
provide(THEME_KEY,         theme)
provide(FONTSIZE_KEY,      fontSize)
provide(SEARCH_KEY,        search)
provide(ACTIVE_TYPE_KEY,   activeType)
provide(SELECTED_KEY,      selected)
provide(VISIBLE_IDS_KEY,   visibleIds)
provide(TOGGLE_THEME_KEY,  toggleTheme)
provide(CYCLE_LANG_KEY,    cycleLanguage)
provide(SET_ACTIVE_TYPE_KEY, (t: PokemonType | null) => { activeType.value = t })
provide(SET_SELECTED_KEY,    (p: Pokemon | null)     => { selected.value = p })
provide(SET_SEARCH_KEY,      (s: string)             => { search.value = s })
provide(SET_FONTSIZE_KEY,    setFontSize)
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.app-header {
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-inner {
  max-width: 1600px;
  margin: 0 auto;
  padding: 14px 20px;
}
.app-title {
  font-size: var(--fs-title);
  font-weight: 700;
  color: var(--txt);
  line-height: 1.1;
  margin: 0;
}
.app-subtitle {
  font-size: var(--fs-subtitle);
  color: var(--txt2);
  margin: 3px 0 0;
}

.app-main {
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 20px;
}

.content-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.grid-scroll {
  flex: 1;
  overflow-x: auto;
  min-width: 0;
}

.app-footer {
  text-align: center;
  padding: 14px;
  font-size: var(--fs-control);
  color: var(--txt3);
  border-top: 1px solid var(--border);
  margin-top: 24px;
}
</style>
