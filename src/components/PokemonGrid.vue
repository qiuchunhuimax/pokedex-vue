<template>
  <div class="grid-root">
    <template v-if="pagedPokemon.length === 0">
      <div class="empty-state">{{ emptyLabel }}</div>
    </template>

    <template v-else>
      <template v-for="gen in visibleGens" :key="gen">
        <div class="gen-header">
          <span class="gen-title">{{ ui.gen }} {{ genRoman[gen] }}</span>
          <span class="gen-count">{{ genPokemon(gen).length }} {{ genCountLabel }}</span>
          <div class="gen-line" />
        </div>

        <div class="pokemon-grid">
          <PokemonCell
            v-for="p in genPokemon(gen)"
            :key="p.id"
            :pokemon="p"
            :faded="false"
            :selected="false"
            @click="openModal(p)"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import PokemonCell from './PokemonCell.vue'
import { PAGED_POKEMON_KEY, LANG_KEY, OPEN_MODAL_KEY } from '../types'
import { TRANSLATIONS } from '../i18n/translations'

const pagedPokemon = inject(PAGED_POKEMON_KEY)!
const lang         = inject(LANG_KEY)!
const openModal    = inject(OPEN_MODAL_KEY)!

const ui = computed(() => TRANSLATIONS[lang.value])

const genRoman: Record<number, string> = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
  6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX',
}

const genCountLabel = computed(() => {
  if (lang.value === 'zh') return '只'
  if (lang.value === 'ja') return '匹'
  return 'Pokémon'
})

const emptyLabel = computed(() => {
  if (lang.value === 'zh') return '没有找到宝可梦'
  if (lang.value === 'ja') return 'ポケモンが見つかりません'
  return 'No Pokémon found'
})

// which generations appear on this page
const visibleGens = computed(() => {
  const gens = new Set(pagedPokemon.value.map(p => p.generation))
  return ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).filter(g => gens.has(g))
})

function genPokemon(gen: number) {
  return pagedPokemon.value.filter(p => p.generation === gen)
}
</script>

<style scoped>
.grid-root { width: 100%; }

.empty-state {
  text-align: center;
  color: var(--txt2);
  font-size: var(--fs-control);
  padding: 60px 20px;
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

/* 网格 */
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
