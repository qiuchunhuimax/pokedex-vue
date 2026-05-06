<template>
  <div class="controls">
    <div class="controls-row">
      <SearchBar v-model="searchVal" :placeholder="ui.searchPlaceholder" />

      <button
        class="ctrl-btn fav-filter-btn"
        :class="{ active: showFavs }"
        @click="setShowFavs(!showFavs)"
      >
        {{ showFavs ? '♥' : '♡' }} {{ ui.favorites }}
        <span v-if="favCount > 0" class="fav-count">{{ favCount }}</span>
      </button>

      <button class="ctrl-btn lang-btn" @click="cycleLanguage()">
        {{ langLabel }}
      </button>

      <button class="ctrl-btn theme-btn" @click="toggleTheme()">
        <span v-if="theme === 'dark'">☀</span>
        <span v-else>☾</span>
      </button>

      <div class="font-ctrl">
        <button class="font-step" @click="setFontSize(fontSize - 1)" :disabled="fontSize <= MIN">A−</button>
        <input
          type="range"
          class="font-slider"
          :min="MIN"
          :max="MAX"
          :value="fontSize"
          @input="setFontSize(Number(($event.target as HTMLInputElement).value))"
        />
        <button class="font-step" @click="setFontSize(fontSize + 1)" :disabled="fontSize >= MAX">A+</button>
      </div>
    </div>

    <TypeFilter v-model="activeTypeVal" :allLabel="ui.all" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import SearchBar from './SearchBar.vue'
import TypeFilter from './TypeFilter.vue'
import {
  LANG_KEY, THEME_KEY, FONTSIZE_KEY,
  SEARCH_KEY, ACTIVE_TYPE_KEY,
  TOGGLE_THEME_KEY, CYCLE_LANG_KEY,
  SET_ACTIVE_TYPE_KEY, SET_SEARCH_KEY, SET_FONTSIZE_KEY,
  FAVORITES_KEY, SHOW_FAVS_KEY, SET_SHOW_FAVS_KEY,
} from '../types'
import { TRANSLATIONS } from '../i18n/translations'
import { useFontSize } from '../composables/useFontSize'

const lang          = inject(LANG_KEY)!
const theme         = inject(THEME_KEY)!
const fontSize      = inject(FONTSIZE_KEY)!
const search        = inject(SEARCH_KEY)!
const activeType    = inject(ACTIVE_TYPE_KEY)!
const toggleTheme   = inject(TOGGLE_THEME_KEY)!
const cycleLanguage = inject(CYCLE_LANG_KEY)!
const setActiveType = inject(SET_ACTIVE_TYPE_KEY)!
const setSearch     = inject(SET_SEARCH_KEY)!
const setFontSize   = inject(SET_FONTSIZE_KEY)!
const favorites     = inject(FAVORITES_KEY)!
const showFavs      = inject(SHOW_FAVS_KEY)!
const setShowFavs   = inject(SET_SHOW_FAVS_KEY)!

const { MIN, MAX } = useFontSize()

const ui = computed(() => TRANSLATIONS[lang.value])
const favCount = computed(() => favorites.value.size)

const langLabel = computed(() => {
  if (lang.value === 'zh') return '中文'
  if (lang.value === 'ja') return '日本語'
  return 'English'
})

const searchVal = computed({
  get: () => search.value,
  set: (v) => setSearch(v),
})

const activeTypeVal = computed({
  get: () => activeType.value,
  set: (v) => setActiveType(v),
})
</script>

<style scoped>
.controls {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px 8px;
  margin-bottom: 12px;
}
.controls-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ctrl-btn {
  padding: 6px 12px;
  background: var(--bg3);
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  color: var(--txt);
  font-size: var(--fs-control);
  font-weight: 600;
  transition: background 0.12s, border-color 0.12s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}
.ctrl-btn:hover { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
.ctrl-btn.active { background: #fbbf2422; border-color: #fbbf24; color: #fbbf24; }

.fav-count {
  background: #fbbf24;
  color: #000;
  font-size: 10px;
  padding: 0 5px;
  border-radius: 8px;
  font-weight: 700;
}

.font-ctrl {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.font-step {
  font-size: var(--fs-control);
  color: var(--txt2);
  padding: 4px 6px;
  border-radius: 6px;
  background: var(--bg3);
  border: 1px solid var(--border);
  transition: color 0.12s;
  line-height: 1;
}
.font-step:not(:disabled):hover { color: var(--accent); }
.font-step:disabled { opacity: 0.4; cursor: not-allowed; }

.font-slider {
  width: 80px;
  accent-color: var(--accent);
  cursor: pointer;
}
</style>
