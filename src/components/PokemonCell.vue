<template>
  <div
    class="cell"
    :class="{ faded, selected, comparing }"
    :style="{ '--cell-color': typeColor }"
    @click="openModal(pokemon)"
  >
    <!-- 收藏按钮 -->
    <button class="fav-btn" :class="{ active: isFav }" @click.stop="toggleFav(pokemon.id)" title="收藏">
      {{ isFav ? '♥' : '♡' }}
    </button>

    <!-- 编号 -->
    <span class="cell-num">#{{ String(pokemon.id).padStart(3, '0') }}</span>

    <!-- 精灵图 -->
    <div class="cell-img-wrap">
      <img
        class="cell-img"
        :src="spriteUrl"
        :alt="name"
        loading="lazy"
        @error="onImgError"
      />
    </div>

    <!-- 名称 -->
    <span class="cell-name">{{ name }}</span>

    <!-- 属性徽章 -->
    <div class="cell-types">
      <span
        v-for="t in pokemon.types"
        :key="t"
        class="type-badge"
        :style="{ background: TYPE_COLORS[t] }"
      >{{ typeLabel(t) }}</span>
    </div>

    <!-- 对比按钮 -->
    <button
      class="cmp-btn"
      :class="{ active: comparing }"
      @click.stop="toggleCompare(pokemon)"
      :title="comparing ? '取消对比' : '加入对比'"
    >⚖</button>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Pokemon } from '../types'
import {
  LANG_KEY, FAVORITES_KEY, TOGGLE_FAV_KEY,
  COMPARE_LIST_KEY, TOGGLE_COMPARE_KEY, OPEN_MODAL_KEY,
} from '../types'
import { TYPE_COLORS, TYPE_LABELS } from '../data/pokemonTypes'

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Ccircle cx='48' cy='48' r='44' fill='rgba(255,255,255,0.12)'/%3E%3Cline x1='4' y1='48' x2='92' y2='48' stroke='rgba(255,255,255,0.25)' stroke-width='3'/%3E%3Ccircle cx='48' cy='48' r='12' fill='rgba(255,255,255,0.3)'/%3E%3C/svg%3E`

const props = defineProps<{ pokemon: Pokemon; faded: boolean; selected: boolean }>()

const lang        = inject(LANG_KEY)!
const favorites   = inject(FAVORITES_KEY)!
const toggleFav   = inject(TOGGLE_FAV_KEY)!
const compareList = inject(COMPARE_LIST_KEY)!
const toggleCompare = inject(TOGGLE_COMPARE_KEY)!
const openModal   = inject(OPEN_MODAL_KEY)!

const isFav     = computed(() => favorites.value.has(props.pokemon.id))
const comparing = computed(() => compareList.value.some(p => p.id === props.pokemon.id))

const spriteUrl = computed(() =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.pokemon.id}.png`
)

const name = computed(() => {
  const l = lang.value
  if (l === 'zh') return props.pokemon.nameZh
  if (l === 'ja') return props.pokemon.nameJa
  return props.pokemon.nameEn
})

const typeColor = computed(() => TYPE_COLORS[props.pokemon.types[0]])

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
  padding: 10px 8px 8px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  background: var(--cell-color, #888);
  background-image: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%);
  transition: transform 0.14s, box-shadow 0.14s, opacity 0.14s;
  user-select: none;
  min-width: 0;
}
.cell:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
.cell.faded  { opacity: 0.12; pointer-events: none; }
.cell.selected { box-shadow: 0 0 0 3px #fff, 0 0 0 5px var(--accent); }
.cell.comparing { box-shadow: 0 0 0 3px #fff, 0 0 0 5px #f59e0b; }

/* 收藏 */
.fav-btn {
  position: absolute;
  top: 6px; right: 7px;
  font-size: 14px;
  line-height: 1;
  color: rgba(255,255,255,0.6);
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.1s, transform 0.1s;
  z-index: 1;
}
.fav-btn:hover, .fav-btn.active { color: #fff; transform: scale(1.25); }
.fav-btn.active { color: #fbbf24; }

/* 编号 */
.cell-num {
  font-size: 10px;
  color: rgba(255,255,255,0.75);
  font-family: var(--font-mono);
  line-height: 1;
  align-self: flex-start;
  margin-bottom: 4px;
}

/* 精灵图 */
.cell-img-wrap {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cell-img {
  width: 88px;
  height: 88px;
  object-fit: contain;
  image-rendering: pixelated;
  filter: drop-shadow(0 3px 6px rgba(0,0,0,0.25));
}

/* 名称 */
.cell-name {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 5px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

/* 属性 */
.cell-types {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 5px;
}
.type-badge {
  font-size: 9px;
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-shadow: 0 1px 2px rgba(0,0,0,0.25);
}

/* 对比 */
.cmp-btn {
  position: absolute;
  bottom: 6px; right: 7px;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.1s, transform 0.1s;
  line-height: 1;
}
.cmp-btn:hover, .cmp-btn.active { color: #fff; transform: scale(1.2); }
.cmp-btn.active { color: #fbbf24; }
</style>
