<template>
  <div class="grid-outer">
    <!-- Generation side labels -->
    <div class="gen-sidebar">
      <div
        v-for="g in ([1,2,3] as const)"
        :key="g"
        class="gen-label"
        :style="{ flex: genRows[g] }"
      >
        <span>{{ ui.gen }}&nbsp;{{ g }}</span>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid-scroll">
      <div class="pokemon-grid">
        <template v-for="row in ROWS" :key="row">
          <template v-for="col in COLS" :key="`${row}-${col}`">
            <PokemonCell
              v-if="cellMap.get(`${row}-${col}`)"
              :pokemon="cellMap.get(`${row}-${col}`)!"
              :faded="!visibleIds.has(cellMap.get(`${row}-${col}`)!.id)"
              :selected="selected?.id === cellMap.get(`${row}-${col}`)!.id"
              :style="{ gridRow: row, gridColumn: col }"
              @click="setSelected(cellMap.get(`${row}-${col}`) ?? null)"
            />
            <div
              v-else
              class="grid-empty"
              :style="{ gridRow: row, gridColumn: col }"
            />
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import PokemonCell from './PokemonCell.vue'
import { POKEMON } from '../data/pokemon'
import { VISIBLE_IDS_KEY, SELECTED_KEY, SET_SELECTED_KEY, LANG_KEY } from '../types'
import { TRANSLATIONS } from '../i18n/translations'

const ROWS = 22
const COLS = 18

const visibleIds  = inject(VISIBLE_IDS_KEY)!
const selected    = inject(SELECTED_KEY)!
const setSelected = inject(SET_SELECTED_KEY)!
const lang        = inject(LANG_KEY)!

const ui = computed(() => TRANSLATIONS[lang.value])

const cellMap = computed(() => {
  const m = new Map<string, typeof POKEMON[number]>()
  for (const p of POKEMON) m.set(`${p.row}-${p.col}`, p)
  return m
})

// flex weights = number of grid rows per generation
const genRows: Record<1|2|3, number> = { 1: 9, 2: 6, 3: 8 }
</script>

<style scoped>
.grid-outer {
  display: flex;
  gap: 6px;
  width: 100%;
}

/* Sidebar */
.gen-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 22px;
}
.gen-label {
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid var(--border-strong);
  padding-right: 4px;
}
.gen-label span {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: var(--fs-control);
  font-weight: 600;
  color: var(--txt2);
  white-space: nowrap;
  letter-spacing: 0.06em;
}

/* Grid */
.grid-scroll {
  flex: 1;
  overflow-x: auto;
}
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(18, minmax(58px, 1fr));
  grid-template-rows: repeat(22, auto);
  gap: 3px;
  min-width: 1080px;
}

.grid-empty {
  min-height: 72px;
  border-radius: 6px;
  background: var(--bg3);
  opacity: 0.25;
}
</style>
