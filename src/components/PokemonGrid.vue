<template>
  <div class="grid-root">
    <template v-for="gen in ([1, 2, 3] as const)" :key="gen">
      <!-- 世代分隔标题 -->
      <div class="gen-header">
        <span class="gen-title">{{ ui.gen }} {{ gen }}</span>
        <span class="gen-count">{{ genPokemon(gen).length }} {{ genCountLabel }}</span>
        <div class="gen-line" />
      </div>

      <!-- 6 列宝可梦网格 -->
      <div class="pokemon-grid">
        <PokemonCell
          v-for="p in genPokemon(gen)"
          :key="p.id"
          :pokemon="p"
          :faded="!visibleIds.has(p.id)"
          :selected="false"
          @click="openModal(p)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import PokemonCell from './PokemonCell.vue'
import { POKEMON } from '../data/pokemon'
import { VISIBLE_IDS_KEY, LANG_KEY, OPEN_MODAL_KEY } from '../types'
import { TRANSLATIONS } from '../i18n/translations'

const visibleIds = inject(VISIBLE_IDS_KEY)!
const lang       = inject(LANG_KEY)!
const openModal  = inject(OPEN_MODAL_KEY)!

const ui = computed(() => TRANSLATIONS[lang.value])

const genCountLabel = computed(() => {
  if (lang.value === 'zh') return '只'
  if (lang.value === 'ja') return '匹'
  return 'Pokémon'
})

function genPokemon(gen: 1 | 2 | 3) {
  return POKEMON.filter(p => p.generation === gen)
}
</script>

<style scoped>
.grid-root {
  width: 100%;
}

/* 世代标题 */
.gen-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 30px 0 16px;
}
.gen-title {
  font-size: var(--fs-control);
  font-weight: 800;
  color: var(--txt);
  white-space: nowrap;
  letter-spacing: 0.04em;
}
.gen-count {
  font-size: var(--fs-control);
  color: var(--txt2);
  white-space: nowrap;
}
.gen-line {
  flex: 1;
  height: 2px;
  background: var(--border-strong);
  border-radius: 1px;
}

/* 6 列网格 */
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 14px;
}

@media (max-width: 1100px) {
  .pokemon-grid { grid-template-columns: repeat(5, 1fr); }
}
@media (max-width: 800px) {
  .pokemon-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 550px) {
  .pokemon-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
