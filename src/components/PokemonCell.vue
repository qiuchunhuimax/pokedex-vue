<template>
  <div
    class="cell"
    :class="{ faded, selected }"
    :style="{ background: cellBg }"
    @click="emit('click')"
  >
    <span class="cell-num">#{{ String(pokemon.id).padStart(3, '0') }}</span>
    <img
      class="cell-img"
      :src="spriteUrl"
      :alt="name"
      loading="lazy"
      @error="onImgError"
    />
    <span class="cell-name">{{ name }}</span>
    <div class="cell-types">
      <span
        v-for="t in pokemon.types"
        :key="t"
        class="type-badge"
        :style="{ background: TYPE_COLORS[t] }"
      >{{ typeLabel(t) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Pokemon } from '../types'
import { LANG_KEY } from '../types'
import { TYPE_COLORS, TYPE_LABELS } from '../data/pokemonTypes'

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='rgba(255,255,255,0.15)'/%3E%3Cline x1='2' y1='20' x2='38' y2='20' stroke='rgba(255,255,255,0.3)' stroke-width='2'/%3E%3Ccircle cx='20' cy='20' r='5' fill='rgba(255,255,255,0.4)'/%3E%3C/svg%3E`

const props = defineProps<{ pokemon: Pokemon; faded: boolean; selected: boolean }>()
const emit = defineEmits<{ click: [] }>()

const lang = inject(LANG_KEY)!

const spriteUrl = computed(() =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.pokemon.id}.png`
)

const name = computed(() => {
  const l = lang.value
  if (l === 'zh') return props.pokemon.nameZh
  if (l === 'ja') return props.pokemon.nameJa
  return props.pokemon.nameEn
})

const cellBg = computed(() => TYPE_COLORS[props.pokemon.types[0]] + 'cc')

function typeLabel(t: Pokemon['types'][number]) {
  return TYPE_LABELS[t][lang.value]
}

function onImgError(e: Event) {
  (e.target as HTMLImageElement).src = FALLBACK
}
</script>

<style scoped>
.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 3px 3px;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.12s, box-shadow 0.12s;
  user-select: none;
  min-width: 0;
  position: relative;
}
.cell:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(0,0,0,0.35); }
.cell.faded { opacity: 0.15; pointer-events: none; }
.cell.selected { box-shadow: 0 0 0 2.5px #fff, 0 0 0 4px var(--accent); }

.cell-num {
  font-size: var(--fs-cell-num);
  color: var(--cell-muted);
  font-family: var(--font-mono);
  line-height: 1;
  align-self: flex-start;
}
.cell-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  image-rendering: pixelated;
  flex-shrink: 0;
}
.cell-name {
  font-size: var(--fs-cell-name);
  color: var(--cell-text);
  font-weight: 500;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
  margin-top: 1px;
}
.cell-types {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2px;
}
.type-badge {
  font-size: var(--fs-type-badge);
  color: #fff;
  padding: 1px 3px;
  border-radius: 3px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
</style>
