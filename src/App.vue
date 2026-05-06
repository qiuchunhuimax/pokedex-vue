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
      <PokemonGrid />
      <ComparePanel />
    </main>

    <DetailModal />

    <footer class="app-footer">
      Pokémon data © Nintendo / Game Freak &nbsp;·&nbsp; Sprites via PokéAPI
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import Controls     from './components/Controls.vue'
import PokemonGrid  from './components/PokemonGrid.vue'
import DetailModal  from './components/DetailModal.vue'
import ComparePanel from './components/ComparePanel.vue'

import { useTheme }     from './composables/useTheme'
import { useLanguage }  from './composables/useLanguage'
import { useFontSize }  from './composables/useFontSize'
import { useFavorites } from './composables/useFavorites'

import { POKEMON } from './data/pokemon'
import { TRANSLATIONS } from './i18n/translations'

import {
  LANG_KEY, THEME_KEY, FONTSIZE_KEY,
  SEARCH_KEY, ACTIVE_TYPE_KEY, VISIBLE_IDS_KEY,
  TOGGLE_THEME_KEY, CYCLE_LANG_KEY,
  SET_ACTIVE_TYPE_KEY, SET_SEARCH_KEY, SET_FONTSIZE_KEY,
  FAVORITES_KEY, TOGGLE_FAV_KEY, SHOW_FAVS_KEY, SET_SHOW_FAVS_KEY,
  COMPARE_LIST_KEY, TOGGLE_COMPARE_KEY, CLEAR_COMPARE_KEY,
  MODAL_KEY, OPEN_MODAL_KEY, CLOSE_MODAL_KEY,
} from './types'
import type { Pokemon, PokemonType } from './types'

// ── composables ───────────────────────────────────────────────────────────
const { theme, toggleTheme }    = useTheme()
const { lang, cycleLanguage }   = useLanguage()
const { fontSize, setFontSize } = useFontSize()
const { favorites, toggleFav }  = useFavorites()

// ── local state ───────────────────────────────────────────────────────────
const search      = ref('')
const activeType  = ref<PokemonType | null>(null)
const showFavs    = ref(false)
const modalPokemon = ref<Pokemon | null>(null)
const compareList  = ref<Pokemon[]>([])

// ── derived ───────────────────────────────────────────────────────────────
const visibleIds = computed(() => {
  const q = search.value.trim().toLowerCase()
  return new Set(
    POKEMON
      .filter(p => {
        if (showFavs.value && !favorites.value.has(p.id)) return false
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

// ── compare helpers ───────────────────────────────────────────────────────
function toggleCompare(p: Pokemon) {
  const idx = compareList.value.findIndex(x => x.id === p.id)
  if (idx !== -1) {
    compareList.value = compareList.value.filter(x => x.id !== p.id)
  } else if (compareList.value.length < 2) {
    compareList.value = [...compareList.value, p]
  }
}

function clearCompare() {
  compareList.value = []
}

// ── modal helpers ─────────────────────────────────────────────────────────
function openModal(p: Pokemon) {
  modalPokemon.value = p
}

function closeModal() {
  modalPokemon.value = null
}

// ── provide ───────────────────────────────────────────────────────────────
provide(LANG_KEY,          lang)
provide(THEME_KEY,         theme)
provide(FONTSIZE_KEY,      fontSize)
provide(SEARCH_KEY,        search)
provide(ACTIVE_TYPE_KEY,   activeType)
provide(VISIBLE_IDS_KEY,   visibleIds)
provide(TOGGLE_THEME_KEY,  toggleTheme)
provide(CYCLE_LANG_KEY,    cycleLanguage)
provide(SET_ACTIVE_TYPE_KEY, (t: PokemonType | null) => { activeType.value = t })
provide(SET_SEARCH_KEY,      (s: string)             => { search.value = s })
provide(SET_FONTSIZE_KEY,    setFontSize)

provide(FAVORITES_KEY,     favorites)
provide(TOGGLE_FAV_KEY,    toggleFav)
provide(SHOW_FAVS_KEY,     showFavs)
provide(SET_SHOW_FAVS_KEY, (v: boolean) => { showFavs.value = v })

provide(COMPARE_LIST_KEY,   compareList)
provide(TOGGLE_COMPARE_KEY, toggleCompare)
provide(CLEAR_COMPARE_KEY,  clearCompare)

provide(MODAL_KEY,       modalPokemon)
provide(OPEN_MODAL_KEY,  openModal)
provide(CLOSE_MODAL_KEY, closeModal)
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
  max-width: 1400px;
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
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 16px 20px;
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
